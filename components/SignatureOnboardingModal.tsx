'use client';

import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Info, Shield, Sparkles, Check } from 'lucide-react';
import {
  SignatureGenerator,
  SignatureData,
} from '@/lib/signature/signatureGenerator';
import {
  SignatureStyle,
  SIGNATURE_CONFIG,
} from '@/lib/signature/signatureConfig';
import { cn } from '@/lib/utils';

interface SignatureOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: SignatureData, style: SignatureStyle) => void;
}

export default function SignatureOnboardingModal({
  isOpen,
  onClose,
  onComplete,
}: SignatureOnboardingModalProps) {
  const { publicKey } = useWallet();
  const [step, setStep] = useState<'intro' | 'input' | 'preview' | 'minting'>(
    'intro',
  );
  const [firstName, setFirstName] = useState('');
  const [lastInitial, setLastInitial] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [signatureData, setSignatureData] = useState<SignatureData | null>(
    null,
  );
  const [styleGallery, setStyleGallery] = useState<SignatureStyle[]>([]);
  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(null);

  const generator = new SignatureGenerator();

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('intro');
      setFirstName('');
      setLastInitial('');
      setErrors([]);
      setSignatureData(null);
      setStyleGallery([]);
      setSelectedStyleId(null);
    }
  }, [isOpen]);

  // Validate input
  const validateInput = () => {
    const validation = generator.validateInput(firstName, lastInitial);
    setErrors(validation.errors);
    return validation.valid;
  };

  const handleGenerateSignatures = async () => {
    if (!publicKey) {
      setErrors(['Wallet not connected']);
      return;
    }

    if (!validateInput()) {
      return;
    }

    setIsGenerating(true);
    setErrors([]);

    try {
      // Generate signature data and styles
      const data = generator.initializeSignature(
        firstName,
        lastInitial,
        publicKey.toString(),
      );

      const styles = generator.generateStyleGallery(
        data.seed,
        SIGNATURE_CONFIG.defaultStyleCount,
      );

      setSignatureData(data);
      setStyleGallery(styles);
      setSelectedStyleId(styles[0].id);
      setStep('preview');
    } catch (error) {
      console.error('Error generating signatures:', error);
      setErrors(['Failed to generate signatures. Please try again.']);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStyleSelect = (styleId: string) => {
    setSelectedStyleId(styleId);
  };

  const handleConfirmSignature = () => {
    if (!signatureData || !selectedStyleId) return;

    const style = styleGallery.find((s) => s.id === selectedStyleId);
    if (style) {
      const updatedData = {
        ...signatureData,
        selectedStyleId: styleId,
      };
      setSignatureData(updatedData);
      onComplete(updatedData, style);
    }
  };

  const renderSignaturePreview = (
    style: SignatureStyle,
    isSelected: boolean,
  ) => {
    if (!signatureData) return null;

    const svg = generator.renderToSVG(signatureData, style);
    const encodedSvg = encodeURIComponent(svg);
    const dataUri = `data:image/svg+xml,${encodedSvg}`;

    return (
      <div
        className={cn(
          'relative cursor-pointer rounded-lg border-2 p-2 transition-all hover:shadow-md',
          isSelected
            ? 'border-blue-500 bg-blue-50 shadow-lg'
            : 'border-gray-200 hover:border-gray-300',
        )}
        onClick={() => handleStyleSelect(style.id)}
      >
        <img
          src={dataUri}
          alt={`Signature style ${style.id}`}
          className="w-full h-auto"
        />
        {isSelected && (
          <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-1">
            <Check className="w-3 h-3" />
          </div>
        )}
      </div>
    );
  };

  const renderStepContent = () => {
    switch (step) {
      case 'intro':
        return (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-yellow-500" />
                Welcome to Football Squares!
              </DialogTitle>
              <DialogDescription className="text-base mt-2">
                Let's create your unique digital signature NFT
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <div className="flex gap-3">
                    <Shield className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-1">
                        What is a Signature NFT?
                      </h3>
                      <p className="text-sm text-blue-800">
                        Your signature NFT is a unique, verifiable digital
                        identity that represents you on the Football Squares
                        platform. It's generated deterministically from your
                        name and wallet address, ensuring it's uniquely yours.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-green-50 border-green-200">
                <CardContent className="pt-6">
                  <div className="flex gap-3">
                    <Info className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-green-900 mb-1">
                        How will it be used?
                      </h3>
                      <ul className="text-sm text-green-800 space-y-1">
                        <li>• Sign your square selections on game boards</li>
                        <li>• Verify your identity in competitions</li>
                        <li>• Display on leaderboards and achievements</li>
                        <li>• Authenticate trades and transactions</li>
                        <li>• Build your reputation in the community</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Alert>
                <AlertDescription>
                  <strong>Privacy Note:</strong> Only your first name and last
                  initial are stored on-chain. Your signature is permanently
                  linked to your wallet address.
                </AlertDescription>
              </Alert>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Maybe Later
              </Button>
              <Button onClick={() => setStep('input')}>Get Started</Button>
            </DialogFooter>
          </>
        );

      case 'input':
        return (
          <>
            <DialogHeader>
              <DialogTitle>Create Your Signature</DialogTitle>
              <DialogDescription>
                Enter your name to generate your unique signature styles
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    onBlur={validateInput}
                    maxLength={30}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastInitial">Last Initial</Label>
                  <Input
                    id="lastInitial"
                    placeholder="D"
                    value={lastInitial}
                    onChange={(e) =>
                      setLastInitial(e.target.value.toUpperCase())
                    }
                    onBlur={validateInput}
                    maxLength={1}
                  />
                </div>
              </div>

              {errors.length > 0 && (
                <Alert variant="destructive">
                  <AlertDescription>
                    <ul className="list-disc list-inside">
                      {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Your signature will always look the same when generated with
                  the same name and wallet combination.
                </AlertDescription>
              </Alert>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setStep('intro')}>
                Back
              </Button>
              <Button
                onClick={handleGenerateSignatures}
                disabled={
                  isGenerating ||
                  errors.length > 0 ||
                  !firstName ||
                  !lastInitial
                }
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Signatures'
                )}
              </Button>
            </DialogFooter>
          </>
        );

      case 'preview':
        return (
          <>
            <DialogHeader>
              <DialogTitle>Choose Your Signature Style</DialogTitle>
              <DialogDescription>
                Select the signature style that best represents you
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <div className="grid grid-cols-3 gap-3 max-h-[400px] overflow-y-auto p-1">
                {styleGallery.map((style) => (
                  <div key={style.id}>
                    {renderSignaturePreview(
                      style,
                      style.id === selectedStyleId,
                    )}
                  </div>
                ))}
              </div>

              <Alert className="mt-4">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  This signature will be minted as an NFT and stored permanently
                  on the Solana blockchain. You'll be able to use it across the
                  Football Squares platform.
                </AlertDescription>
              </Alert>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setStep('input')}>
                Back
              </Button>
              <Button
                onClick={handleConfirmSignature}
                disabled={!selectedStyleId}
              >
                Create My Signature NFT
              </Button>
            </DialogFooter>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">{renderStepContent()}</DialogContent>
    </Dialog>
  );
}
