'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  VRFState,
  VRFStatus,
  VRFRequest,
  VRFProof,
  VRFError,
  VRF_CONFIG,
  calculateVRFTiming,
  formatCountdownTime,
} from '@/lib/vrfTypes';

/**
 * Custom hook for managing VRF state and real-time updates
 * Handles countdown timers, status polling, and state synchronization
 */
export interface UseVRFStatusOptions {
  boardId: string;
  gameStartTime: Date;
  enabled?: boolean;
  pollInterval?: number;
  onStatusChange?: (status: VRFStatus) => void;
  onProofReceived?: (proof: VRFProof) => void;
  onError?: (error: VRFError) => void;
}

export interface UseVRFStatusReturn {
  vrfState: VRFState;
  isLoading: boolean;
  error: VRFError | null;
  countdown: {
    timeUntilTrigger: string;
    timeUntilReveal: string;
    isActive: boolean;
    triggerTime: Date;
  };
  actions: {
    refreshStatus: () => Promise<void>;
    retryRequest: () => Promise<void>;
    clearError: () => void;
  };
}

// Mock API functions - replace with actual API calls
const mockFetchVRFStatus = async (boardId: string): Promise<VRFState> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Generate mock VRF state based on timing
  const gameStartTime = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours from now
  const timing = calculateVRFTiming(gameStartTime);

  let status: VRFStatus = 'pending';
  let request: VRFRequest | undefined;
  let proof: VRFProof | undefined;

  if (timing.isTriggered) {
    status = Math.random() > 0.8 ? 'completed' : 'processing';

    request = {
      requestId: `vrf_${boardId}_${Date.now()}`,
      boardId,
      gameId: `game_${boardId.split('-')[0]}`,
      requestTime: new Date(timing.triggerTime),
      scheduledTriggerTime: timing.triggerTime,
      transactionHash: `0x${Math.random().toString(16).substring(2, 66)}`,
      gasUsed: Math.floor(Math.random() * 50000) + 20000,
      status,
    };

    if (status === 'completed') {
      proof = {
        requestId: request.requestId,
        transactionHash: `0x${Math.random().toString(16).substring(2, 66)}`,
        blockNumber: Math.floor(Math.random() * 1000000) + 100000000,
        timestamp: Date.now(),
        randomSeed: Math.random().toString(16).substring(2),
        homeDigits: Array.from({ length: 10 }, (_, i) => i),
        awayDigits: Array.from({ length: 10 }, (_, i) => (i + 5) % 10),
        proof: {
          gamma: [
            `0x${Math.random().toString(16).substring(2, 66)}`,
            `0x${Math.random().toString(16).substring(2, 66)}`,
          ],
          c: `0x${Math.random().toString(16).substring(2, 66)}`,
          s: `0x${Math.random().toString(16).substring(2, 66)}`,
          seed: `0x${Math.random().toString(16).substring(2, 66)}`,
          uWitness: [
            `0x${Math.random().toString(16).substring(2, 66)}`,
            `0x${Math.random().toString(16).substring(2, 66)}`,
          ],
          cGammaWitness: [
            `0x${Math.random().toString(16).substring(2, 66)}`,
            `0x${Math.random().toString(16).substring(2, 66)}`,
          ],
          sHashWitness: [
            `0x${Math.random().toString(16).substring(2, 66)}`,
            `0x${Math.random().toString(16).substring(2, 66)}`,
          ],
          zInv: `0x${Math.random().toString(16).substring(2, 66)}`,
        },
        verified: true,
      };
    }
  }

  return {
    boardId,
    status,
    request,
    proof,
    countdown: {
      timeUntilTrigger: Math.max(0, timing.timeUntilTrigger),
      timeUntilReveal: Math.max(0, timing.timeUntilReveal),
      isActive: timing.timeUntilTrigger > 0,
    },
  };
};

const mockRetryVRFRequest = async (boardId: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  // Mock retry logic - in real implementation this would trigger a new VRF request
};

