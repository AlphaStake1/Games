'use client';

import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { VRFError, VRFStatus } from '@/lib/vrfTypes';
import { cn } from '@/lib/utils';
import {
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Info,
  Shield,
  Clock,
  Activity,
} from '@/lib/icons';

interface VRFErrorHandlerProps {
  error: VRFError;
  status: VRFStatus;
  boardId: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  showFallbackInfo?: boolean;
  className?: string;
}

/**
 * VRF Error Handler Component
 *
 * Provides comprehensive error handling and fallback messaging for VRF failures.
 * Includes retry mechanisms, fallback explanations, and transparency about
 * backup randomization methods.
 */
const VRFErrorHandler: React.FC<VRFErrorHandlerProps> = ({
  error,
  status,
  boardId,
  onRetry,
  onDismiss,
  showFallbackInfo = true,
  className,
}) => {
  // Get error severity based on error code
  const getErrorSeverity = (errorCode: string): 'warning' | 'error' => {
    const warningCodes = ['TIMEOUT', 'NETWORK_ERROR', 'TEMPORARY_FAILURE'];
    return warningCodes.includes(errorCode) ? 'warning' : 'error';
  };

  // Get user-friendly error message
  const getUserFriendlyMessage = (error: VRFError): string => {
    switch (error.code) {
      case 'VRF_REQUEST_FAILED':
        return 'Failed to request random number generation. The blockchain network may be experiencing high traffic.';
      case 'VRF_TIMEOUT':
        return 'Random number generation is taking longer than expected. This can happen during network congestion.';
      case 'VRF_PROOF_INVALID':
        return 'The cryptographic proof for random number generation failed verification. This is extremely rare.';
      case 'INSUFFICIENT_FUNDS':
        return 'Not enough funds to pay for the VRF request. Please ensure the contract has sufficient SOL for gas fees.';
      case 'NETWORK_ERROR':
        return 'Network connectivity issues are preventing the VRF request. Please check your internet connection.';
      case 'RATE_LIMIT_EXCEEDED':
        return 'Too many VRF requests have been made recently. Please wait a moment before retrying.';
      case 'CONTRACT_ERROR':
        return 'Smart contract error occurred during VRF processing. This may require manual intervention.';
      case 'ORACLE_UNAVAILABLE':
        return 'The Chainlink VRF oracle is temporarily unavailable. This should resolve automatically.';
      default:
        return (
          error.message ||
          'An unexpected error occurred during random number generation.'
        );
    }
  };

  // Get recommended action based on error type
  const getRecommendedAction = (error: VRFError): string => {
    switch (error.code) {
      case 'VRF_TIMEOUT':
      case 'NETWORK_ERROR':
      case 'ORACLE_UNAVAILABLE':
        return 'Wait a few minutes and try again. Network issues usually resolve quickly.';
      case 'RATE_LIMIT_EXCEEDED':
        return 'Wait 5-10 minutes before retrying to avoid hitting rate limits again.';
      case 'INSUFFICIENT_FUNDS':
        return 'Contact support to add funds to the VRF request wallet.';
      case 'VRF_PROOF_INVALID':
        return 'This requires immediate attention from our technical team.';
      default:
        return 'If the problem persists after retrying, please contact our support team.';
    }
  };

  // Check if retry is available
  const canRetry = (error: VRFError): boolean => {
    const retryableCodes = [
      'VRF_REQUEST_FAILED',
      'VRF_TIMEOUT',
      'NETWORK_ERROR',
      'RATE_LIMIT_EXCEEDED',
      'ORACLE_UNAVAILABLE',
    ];
    return (
      retryableCodes.includes(error.code) &&
      (error.retryCount || 0) < (error.maxRetries || 3)
    );
  };

  // Calculate next retry delay
  const getRetryDelay = (error: VRFError): number => {
    const baseDelay = 30; // 30 seconds
    const retryCount = error.retryCount || 0;
    return baseDelay * Math.pow(2, retryCount); // Exponential backoff
  };

  const severity = getErrorSeverity(error.code);
  const userMessage = getUserFriendlyMessage(error);
  const recommendedAction = getRecommendedAction(error);
  const retryAvailable = canRetry(error) && onRetry;
  const retryDelay = getRetryDelay(error);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Main Error Alert */}
      <Alert variant={severity === 'error' ? 'destructive' : 'default'}>
        <AlertTriangle className="w-4 h-4" />
        <AlertDescription>
          <div className="space-y-3">
            {/* Error Header */}
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">VRF Error Detected</div>
                <div className="text-sm opacity-80">{userMessage}</div>
              </div>
              <Badge variant="outline" className="text-xs">
                {error.code}
              </Badge>
            </div>

            {/* Recommended Action */}
            <div className="text-sm">
              <span className="font-medium">What to do: </span>
              {recommendedAction}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              {retryAvailable && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onRetry}
                  className="h-8"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Retry {error.retryCount && `(${error.retryCount + 1}/3)`}
                </Button>
              )}

              {onDismiss && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onDismiss}
                  className="h-8"
                >
                  Dismiss
                </Button>
              )}

              <Button
                size="sm"
                variant="ghost"
                onClick={() =>
                  window.open('mailto:Coach-B@tutamail.com', '_blank')
                }
                className="h-8"
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                Contact Support
              </Button>
            </div>

            {/* Retry Timer */}
            {retryAvailable && retryDelay > 30 && (
              <div className="text-xs opacity-70">
                <Clock className="w-3 h-3 inline mr-1" />
                Recommended wait time: {retryDelay} seconds
              </div>
            )}
          </div>
        </AlertDescription>
      </Alert>

      {/* Fallback Information */}
      {showFallbackInfo && status === 'failed' && (
        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-800">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
              <Shield className="w-5 h-5" />
              Fallback Randomization Active
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-3">
            <div className="text-amber-700 dark:text-amber-300">
              Since the primary VRF system encountered an issue, we've activated
              our fallback randomization system to ensure the game can proceed
              fairly.
            </div>

            <div className="space-y-2">
              <div className="font-medium text-amber-800 dark:text-amber-200">
                Fallback System Details:
              </div>
              <ul className="list-disc list-inside space-y-1 text-amber-700 dark:text-amber-300">
                <li>
                  Uses cryptographically secure pseudo-random number generation
                </li>
                <li>
                  Seeded with multiple unpredictable sources (block hashes,
                  timestamps)
                </li>
                <li>Audited by independent security firm for fairness</li>
                <li>All randomization data is recorded for transparency</li>
              </ul>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  window.open('/docs/fairness-guarantee', '_blank')
                }
                className="h-8 text-amber-700 border-amber-300 hover:bg-amber-100"
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                Learn About Our Fairness Guarantee
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Technical Details (for developers/advanced users) */}
      <details className="text-xs">
        <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
          Show Technical Details
        </summary>
        <div className="mt-2 p-3 bg-muted rounded text-muted-foreground font-mono">
          <div>Board ID: {boardId}</div>
          <div>Error Code: {error.code}</div>
          <div>Error Time: {error.timestamp.toISOString()}</div>
          <div>Status: {status}</div>
          {error.retryCount !== undefined && (
            <div>Retry Attempt: {error.retryCount + 1}</div>
          )}
          {error.fallbackUsed && <div>Fallback Used: Yes</div>}
        </div>
      </details>
    </div>
  );
};

export default VRFErrorHandler;
