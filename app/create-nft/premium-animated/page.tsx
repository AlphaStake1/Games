'use client';

import { useState } from 'react';
import CreateNFTNav from '@/components/CreateNFTNav';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Sparkles,
  Upload,
  Play,
  Wand2,
  Shuffle,
  User,
  Package,
  Coffee,
  Shield,
} from 'lucide-react';
import NFTGallery from '@/components/NFTGallery';
import { animatedNFTs } from '@/lib/mockNFTData';
import { NFTItem } from '@/components/NFTGallery';
import Image from 'next/image';
import {
  SUBJECTS,
  SUBJECT_LABELS,
  SUBJECT_THUMBNAILS,
  ART_STYLES,
  GUIDED_FIELDS,
  ENERGY_LEVELS,
  BACKGROUND_OPTIONS,
  FRAMING_OPTIONS,
  FINISH_OPTIONS,
  PALETTE_PRESETS,
  RECIPE_CARDS,
  buildPromptFromFields,
  type SubjectType,
} from '@/lib/art-presets';

function AnimatedNFTCreator() {
  const [selectedNFT, setSelectedNFT] = useState<NFTItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'create' | 'upload' | 'gallery'>(
    'create',
  );

  // Guided creation state
  const [subjectType, setSubjectType] = useState<SubjectType>('character');
  const [artStyle, setArtStyle] = useState('sticker');
  const [energyLevel, setEnergyLevel] = useState('balanced');
  const [backgroundOption, setBackgroundOption] = useState('scene');
  const [framingOption, setFramingOption] = useState('bust');
  const [finishOption, setFinishOption] = useState('none');
  const [selectedPalette, setSelectedPalette] = useState('dali-choice');
  const [guidedFields, setGuidedFields] = useState<Record<string, string>>({});

  // Advanced mode
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  const handleFieldChange = (fieldId: string, value: string) => {
    setGuidedFields((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleSurpriseMe = () => {
    const surpriseValues: Record<SubjectType, Record<string, string>> = {
      character: {
        role: ['QB', 'mascot', 'coach', 'fan'][Math.floor(Math.random() * 4)],
        action: ['throwing', 'cheering', 'running', 'celebrating'][
          Math.floor(Math.random() * 4)
        ],
        mood: ['confident', 'excited', 'determined', 'joyful'][
          Math.floor(Math.random() * 4)
        ],
        prop: ['football', 'trophy', 'foam finger', 'none'][
          Math.floor(Math.random() * 4)
        ],
      },
      object: {
        item: ['helmet', 'football', 'cleats', 'trophy'][
          Math.floor(Math.random() * 4)
        ],
        condition: ['pristine', 'vintage', 'battle-worn', 'gleaming'][
          Math.floor(Math.random() * 4)
        ],
        vibe: ['professional', 'rugged', 'classic', 'modern'][
          Math.floor(Math.random() * 4)
        ],
        context: ['on field', 'locker room', 'spotlight', 'grass'][
          Math.floor(Math.random() * 4)
        ],
      },
      food: {
        item: ['hotdog', 'nachos', 'popcorn', 'beer'][
          Math.floor(Math.random() * 4)
        ],
        topping: ['loaded', 'classic', 'extra cheese', 'spicy'][
          Math.floor(Math.random() * 4)
        ],
        temp: ['steaming', 'fresh', 'ice cold', 'hot'][
          Math.floor(Math.random() * 4)
        ],
        container: ['paper tray', 'helmet cup', 'bucket', 'box'][
          Math.floor(Math.random() * 4)
        ],
      },
      emblem: {
        symbol: ['number 7', 'star', 'lightning bolt', 'shield'][
          Math.floor(Math.random() * 4)
        ],
        style: ['neon', 'chrome', 'vintage', 'holographic'][
          Math.floor(Math.random() * 4)
        ],
        pattern: ['gradient', 'solid', 'textured', 'metallic'][
          Math.floor(Math.random() * 4)
        ],
        background: ['none', 'circle', 'shield', 'burst'][
          Math.floor(Math.random() * 4)
        ],
      },
    };

    setGuidedFields(surpriseValues[subjectType]);
    setArtStyle(ART_STYLES[Math.floor(Math.random() * ART_STYLES.length)].id);
    setEnergyLevel(
      ENERGY_LEVELS[Math.floor(Math.random() * ENERGY_LEVELS.length)].id,
    );
    setBackgroundOption(
      BACKGROUND_OPTIONS[Math.floor(Math.random() * BACKGROUND_OPTIONS.length)]
        .id,
    );
    setFramingOption(
      FRAMING_OPTIONS[Math.floor(Math.random() * FRAMING_OPTIONS.length)].id,
    );
    setFinishOption(
      FINISH_OPTIONS[Math.floor(Math.random() * FINISH_OPTIONS.length)].id,
    );
    setSelectedPalette(
      PALETTE_PRESETS[Math.floor(Math.random() * PALETTE_PRESETS.length)].id,
    );
  };

  const handleRecipeSelect = (recipe: (typeof RECIPE_CARDS)[0]) => {
    setSubjectType(recipe.subject);
    setArtStyle(recipe.style);
    setEnergyLevel(recipe.energy || 'balanced');
    setBackgroundOption(recipe.background || 'scene');
    setFramingOption(recipe.framing || 'bust');
    setFinishOption(recipe.finish || 'none');
    setSelectedPalette(recipe.palette || 'dali-choice');
    setGuidedFields(recipe.fields || {});
    setActiveTab('create');
  };

  const handleSelect = (item: NFTItem) => {
    setSelectedNFT(item);
    setActiveTab('create');
  };

  const handleGenerateArt = async () => {
    setIsGenerating(true);

    // Build prompt from guided fields or use custom
    const finalPrompt =
      showAdvanced && customPrompt
        ? customPrompt
        : buildPromptFromFields(
            subjectType,
            artStyle,
            energyLevel,
            backgroundOption,
            framingOption,
            guidedFields,
            selectedPalette,
          );

    // Simulate AI generation
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Select a random animated NFT as the "generated" result
    const randomNFT =
      animatedNFTs[Math.floor(Math.random() * animatedNFTs.length)];
    setSelectedNFT({
      ...randomNFT,
      name: 'AI Generated Animation',
      description: `Generated: ${finalPrompt.substring(0, 80)}... | Energy: ${energyLevel} | Finish: ${finishOption}`,
    });

    setIsGenerating(false);
  };

  const handleCreateNFT = async () => {
    if (!selectedNFT) return;

    setIsCreating(true);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setIsCreating(false);

    alert(`Animated NFT "${selectedNFT.name}" created successfully!`);
  };

  const getSubjectIcon = (subject: SubjectType) => {
    const icons = {
      character: <User className="w-4 h-4" />,
      object: <Package className="w-4 h-4" />,
      food: <Coffee className="w-4 h-4" />,
      emblem: <Shield className="w-4 h-4" />,
    };
    return icons[subject];
  };

  // Get available recipe cards for animated NFTs
  const animatedRecipes = RECIPE_CARDS.slice(0, 6); // Show first 6 recipe cards

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Create/Upload/Gallery Section */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-[#002244] rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-amber-500/20">
            {/* Tabs */}
            <div className="flex gap-2 mb-6">
              <Button
                variant={activeTab === 'create' ? 'default' : 'outline'}
                onClick={() => setActiveTab('create')}
                className="flex-1"
              >
                <Wand2 className="w-4 h-4 mr-2" />
                Create Art
              </Button>
              <Button
                variant={activeTab === 'upload' ? 'default' : 'outline'}
                onClick={() => setActiveTab('upload')}
                className="flex-1"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Custom
              </Button>
              <Button
                variant={activeTab === 'gallery' ? 'default' : 'outline'}
                onClick={() => setActiveTab('gallery')}
                className="flex-1"
              >
                <Play className="w-4 h-4 mr-2" />
                Gallery
              </Button>
            </div>

            {activeTab === 'create' ? (
              <div className="space-y-6">
                {/* Subject Type Selector */}
                <div>
                  <label className="block text-sm font-medium text-amber-600 dark:text-amber-400 mb-2">
                    What are you animating?
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {SUBJECTS.map((subject) => (
                      <Button
                        key={subject}
                        variant={
                          subjectType === subject ? 'default' : 'outline'
                        }
                        onClick={() => {
                          setSubjectType(subject);
                          setGuidedFields({});
                        }}
                        className="flex flex-col items-center p-3 h-auto space-y-2"
                      >
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={SUBJECT_THUMBNAILS[subject]}
                            alt={SUBJECT_LABELS[subject]}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="text-xs font-medium text-center leading-tight">
                          {SUBJECT_LABELS[subject]}
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Art Style Selector */}
                <div>
                  <label className="block text-sm font-medium text-amber-600 dark:text-amber-400 mb-2">
                    Art Style
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {ART_STYLES.map((style) => (
                      <Button
                        key={style.id}
                        variant={artStyle === style.id ? 'default' : 'outline'}
                        onClick={() => setArtStyle(style.id)}
                        className="flex flex-col items-center p-3 h-auto space-y-2"
                      >
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={style.thumbnail}
                            alt={style.label}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="text-center">
                          <span className="font-medium text-xs block">
                            {style.label}
                          </span>
                          <span className="text-xs opacity-70">
                            {style.description}
                          </span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Details Toggle */}
                {!showAdvanced && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowDetails(!showDetails)}
                        className="text-amber-600 dark:text-amber-400 p-0 h-auto"
                      >
                        <span className="text-sm font-medium">
                          {showDetails ? 'Hide Details' : 'Add Details'}
                        </span>
                        <span className="ml-1">{showDetails ? '▲' : '▼'}</span>
                      </Button>
                      {showDetails && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleSurpriseMe}
                          className="text-amber-500"
                        >
                          <Shuffle className="w-3 h-3 mr-1" />
                          Surprise me
                        </Button>
                      )}
                    </div>

                    {showDetails && (
                      <div className="grid grid-cols-2 gap-3">
                        {GUIDED_FIELDS[subjectType].map((field) => (
                          <div key={field.id}>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                              {field.label}
                            </label>
                            <input
                              type="text"
                              value={guidedFields[field.id] || ''}
                              onChange={(e) =>
                                handleFieldChange(field.id, e.target.value)
                              }
                              placeholder={field.placeholder}
                              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#1a1a2e] text-[#002244] dark:text-white"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Energy Level */}
                <div>
                  <label className="block text-sm font-medium text-amber-600 dark:text-amber-400 mb-2">
                    Energy Level
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {ENERGY_LEVELS.map((energy) => (
                      <Button
                        key={energy.id}
                        variant={
                          energyLevel === energy.id ? 'default' : 'outline'
                        }
                        onClick={() => setEnergyLevel(energy.id)}
                        size="sm"
                        className="flex flex-col items-start p-3 h-auto"
                      >
                        <span className="font-medium text-xs">
                          {energy.label}
                        </span>
                        <span className="text-xs opacity-70">
                          {energy.description}
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Background */}
                <div>
                  <label className="block text-sm font-medium text-amber-600 dark:text-amber-400 mb-2">
                    Background
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {BACKGROUND_OPTIONS.map((background) => (
                      <Button
                        key={background.id}
                        variant={
                          backgroundOption === background.id
                            ? 'default'
                            : 'outline'
                        }
                        onClick={() => setBackgroundOption(background.id)}
                        size="sm"
                        className="flex flex-col items-start p-3 h-auto"
                      >
                        <span className="font-medium text-xs">
                          {background.label}
                        </span>
                        <span className="text-xs opacity-70">
                          {background.description}
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Framing */}
                <div>
                  <label className="block text-sm font-medium text-amber-600 dark:text-amber-400 mb-2">
                    Framing
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {FRAMING_OPTIONS.map((framing) => (
                      <Button
                        key={framing.id}
                        variant={
                          framingOption === framing.id ? 'default' : 'outline'
                        }
                        onClick={() => setFramingOption(framing.id)}
                        size="sm"
                        className="flex flex-col items-start p-3 h-auto"
                      >
                        <span className="font-medium text-xs">
                          {framing.label}
                        </span>
                        <span className="text-xs opacity-70">
                          {framing.description}
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Finish Options */}
                <div>
                  <label className="block text-sm font-medium text-amber-600 dark:text-amber-400 mb-2">
                    Finish
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {FINISH_OPTIONS.map((finish) => (
                      <Button
                        key={finish.id}
                        variant={
                          finishOption === finish.id ? 'default' : 'outline'
                        }
                        onClick={() => setFinishOption(finish.id)}
                        size="sm"
                        className="flex flex-col items-start p-2 h-auto"
                      >
                        <span className="font-medium text-xs">
                          {finish.label}
                        </span>
                        <span className="text-xs opacity-70">
                          {finish.description}
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Color Palette */}
                <div>
                  <label className="block text-sm font-medium text-amber-600 dark:text-amber-400 mb-2">
                    Color Palette
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {PALETTE_PRESETS.map((palette) => (
                      <Button
                        key={palette.id}
                        variant={
                          selectedPalette === palette.id ? 'default' : 'outline'
                        }
                        onClick={() => setSelectedPalette(palette.id)}
                        size="sm"
                        className={`flex items-center gap-2 ${
                          palette.special
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none hover:from-purple-600 hover:to-pink-600'
                            : ''
                        }`}
                      >
                        {palette.special ? (
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-bold">🎨</span>
                            <span className="text-xs font-bold">
                              {palette.label}
                            </span>
                          </div>
                        ) : (
                          <>
                            <div className="flex gap-1">
                              {palette.colors.map((color, i) => (
                                <div
                                  key={i}
                                  className="w-3 h-3 rounded-full border border-gray-300"
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                            <span className="text-xs">{palette.label}</span>
                          </>
                        )}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Recipe Cards */}
                <div>
                  <label className="block text-sm font-medium text-amber-600 dark:text-amber-400 mb-2">
                    Quick Recipes
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {animatedRecipes.map((recipe) => (
                      <Button
                        key={recipe.id}
                        variant="ghost"
                        onClick={() => handleRecipeSelect(recipe)}
                        className="flex flex-col items-center p-2 h-auto hover:bg-amber-500/10"
                      >
                        <span className="text-xl">{recipe.icon}</span>
                        <span className="text-xs mt-1">{recipe.title}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Advanced Toggle */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="text-amber-500"
                  >
                    {showAdvanced ? 'Use Guided Mode' : 'Advanced Mode'}
                  </Button>
                </div>

                {/* Advanced Prompt (if enabled) */}
                {showAdvanced && (
                  <div>
                    <label className="block text-sm font-medium text-amber-600 dark:text-amber-400 mb-2">
                      Custom Animation Prompt
                    </label>
                    <textarea
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      placeholder="Describe your animated NFT vision in detail..."
                      className="w-full p-3 border border-amber-300 dark:border-amber-600 rounded-lg bg-white dark:bg-[#1a1a2e] text-[#002244] dark:text-white resize-none"
                      rows={4}
                    />
                  </div>
                )}

                <Button
                  onClick={handleGenerateArt}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-white font-bold py-3"
                >
                  {isGenerating ? (
                    <>
                      <Wand2 className="w-5 h-5 mr-2 animate-pulse" />
                      Generating Animated Artwork...
                    </>
                  ) : (
                    <>
                      Generate Animated Artwork
                      <Wand2 className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>

                {selectedNFT && (
                  <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-sm text-green-800 dark:text-green-200">
                      ✨ Animated artwork generated! Check the preview on the
                      right.
                    </p>
                  </div>
                )}
              </div>
            ) : activeTab === 'upload' ? (
              <div className="space-y-6">
                <div className="text-center py-12 border-2 border-dashed border-amber-300 dark:border-amber-600 rounded-lg bg-amber-50 dark:bg-amber-900/10">
                  <Upload className="w-16 h-16 mx-auto mb-4 text-amber-500" />
                  <h3 className="text-lg font-semibold mb-2 text-amber-700 dark:text-amber-300">
                    Upload Your Custom Artwork
                  </h3>
                  <p className="text-sm text-amber-600 dark:text-amber-400 mb-4 max-w-md mx-auto">
                    Upload an image or video to be transformed into a premium
                    animated NFT
                  </p>
                  <Button className="bg-gradient-to-r from-amber-400 to-yellow-500 text-white font-bold">
                    Choose File
                  </Button>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-amber-500">
                    Upload Animation Settings
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    After uploading, you can apply motion effects and finishes
                    to your artwork
                  </p>
                </div>

                {selectedNFT && (
                  <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-sm text-green-800 dark:text-green-200">
                      ✨ Ready to create your premium animated NFT! Check the
                      preview on the right.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-semibold mb-4 text-amber-500">
                  Premium Animated Collection
                </h3>
                <NFTGallery
                  items={animatedNFTs}
                  onSelect={handleSelect}
                  selectedId={selectedNFT?.id}
                  showCategories={false}
                  maxColumns={2}
                />
              </div>
            )}
          </div>
        </div>

        {/* Preview & Create Section */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-[#002244] rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-amber-500/20 sticky top-24">
            <h2 className="text-xl font-semibold mb-4 text-amber-500">
              NFT Preview
            </h2>

            {selectedNFT ? (
              <div className="space-y-4">
                <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                  {selectedNFT.isAnimated && selectedNFT.videoUrl ? (
                    <video
                      src={selectedNFT.videoUrl}
                      className="w-full h-full object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  ) : (
                    <Image
                      src={selectedNFT.imageUrl}
                      alt={selectedNFT.name}
                      fill
                      className="object-cover"
                    />
                  )}
                  <div className="absolute top-2 left-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-semibold shadow-lg">
                    PREMIUM ANIMATED
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-bold text-lg text-amber-500">
                    {selectedNFT.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedNFT.description}
                  </p>

                  {energyLevel && (
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-medium text-amber-600">
                        Energy:
                      </span>
                      <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 rounded">
                        {ENERGY_LEVELS.find((e) => e.id === energyLevel)?.label}
                      </span>
                    </div>
                  )}

                  {finishOption && finishOption !== 'none' && (
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-medium text-amber-600">
                        Finish:
                      </span>
                      <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 rounded">
                        {
                          FINISH_OPTIONS.find((f) => f.id === finishOption)
                            ?.label
                        }
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm font-medium capitalize px-3 py-1 rounded-full bg-gradient-to-r 
                      ${
                        selectedNFT.rarity === 'legendary'
                          ? 'from-amber-100 to-amber-200'
                          : selectedNFT.rarity === 'epic'
                            ? 'from-purple-100 to-purple-200'
                            : selectedNFT.rarity === 'rare'
                              ? 'from-blue-100 to-blue-200'
                              : 'from-gray-100 to-gray-200'
                      }`}
                    >
                      {selectedNFT.rarity}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handleCreateNFT}
                  disabled={isCreating}
                  className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-white font-bold py-3"
                >
                  {isCreating ? (
                    <>
                      <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                      Creating Animated NFT...
                    </>
                  ) : (
                    <>
                      Create Animated NFT
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <Play className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Create artwork or select from gallery</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PremiumAnimatedNFTPage() {
  return (
    <main className="min-h-screen bg-[#faf9f5] dark:bg-[#1a1a2e] transition-colors duration-300 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <CreateNFTNav active="/create-nft/premium-animated" />
        <h1 className="text-4xl font-bold text-amber-500 mb-6 text-center">
          Create Premium Animated NFT
        </h1>
        <p className="text-lg text-[#002244] dark:text-white mb-8 text-center">
          Generate or upload artwork with premium animation effects. Your
          animated NFT will appear on your purchased squares.
        </p>

        <AnimatedNFTCreator />
      </div>
    </main>
  );
}
