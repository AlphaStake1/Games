'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Undo2, Eraser, Palette, Download, Trash2 } from 'lucide-react';

type Point = { x: number; y: number; p: number; t: number };
type Stroke = {
  points: Point[];
  color: string;
  size: number;
  glow: number;
  id: string;
};

interface Props {
  displaySize?: number;
  pixelSize?: number;
  onExport?: (pngDataUrl: string, svgData: string, metadata: any) => void;
}

const BRAND_COLORS = [
  '#ed5925', // FSQ Orange
  '#96abdc', // FSQ Blue
  '#004953', // FSQ Teal
  '#002244', // FSQ Navy
  '#8d594d', // Brown
  '#6b46c1', // Purple
  '#059669', // Green
  '#dc2626', // Red
  '#ffffff', // White
  '#000000', // Black
];

export default function DrawingBoardMarker({
  displaySize = 320,
  pixelSize = 1024,
  onExport,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(8);
  const [glowIntensity, setGlowIntensity] = useState(6);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);
  const [isErasing, setIsErasing] = useState(false);
  const [previewMode, setPreviewMode] = useState<
    'light' | 'dark' | 'transparent'
  >('transparent');

  // Setup canvas with proper DPI
  useEffect(() => {
    const canvas = canvasRef.current!;
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = pixelSize * dpr;
    canvas.height = pixelSize * dpr;
    canvas.style.width = `${displaySize}px`;
    canvas.style.height = `${displaySize}px`;

    const ctx = canvas.getContext('2d')!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.scale(pixelSize / displaySize, pixelSize / displaySize);

    redrawCanvas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displaySize, pixelSize, previewMode]);

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    // Clear canvas
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    // Background based on preview mode
    if (previewMode !== 'transparent') {
      ctx.fillStyle = previewMode === 'light' ? '#ffffff' : '#0b0f14';
      ctx.fillRect(0, 0, displaySize, displaySize);
    }

    // Draw all strokes
    [...strokes, ...(currentStroke ? [currentStroke] : [])].forEach(
      (stroke) => {
        drawStroke(ctx, stroke);
      },
    );
  }, [strokes, currentStroke, displaySize, previewMode]);

  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  const drawStroke = (ctx: CanvasRenderingContext2D, stroke: Stroke) => {
    if (stroke.points.length < 1) return;

    const { points, color: strokeColor, size, glow } = stroke;

    // Draw glow layer first (if enabled)
    if (glow > 0) {
      ctx.save();
      ctx.globalCompositeOperation = 'source-over';
      ctx.shadowColor = strokeColor;
      ctx.shadowBlur = glow;
      ctx.strokeStyle = strokeColor;
      ctx.globalAlpha = 0.6;
      ctx.lineWidth = size + glow * 0.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      drawSmoothPath(ctx, points);
      ctx.restore();
    }

    // Draw main stroke
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = strokeColor;
    ctx.globalAlpha = 1;
    ctx.lineWidth = size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    drawSmoothPath(ctx, points);
    ctx.restore();
  };

  const drawSmoothPath = (ctx: CanvasRenderingContext2D, points: Point[]) => {
    if (points.length < 2) {
      // Single point - draw a dot
      const point = points[0];
      ctx.beginPath();
      ctx.arc(point.x, point.y, ctx.lineWidth / 2, 0, Math.PI * 2);
      ctx.fillStyle = ctx.strokeStyle as string;
      ctx.fill();
      return;
    }

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length - 1; i++) {
      const currentPoint = points[i];
      const nextPoint = points[i + 1];
      const midX = (currentPoint.x + nextPoint.x) / 2;
      const midY = (currentPoint.y + nextPoint.y) / 2;

      // Apply pressure variation (subtle)
      const pressureMultiplier = 0.7 + 0.3 * (currentPoint.p || 1);
      ctx.lineWidth = (ctx.lineWidth as any) * pressureMultiplier;

      ctx.quadraticCurveTo(currentPoint.x, currentPoint.y, midX, midY);
    }

    // Draw to the last point
    const lastPoint = points[points.length - 1];
    ctx.lineTo(lastPoint.x, lastPoint.y);
    ctx.stroke();
  };

  const getPointerPosition = (e: PointerEvent): { x: number; y: number } => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * displaySize,
      y: ((e.clientY - rect.top) / rect.height) * displaySize,
    };
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    const canvas = canvasRef.current!;
    canvas.setPointerCapture(e.pointerId);
    canvas.style.touchAction = 'none';

    const { x, y } = getPointerPosition(e.nativeEvent);
    const pressure = e.nativeEvent.pressure || 1;

    const newStroke: Stroke = {
      points: [{ x, y, p: pressure, t: performance.now() }],
      color: isErasing ? 'transparent' : color,
      size: brushSize,
      glow: isErasing ? 0 : glowIntensity,
      id: `stroke-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    };

    setCurrentStroke(newStroke);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!currentStroke) return;

    const nativeEvent = e.nativeEvent;
    const events = nativeEvent.getCoalescedEvents
      ? nativeEvent.getCoalescedEvents()
      : [nativeEvent];

    const newPoints: Point[] = [];
    for (const event of events as PointerEvent[]) {
      const { x, y } = getPointerPosition(event);
      const pressure = event.pressure || 1;
      newPoints.push({ x, y, p: pressure, t: performance.now() });
    }

    if (newPoints.length > 0) {
      setCurrentStroke((prev) => ({
        ...prev!,
        points: [...prev!.points, ...newPoints],
      }));
    }
  };

  const handlePointerUp = () => {
    if (currentStroke) {
      if (isErasing) {
        // For erasing, we'd need to implement more complex logic
        // For now, just ignore eraser strokes
        setCurrentStroke(null);
      } else {
        setStrokes((prev) => [...prev, currentStroke]);
        setCurrentStroke(null);
      }
    }
  };

  const handlePointerCancel = () => {
    setCurrentStroke(null);
  };

  const undoLastStroke = () => {
    setStrokes((prev) => prev.slice(0, -1));
  };

  const clearCanvas = () => {
    setStrokes([]);
    setCurrentStroke(null);
  };

  const exportArtwork = async () => {
    const canvas = canvasRef.current!;

    // Create clean export canvas
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = pixelSize;
    exportCanvas.height = pixelSize;
    const exportCtx = exportCanvas.getContext('2d')!;

    // Set up high-quality rendering
    exportCtx.imageSmoothingEnabled = true;
    exportCtx.imageSmoothingQuality = 'high';

    // Draw background if not transparent
    if (previewMode !== 'transparent') {
      exportCtx.fillStyle = previewMode === 'light' ? '#ffffff' : '#0b0f14';
      exportCtx.fillRect(0, 0, pixelSize, pixelSize);
    }

    // Redraw all strokes at full resolution
    const scale = pixelSize / displaySize;
    exportCtx.scale(scale, scale);

    strokes.forEach((stroke) => {
      drawStroke(exportCtx, stroke);
    });

    // Generate PNG
    const pngDataUrl = exportCanvas.toDataURL('image/png');

    // Generate SVG representation
    const svgData = generateSVG();

    // Generate metadata
    const metadata = {
      name: 'Custom Drawing Marker',
      description: 'Hand-drawn custom symbol for Football Squares',
      attributes: [
        { trait_type: 'nft_type', value: 'hand_drawn_symbol' },
        { trait_type: 'stroke_count', value: strokes.length },
        { trait_type: 'primary_color', value: getMostUsedColor() },
        { trait_type: 'has_glow', value: strokes.some((s) => s.glow > 0) },
        { trait_type: 'price_tier', value: '$3' },
        { trait_type: 'created_with', value: 'drawing_board' },
      ],
    };

    onExport?.(pngDataUrl, svgData, metadata);

    // Also trigger download
    const link = document.createElement('a');
    link.download = `custom-marker-${Date.now()}.png`;
    link.href = pngDataUrl;
    link.click();
  };

  const generateSVG = (): string => {
    // Convert strokes to SVG paths
    let pathElements = '';

    strokes.forEach((stroke, index) => {
      if (stroke.points.length < 2) return;

      let pathData = `M ${stroke.points[0].x} ${stroke.points[0].y}`;

      for (let i = 1; i < stroke.points.length - 1; i++) {
        const current = stroke.points[i];
        const next = stroke.points[i + 1];
        const midX = (current.x + next.x) / 2;
        const midY = (current.y + next.y) / 2;
        pathData += ` Q ${current.x} ${current.y} ${midX} ${midY}`;
      }

      const lastPoint = stroke.points[stroke.points.length - 1];
      pathData += ` L ${lastPoint.x} ${lastPoint.y}`;

      pathElements += `
        <path 
          d="${pathData}" 
          stroke="${stroke.color}" 
          stroke-width="${stroke.size}" 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          fill="none"
          ${stroke.glow > 0 ? `filter="url(#glow-${index})"` : ''}
        />`;

      // Add glow filter if needed
      if (stroke.glow > 0) {
        pathElements =
          `
          <defs>
            <filter id="glow-${index}" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="${stroke.glow / 2}" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
        ` + pathElements;
      }
    });

    return `
      <svg width="${pixelSize}" height="${pixelSize}" viewBox="0 0 ${displaySize} ${displaySize}" xmlns="http://www.w3.org/2000/svg">
        ${pathElements}
      </svg>
    `.trim();
  };

  const getMostUsedColor = (): string => {
    const colorCounts: { [key: string]: number } = {};
    strokes.forEach((stroke) => {
      colorCounts[stroke.color] =
        (colorCounts[stroke.color] || 0) + stroke.points.length;
    });

    return (
      Object.entries(colorCounts).reduce((a, b) =>
        colorCounts[a[0]] > colorCounts[b[0]] ? a : b,
      )?.[0] || '#000000'
    );
  };

  const backgroundStyle = {
    light: '#ffffff',
    dark: '#0b0f14',
    transparent: 'transparent',
  }[previewMode];

  return (
    <div className="space-y-6">
      {/* Tools */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[#002244] dark:text-white">
          Drawing Tools
        </h3>

        {/* Color Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Color:</label>
          <div className="flex gap-2 flex-wrap">
            {BRAND_COLORS.map((brandColor) => (
              <button
                key={brandColor}
                onClick={() => setColor(brandColor)}
                className={`w-8 h-8 rounded-lg border-2 transition-all ${
                  color === brandColor
                    ? 'border-[#ed5925] scale-110 shadow-lg'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                style={{ backgroundColor: brandColor }}
                title={brandColor}
              />
            ))}
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-8 h-8 rounded border cursor-pointer"
            />
          </div>
        </div>

        {/* Brush Controls */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">
              Brush Size: {brushSize}px
            </label>
            <input
              type="range"
              min={2}
              max={32}
              value={brushSize}
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-sm font-medium">
              Glow: {glowIntensity}px
            </label>
            <input
              type="range"
              min={0}
              max={24}
              value={glowIntensity}
              onChange={(e) => setGlowIntensity(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={undoLastStroke}
            disabled={strokes.length === 0}
            className="flex items-center gap-2 px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Undo2 className="w-4 h-4" />
            Undo
          </button>

          <button
            onClick={clearCanvas}
            disabled={strokes.length === 0}
            className="flex items-center gap-2 px-3 py-2 rounded bg-red-200 hover:bg-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </button>

          <div className="flex items-center gap-2">
            <label className="text-sm">Preview:</label>
            {(['transparent', 'light', 'dark'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setPreviewMode(mode)}
                className={`px-2 py-1 rounded text-xs ${
                  previewMode === mode
                    ? 'bg-[#ed5925] text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Drawing Canvas */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-[#002244] dark:text-white">
          Draw Your Symbol
        </h3>

        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center"
          style={{ backgroundColor: backgroundStyle }}
        >
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            onPointerLeave={handlePointerCancel}
            className="touch-none rounded cursor-crosshair"
            style={{
              width: displaySize,
              height: displaySize,
              touchAction: 'none',
            }}
          />
        </div>

        <p className="text-sm text-gray-600 text-center">
          Draw with mouse, finger, or stylus. Perfect for simple symbols,
          initials, or doodles.
        </p>
      </div>

      {/* Export */}
      <div className="flex gap-3">
        <button
          onClick={exportArtwork}
          disabled={strokes.length === 0}
          className="bg-gradient-to-r from-[#ed5925] to-[#96abdc] text-white px-6 py-3 rounded-lg font-semibold hover:from-[#d14a1f] hover:to-[#7a95d1] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Create NFT ($3)
        </button>
      </div>

      {/* Stats */}
      {strokes.length > 0 && (
        <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4">
          <h4 className="text-sm font-semibold mb-2">Drawing Stats:</h4>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <div>Strokes: {strokes.length}</div>
            <div>
              Total Points:{' '}
              {strokes.reduce((sum, s) => sum + s.points.length, 0)}
            </div>
            <div>
              Colors Used:{' '}
              {Array.from(new Set(strokes.map((s) => s.color))).length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
