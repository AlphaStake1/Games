'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Bot,
  Sparkles,
  MessageSquare,
  Crown,
  Gamepad2,
  Heart,
  Brain,
  Zap,
  Palette,
  Settings,
  Save,
  Eye,
} from 'lucide-react';

// Import personality types (would be from your actual types file)
interface BotPersonality {
  name: string;
  username: string;
  description: string;
  welcomeMessage: string;
  responseStyle: {
    formality: 'casual' | 'professional' | 'friendly' | 'energetic';
    enthusiasm: 'low' | 'medium' | 'high' | 'extreme';
    humor: 'none' | 'light' | 'moderate' | 'heavy';
    emojis: 'minimal' | 'balanced' | 'heavy';
    catchphrases: string[];
    signatureClosing: string;
  };
  voiceTone: {
    primary: 'coach' | 'mentor' | 'friend' | 'expert' | 'entertainer';
    secondary?: 'motivational' | 'analytical' | 'supportive' | 'competitive';
    customTraits: string[];
  };
  branding: {
    primaryColor: string;
    accentColor: string;
    theme: 'professional' | 'fun' | 'gaming' | 'community' | 'custom';
  };
}

interface CBLBotSetupProps {
  cblId: string;
  platformHandle?: string;
  onSave: (personality: BotPersonality) => void;
  onCancel: () => void;
  isOpen: boolean;
}