export const useVRFStatus = ({
  boardId,
  gameStartTime,
  enabled = true,
  pollInterval = VRF_CONFIG.STATUS_POLL_INTERVAL_MS,
  onStatusChange,
  onProofReceived,
  onError,
}: UseVRFStatusOptions): UseVRFStatusReturn => {
  const [vrfState, setVrfState] = useState<VRFState>({
    boardId,
    status: 'pending',
    countdown: {
      timeUntilTrigger: 0,
      timeUntilReveal: 0,
      isActive: false,
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<VRFError | null>(null);

  // Refs for managing intervals and preventing stale closures
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const statusPollingRef = useRef<NodeJS.Timeout | null>(null);
  const previousStatusRef = useRef<VRFStatus>(vrfState.status);

  // Calculate countdown values
  const getCountdownValues = useCallback(() => {
    const timing = calculateVRFTiming(gameStartTime);
    return {
      timeUntilTrigger: formatCountdownTime(
        Math.max(0, timing.timeUntilTrigger),
      ),
      timeUntilReveal: formatCountdownTime(Math.max(0, timing.timeUntilReveal)),
      isActive: timing.timeUntilTrigger > 0,
      triggerTime: timing.triggerTime,
    };
  }, [gameStartTime]);

  // Fetch VRF status from API
  const fetchVRFStatus = useCallback(async () => {
    if (!enabled) return;

    try {
      setIsLoading(true);
      const newState = await mockFetchVRFStatus(boardId);

      setVrfState((prevState) => {
        // Trigger callbacks if status changed
        if (prevState.status !== newState.status) {
          onStatusChange?.(newState.status);

          // If we received a proof for the first time
          if (newState.proof && !prevState.proof) {
            onProofReceived?.(newState.proof);
          }
        }

        return newState;
      });

      // Clear any existing errors on successful fetch
      setError(null);
    } catch (err) {
      const vrfError: VRFError = {
        code: 'FETCH_ERROR',
        message:
          err instanceof Error ? err.message : 'Failed to fetch VRF status',
        timestamp: new Date(),
      };

      setError(vrfError);
      onError?.(vrfError);
    } finally {
      setIsLoading(false);
    }
  }, [boardId, enabled, onStatusChange, onProofReceived, onError]);

  // Setup countdown timer
  useEffect(() => {
    if (!enabled) return;

    const updateCountdown = () => {
      const countdown = getCountdownValues();
      setVrfState((prevState) => ({
        ...prevState,
        countdown: {
          timeUntilTrigger: calculateVRFTiming(gameStartTime).timeUntilTrigger,
          timeUntilReveal: calculateVRFTiming(gameStartTime).timeUntilReveal,
          isActive: countdown.isActive,
        },
      }));
    };

    // Initial update
    updateCountdown();

    // Setup interval
    countdownIntervalRef.current = setInterval(
      updateCountdown,
      VRF_CONFIG.COUNTDOWN_UPDATE_INTERVAL_MS,
    );

    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
    };
  }, [enabled, gameStartTime, getCountdownValues]);

  // Setup status polling
  useEffect(() => {
    if (!enabled) return;

    // Initial fetch
    fetchVRFStatus();

    // Only poll if VRF is still pending
    const shouldPoll = () => {
      const currentStatus = vrfState.status;
      return ['pending', 'requested', 'processing'].includes(currentStatus);
    };

    const setupPolling = () => {
      if (shouldPoll()) {
        statusPollingRef.current = setTimeout(() => {
          fetchVRFStatus().then(() => {
            setupPolling(); // Recursive polling
          });
        }, pollInterval);
      }
    };

    setupPolling();

    return () => {
      if (statusPollingRef.current) {
        clearTimeout(statusPollingRef.current);
        statusPollingRef.current = null;
      }
    };
  }, [enabled, pollInterval, fetchVRFStatus, vrfState.status]);

  // Actions
  const refreshStatus = useCallback(async () => {
    await fetchVRFStatus();
  }, [fetchVRFStatus]);

  const retryRequest = useCallback(async () => {
    try {
      setIsLoading(true);
      await mockRetryVRFRequest(boardId);
      await fetchVRFStatus();
    } catch (err) {
      const vrfError: VRFError = {
        code: 'RETRY_ERROR',
        message:
          err instanceof Error ? err.message : 'Failed to retry VRF request',
        timestamp: new Date(),
      };

      setError(vrfError);
      onError?.(vrfError);
    } finally {
      setIsLoading(false);
    }
  }, [boardId, fetchVRFStatus, onError]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
      if (statusPollingRef.current) {
        clearTimeout(statusPollingRef.current);
      }
    };
  }, []);

  return {
    vrfState,
    isLoading,
    error,
    countdown: getCountdownValues(),
    actions: {
      refreshStatus,
      retryRequest,
      clearError,
    },
  };
};
