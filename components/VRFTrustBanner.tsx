'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  VRFState,
  VRFStatus,
  getVRFStatusColor,
  getVRFStatusMessage,
  getSolanaExplorerUrl,
  getChainlinkVRFExplorerUrl,
} from '@/lib/vrfTypes';
import { useVRFStatus } from '@/hooks/useVRFStatus';
import VRFErrorHandler from '@/components/VRFErrorHandler';
import { cn } from '@/lib/utils';
import {
  Clock,
  Shield,
  ExternalLink,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Eye,
  Zap,
  Timer,
  Info,
  Hash,
  Activity,
} from '@/lib/icons';

interface VRFTrustBannerProps {
  boardId: string;
  gameStartTime: Date;
  onShowProof?: (vrfState: VRFState) => void;
  className?: string;
}

/**
 * VRF Trust Banner Component
 *
 * Displays the VRF randomization process status with:
 * - Real-time countdown to digit reveal (40 min before kickoff)
 * - Trust indicators and verification links
 * - Status updates during VRF process
 * - Error handling with retry functionality
 * - Links to Solana Explorer and Chainlink VRF
 */
const VRFTrustBanner: React.FC<VRFTrustBannerProps> = ({
  boardId,
  gameStartTime,
  onShowProof,
  className,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const { vrfState, isLoading, error, countdown, actions } = useVRFStatus({
    boardId,
    gameStartTime,
    onStatusChange: (status) => {
      console.log(`VRF Status changed to: ${status}`);
    },
    onProofReceived: (proof) => {
      console.log('VRF Proof received:', proof);
    },
    onError: (error) => {
      console.error('VRF Error:', error);
    },
  });

  const { status, request, proof } = vrfState;
  const statusColor = getVRFStatusColor(status);
  const statusMessage = getVRFStatusMessage(status);

  // Render countdown timer
  const renderCountdown = () => {
    if (status === 'completed') return null;

    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Timer className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium">
            {status === 'pending' ? 'Digits reveal in:' : 'Game starts in:'}
          </span>
        </div>
        <div className="font-mono text-lg font-bold text-blue-600">
          {status === 'pending'
            ? countdown.timeUntilTrigger
            : countdown.timeUntilReveal}
        </div>
      </div>
    );
  };

  // Render status indicator
  const renderStatusIndicator = () => {
    const getIcon = () => {
      switch (status) {
        case 'pending':
          return <Clock className="w-4 h-4" />;
        case 'requested':
        case 'processing':
          return <Activity className="w-4 h-4 animate-pulse" />;
        case 'completed':
          return <CheckCircle className="w-4 h-4" />;
        case 'failed':
          return <AlertTriangle className="w-4 h-4" />;
        case 'cancelled':
          return <AlertTriangle className="w-4 h-4" />;
        default:
          return <Clock className="w-4 h-4" />;
      }
    };

    return (
      <div className="flex items-center gap-2">
        <Badge className={cn('flex items-center gap-1', statusColor)}>
          {getIcon()}
          {statusMessage}
        </Badge>
        {isLoading && (
          <RefreshCw className="w-4 h-4 animate-spin text-muted-foreground" />
        )}
      </div>
    );
  };

  // Render trust indicators
  const renderTrustIndicators = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 dark:bg-green-950 px-2 py-1 rounded-full">
          <Shield className="w-3 h-3" />
          Chainlink VRF
        </div>
        <div className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-1 rounded-full">
          <Hash className="w-3 h-3" />
          On-Chain Proof
        </div>
        <div className="flex items-center gap-1 text-xs text-purple-600 bg-purple-50 dark:bg-purple-950 px-2 py-1 rounded-full">
          <Zap className="w-3 h-3" />
          Verifiable
        </div>
      </div>
    );
  };

  // Render verification links
  const renderVerificationLinks = () => {
    if (!request?.transactionHash) return null;

    return (
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            window.open(
              getSolanaExplorerUrl(request.transactionHash!),
              '_blank',
            )
          }
          className="h-8 text-xs"
        >
          <ExternalLink className="w-3 h-3 mr-1" />
          View on Solana Explorer
        </Button>

        {request.requestId && (
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              window.open(
                getChainlinkVRFExplorerUrl(request.requestId),
                '_blank',
              )
            }
            className="h-8 text-xs"
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            Chainlink VRF Details
          </Button>
        )}

        {proof && onShowProof && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onShowProof(vrfState)}
            className="h-8 text-xs"
          >
            <Eye className="w-3 h-3 mr-1" />
            View JSON Proof
          </Button>
        )}
      </div>
    );
  };

  // Render error state
  const renderError = () => {
    if (!error) return null;

    return (
      <VRFErrorHandler
        error={error}
        status={status}
        boardId={boardId}
        onRetry={actions.retryRequest}
        onDismiss={actions.clearError}
        showFallbackInfo={true}
        className="mt-3"
      />
    );
  };

  // Render progress bar for VRF stages
  const renderProgress = () => {
    let progress = 0;

    switch (status) {
      case 'pending':
        progress = 25;
        break;
      case 'requested':
        progress = 50;
        break;
      case 'processing':
        progress = 75;
        break;
      case 'completed':
        progress = 100;
        break;
      default:
        progress = 0;
    }

    if (status === 'failed' || status === 'cancelled') {
      return null;
    }

    return (
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Randomization Progress</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
    );
  };

  // Render detailed information (expanded view)
  const renderDetailedInfo = () => {
    if (!isExpanded) return null;

    return (
      <div className="mt-4 p-3 bg-muted/50 rounded-lg space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          {request && (
            <>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Request ID:</span>
                <span className="font-mono text-xs">
                  {request.requestId.slice(0, 16)}...
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Scheduled Time:</span>
                <span>{request.scheduledTriggerTime.toLocaleTimeString()}</span>
              </div>
              {request.gasUsed && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gas Used:</span>
                  <span>{request.gasUsed.toLocaleString()}</span>
                </div>
              )}
            </>
          )}

          {proof && (
            <>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Block Number:</span>
                <span>{proof.blockNumber.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Verified:</span>
                <span
                  className={proof.verified ? 'text-green-600' : 'text-red-600'}
                >
                  {proof.verified ? '✓ Yes' : '✗ No'}
                </span>
              </div>
            </>
          )}
        </div>

        {renderVerificationLinks()}
      </div>
    );
  };

  return (
    <Card className={cn('border-l-4 border-l-blue-500', className)}>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <span className="font-semibold">
                  Provably Fair Randomization
                </span>
              </div>
              {renderStatusIndicator()}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-muted-foreground"
            >
              <Info className="w-4 h-4" />
            </Button>
          </div>

          {/* Main Content */}
          <div className="space-y-3">
            {renderCountdown()}
            {renderProgress()}
            {renderTrustIndicators()}
          </div>

          {/* Description */}
          <div className="text-sm text-muted-foreground">
            {status === 'pending' && (
              <p>
                Board digits will be randomly generated using Chainlink VRF 40
                minutes before kickoff. This ensures complete fairness and
                transparency.
              </p>
            )}

            {status === 'requested' && (
              <p>
                Random number generation request submitted to Chainlink VRF
                oracle. Waiting for cryptographic proof generation.
              </p>
            )}

            {status === 'processing' && (
              <p>
                Chainlink VRF is generating your random digits with
                cryptographic proof. This process typically takes 1-2 minutes.
              </p>
            )}

            {status === 'completed' && proof && (
              <p>
                Digits have been revealed! Home team: [
                {proof.homeDigits.join(', ')}] Away team: [
                {proof.awayDigits.join(', ')}]. All randomization is
                cryptographically verified.
              </p>
            )}

            {status === 'failed' && (
              <p>
                VRF randomization encountered an issue. A fallback randomization
                method has been used with manual audit oversight.
              </p>
            )}
          </div>

          {/* Error Display */}
          {renderError()}

          {/* Detailed Information */}
          {renderDetailedInfo()}

          {/* Quick Action Buttons */}
          {!isExpanded && (
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={actions.refreshStatus}
                  disabled={isLoading}
                  className="h-8 text-xs"
                >
                  <RefreshCw
                    className={cn('w-3 h-3 mr-1', isLoading && 'animate-spin')}
                  />
                  Refresh
                </Button>
              </div>

              {request?.transactionHash && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    window.open(
                      getSolanaExplorerUrl(request.transactionHash!),
                      '_blank',
                    )
                  }
                  className="h-8 text-xs text-blue-600"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Verify
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VRFTrustBanner;
