'use client';

import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Palette, PenTool, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SignatureColorCustomizer from '@/components/signature/SignatureColorCustomizer';
import DrawingBoardMarker from '@/components/signature/DrawingBoardMarker';
import {
  SignatureGenerator,
  SignatureData,
} from '@/lib/signature/signatureGenerator';
import { SIGNATURE_STYLES } from '@/lib/signature/signatureConfig';
import CreateNFTNav from '@/components/CreateNFTNav';

export default function CustomSignatureNFTPage() {
  const { publicKey, connected } = useWallet();
  const [activeTab, setActiveTab] = useState<'color' | 'draw'>('color');
  const [signatureData, setSignatureData] = useState<SignatureData | null>(
    null,
  );
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [svgContent, setSvgContent] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastInitial, setLastInitial] = useState('');

  const generator = new SignatureGenerator();

  // Generate signature when wallet connects or name changes
  useEffect(() => {
    if (connected && publicKey && firstName && lastInitial) {
      generateSignature();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected, publicKey, firstName, lastInitial]);

  const generateSignature = async () => {
    if (!publicKey || !firstName || !lastInitial) return;

    setIsGenerating(true);
    try {
      // Initialize signature data
      const data = generator.initializeSignature(
        firstName,
        lastInitial,
        publicKey.toString(),
      );
      setSignatureData(data);

      // Generate style gallery and select first one
      const gallery = generator.generateStyleGallery(data.seed, 9);
      const defaultStyle = gallery[0];
      setSelectedStyle(defaultStyle.id);

      // Generate SVG
      const svg = generator.renderToSVG(data, defaultStyle);
      setSvgContent(svg);
    } catch (error) {
      console.error('Error generating signature:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleColorExport = (svgContent: string, pngDataUrl: string) => {
    console.log('Exporting colored signature:', {
      svgContent: svgContent.length,
      pngDataUrl: pngDataUrl.length,
    });
    // TODO: Integrate with NFT minting service
  };

  const handleDrawingExport = (
    pngDataUrl: string,
    svgData: string,
    metadata: any,
  ) => {
    console.log('Exporting drawing:', {
      pngDataUrl: pngDataUrl.length,
      svgData: svgData.length,
      metadata,
    });
    // TODO: Integrate with NFT minting service
  };

  const currentStyle = SIGNATURE_STYLES.find((s) => s.id === selectedStyle);

  if (!connected) {
    return (
      <main className="min-h-screen bg-[#faf9f5] dark:bg-[#1a1a2e] transition-colors duration-300 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <CreateNFTNav active="/create-nft/custom-signature" />
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[#002244] dark:text-white mb-6">
              Create Custom Signature NFT
            </h1>
            <p className="text-xl text-[#708090] dark:text-[#96abdc] mb-8">
              Please connect your wallet to create a personalized signature
              marker.
            </p>
            <button
              onClick={() => {
                // Trigger wallet connection through the header wallet button
                const walletButton = document.querySelector(
                  '[data-wallet-button]',
                );
                if (walletButton) {
                  (walletButton as HTMLElement).click();
                } else {
                  // Fallback: Look for any wallet connect button
                  const connectButton = document.querySelector(
                    'button:has([aria-label*="wallet" i]), button:contains("Connect Wallet")',
                  );
                  if (connectButton) {
                    (connectButton as HTMLElement).click();
                  }
                }
              }}
              className="bg-gradient-to-r from-[#ed5925] to-[#96abdc] text-white px-8 py-3 rounded-full font-bold hover:from-[#d14a1f] hover:to-[#7a95d1] transition-all duration-200"
            >
              Connect Wallet
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf9f5] dark:bg-[#1a1a2e] transition-colors duration-300 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <CreateNFTNav active="/create-nft/custom-signature" />

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-[#002244] dark:text-white mb-4">
            Create Custom Signature NFT
          </h1>
          <p className="text-xl text-[#708090] dark:text-[#96abdc]">
            Design a personalized $3 marker for your Football Squares
          </p>
        </div>

        {/* Name Input (if no signature generated yet) */}
        {!signatureData && (
          <Card className="mb-8 max-w-xl mx-auto">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Enter Your Name</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#ed5925] focus:border-transparent"
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Last Initial
                  </label>
                  <input
                    type="text"
                    value={lastInitial}
                    onChange={(e) => setLastInitial(e.target.value.slice(0, 1))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#ed5925] focus:border-transparent"
                    placeholder="Enter your last initial"
                    maxLength={1}
                  />
                </div>
              </div>
              <Button
                onClick={generateSignature}
                disabled={!firstName || !lastInitial || isGenerating}
                className="w-full mt-4 bg-[#ed5925] hover:bg-[#d14a1f] text-white"
              >
                {isGenerating ? 'Generating...' : 'Generate Signature Options'}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Signature Style Selection (only show after signature generated) */}
        {signatureData && !selectedStyle && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-center">
                Choose Your Signature Style
              </h3>
              <p className="text-sm text-gray-600 text-center mb-6">
                Select the signature style that best represents you
              </p>
              <div className="grid grid-cols-3 gap-4">
                {generator
                  .generateStyleGallery(signatureData.seed, 9)
                  .map((style) => {
                    const svg = generator.renderToSVG(signatureData, style);
                    const base64Svg = btoa(unescape(encodeURIComponent(svg)));
                    const dataUri = `data:image/svg+xml;base64,${base64Svg}`;

                    return (
                      <button
                        key={style.id}
                        onClick={() => {
                          setSelectedStyle(style.id);
                          const newSvg = generator.renderToSVG(
                            signatureData,
                            style,
                          );
                          setSvgContent(newSvg);
                        }}
                        className={`relative border-2 rounded-lg p-4 transition-all hover:shadow-lg ${
                          selectedStyle === style.id
                            ? 'border-[#ed5925] shadow-lg'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img
                          src={dataUri}
                          alt={`Signature style ${style.id}`}
                          className="w-full h-auto"
                        />
                        {selectedStyle === style.id && (
                          <div className="absolute top-2 right-2 bg-[#ed5925] text-white rounded-full p-1">
                            <CheckCircle className="w-4 h-4" />
                          </div>
                        )}
                      </button>
                    );
                  })}
              </div>
              <Button
                onClick={() => {
                  if (!selectedStyle) {
                    const gallery = generator.generateStyleGallery(
                      signatureData.seed,
                      9,
                    );
                    setSelectedStyle(gallery[0].id);
                    const svg = generator.renderToSVG(
                      signatureData,
                      gallery[0],
                    );
                    setSvgContent(svg);
                  }
                }}
                className="w-full mt-6 bg-[#ed5925] hover:bg-[#d14a1f] text-white"
                disabled={!selectedStyle}
              >
                Continue to Customization
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Creation Options */}
        {signatureData && selectedStyle && (
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as 'color' | 'draw')}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 h-14 bg-white dark:bg-[#002244] border border-gray-200 dark:border-[#004953] rounded-xl p-1 max-w-lg mx-auto">
              <TabsTrigger
                value="color"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#ed5925] data-[state=active]:to-[#96abdc] data-[state=active]:text-white rounded-lg font-semibold transition-all duration-200 flex items-center gap-2"
              >
                <Palette className="w-4 h-4" />
                Color Signature
              </TabsTrigger>
              <TabsTrigger
                value="draw"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#ed5925] data-[state=active]:to-[#96abdc] data-[state=active]:text-white rounded-lg font-semibold transition-all duration-200 flex items-center gap-2"
              >
                <PenTool className="w-4 h-4" />
                Draw Symbol
              </TabsTrigger>
            </TabsList>

            {/* Color Signature Tab */}
            <TabsContent value="color" className="mt-8">
              <Card>
                <CardContent className="p-6">
                  <div className="mb-6 text-center">
                    <h3 className="text-2xl font-bold text-[#002244] dark:text-white mb-2">
                      Customize Your Signature Color
                    </h3>
                    <p className="text-[#708090] dark:text-[#96abdc]">
                      Add color and glow effects to your personalized signature.
                      Perfect for making your squares stand out!
                    </p>
                  </div>

                  {signatureData && currentStyle && (
                    <SignatureColorCustomizer
                      signatureData={signatureData}
                      signatureStyle={currentStyle}
                      svgContent={svgContent}
                      onColorChange={(color, glow) => {
                        console.log('Color changed:', color, glow);
                      }}
                      onExport={handleColorExport}
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Drawing Board Tab */}
            <TabsContent value="draw" className="mt-8">
              <Card>
                <CardContent className="p-6">
                  <div className="mb-6 text-center">
                    <h3 className="text-2xl font-bold text-[#002244] dark:text-white mb-2">
                      Draw Your Custom Symbol
                    </h3>
                    <p className="text-[#708090] dark:text-[#96abdc]">
                      Create a unique hand-drawn symbol using your mouse,
                      finger, or stylus. Perfect for initials, simple logos, or
                      personal doodles!
                    </p>
                  </div>

                  <div className="flex justify-center">
                    <DrawingBoardMarker
                      displaySize={320}
                      pixelSize={1024}
                      onExport={handleDrawingExport}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {/* Pricing & Benefits */}
        <Card className="mt-8 bg-gradient-to-r from-[#004953] to-[#002244] text-white">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">$3 Tier Benefits</h3>
                <ul className="space-y-2">
                  {[
                    'Personalized signature or symbol',
                    'Full color customization',
                    'Soft glow effects',
                    'High-resolution 1024x1024 output',
                    'Use on unlimited squares',
                    'Transferable NFT ownership',
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-[#96abdc]" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-center">
                <div className="bg-white bg-opacity-20 rounded-2xl p-6">
                  <div className="text-6xl font-bold text-[#96abdc] mb-2">
                    $3
                  </div>
                  <p className="text-lg opacity-90">One-time cost</p>
                  <p className="text-sm opacity-75">
                    Use forever on any square
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-center">
              How It Works
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                {
                  step: '1',
                  title: 'Choose Style',
                  description:
                    'Pick between colored signature or custom drawing',
                },
                {
                  step: '2',
                  title: 'Customize',
                  description:
                    'Select colors, adjust glow, or draw your symbol',
                },
                {
                  step: '3',
                  title: 'Preview',
                  description:
                    'See how your marker looks in different backgrounds',
                },
                {
                  step: '4',
                  title: 'Mint NFT',
                  description:
                    'Create your $3 NFT and use it on all future squares',
                },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-8 h-8 bg-[#ed5925] text-white rounded-full flex items-center justify-center font-bold mb-2 mx-auto">
                    {item.step}
                  </div>
                  <h4 className="font-semibold mb-1">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
