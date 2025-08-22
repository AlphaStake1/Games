'use client';

import React, { useMemo, useRef, useState } from 'react';
import { SignatureStyle } from '@/lib/signature/signatureConfig';
import { SignatureData } from '@/lib/signature/signatureGenerator';

interface Props {
  signatureData: SignatureData;
  signatureStyle: SignatureStyle;
  svgContent: string;
  onColorChange?: (color: string, glow: number) => void;
  onExport?: (svgContent: string, pngDataUrl: string) => void;
}

const BRAND_COLORS = [
  { name: 'FSQ Orange', value: '#ed5925' },
  { name: 'FSQ Blue', value: '#96abdc' },
  { name: 'FSQ Teal', value: '#004953' },
  { name: 'FSQ Navy', value: '#002244' },
  { name: 'Brown', value: '#8d594d' },
  { name: 'Purple', value: '#6b46c1' },
  { name: 'Green', value: '#059669' },
  { name: 'Red', value: '#dc2626' },
  { name: 'Gold', value: '#fbbf24' },
  { name: 'Pink', value: '#ec4899' },
];

export default function SignatureColorCustomizer({
  signatureData,
  signatureStyle,
  svgContent,
  onColorChange,
  onExport,
}: Props) {
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [glowIntensity, setGlowIntensity] = useState(8);
  const [previewMode, setPreviewMode] = useState<
    'light' | 'dark' | 'transparent'
  >('transparent');
  const svgRef = useRef<SVGSVGElement>(null);

  const filterId = useMemo(
    () => `signature-glow-${Math.random().toString(36).slice(2)}`,
    [],
  );

  // Generate enhanced SVG with color and glow
  const enhancedSvg = useMemo(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgContent, 'image/svg+xml');
    const svg = doc.querySelector('svg');

    if (!svg) return svgContent;

    // Clone to avoid mutations
    const svgClone = svg.cloneNode(true) as SVGSVGElement;

    // Add glow filter to defs
    let defs = svgClone.querySelector('defs');
    if (!defs) {
      defs = doc.createElementNS('http://www.w3.org/2000/svg', 'defs');
      svgClone.insertBefore(defs, svgClone.firstChild);
    }

    // Clear existing glow elements and filters
    svgClone
      .querySelectorAll('[data-glow="true"]')
      .forEach((el) => el.remove());
    const existingFilter = defs.querySelector(`#${filterId}`);
    if (existingFilter) {
      existingFilter.remove();
    }

    // Add new glow filter
    if (glowIntensity > 0) {
      const filter = doc.createElementNS(
        'http://www.w3.org/2000/svg',
        'filter',
      );
      filter.setAttribute('id', filterId);
      filter.setAttribute('x', '-50%');
      filter.setAttribute('y', '-50%');
      filter.setAttribute('width', '200%');
      filter.setAttribute('height', '200%');

      const blur = doc.createElementNS(
        'http://www.w3.org/2000/svg',
        'feGaussianBlur',
      );
      blur.setAttribute('in', 'SourceGraphic');
      blur.setAttribute('stdDeviation', (glowIntensity / 2).toString());

      filter.appendChild(blur);
      defs.appendChild(filter);
    }

    // Find text elements and update them
    const textElements = svgClone.querySelectorAll('text');
    textElements.forEach((text) => {
      // Create glow layer if glow > 0
      if (glowIntensity > 0) {
        const glowText = text.cloneNode(true) as SVGTextElement;
        glowText.setAttribute('fill', selectedColor);
        glowText.setAttribute('opacity', '0.6');
        glowText.setAttribute('filter', `url(#${filterId})`);
        glowText.setAttribute('data-glow', 'true');
        svgClone.insertBefore(glowText, text);
      }

      // Update main text color
      text.setAttribute('fill', selectedColor);
    });

    return new XMLSerializer().serializeToString(svgClone);
  }, [svgContent, selectedColor, glowIntensity, filterId]);

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    onColorChange?.(color, glowIntensity);
  };

  const handleGlowChange = (glow: number) => {
    setGlowIntensity(glow);
    onColorChange?.(selectedColor, glow);
  };

  const handleExportPNG = async () => {
    // Use the enhanced SVG directly
    const svgBlob = new Blob([enhancedSvg], {
      type: 'image/svg+xml;charset=utf-8',
    });
    const url = URL.createObjectURL(svgBlob);

    try {
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = url;
      });

      const canvas = document.createElement('canvas');
      const scale = 2; // High DPI
      canvas.width = 1024 * scale;
      canvas.height = 1024 * scale;
      const ctx = canvas.getContext('2d')!;

      // Background based on preview mode
      if (previewMode !== 'transparent') {
        ctx.fillStyle = previewMode === 'light' ? '#ffffff' : '#0b0f14';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const pngDataUrl = canvas.toDataURL('image/png');

      onExport?.(enhancedSvg, pngDataUrl);

      // Trigger download
      const link = document.createElement('a');
      link.download = `signature-${signatureData.firstName}-${selectedColor.replace('#', '')}-g${glowIntensity}.png`;
      link.href = pngDataUrl;
      link.click();
    } finally {
      URL.revokeObjectURL(url);
    }
  };

  const previewBackground = {
    light: '#ffffff',
    dark: '#0b0f14',
    transparent: 'transparent',
  }[previewMode];

  return (
    <div className="space-y-6">
      {/* Color Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[#002244] dark:text-white">
          Choose Your Signature Color
        </h3>

        {/* Brand Color Swatches */}
        <div className="grid grid-cols-5 gap-3">
          {BRAND_COLORS.map((color) => (
            <button
              key={color.value}
              onClick={() => handleColorSelect(color.value)}
              className={`relative h-12 w-full rounded-lg border-2 transition-all duration-200 ${
                selectedColor === color.value
                  ? 'border-[#ed5925] scale-105 shadow-lg'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              style={{ backgroundColor: color.value }}
              title={color.name}
            >
              {selectedColor === color.value && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-white border border-gray-300" />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Custom Color Picker */}
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium">Custom Color:</label>
          <input
            type="color"
            value={selectedColor}
            onChange={(e) => handleColorSelect(e.target.value)}
            className="h-10 w-16 rounded border cursor-pointer"
          />
          <span className="text-sm font-mono text-gray-600">
            {selectedColor.toUpperCase()}
          </span>
        </div>

        {/* Glow Intensity */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Glow Intensity:</label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={24}
              step={1}
              value={glowIntensity}
              onChange={(e) => handleGlowChange(parseInt(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm font-mono w-12">{glowIntensity}px</span>
          </div>
        </div>

        {/* Preview Mode */}
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium">Preview:</label>
          {['transparent', 'light', 'dark'].map((mode) => (
            <button
              key={mode}
              onClick={() => setPreviewMode(mode as any)}
              className={`px-3 py-1 rounded text-sm ${
                previewMode === mode
                  ? 'bg-[#ed5925] text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[#002244] dark:text-white">
          Preview
        </h3>

        <div
          className="border rounded-lg p-8 flex items-center justify-center"
          style={{ backgroundColor: previewBackground }}
        >
          <svg
            ref={svgRef}
            viewBox="0 0 1024 1024"
            className="max-w-full max-h-64"
            dangerouslySetInnerHTML={{
              __html: enhancedSvg.replace(/<svg[^>]*>|<\/svg>/g, ''),
            }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleExportPNG}
          className="bg-gradient-to-r from-[#ed5925] to-[#96abdc] text-white px-6 py-3 rounded-lg font-semibold hover:from-[#d14a1f] hover:to-[#7a95d1] transition-all duration-200"
        >
          Export High-Resolution PNG
        </button>

        <button
          onClick={() => onExport?.(enhancedSvg, '')}
          className="border border-[#ed5925] text-[#ed5925] px-6 py-3 rounded-lg font-semibold hover:bg-[#ed5925] hover:text-white transition-all duration-200"
        >
          Create NFT ($3)
        </button>
      </div>

      {/* Metadata Preview */}
      <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4">
        <h4 className="text-sm font-semibold mb-2">NFT Metadata Preview:</h4>
        <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-auto">
          {JSON.stringify(
            {
              name: `${signatureData.firstName} ${signatureData.lastInitial}. - Colored Signature`,
              attributes: [
                { trait_type: 'signature_style', value: signatureStyle.id },
                {
                  trait_type: 'signature_color',
                  value: selectedColor.toUpperCase(),
                },
                { trait_type: 'signature_glow_px', value: glowIntensity },
                { trait_type: 'nft_type', value: 'colored_signature' },
                { trait_type: 'price_tier', value: '$3' },
              ],
            },
            null,
            2,
          )}
        </pre>
      </div>
    </div>
  );
}
