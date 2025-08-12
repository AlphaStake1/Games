'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Check, Sparkles, Trophy, Palette, Zap } from 'lucide-react';

export interface NFTItem {
  id: string;
  name: string;
  imageUrl: string;
  category:
    | 'abstract'
    | 'celebration'
    | 'field'
    | 'trophy'
    | 'ai-generated'
    | 'animated';
  isAnimated?: boolean;
  videoUrl?: string;
  description?: string;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
}

interface NFTGalleryProps {
  items: NFTItem[];
  onSelect: (item: NFTItem) => void;
  selectedId?: string;
  showCategories?: boolean;
  maxColumns?: number;
}

const categoryIcons = {
  abstract: <Palette className="w-4 h-4" />,
  celebration: <Sparkles className="w-4 h-4" />,
  field: <Zap className="w-4 h-4" />,
  trophy: <Trophy className="w-4 h-4" />,
  'ai-generated': <Sparkles className="w-4 h-4" />,
  animated: <Zap className="w-4 h-4" />,
};

const rarityColors = {
  common: 'border-gray-300',
  rare: 'border-blue-400',
  epic: 'border-purple-400',
  legendary: 'border-amber-400',
};

const rarityGradients = {
  common: 'from-gray-100 to-gray-200',
  rare: 'from-blue-100 to-blue-200',
  epic: 'from-purple-100 to-purple-200',
  legendary: 'from-amber-100 to-amber-200',
};

export default function NFTGallery({
  items,
  onSelect,
  selectedId,
  showCategories = true,
  maxColumns = 3,
}: NFTGalleryProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const categories = [
    'all',
    ...Array.from(new Set(items.map((item) => item.category))),
  ];

  const filteredItems =
    activeCategory === 'all'
      ? items
      : items.filter((item) => item.category === activeCategory);

  const gridCols =
    maxColumns === 2
      ? 'grid-cols-2'
      : maxColumns === 4
        ? 'grid-cols-2 md:grid-cols-4'
        : 'grid-cols-2 md:grid-cols-3';

  return (
    <div className="space-y-6">
      {showCategories && categories.length > 1 && (
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory(category)}
              className={`capitalize ${
                activeCategory === category
                  ? 'bg-[#004953] text-white'
                  : 'border-[#004953] text-[#004953] hover:bg-[#004953]/10'
              }`}
            >
              {category !== 'all' &&
                categoryIcons[category as keyof typeof categoryIcons]}
              <span className="ml-1">{category.replace('-', ' ')}</span>
            </Button>
          ))}
        </div>
      )}

      <div className={`grid ${gridCols} gap-4`}>
        {filteredItems.map((item) => {
          const isSelected = selectedId === item.id;
          const isHovered = hoveredId === item.id;
          const rarity = item.rarity || 'common';

          return (
            <div
              key={item.id}
              className={`relative group cursor-pointer transform transition-all duration-300 ${
                isSelected ? 'scale-105' : isHovered ? 'scale-102' : 'scale-100'
              }`}
              onClick={() => onSelect(item)}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div
                className={`
                relative rounded-xl overflow-hidden border-4 transition-all duration-300
                ${
                  isSelected
                    ? `${rarityColors[rarity]} shadow-2xl ring-4 ring-offset-2 ring-[#004953]/20`
                    : `border-gray-200 hover:${rarityColors[rarity]} hover:shadow-xl`
                }
              `}
              >
                {/* Rarity gradient background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${rarityGradients[rarity]} opacity-10`}
                />

                {/* Image/Video Container */}
                <div className="relative aspect-square bg-gray-100">
                  {item.isAnimated && item.videoUrl ? (
                    <video
                      src={item.videoUrl}
                      className="w-full h-full object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  ) : (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                  )}

                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1.5 shadow-lg">
                      <Check className="w-5 h-5" />
                    </div>
                  )}

                  {/* Animated Badge */}
                  {item.isAnimated && (
                    <div className="absolute top-2 left-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-semibold shadow-lg">
                      ANIMATED
                    </div>
                  )}
                </div>

                {/* NFT Info */}
                <div className="p-3 bg-white dark:bg-[#002244] relative">
                  <h3 className="font-semibold text-sm text-[#004953] dark:text-white truncate">
                    {item.name}
                  </h3>
                  {item.description && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <span
                      className={`text-xs font-medium capitalize px-2 py-0.5 rounded-full bg-gradient-to-r ${rarityGradients[rarity]}`}
                    >
                      {rarity}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 capitalize flex items-center gap-1">
                      {categoryIcons[item.category]}
                      {item.category.replace('-', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No NFTs found in this category</p>
        </div>
      )}
    </div>
  );
}
