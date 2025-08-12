'use client';

import { useState } from 'react';
import CreateNFTNav from '@/components/CreateNFTNav';
import NFTGallery from '@/components/NFTGallery';
import { aiGeneratedNFTs } from '@/lib/mockNFTData';
import { Button } from '@/components/ui/button';
import { NFTItem } from '@/components/NFTGallery';
import Image from 'next/image';
import {
  ArrowRight,
  Sparkles,
  Wand2,
  Shuffle,
  Upload,
  User,
  Package,
  Coffee,
  Shield,
  Download,
} from 'lucide-react';
import {
  SUBJECTS,
  SUBJECT_LABELS,
  SUBJECT_THUMBNAILS,
  ART_STYLES,
  GUIDED_FIELDS,
  PALETTE_PRESETS,
  RECIPE_CARDS,
  buildPromptFromFields,
  type SubjectType,
} from '@/lib/art-presets';

export default function AiGeneratedArtworkNFTPage() {
  const [selectedNFT, setSelectedNFT] = useState<NFTItem | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'create' | 'upload' | 'recipes' | 'examples' | 'drafts'
  >('create');
  const [savedDrafts, setSavedDrafts] = useState<NFTItem[]>([]);
  const [nftsPurchased, setNftsPurchased] = useState(0); // Track purchased NFTs

  // Guided creation state
  const [subjectType, setSubjectType] = useState<SubjectType>('character');
  const [artStyle, setArtStyle] = useState('sticker');
  const [selectedPalette, setSelectedPalette] = useState('dali-choice');
  const [guidedFields, setGuidedFields] = useState<Record<string, string>>({});

  // Advanced mode
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  const handleFieldChange = (fieldId: string, value: string) => {
    setGuidedFields((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleClear = () => {
    setSubjectType('character');
    setArtStyle('sticker');
    setSelectedPalette('dali-choice');
    setGuidedFields({});
    setShowAdvanced(false);
    setCustomPrompt('');
    setShowDetails(false);
    setSelectedNFT(null);
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
    setSelectedPalette(
      PALETTE_PRESETS[Math.floor(Math.random() * PALETTE_PRESETS.length)].id,
    );
  };

  const handleRecipeSelect = (recipe: (typeof RECIPE_CARDS)[0]) => {
    setSubjectType(recipe.subject);
    setArtStyle(recipe.style);
    setSelectedPalette(recipe.palette || 'dali-choice');
    setGuidedFields(recipe.fields || {});
    setActiveTab('create');
  };

  const saveDraft = (nft: NFTItem) => {
    const draft = {
      ...nft,
      id: `draft-${Date.now()}`,
      name: `Draft ${savedDrafts.length + 1}`,
    };
    setSavedDrafts((prev) => [draft, ...prev]);
    return draft;
  };

  const handleGenerateNFT = async () => {
    setIsGenerating(true);

    // Build prompt from guided fields or use custom
    const finalPrompt =
      showAdvanced && customPrompt
        ? customPrompt
        : buildPromptFromFields(
            subjectType,
            artStyle,
            guidedFields,
            selectedPalette,
          );

    // Simulate AI generation
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Select a random NFT as the "generated" result
    const randomNFT =
      aiGeneratedNFTs[Math.floor(Math.random() * aiGeneratedNFTs.length)];
    const generatedNFT = {
      ...randomNFT,
      name: 'AI Generated Artwork',
      description: `Generated: ${finalPrompt.substring(0, 100)}...`,
    };

    // Auto-save as draft
    const draft = saveDraft(generatedNFT);
    setSelectedNFT(draft);

    setIsGenerating(false);
  };

  const handleCreateNFT = async () => {
    if (!selectedNFT) return;

    await new Promise((resolve) => setTimeout(resolve, 2000));
    setNftsPurchased((prev) => prev + 1);
    alert(`NFT "${selectedNFT.name}" created successfully!`);
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

  return (
    <main className="min-h-screen bg-[#faf9f5] dark:bg-[#1a1a2e] transition-colors duration-300 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <CreateNFTNav active="/create-nft/ai-generated-artwork" />
        <h1 className="text-4xl font-bold text-[#8d594d] mb-6 text-center">
          Your Artwork NFT
        </h1>
        <p className="text-lg text-[#002244] dark:text-white mb-8 text-center max-w-3xl mx-auto">
          Generate unique NFT artwork with AI or upload your own custom art.
          Your NFT will appear on your purchased squares.
        </p>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Creation Section */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-[#002244] rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-[#004953]">
              {/* Tabs */}
              <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mb-6">
                <Button
                  variant={activeTab === 'create' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('create')}
                  className="flex items-center justify-center"
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  <span className="text-xs md:text-sm">AI Create</span>
                </Button>
                <Button
                  variant={activeTab === 'upload' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('upload')}
                  className="flex items-center justify-center"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  <span className="text-xs md:text-sm">Upload Art</span>
                </Button>
                <Button
                  variant={activeTab === 'recipes' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('recipes')}
                  className="flex items-center justify-center"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  <span className="text-xs md:text-sm">Recipes</span>
                </Button>
                <Button
                  variant={activeTab === 'drafts' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('drafts')}
                  className="flex items-center justify-center"
                >
                  <Package className="w-4 h-4 mr-2" />
                  <span className="text-xs md:text-sm">
                    Drafts ({savedDrafts.length})
                  </span>
                </Button>
                <Button
                  variant={activeTab === 'examples' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('examples')}
                  className="flex items-center justify-center"
                >
                  <span className="text-xs md:text-sm">Examples</span>
                </Button>
              </div>

              {activeTab === 'create' ? (
                <div className="space-y-6">
                  {/* Subject Type Selector */}
                  <div>
                    <label className="block text-sm font-medium text-[#004953] dark:text-white mb-2">
                      What are you creating?
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
                    <label className="block text-sm font-medium text-[#004953] dark:text-white mb-2">
                      Art Style
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {ART_STYLES.map((style) => (
                        <Button
                          key={style.id}
                          variant={
                            artStyle === style.id ? 'default' : 'outline'
                          }
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
                          className="text-[#004953] dark:text-white p-0 h-auto"
                        >
                          <span className="text-sm font-medium">
                            {showDetails ? 'Hide Details' : 'Add Details'}
                          </span>
                          <span className="ml-1">
                            {showDetails ? '▲' : '▼'}
                          </span>
                        </Button>
                        {showDetails && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleSurpriseMe}
                            className="text-[#8d594d]"
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

                  {/* Color Palette */}
                  <div>
                    <label className="block text-sm font-medium text-[#004953] dark:text-white mb-2">
                      Color Palette
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {PALETTE_PRESETS.map((palette) => (
                        <Button
                          key={palette.id}
                          variant={
                            selectedPalette === palette.id
                              ? 'default'
                              : 'outline'
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

                  {/* Advanced Toggle & Clear */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className="text-[#8d594d]"
                    >
                      {showAdvanced ? 'Use Guided Mode' : 'Advanced Mode'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClear}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      Clear
                    </Button>
                  </div>

                  {/* Advanced Prompt (if enabled) */}
                  {showAdvanced && (
                    <div>
                      <label className="block text-sm font-medium text-[#004953] dark:text-white mb-2">
                        Custom Prompt
                      </label>
                      <textarea
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        placeholder="Describe your vision in detail..."
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#1a1a2e] text-[#002244] dark:text-white resize-none"
                        rows={4}
                      />
                    </div>
                  )}

                  <Button
                    onClick={handleGenerateNFT}
                    disabled={isGenerating}
                    className="w-full bg-gradient-to-r from-[#8d594d] to-[#a66d5d] hover:from-[#7a4d42] hover:to-[#935f50] text-white font-bold py-3"
                  >
                    {isGenerating ? (
                      <>
                        <Wand2 className="w-5 h-5 mr-2 animate-pulse" />
                        Generating AI Artwork...
                      </>
                    ) : (
                      <>
                        Generate AI Artwork
                        <Wand2 className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>

                  {selectedNFT && (
                    <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <p className="text-sm text-green-800 dark:text-green-200">
                        ✨ AI artwork generated successfully! Check the preview
                        on the right.
                      </p>
                    </div>
                  )}
                </div>
              ) : activeTab === 'upload' ? (
                <div className="space-y-6">
                  <div className="text-center py-12 border-2 border-dashed border-[#8d594d]/30 rounded-lg bg-[#8d594d]/5">
                    <Upload className="w-16 h-16 mx-auto mb-4 text-[#8d594d]" />
                    <h3 className="text-lg font-semibold mb-2 text-[#004953] dark:text-white">
                      Upload Your Custom Artwork
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 max-w-md mx-auto">
                      Upload your own artwork to create a personalized NFT.
                      Supported formats: PNG, JPG, GIF
                    </p>
                    <Button className="bg-gradient-to-r from-[#8d594d] to-[#a66d5d] text-white font-bold">
                      Choose File
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#004953] dark:text-white">
                      Upload Guidelines
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <span className="text-green-500">✓</span>
                          <span>High resolution (1000x1000px or higher)</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-green-500">✓</span>
                          <span>Square aspect ratio recommended</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-green-500">✓</span>
                          <span>PNG with transparency supported</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <span className="text-red-500">✗</span>
                          <span>No copyrighted images</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-red-500">✗</span>
                          <span>No inappropriate content</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-red-500">✗</span>
                          <span>File size limit: 10MB</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {selectedNFT && (
                    <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <p className="text-sm text-green-800 dark:text-green-200">
                        ✨ Artwork uploaded successfully! Check the preview on
                        the right.
                      </p>
                    </div>
                  )}
                </div>
              ) : activeTab === 'recipes' ? (
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-[#004953] dark:text-white">
                    Quick Recipe Cards
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {RECIPE_CARDS.map((recipe) => (
                      <Button
                        key={recipe.id}
                        variant="outline"
                        onClick={() => handleRecipeSelect(recipe)}
                        className="flex flex-col items-center p-4 h-auto hover:bg-[#8d594d]/10"
                      >
                        <span className="text-2xl mb-1">{recipe.icon}</span>
                        <span className="font-medium text-xs">
                          {recipe.title}
                        </span>
                        <span className="text-xs opacity-70 text-center mt-1">
                          {recipe.description}
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>
              ) : activeTab === 'drafts' ? (
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-[#004953] dark:text-white">
                    Your Saved Drafts ({savedDrafts.length})
                  </h3>
                  {savedDrafts.length > 0 ? (
                    <NFTGallery
                      items={savedDrafts}
                      onSelect={(item) => {
                        setSelectedNFT(item);
                        setActiveTab('create');
                      }}
                      selectedId={selectedNFT?.id}
                      showCategories={false}
                      maxColumns={2}
                    />
                  ) : (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                      <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>
                        No drafts saved yet. Generate artwork to save drafts
                        automatically!
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-[#004953] dark:text-white">
                    Example AI-Generated NFTs
                  </h3>
                  <NFTGallery
                    items={aiGeneratedNFTs}
                    onSelect={(item) => {
                      setSelectedNFT(item);
                      setActiveTab('create');
                    }}
                    selectedId={selectedNFT?.id}
                    showCategories={false}
                    maxColumns={2}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-[#002244] rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-[#004953] sticky top-24">
              <h2 className="text-xl font-semibold mb-4 text-[#004953] dark:text-white">
                NFT Preview
              </h2>

              {selectedNFT ? (
                <div className="space-y-4">
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={selectedNFT.imageUrl}
                      alt={selectedNFT.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-semibold shadow-lg">
                      AI GENERATED
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-bold text-lg text-[#004953] dark:text-white">
                      {selectedNFT.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedNFT.description}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Button
                      onClick={handleCreateNFT}
                      className="w-full bg-gradient-to-r from-[#004953] to-[#006d7a] hover:from-[#003843] hover:to-[#005862] text-white font-bold py-3"
                    >
                      Create NFT
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>

                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          onClick={handleGenerateNFT}
                          className="text-sm"
                        >
                          Try Again
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowAdvanced(true)}
                          className="text-sm"
                        >
                          Modify Prompt
                        </Button>
                      </div>

                      {nftsPurchased >= 3 && (
                        <Button
                          variant="outline"
                          onClick={() => alert('Download started!')}
                          className="w-full text-sm text-green-600 border-green-600 hover:bg-green-50"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download Preview
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <Wand2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Fill in details or select a recipe to preview</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
