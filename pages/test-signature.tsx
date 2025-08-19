'use client';

import React, { useState } from 'react';
import {
  SignatureGenerator,
  SignatureData,
} from '@/lib/signature/signatureGenerator';
import { SIGNATURE_CONFIG } from '@/lib/signature/signatureConfig';

export default function TestSignaturePage() {
  const [signatures, setSignatures] = useState<any[]>([]);
  const generator = new SignatureGenerator();

  const generateTestSignatures = () => {
    const testData: SignatureData = {
      firstName: 'John',
      lastInitial: 'D',
      walletPublicKey: '11111111111111111111111111111111',
      seed: 'test-seed-12345',
      selectedStyleId: 'test',
      timestamp: Date.now(),
    };

    const styles = generator.generateStyleGallery(testData.seed, 9);
    const sigs = styles.map((style) => {
      const svg = generator.renderToSVG(testData, style);
      return {
        style,
        svg,
        dataUri: `data:image/svg+xml,${encodeURIComponent(svg)}`,
      };
    });

    setSignatures(sigs);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Signature Angle Test</h1>

      <button
        onClick={generateTestSignatures}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-6 hover:bg-blue-600"
      >
        Generate Test Signatures
      </button>

      <div className="grid grid-cols-3 gap-4">
        {signatures.map((sig, index) => (
          <div key={index} className="border rounded p-4 bg-gray-50">
            <div className="mb-2 text-sm">
              <div>Font: {sig.style.fontId}</div>
              <div className="font-bold text-red-600">
                Slant: {sig.style.slant}°
              </div>
              <div>Size: {sig.style.baseSize}px</div>
            </div>
            <div className="border bg-white p-2">
              <img
                src={sig.dataUri}
                alt={`Signature ${index + 1}`}
                className="w-full h-auto"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
