'use client';

import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  VRFState,
  VRFProof,
  VRFRequest,
  getSolanaExplorerUrl,
  getChainlinkVRFExplorerUrl,
} from '@/lib/vrfTypes';
import { cn } from '@/lib/utils';
import {
  Shield,
  ExternalLink,
  Copy,
  CheckCircle,
  Hash,
  Clock,
  Activity,
  Eye,
  Download,
  Info,
  AlertTriangle,
  Zap,
} from '@/lib/icons';

interface VRFProofModalProps {
  isOpen: boolean;
  onClose: () => void;
  vrfState: VRFState | null;
  className?: string;
}

/**
 * VRF Proof Modal Component
 *
 * Displays detailed VRF verification data including:
 * - Cryptographic proof details
 * - Transaction hashes and blockchain links
 * - Raw JSON data for developers
 * - Verification status and timestamps
 * - Export functionality for audit purposes
 */
const VRFProofModal: React.FC<VRFProofModalProps> = ({
  isOpen,
  onClose,
  vrfState,
  className,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');

  const { status, request, proof, error } = vrfState || {};

  // Copy to clipboard functionality
  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp: number | Date) => {
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
    });
  };

  // Generate formatted JSON for display
  const formattedProofJson = useMemo(() => {
    if (!proof) return '';
    return JSON.stringify(proof, null, 2);
  }, [proof]);

  const formattedRequestJson = useMemo(() => {
    if (!request) return '';
    return JSON.stringify(request, null, 2);
  }, [request]);

  // Export proof data
  const exportProofData = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      boardId: vrfState?.boardId,
      status,
      request,
      proof,
      error,
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `vrf-proof-${vrfState?.boardId}-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Render copy button
  const CopyButton: React.FC<{
    text: string;
    fieldName: string;
    label?: string;
  }> = ({ text, fieldName, label = 'Copy' }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => copyToClipboard(text, fieldName)}
      className="h-6 px-2 text-xs"
    >
      {copiedField === fieldName ? (
        <>
          <CheckCircle className="w-3 h-3 mr-1 text-green-600" />
          Copied
        </>
      ) : (
        <>
          <Copy className="w-3 h-3 mr-1" />
          {label}
        </>
      )}
    </Button>
  );

  // Render overview tab
  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Status Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            VRF Process Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Current Status:</span>
            <Badge variant={status === 'completed' ? 'default' : 'secondary'}>
              {status?.toUpperCase()}
            </Badge>
          </div>

          {request && (
            <>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Request ID:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs">
                      {request.requestId.slice(0, 16)}...
                    </span>
                    <CopyButton
                      text={request.requestId}
                      fieldName="requestId"
                    />
                  </div>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Request Time:</span>
                  <span>{formatTimestamp(request.requestTime)}</span>
                </div>

                {request.transactionHash && (
                  <div className="flex justify-between col-span-2">
                    <span className="text-muted-foreground">
                      Transaction Hash:
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs">
                        {request.transactionHash.slice(0, 16)}...
                      </span>
                      <CopyButton
                        text={request.transactionHash}
                        fieldName="txHash"
                      />
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Randomization Results */}
      {proof && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="w-5 h-5" />
              Random Digits
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm font-medium text-blue-600">
                  Home Team Digits
                </div>
                <div className="flex flex-wrap gap-2">
                  {proof.homeDigits.map((digit, index) => (
                    <Badge key={index} variant="outline" className="font-mono">
                      {digit}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium text-red-600">
                  Away Team Digits
                </div>
                <div className="flex flex-wrap gap-2">
                  {proof.awayDigits.map((digit, index) => (
                    <Badge key={index} variant="outline" className="font-mono">
                      {digit}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Block Number:</span>
                <span className="font-mono">
                  {proof.blockNumber.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Verified:</span>
                <span
                  className={`font-medium ${proof.verified ? 'text-green-600' : 'text-red-600'}`}
                >
                  {proof.verified ? '✓ Verified' : '✗ Not Verified'}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Proof Time:</span>
                <span>{formatTimestamp(proof.timestamp)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Random Seed:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs">
                    {proof.randomSeed.slice(0, 16)}...
                  </span>
                  <CopyButton text={proof.randomSeed} fieldName="randomSeed" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Section */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription>
            <div className="space-y-2">
              <div className="font-medium">VRF Error Detected</div>
              <div className="text-sm">{error.message}</div>
              <div className="text-xs text-muted-foreground">
                Error Code: {error.code} | Time:{' '}
                {formatTimestamp(error.timestamp)}
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* External Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="w-5 h-5" />
            Verification Links
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {request?.transactionHash && (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  window.open(
                    getSolanaExplorerUrl(request.transactionHash!),
                    '_blank',
                  )
                }
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Solana Explorer
              </Button>
            )}

            {request?.requestId && (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  window.open(
                    getChainlinkVRFExplorerUrl(request.requestId),
                    '_blank',
                  )
                }
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Chainlink VRF
              </Button>
            )}

            <Button variant="outline" size="sm" onClick={exportProofData}>
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Render cryptographic proof tab
  const renderProofTab = () => {
    if (!proof) {
      return (
        <div className="text-center py-8">
          <Info className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">
            No cryptographic proof available yet.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <Alert>
          <Shield className="w-4 h-4" />
          <AlertDescription>
            This cryptographic proof demonstrates that the random numbers were
            generated fairly using Chainlink VRF. Each component can be
            independently verified.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>Proof Components</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Gamma */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Gamma (γ)</span>
                <CopyButton
                  text={JSON.stringify(proof.proof.gamma)}
                  fieldName="gamma"
                />
              </div>
              <div className="font-mono text-xs bg-muted p-2 rounded break-all">
                [{proof.proof.gamma.join(', ')}]
              </div>
            </div>

            {/* C */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Challenge (c)</span>
                <CopyButton text={proof.proof.c} fieldName="c" />
              </div>
              <div className="font-mono text-xs bg-muted p-2 rounded break-all">
                {proof.proof.c}
              </div>
            </div>

            {/* S */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Response (s)</span>
                <CopyButton text={proof.proof.s} fieldName="s" />
              </div>
              <div className="font-mono text-xs bg-muted p-2 rounded break-all">
                {proof.proof.s}
              </div>
            </div>

            {/* Seed */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Seed</span>
                <CopyButton text={proof.proof.seed} fieldName="seed" />
              </div>
              <div className="font-mono text-xs bg-muted p-2 rounded break-all">
                {proof.proof.seed}
              </div>
            </div>

            {/* U Witness */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">U Witness</span>
                <CopyButton
                  text={JSON.stringify(proof.proof.uWitness)}
                  fieldName="uWitness"
                />
              </div>
              <div className="font-mono text-xs bg-muted p-2 rounded break-all">
                [{proof.proof.uWitness.join(', ')}]
              </div>
            </div>

            {/* Other witnesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">cGamma Witness</span>
                  <CopyButton
                    text={JSON.stringify(proof.proof.cGammaWitness)}
                    fieldName="cGammaWitness"
                  />
                </div>
                <div className="font-mono text-xs bg-muted p-2 rounded break-all">
                  [{proof.proof.cGammaWitness.join(', ')}]
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">sHash Witness</span>
                  <CopyButton
                    text={JSON.stringify(proof.proof.sHashWitness)}
                    fieldName="sHashWitness"
                  />
                </div>
                <div className="font-mono text-xs bg-muted p-2 rounded break-all">
                  [{proof.proof.sHashWitness.join(', ')}]
                </div>
              </div>
            </div>

            {/* Z Inverse */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Z Inverse (zInv)</span>
                <CopyButton text={proof.proof.zInv} fieldName="zInv" />
              </div>
              <div className="font-mono text-xs bg-muted p-2 rounded break-all">
                {proof.proof.zInv}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Render raw JSON tab
  const renderJsonTab = () => (
    <div className="space-y-6">
      {/* Request JSON */}
      {request && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              VRF Request Data
              <CopyButton
                text={formattedRequestJson}
                fieldName="requestJson"
                label="Copy JSON"
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs font-mono bg-muted p-4 rounded-lg overflow-auto max-h-64">
              {formattedRequestJson}
            </pre>
          </CardContent>
        </Card>
      )}

      {/* Proof JSON */}
      {proof && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              VRF Proof Data
              <CopyButton
                text={formattedProofJson}
                fieldName="proofJson"
                label="Copy JSON"
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs font-mono bg-muted p-4 rounded-lg overflow-auto max-h-64">
              {formattedProofJson}
            </pre>
          </CardContent>
        </Card>
      )}

      {/* Full State JSON */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Complete VRF State
            <CopyButton
              text={JSON.stringify(vrfState, null, 2)}
              fieldName="fullState"
              label="Copy All"
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs font-mono bg-muted p-4 rounded-lg overflow-auto max-h-64">
            {JSON.stringify(vrfState, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );

  if (!vrfState) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn('max-w-4xl max-h-[90vh] overflow-y-auto', className)}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            VRF Proof & Verification
          </DialogTitle>
          <DialogDescription>
            Detailed cryptographic proof and verification data for board{' '}
            {vrfState.boardId}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="proof" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Crypto Proof
            </TabsTrigger>
            <TabsTrigger value="json" className="flex items-center gap-2">
              <Hash className="w-4 h-4" />
              Raw JSON
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            {renderOverviewTab()}
          </TabsContent>

          <TabsContent value="proof" className="mt-6">
            {renderProofTab()}
          </TabsContent>

          <TabsContent value="json" className="mt-6">
            {renderJsonTab()}
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Info className="w-4 h-4" />
            <span>All data is cryptographically verifiable on-chain</span>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={exportProofData} size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button onClick={onClose} size="sm">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VRFProofModal;
