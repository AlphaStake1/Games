'use client';

import { useState, useCallback, useEffect } from 'react';

interface UserIntent {
  intent: 'create-nft' | 'play-game' | 'view-collection' | 'general';
  intentData?: {
    nftType?: string;
    gameId?: string;
    redirectPath?: string;
  };
  timestamp: number;
}

export const useWalletConnectionPopup = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentIntent, setCurrentIntent] =
    useState<UserIntent['intent']>('general');
  const [intentData, setIntentData] = useState<UserIntent['intentData']>();

  // Check for stored user intent on mount
  useEffect(() => {
    const storedIntent = localStorage.getItem('userIntent');
    if (storedIntent) {
      try {
        const parsed: UserIntent = JSON.parse(storedIntent);
        // Check if intent is recent (within 24 hours)
        const isRecent = Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000;

        if (isRecent && parsed.intent !== 'general') {
          // Auto-redirect based on stored intent after wallet connection
          handleStoredIntent(parsed);
          // Clear the stored intent
          localStorage.removeItem('userIntent');
        }
      } catch (error) {
        console.error('Error parsing stored user intent:', error);
        localStorage.removeItem('userIntent');
      }
    }
  }, []);

  const handleStoredIntent = (intent: UserIntent) => {
    switch (intent.intent) {
      case 'create-nft':
        if (intent.intentData?.nftType) {
          window.location.href = `/create-nft/${intent.intentData.nftType}`;
        } else {
          window.location.href = '/my-nfts';
        }
        break;
      case 'play-game':
        if (intent.intentData?.gameId) {
          window.location.href = `/boards?gameId=${intent.intentData.gameId}`;
        } else if (intent.intentData?.redirectPath) {
          window.location.href = intent.intentData.redirectPath;
        } else {
          window.location.href = '/boards';
        }
        break;
      case 'view-collection':
        window.location.href = '/my-nfts';
        break;
      default:
        // Do nothing for general intent
        break;
    }
  };

  const showPopup = useCallback(
    (
      intent: UserIntent['intent'] = 'general',
      data?: UserIntent['intentData'],
    ) => {
      setCurrentIntent(intent);
      setIntentData(data);
      setIsPopupOpen(true);
    },
    [],
  );

  const hidePopup = useCallback(() => {
    setIsPopupOpen(false);
  }, []);

  const handleWalletConnect = useCallback(async () => {
    // This would typically call your actual wallet connection logic
    // For now, we'll simulate it
    try {
      // Simulate wallet connection
      console.log('Connecting wallet...');

      // After successful connection, handle the intent
      if (currentIntent !== 'general') {
        handleStoredIntent({
          intent: currentIntent,
          intentData,
          timestamp: Date.now(),
        });
      }

      hidePopup();
    } catch (error) {
      console.error('Wallet connection failed:', error);
      throw error;
    }
  }, [currentIntent, intentData]);

  // Helper functions for specific intents
  const showCreateNFTPopup = useCallback(
    (nftType?: string) => {
      showPopup('create-nft', { nftType });
    },
    [showPopup],
  );

  const showPlayGamePopup = useCallback(
    (gameId?: string, redirectPath?: string) => {
      showPopup('play-game', { gameId, redirectPath });
    },
    [showPopup],
  );

  const showViewCollectionPopup = useCallback(() => {
    showPopup('view-collection');
  }, [showPopup]);

  return {
    isPopupOpen,
    currentIntent,
    intentData,
    showPopup,
    hidePopup,
    handleWalletConnect,
    showCreateNFTPopup,
    showPlayGamePopup,
    showViewCollectionPopup,
  };
};

export default useWalletConnectionPopup;
