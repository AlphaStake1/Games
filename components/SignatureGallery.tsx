'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import {
  SignatureGenerator,
  SignatureData,
} from '@/lib/signature/signatureGenerator';
import {
  SignatureStyle,
  SIGNATURE_CONFIG,
} from '@/lib/signature/signatureConfig';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Check, AlertCircle } from 'lucide-react';

interface SignatureGalleryProps {
  onSignatureSelected?: (data: SignatureData, style: SignatureStyle) => void;
  onMintRequest?: (data: SignatureData, style: SignatureStyle) => void;
}

export default function SignatureGallery({
  onSignatureSelected,
  onMintRequest,
}: SignatureGalleryProps) {
  const { publicKey, connected } = useWallet();
  const [firstName, setFirstName] = useState('');
  const [lastInitial, setLastInitial] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [signatureData, setSignatureData] = useState<SignatureData | null>(
    null,
  );
  const [styleGallery, setStyleGallery] = useState<SignatureStyle[]>([]);
  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(null);
  const [showGallery, setShowGallery] = useState(false);

  const generator = useMemo(() => new SignatureGenerator(), []);

  // Validate input on change
  useEffect(() => {
    if (firstName || lastInitial) {
      const validation = generator.validateInput(firstName, lastInitial);
      setErrors(validation.errors);
    }
  }, [firstName, lastInitial, generator]);

  const handleGenerateSignatures = async () => {
    if (!connected || !publicKey) {
      setErrors(['Please connect your wallet first']);
      return;
    }

    const validation = generator.validateInput(firstName, lastInitial);
    if (!validation.valid) {
      setErrors(validation.errors);
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
      setShowGallery(true);
      setSelectedStyleId(styles[0].id);
    } catch (error) {
      console.error('Error generating signatures:', error);
      setErrors(['Failed to generate signatures. Please try again.']);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStyleSelect = (styleId: string) => {
    setSelectedStyleId(styleId);

    if (signatureData && onSignatureSelected) {
      const style = styleGallery.find((s) => s.id === styleId);
      if (style) {
        const updatedData = {
          ...signatureData,
          selectedStyleId: styleId,
        };
        setSignatureData(updatedData);
        onSignatureSelected(updatedData, style);
      }
    }
  };

  const handleMint = () => {
    if (!signatureData || !selectedStyleId) return;

    const style = styleGallery.find((s) => s.id === selectedStyleId);
    if (style && onMintRequest) {
      onMintRequest(signatureData, style);
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
      <Card
        className={`cursor-pointer transition-all hover:shadow-lg ${
          isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''
        }`}
        onClick={() => handleStyleSelect(style.id)}
      >
        <CardContent className="p-4">
          <div className="relative">
            <img
              src={dataUri}
              alt={`Signature style ${style.id}`}
              className="w-full h-auto"
            />
            {isSelected && (
              <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                <Check className="w-4 h-4" />
              </div>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-2 text-center">
            Style: {style.id}
          </p>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Your Signature NFT</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input Form */}
          {!showGallery && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={!connected}
                    maxLength={30}
                  />
                </div>
                <div>
                  <Label htmlFor="lastInitial">Last Initial</Label>
                  <Input
                    id="lastInitial"
                    type="text"
                    placeholder="D"
                    value={lastInitial}
                    onChange={(e) =>
                      setLastInitial(e.target.value.toUpperCase())
                    }
                    disabled={!connected}
                    maxLength={1}
                  />
                </div>
              </div>

              {/* Error Messages */}
              {errors.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <ul className="list-disc list-inside">
                      {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {/* Wallet Connection Message */}
              {!connected && (
                <Alert>
                  <AlertDescription>
                    Please connect your wallet to create your signature NFT
                  </AlertDescription>
                </Alert>
              )}

              {/* Generate Button */}
              <Button
                onClick={handleGenerateSignatures}
                disabled={!connected || isGenerating || errors.length > 0}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Signatures...
                  </>
                ) : (
                  'Generate Signature Styles'
                )}
              </Button>
            </div>
          )}

          {/* Signature Gallery */}
          {showGallery && styleGallery.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  Choose Your Signature Style
                </h3>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowGallery(false);
                    setSignatureData(null);
                    setStyleGallery([]);
                    setSelectedStyleId(null);
                  }}
                >
                  Start Over
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {styleGallery.map((style) => (
                  <div key={style.id}>
                    {renderSignaturePreview(
                      style,
                      style.id === selectedStyleId,
                    )}
                  </div>
                ))}
              </div>

              {/* Mint Button */}
              <div className="flex justify-center mt-6">
                <Button
                  onClick={handleMint}
                  disabled={!selectedStyleId}
                  size="lg"
                  className="px-8"
                >
                  Mint Signature NFT
                </Button>
              </div>

              {/* Info Text */}
              <p className="text-sm text-gray-600 text-center">
                Your signature is deterministically generated from your name and
                wallet address. The same inputs will always produce the same
                signature options.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