const CBLBotSetup: React.FC<CBLBotSetupProps> = ({
  cblId,
  platformHandle,
  onSave,
  onCancel,
  isOpen,
}) => {
  const [personality, setPersonality] = useState<BotPersonality>({
    name: `${platformHandle || 'Your Community'} Coach`,
    username: `${platformHandle?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'community'}_coach_bot`,
    description: `Your personal squares coach for ${platformHandle || 'your community'}! 🏈`,
    welcomeMessage: `🏈 Welcome to ${platformHandle || 'the community'}!\n\nI'm your personal squares coach, ready to help you dominate every board!\n\nUse /help to see all my coaching tools. Game on! 🚀`,
    responseStyle: {
      formality: 'friendly',
      enthusiasm: 'high',
      humor: 'moderate',
      emojis: 'balanced',
      catchphrases: ['Game on!', "Let's dominate!", 'Victory is yours!'],
      signatureClosing: '🏈 Your Coach',
    },
    voiceTone: {
      primary: 'coach',
      secondary: 'motivational',
      customTraits: [
        'uses football terminology',
        'celebrates wins enthusiastically',
      ],
    },
    branding: {
      primaryColor: '#255c7e',
      accentColor: '#ed5925',
      theme: 'professional',
    },
  });

  const [activeTab, setActiveTab] = useState('template');
  const [selectedTemplate, setSelectedTemplate] = useState('oc_phil');
  const [previewMode, setPreviewMode] = useState(false);

  // Personality templates
  const templates = {
    oc_phil: {
      name: 'OC Phil Style',
      icon: <Crown className="w-5 h-5" />,
      description: 'Classic coaching energy with proven strategies',
      color: 'bg-blue-500',
    },
    professional: {
      name: 'Professional Advisor',
      icon: <Brain className="w-5 h-5" />,
      description: 'Data-driven insights and expert analysis',
      color: 'bg-slate-600',
    },
    community_buddy: {
      name: 'Community Friend',
      icon: <Heart className="w-5 h-5" />,
      description: 'Friendly, supportive, and community-focused',
      color: 'bg-green-500',
    },
    hype_master: {
      name: 'Hype Master',
      icon: <Zap className="w-5 h-5" />,
      description: 'Maximum energy and excitement!',
      color: 'bg-red-500',
    },
    zen_mentor: {
      name: 'Zen Mentor',
      icon: <Sparkles className="w-5 h-5" />,
      description: 'Calm wisdom and long-term thinking',
      color: 'bg-purple-500',
    },
  };

  const voiceToneIcons = {
    coach: <Crown className="w-4 h-4" />,
    mentor: <Brain className="w-4 h-4" />,
    friend: <Heart className="w-4 h-4" />,
    expert: <Settings className="w-4 h-4" />,
    entertainer: <Gamepad2 className="w-4 h-4" />,
  };

  const applyTemplate = (templateKey: string) => {
    const templates: Record<string, Partial<BotPersonality>> = {
      oc_phil: {
        responseStyle: {
          formality: 'friendly',
          enthusiasm: 'high',
          humor: 'moderate',
          emojis: 'balanced',
          catchphrases: ['Game on!', "Let's dominate!", 'Victory is yours!'],
          signatureClosing: '🏈 Coach Phil',
        },
        voiceTone: {
          primary: 'coach',
          secondary: 'motivational',
          customTraits: [
            'uses football terminology',
            'celebrates wins enthusiastically',
          ],
        },
        branding: {
          primaryColor: '#255c7e',
          accentColor: '#ed5925',
          theme: 'professional',
        },
      },
      professional: {
        responseStyle: {
          formality: 'professional',
          enthusiasm: 'medium',
          humor: 'light',
          emojis: 'minimal',
          catchphrases: ['Strategic thinking wins', 'Data-driven decisions'],
          signatureClosing: '📊 Your Strategy Advisor',
        },
        voiceTone: {
          primary: 'expert',
          secondary: 'analytical',
          customTraits: ['focuses on metrics', 'provides detailed analysis'],
        },
        branding: {
          primaryColor: '#2c3e50',
          accentColor: '#3498db',
          theme: 'professional',
        },
      },
      // Add other templates...
    };

    const template = templates[templateKey];
    if (template) {
      setPersonality((prev) => ({
        ...prev,
        ...template,
        responseStyle: { ...prev.responseStyle, ...template.responseStyle },
        voiceTone: { ...prev.voiceTone, ...template.voiceTone },
        branding: { ...prev.branding, ...template.branding },
      }));
    }
  };

  const updatePersonality = (field: string, value: any) => {
    setPersonality((prev) => {
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        return {
          ...prev,
          [parent]: {
            ...(prev[parent as keyof BotPersonality] as object),
            [child]: value,
          },
        };
      }
      return { ...prev, [field]: value };
    });
  };

  const generatePreview = () => {
    return {
      welcome: personality.welcomeMessage,
      helpCommand: `${personality.responseStyle.catchphrases[0] || 'Ready to help!'} Here are all my available commands:\n\n🏈 /board - Create a new squares board\n📊 /stats - View your performance\n💡 /tips - Get strategy advice\n🎯 /leaderboard - See top performers\n\n${personality.responseStyle.signatureClosing}`,
      celebration: `${personality.responseStyle.catchphrases[1] || 'Amazing!'} Someone just won on the board! 🎉 Congratulations to the winner!\n\n${personality.responseStyle.signatureClosing}`,
    };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bot className="w-8 h-8 text-blue-600" />
              <div>
                <h2 className="text-2xl font-bold">Customize Your Bot</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  🎉 Milestone reward! Design your personal coaching assistant.
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </div>

        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 h-14">
              <TabsTrigger value="template">Template</TabsTrigger>
              <TabsTrigger value="personality">Personality</TabsTrigger>
              <TabsTrigger value="branding">Branding</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="template" className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Choose Your Bot Style
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(templates).map(([key, template]) => (
                    <Card
                      key={key}
                      className={`cursor-pointer transition-all ${
                        selectedTemplate === key
                          ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                      onClick={() => {
                        setSelectedTemplate(key);
                        applyTemplate(key);
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div
                            className={`p-2 rounded-lg ${template.color} text-white`}
                          >
                            {template.icon}
                          </div>
                          <h4 className="font-semibold">{template.name}</h4>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {template.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="bot-name">Bot Name</Label>
                  <Input
                    id="bot-name"
                    value={personality.name}
                    onChange={(e) => updatePersonality('name', e.target.value)}
                    placeholder="Your Community Coach"
                  />
                </div>
                <div>
                  <Label htmlFor="bot-username">
                    Username (@{personality.username})
                  </Label>
                  <Input
                    id="bot-username"
                    value={personality.username}
                    onChange={(e) =>
                      updatePersonality('username', e.target.value)
                    }
                    placeholder="community_coach_bot"
                  />
                </div>
                <div>
                  <Label htmlFor="bot-description">Description</Label>
                  <Input
                    id="bot-description"
                    value={personality.description}
                    onChange={(e) =>
                      updatePersonality('description', e.target.value)
                    }
                    placeholder="Your personal squares coach!"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="personality" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Voice & Tone</h3>

                  <div>
                    <Label>Primary Voice</Label>
                    <Select
                      value={personality.voiceTone.primary}
                      onValueChange={(value) =>
                        updatePersonality('voiceTone.primary', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(voiceToneIcons).map(([tone, icon]) => (
                          <SelectItem key={tone} value={tone}>
                            <div className="flex items-center gap-2">
                              {icon}
                              {tone.charAt(0).toUpperCase() + tone.slice(1)}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Formality Level</Label>
                    <Select
                      value={personality.responseStyle.formality}
                      onValueChange={(value) =>
                        updatePersonality('responseStyle.formality', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="friendly">Friendly</SelectItem>
                        <SelectItem value="professional">
                          Professional
                        </SelectItem>
                        <SelectItem value="energetic">Energetic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Enthusiasm Level</Label>
                    <Select
                      value={personality.responseStyle.enthusiasm}
                      onValueChange={(value) =>
                        updatePersonality('responseStyle.enthusiasm', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low 😌</SelectItem>
                        <SelectItem value="medium">Medium 😊</SelectItem>
                        <SelectItem value="high">High 🚀</SelectItem>
                        <SelectItem value="extreme">EXTREME! 🔥</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Emoji Usage</Label>
                    <Select
                      value={personality.responseStyle.emojis}
                      onValueChange={(value) =>
                        updatePersonality('responseStyle.emojis', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minimal">Minimal</SelectItem>
                        <SelectItem value="balanced">Balanced 👍</SelectItem>
                        <SelectItem value="heavy">Heavy 🎉🚀💎</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Custom Messages</h3>

                  <div>
                    <Label htmlFor="signature">Signature Closing</Label>
                    <Input
                      id="signature"
                      value={personality.responseStyle.signatureClosing}
                      onChange={(e) =>
                        updatePersonality(
                          'responseStyle.signatureClosing',
                          e.target.value,
                        )
                      }
                      placeholder="🏈 Your Coach"
                    />
                  </div>

                  <div>
                    <Label htmlFor="catchphrases">
                      Catchphrases (one per line)
                    </Label>
                    <Textarea
                      id="catchphrases"
                      value={personality.responseStyle.catchphrases.join('\n')}
                      onChange={(e) =>
                        updatePersonality(
                          'responseStyle.catchphrases',
                          e.target.value.split('\n').filter(Boolean),
                        )
                      }
                      placeholder="Game on!&#10;Let's dominate!&#10;Victory is yours!"
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="welcome">Welcome Message</Label>
                    <Textarea
                      id="welcome"
                      value={personality.welcomeMessage}
                      onChange={(e) =>
                        updatePersonality('welcomeMessage', e.target.value)
                      }
                      rows={4}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="branding" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Brand Colors
                  </h3>

                  <div>
                    <Label htmlFor="primary-color">Primary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="primary-color"
                        type="color"
                        value={personality.branding.primaryColor}
                        onChange={(e) =>
                          updatePersonality(
                            'branding.primaryColor',
                            e.target.value,
                          )
                        }
                        className="w-16 h-9"
                      />
                      <Input
                        value={personality.branding.primaryColor}
                        onChange={(e) =>
                          updatePersonality(
                            'branding.primaryColor',
                            e.target.value,
                          )
                        }
                        placeholder="#255c7e"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="accent-color">Accent Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="accent-color"
                        type="color"
                        value={personality.branding.accentColor}
                        onChange={(e) =>
                          updatePersonality(
                            'branding.accentColor',
                            e.target.value,
                          )
                        }
                        className="w-16 h-9"
                      />
                      <Input
                        value={personality.branding.accentColor}
                        onChange={(e) =>
                          updatePersonality(
                            'branding.accentColor',
                            e.target.value,
                          )
                        }
                        placeholder="#ed5925"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Theme Style</Label>
                    <Select
                      value={personality.branding.theme}
                      onValueChange={(value) =>
                        updatePersonality('branding.theme', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">
                          Professional
                        </SelectItem>
                        <SelectItem value="fun">Fun & Playful</SelectItem>
                        <SelectItem value="gaming">Gaming</SelectItem>
                        <SelectItem value="community">Community</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Preview</h3>
                  <div
                    className="p-4 rounded-lg border-2"
                    style={{
                      borderColor: personality.branding.primaryColor,
                      backgroundColor: personality.branding.primaryColor + '10',
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: personality.branding.primaryColor,
                        }}
                      />
                      <span className="font-semibold">{personality.name}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Sample message with your brand colors
                    </p>
                    <div
                      className="mt-2 px-2 py-1 rounded text-xs text-white inline-block"
                      style={{
                        backgroundColor: personality.branding.accentColor,
                      }}
                    >
                      Accent Element
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Bot Preview
                </h3>
                <Badge variant="secondary">@{personality.username}</Badge>
              </div>

              <div className="space-y-4">
                {Object.entries(generatePreview()).map(
                  ([command, response]) => (
                    <Card key={command}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          {command === 'welcome'
                            ? 'Welcome Message'
                            : command === 'helpCommand'
                              ? '/help Command'
                              : 'Celebration Message'}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div
                          className="p-3 rounded bg-gray-50 dark:bg-gray-800 border-l-4 whitespace-pre-wrap text-sm"
                          style={{
                            borderLeftColor: personality.branding.primaryColor,
                          }}
                        >
                          {response}
                        </div>
                      </CardContent>
                    </Card>
                  ),
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              onClick={() => onSave(personality)}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Create My Bot
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CBLBotSetup;
