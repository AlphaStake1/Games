'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Check,
  CreditCard,
  MessageSquare,
  User,
  Wallet,
  Star,
  Trophy,
  Target,
  Globe,
  Hash,
  Twitter,
  Facebook,
  Instagram,
  Users,
} from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

type OnboardingStep =
  | 'intent'
  | 'payment'
  | 'signup'
  | 'quiz'
  | 'platform'
  | 'complete';

interface QuizAnswer {
  question: string;
  answer: string;
  tier?: string;
}

const CBLOnboardingFlow = () => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('intent');
  const [formData, setFormData] = useState({
    email: '',
    walletAddress: '',
    quizAnswers: [] as QuizAnswer[],
    selectedPlatform: '' as
      | 'telegram'
      | 'discord'
      | 'twitter'
      | 'facebook'
      | 'instagram'
      | 'existing',
    platformDetails: '',
    tier: 'First Stream' as 'First Stream' | 'Drive Maker' | 'Franchise',
  });

  const { connected, publicKey } = useWallet();

  const steps = [
    { id: 'intent', title: 'Value Preview', icon: Star },
    { id: 'payment', title: 'Payment', icon: CreditCard },
    { id: 'signup', title: 'Account Setup', icon: User },
    { id: 'quiz', title: 'Assessment', icon: Target },
    { id: 'platform', title: 'Platform Selection', icon: Globe },
    { id: 'complete', title: 'Welcome!', icon: Trophy },
  ];

  const currentStepIndex = steps.findIndex((step) => step.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handlePayment = async () => {
    // TODO: Implement Solana payment for $9.99
    // For now, simulate payment success
    setTimeout(() => {
      setCurrentStep('signup');
    }, 2000);
  };

  const handleWalletConnect = () => {
    if (connected && publicKey) {
      setFormData((prev) => ({
        ...prev,
        walletAddress: publicKey.toString(),
      }));
      setCurrentStep('quiz');
    }
  };

  const handleQuizComplete = (answers: QuizAnswer[]) => {
    // Simple tier assignment logic based on experience
    const experienceLevel =
      answers.find((a) => a.question.includes('experience'))?.answer || '';
    let tier: 'First Stream' | 'Drive Maker' | 'Franchise' = 'First Stream';

    if (
      experienceLevel.includes('advanced') ||
      experienceLevel.includes('expert')
    ) {
      tier = 'Franchise';
    } else if (
      experienceLevel.includes('intermediate') ||
      experienceLevel.includes('some')
    ) {
      tier = 'Drive Maker';
    }

    setFormData((prev) => ({
      ...prev,
      quizAnswers: answers,
      tier,
    }));
    setCurrentStep('platform');
  };

  const handlePlatformSelection = (platform: string, details?: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedPlatform: platform as any,
      platformDetails: details || '',
    }));

    // Open relevant platform if needed
    if (platform === 'telegram') {
      window.open('https://t.me/OC_Phil_bot', '_blank');
    }

    setCurrentStep('complete');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 dark:from-blue-950 to-orange-950">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              CBL Onboarding
            </h1>
            <Badge variant="outline" className="px-3 py-1">
              Step {currentStepIndex + 1} of {steps.length}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />

          {/* Step Navigation */}
          <div className="flex justify-between mt-4 text-sm">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index < currentStepIndex;
              const isCurrent = index === currentStepIndex;

              return (
                <div
                  key={step.id}
                  className={`flex flex-col items-center ${
                    isCompleted
                      ? 'text-green-600'
                      : isCurrent
                        ? 'text-blue-600'
                        : 'text-gray-400'
                  }`}
                >
                  <div
                    className={`rounded-full p-2 mb-1 ${
                      isCompleted
                        ? 'bg-green-100 dark:bg-green-900'
                        : isCurrent
                          ? 'bg-blue-100 dark:bg-blue-900'
                          : 'bg-gray-100 dark:bg-gray-800'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>
                  <span>{step.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <Card className="shadow-lg">
          <CardContent className="p-8">
            {currentStep === 'intent' && (
              <IntentCaptureStep onNext={() => setCurrentStep('payment')} />
            )}

            {currentStep === 'payment' && (
              <PaymentStep onPayment={handlePayment} />
            )}

            {currentStep === 'signup' && (
              <SignupStep
                formData={formData}
                setFormData={setFormData}
                onNext={handleWalletConnect}
                connected={connected}
              />
            )}

            {currentStep === 'quiz' && (
              <QuizStep onComplete={handleQuizComplete} />
            )}

            {currentStep === 'platform' && (
              <PlatformSelectionStep
                tier={formData.tier}
                onPlatformSelect={handlePlatformSelection}
              />
            )}

            {currentStep === 'complete' && (
              <CompleteStep
                tier={formData.tier}
                selectedPlatform={formData.selectedPlatform}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Step Components

const IntentCaptureStep = ({ onNext }: { onNext: () => void }) => (
  <div className="text-center space-y-6">
    <div className="space-y-4">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
        Become a Community Board Leader
      </h2>
      <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
        Join the elite CBL program and earn rewards while building your squares
        community
      </p>
    </div>

    {/* Value Carousel */}
    <div className="grid md:grid-cols-3 gap-6 my-8">
      <div className="bg-blue-50 dark:bg-blue-950 p-6 rounded-lg">
        <div className="text-blue-600 text-2xl mb-2">💰</div>
        <h3 className="font-semibold mb-2">Earn Revenue</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          3-4% rake share on every board + NFT commission
        </p>
      </div>
      <div className="bg-orange-50 dark:bg-orange-950 p-6 rounded-lg">
        <div className="text-orange-600 text-2xl mb-2">🏆</div>
        <h3 className="font-semibold mb-2">Build Community</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Lead your own sports community with powerful tools
        </p>
      </div>
      <div className="bg-green-50 dark:bg-green-950 p-6 rounded-lg">
        <div className="text-green-600 text-2xl mb-2">🎯</div>
        <h3 className="font-semibold mb-2">Premium Features</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Advanced board customization and analytics
        </p>
      </div>
    </div>

    <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-300">
        <CreditCard className="w-4 h-4" />
        <span className="font-medium">One-time Setup Fee: $9.99</span>
      </div>
      <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
        Covers training, dashboard access, and OC Phil coaching
      </p>
    </div>

    <Button onClick={onNext} size="lg" className="px-8">
      Get Started - $9.99
    </Button>
  </div>
);

const PaymentStep = ({ onPayment }: { onPayment: () => void }) => (
  <div className="text-center space-y-6">
    <h2 className="text-2xl font-bold">Secure Payment</h2>
    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <span>CBL Setup Fee</span>
        <span className="font-bold">$9.99</span>
      </div>
      <Separator className="my-4" />
      <div className="flex justify-between items-center font-bold">
        <span>Total</span>
        <span>$9.99</span>
      </div>
    </div>

    <div className="space-y-4">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Secure payment via Solana blockchain
      </p>
      <Button onClick={onPayment} size="lg" className="w-full">
        <CreditCard className="w-4 h-4 mr-2" />
        Pay $9.99 with SOL
      </Button>
    </div>
  </div>
);

const SignupStep = ({
  formData,
  setFormData,
  onNext,
  connected,
}: {
  formData: any;
  setFormData: any;
  onNext: () => void;
  connected: boolean;
}) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-center">Account Setup</h2>

    <div className="space-y-4 max-w-md mx-auto">
      <div>
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="your@email.com"
          value={formData.email}
          onChange={(e) =>
            setFormData((prev: any) => ({ ...prev, email: e.target.value }))
          }
        />
      </div>

      <div>
        <Label>Solana Wallet</Label>
        <div className="mt-2">
          <WalletMultiButton className="!bg-blue-600 hover:!bg-blue-700" />
        </div>
        {connected && (
          <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
            <Check className="w-4 h-4" />
            Wallet connected successfully
          </p>
        )}
      </div>

      <Button
        onClick={onNext}
        disabled={!connected || !formData.email}
        className="w-full"
      >
        Continue to Assessment
      </Button>
    </div>
  </div>
);

const QuizStep = ({
  onComplete,
}: {
  onComplete: (answers: QuizAnswer[]) => void;
}) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);

  const questions = [
    {
      question: "What's your experience level with community management?",
      options: [
        'Beginner - New to this',
        'Intermediate - Some experience',
        'Advanced - Very experienced',
      ],
    },
    {
      question: 'How many people do you plan to invite initially?',
      options: ['10-25 people', '25-100 people', '100+ people'],
    },
    {
      question: "What's your preferred board entry fee range?",
      options: ['$1-25 per square', '$25-100 per square', '$100+ per square'],
    },
  ];

  const handleAnswer = (answer: string) => {
    const newAnswers = [
      ...answers,
      { question: questions[currentQ].question, answer },
    ];
    setAnswers(newAnswers);

    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      onComplete(newAnswers);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Quick Assessment</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Question {currentQ + 1} of {questions.length}
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <h3 className="text-lg font-medium mb-4 text-center">
          {questions[currentQ].question}
        </h3>

        <div className="grid gap-3">
          {questions[currentQ].options.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              className="p-4 h-auto text-left justify-start"
              onClick={() => handleAnswer(option)}
            >
              {option}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

const PlatformSelectionStep = ({
  tier,
  onPlatformSelect,
}: {
  tier: string;
  onPlatformSelect: (platform: string, details?: string) => void;
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [existingDetails, setExistingDetails] = useState<string>('');

  const platforms = [
    {
      id: 'telegram',
      name: 'Telegram',
      icon: MessageSquare,
      description:
        'Connect with OC Phil for AI coaching and instant community chat',
      benefits: [
        'Real-time coaching',
        'Instant notifications',
        'Group discussions',
      ],
      color: 'blue',
    },
    {
      id: 'discord',
      name: 'Discord',
      icon: Hash,
      description:
        'Build your gaming community with voice chat and structured channels',
      benefits: ['Voice channels', 'Role management', 'Bot integrations'],
      color: 'indigo',
    },
    {
      id: 'twitter',
      name: 'X (Twitter)',
      icon: Twitter,
      description:
        'Leverage social reach and trending hashtags for maximum exposure',
      benefits: ['Viral potential', 'Hashtag discovery', 'Influencer reach'],
      color: 'sky',
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      description: 'Tap into established networks and local community groups',
      benefits: ['Local groups', 'Event promotion', 'Family networks'],
      color: 'blue',
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: Instagram,
      description:
        'Visual storytelling and Stories for behind-the-scenes content',
      benefits: ['Visual content', 'Stories features', 'Younger audience'],
      color: 'pink',
    },
    {
      id: 'existing',
      name: 'Existing Community',
      icon: Users,
      description: 'Already have a community? Connect it to our platform',
      benefits: ['Import followers', 'Cross-platform sync', 'Enhanced tools'],
      color: 'green',
    },
  ];

  const handlePlatformSelect = (platformId: string) => {
    setSelectedPlatform(platformId);
    if (platformId !== 'existing') {
      onPlatformSelect(platformId);
    }
  };

  const handleExistingSubmit = () => {
    if (existingDetails.trim()) {
      onPlatformSelect('existing', existingDetails);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Choose Your Community Platform</h2>
        <Badge variant="outline" className="mt-2">
          {tier} Tier Assigned
        </Badge>
        <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
          Select where you want to build your squares community. Each platform
          gets tailored guidance and milestone rewards including custom OC Phil
          bots.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {platforms.map((platform) => {
          const Icon = platform.icon;
          const isSelected = selectedPlatform === platform.id;

          return (
            <Card
              key={platform.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                isSelected
                  ? `ring-2 ring-${platform.color}-500 bg-${platform.color}-50 dark:bg-${platform.color}-950`
                  : ''
              }`}
              onClick={() => handlePlatformSelect(platform.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`p-2 rounded-lg bg-${platform.color}-100 dark:bg-${platform.color}-900`}
                  >
                    <Icon className={`w-5 h-5 text-${platform.color}-600`} />
                  </div>
                  <h3 className="font-semibold">{platform.name}</h3>
                  {isSelected && (
                    <Check className="w-4 h-4 text-green-500 ml-auto" />
                  )}
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {platform.description}
                </p>

                <div className="space-y-1">
                  {platform.benefits.map((benefit, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-xs"
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full bg-${platform.color}-500`}
                      />
                      <span className="text-gray-600 dark:text-gray-400">
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedPlatform === 'existing' && (
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-lg">
              Tell us about your existing community
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="existing-details">Community Details</Label>
              <Input
                id="existing-details"
                placeholder="e.g., Facebook group 'Sports Fans Unite' with 2,500 members"
                value={existingDetails}
                onChange={(e) => setExistingDetails(e.target.value)}
                className="mt-1"
              />
            </div>

            <Button
              onClick={handleExistingSubmit}
              disabled={!existingDetails.trim()}
              className="w-full"
            >
              Connect Existing Community
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="text-center">
        <div className="bg-orange-50 dark:bg-orange-950 rounded-lg p-4 max-w-md mx-auto">
          <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">
            🏆 Milestone Rewards
          </h4>
          <p className="text-sm text-orange-700 dark:text-orange-300">
            Reach 500+ followers, 25+ boards/month, $10K+ revenue, or 90% fill
            rate to earn your custom OC Phil bot!
          </p>
        </div>
      </div>
    </div>
  );
};

const CompleteStep = ({
  tier,
  selectedPlatform,
}: {
  tier: string;
  selectedPlatform: string;
}) => {
  const platformDetails = {
    telegram: {
      name: 'Telegram',
      action: 'Chat with OC Phil',
      url: 'https://t.me/OC_Phil_bot',
    },
    discord: {
      name: 'Discord',
      action: 'Set up Discord server',
      url: '/cbl/platform-guides/discord',
    },
    twitter: {
      name: 'X (Twitter)',
      action: 'Review Twitter strategy',
      url: '/cbl/platform-guides/twitter',
    },
    facebook: {
      name: 'Facebook',
      action: 'View Facebook guide',
      url: '/cbl/platform-guides/facebook',
    },
    instagram: {
      name: 'Instagram',
      action: 'Get Instagram tips',
      url: '/cbl/platform-guides/instagram',
    },
    existing: {
      name: 'Existing Community',
      action: 'Integration guide',
      url: '/cbl/platform-guides/existing',
    },
  };

  const platform =
    platformDetails[selectedPlatform as keyof typeof platformDetails] ||
    platformDetails.telegram;

  return (
    <div className="text-center space-y-6">
      <div className="text-6xl">🎉</div>
      <div>
        <h2 className="text-3xl font-bold text-green-600">Welcome to CBL!</h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
          You're now a <strong>{tier}</strong> Community Board Leader
        </p>
        <Badge variant="secondary" className="mt-2">
          {platform.name} Community Builder
        </Badge>
      </div>

      <div className="bg-green-50 dark:bg-green-950 rounded-lg p-6 max-w-md mx-auto">
        <h3 className="font-semibold mb-4">Your CBL Journey Starts Now!</h3>
        <div className="space-y-3 text-sm text-left">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-green-600" />
            <span>Access your CBL dashboard</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-green-600" />
            <span>Get your {platform.name} growth playbook</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-green-600" />
            <span>Join private CBL coaching staff room</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-green-600" />
            <span>Start building toward milestone rewards</span>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4 max-w-md mx-auto">
        <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
          🎯 Your Platform Mission
        </h4>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          Build your {platform.name} community to 500+ followers or achieve 90%
          fill rate to unlock your custom OC Phil bot and advanced features!
        </p>
      </div>

      <div className="flex gap-4 justify-center">
        <Button asChild>
          <a href="/cbl/dashboard">Go to Dashboard</a>
        </Button>
        <Button variant="outline" asChild>
          <a
            href={platform.url}
            target={platform.url.startsWith('http') ? '_blank' : undefined}
          >
            {platform.action}
          </a>
        </Button>
      </div>
    </div>
  );
};

export default CBLOnboardingFlow;
