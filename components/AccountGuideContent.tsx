'use client';

import { useState } from 'react';
import {
  User,
  Mail,
  Shield,
  Wallet,
  Settings,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Key,
  Bell,
  CreditCard,
  ArrowRight,
  Lock,
  Smartphone,
  Globe,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AccountGuideContent = () => {
  const [activeTab, setActiveTab] = useState('setup');

  const tabs = [
    { id: 'setup', label: 'Account Setup', icon: User },
    { id: 'verification', label: 'Setup Levels', icon: Shield },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'preferences', label: 'Preferences', icon: Settings },
  ];

  const setupSteps = [
    {
      step: 1,
      title: 'Create Your Account',
      description: 'Start with basic registration',
      icon: User,
      details: [
        "Click 'Sign Up' in the top right corner",
        "Enter a valid email address (you'll need to verify this)",
        'Create a strong password (8+ characters, mix of letters, numbers, symbols)',
        'Choose a unique username (this will be your public display name)',
        'Read and accept the Terms of Service and Privacy Policy',
      ],
      tips: 'Use an email you check regularly - important game notifications go here!',
      warning:
        "Choose your username carefully - it can't be changed later and will be visible to other players.",
    },
    {
      step: 2,
      title: 'Verify Your Email',
      description: 'Confirm your email address',
      icon: Mail,
      details: [
        'Check your inbox for a verification email (usually arrives within 2 minutes)',
        "If you don't see it, check your spam/junk folder",
        'Click the verification link in the email',
        "You'll be redirected back to the site with confirmation",
        "Your account status will update to 'Verified'",
      ],
      tips: "Gmail users: sometimes our emails go to the 'Promotions' tab instead of 'Primary'",
      warning:
        'You cannot participate in paid games until your email is verified.',
    },
    {
      step: 3,
      title: 'Complete Your Profile',
      description: 'Add personal information',
      icon: Settings,
      details: [
        "Navigate to 'Profile Settings' from the account menu",
        'Add your display name and optional bio',
        'Upload a profile picture (optional but recommended)',
        'Set your timezone for accurate game notifications',
        'Choose your preferred communication settings',
      ],
      tips: 'A profile picture makes you more recognizable in community boards!',
      warning:
        'Keep personal information minimal - this is a public gaming platform.',
    },
    {
      step: 4,
      title: 'Connect Wallet (Optional)',
      description: 'Link your Solana wallet for game participation',
      icon: Wallet,
      details: [
        "Visit any game page and click 'Connect Wallet'",
        'Choose from Phantom, Solflare, or other supported Solana wallets',
        'Approve the connection request in your wallet',
        'Your wallet address will appear for game transactions',
        'You can disconnect anytime from account settings',
      ],
      tips: "Wallet connection is only needed when you're ready to join a game - you can browse and learn without connecting",
      warning:
        'Never share your seed phrase with anyone - Coach B will never ask for it! You maintain full control of your funds.',
    },
  ];

  const accountFeatures = [
    {
      feature: 'Email Verification',
      requirements: ['Valid email address', 'Click verification link'],
      access: [
        'Game browsing',
        'Community participation',
        'Account notifications',
      ],
      timeframe: 'Instant',
      benefits: [
        'Platform communications',
        'Game notifications',
        'Community support',
      ],
    },
    {
      feature: 'Wallet Connection',
      requirements: ['Solana-compatible wallet', 'Wallet approval'],
      access: ['Join games', 'Fund smart contracts', 'Receive winnings'],
      timeframe: 'Instant',
      benefits: [
        'Trustless gameplay',
        'Immediate payouts',
        'Full fund control',
      ],
    },
    {
      feature: 'Smart Contract Understanding',
      requirements: [
        'Basic blockchain knowledge',
        'Understand transaction finality',
      ],
      access: ['Confident gameplay', 'Advanced features', 'Risk awareness'],
      timeframe: 'Educational',
      benefits: [
        'Informed decisions',
        'Security awareness',
        'Better experience',
      ],
    },
  ];

  const securityFeatures = [
    {
      feature: 'Two-Factor Authentication (2FA)',
      description: 'Add an extra layer of security to your account',
      setup: [
        'Go to Security Settings in your account',
        'Download Google Authenticator or Authy app',
        'Scan the QR code with your authenticator app',
        'Enter the 6-digit code to confirm setup',
        'Save your backup codes in a secure location',
      ],
      importance: 'Critical',
      icon: Smartphone,
    },
    {
      feature: 'Password Management',
      description: 'Keep your account secure with strong passwords',
      setup: [
        "Use a unique password you don't use elsewhere",
        'Include uppercase, lowercase, numbers, and symbols',
        'Aim for 12+ characters minimum',
        'Consider using a password manager',
        'Update your password every 6 months',
      ],
      importance: 'High',
      icon: Key,
    },
    {
      feature: 'Login Notifications',
      description: 'Get alerted when someone accesses your account',
      setup: [
        'Enable email notifications for new logins',
        'Set up SMS alerts for suspicious activity',
        'Review your login history regularly',
        'Report any unauthorized access immediately',
      ],
      importance: 'Medium',
      icon: Bell,
    },
  ];

  const preferencesOptions = [
    {
      category: 'Game Notifications',
      options: [
        {
          name: 'Board filling alerts',
          description: 'When boards are nearly full',
        },
        {
          name: 'Game start reminders',
          description: '15 minutes before kickoff',
        },
        {
          name: 'Quarter end updates',
          description: 'Scoring results and payouts',
        },
        { name: 'Win notifications', description: 'When you win a square' },
      ],
    },
    {
      category: 'Marketing Communications',
      options: [
        {
          name: 'Weekly newsletters',
          description: 'Game schedules and promotions',
        },
        {
          name: 'Special offers',
          description: 'VIP deals and bonus opportunities',
        },
        {
          name: 'Community updates',
          description: 'New features and announcements',
        },
        {
          name: 'Fantasy football content',
          description: 'Tips and strategy guides',
        },
      ],
    },
    {
      category: 'Privacy Settings',
      options: [
        {
          name: 'Public profile',
          description: 'Show your stats to other players',
        },
        {
          name: 'Leaderboard participation',
          description: 'Appear in public rankings',
        },
        {
          name: 'Social features',
          description: 'Allow friend requests and messages',
        },
        {
          name: 'Data sharing',
          description: 'Improve platform with usage analytics',
        },
      ],
    },
  ];

  return (
    <main className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#002244] dark:text-white mb-6 transition-colors duration-300">
            Account Setup & Management Guide
          </h1>
          <p className="text-xl text-[#708090] dark:text-[#96abdc] max-w-3xl mx-auto mb-8 transition-colors duration-300">
            Everything you need to know about creating, verifying, and managing
            your Football Squares account. From basic setup to advanced security
            features.
          </p>
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-[#ed5925] to-[#96abdc] p-1 rounded-full">
              <button className="bg-white dark:bg-[#002244] text-[#002244] dark:text-white px-8 py-3 rounded-full font-bold hover:bg-gray-50 dark:hover:bg-[#004953] transition-colors duration-200 inline-flex items-center gap-2">
                <User className="w-5 h-5" />
                Get Started Now
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#ed5925] to-[#96abdc] text-white shadow-lg'
                  : 'bg-white dark:bg-[#002244] text-[#708090] dark:text-[#96abdc] hover:text-[#002244] dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#004953] border border-gray-200 dark:border-[#004953]'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-[#002244] rounded-2xl shadow-lg overflow-hidden transition-colors duration-300">
          {/* Account Setup Tab */}
          {activeTab === 'setup' && (
            <div className="p-8 lg:p-12">
              <h2 className="text-3xl font-bold text-[#002244] dark:text-white mb-8 text-center transition-colors duration-300">
                Step-by-Step Account Setup
              </h2>

              <div className="space-y-8">
                {setupSteps.map((step) => (
                  <Card
                    key={step.step}
                    className="border-l-4 border-l-[#ed5925]"
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-4">
                        <div className="bg-gradient-to-r from-[#ed5925] to-[#96abdc] w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {step.step}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-[#002244] dark:text-white transition-colors duration-300">
                            {step.title}
                          </h3>
                          <p className="text-[#708090] dark:text-[#96abdc] transition-colors duration-300">
                            {step.description}
                          </p>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                          <h4 className="font-semibold text-[#002244] dark:text-white mb-3 transition-colors duration-300">
                            Detailed Steps:
                          </h4>
                          <ol className="space-y-2">
                            {step.details.map((detail, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-2"
                              >
                                <CheckCircle className="w-4 h-4 text-[#ed5925] mt-0.5 flex-shrink-0" />
                                <span className="text-[#708090] dark:text-[#96abdc] text-sm transition-colors duration-300">
                                  {detail}
                                </span>
                              </li>
                            ))}
                          </ol>
                        </div>
                        <div className="space-y-4">
                          <div className="bg-[#ed5925] bg-opacity-10 border-l-4 border-[#ed5925] p-3 rounded">
                            <h5 className="font-semibold text-[#002244] dark:text-white text-sm mb-1 transition-colors duration-300">
                              💡 Pro Tip:
                            </h5>
                            <p className="text-xs text-[#708090] dark:text-[#96abdc] transition-colors duration-300">
                              {step.tips}
                            </p>
                          </div>
                          {step.warning && (
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-3 rounded">
                              <h5 className="font-semibold text-yellow-800 dark:text-yellow-200 text-sm mb-1 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                Important:
                              </h5>
                              <p className="text-xs text-yellow-700 dark:text-yellow-300">
                                {step.warning}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Quick Start CTA */}
              <div className="mt-12 text-center bg-gradient-to-r from-[#002244] to-[#004953] rounded-xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">
                  Ready to Get Started?
                </h3>
                <p className="text-[#96abdc] mb-6">
                  Follow these steps and you'll be playing Football Squares in
                  under 10 minutes!
                </p>
                <Button className="bg-[#ed5925] hover:bg-[#d14a1f] text-white px-8 py-3 rounded-full font-bold">
                  Create Account Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Account Setup Levels Tab */}
          {activeTab === 'verification' && (
            <div className="p-8 lg:p-12">
              <h2 className="text-3xl font-bold text-[#002244] dark:text-white mb-8 text-center transition-colors duration-300">
                Account Setup Levels
              </h2>

              <div className="mb-8">
                <p className="text-center text-[#708090] dark:text-[#96abdc] max-w-2xl mx-auto transition-colors duration-300">
                  Different setup levels provide different experiences. Start
                  simple and add features as you explore Football Squares.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {accountFeatures.map((feature, index) => (
                  <Card
                    key={index}
                    className={`relative ${index === 1 ? 'border-[#ed5925] border-2' : ''}`}
                  >
                    {index === 1 && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-[#ed5925] text-white px-4 py-1 rounded-full text-sm font-bold">
                          Ready to Play
                        </span>
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="text-center">
                        <h3 className="text-xl font-bold text-[#002244] dark:text-white mb-2 transition-colors duration-300">
                          {feature.feature}
                        </h3>
                        <p className="text-sm text-[#708090] dark:text-[#96abdc] transition-colors duration-300">
                          Setup: {feature.timeframe}
                        </p>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-[#002244] dark:text-white mb-2 transition-colors duration-300">
                          Requirements:
                        </h4>
                        <ul className="space-y-1">
                          {feature.requirements.map((req, reqIndex) => (
                            <li
                              key={reqIndex}
                              className="flex items-start gap-2"
                            >
                              <CheckCircle className="w-4 h-4 text-[#ed5925] mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-[#708090] dark:text-[#96abdc] transition-colors duration-300">
                                {req}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-[#002244] dark:text-white mb-2 transition-colors duration-300">
                          What You Can Do:
                        </h4>
                        <ul className="space-y-1">
                          {feature.access.map((access, accessIndex) => (
                            <li
                              key={accessIndex}
                              className="flex items-start gap-2"
                            >
                              <Globe className="w-4 h-4 text-[#96abdc] mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-[#708090] dark:text-[#96abdc] transition-colors duration-300">
                                {access}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-[#002244] dark:text-white mb-2 transition-colors duration-300">
                          Benefits:
                        </h4>
                        <ul className="space-y-1">
                          {feature.benefits.map((benefit, benefitIndex) => (
                            <li
                              key={benefitIndex}
                              className="flex items-start gap-2"
                            >
                              <Shield className="w-4 h-4 text-[#004953] mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-[#708090] dark:text-[#96abdc] transition-colors duration-300">
                                {benefit}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Wallet Security Education */}
              <div className="mt-12 bg-[#faf9f5] dark:bg-[#1a1a2e] rounded-xl p-8 transition-colors duration-300">
                <h3 className="text-2xl font-bold text-[#002244] dark:text-white mb-6 transition-colors duration-300">
                  Wallet Security & Smart Contract Basics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-[#ed5925] mb-3">
                      🛡️ Essential Security:
                    </h4>
                    <ul className="space-y-2">
                      {[
                        'Never share your seed phrase with anyone - not even support',
                        'Keep your seed phrase written down offline',
                        'Double-check transaction details before signing',
                        'Only connect to trusted sites and applications',
                      ].map((tip, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-[#ed5925] mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-[#708090] dark:text-[#96abdc] transition-colors duration-300">
                            {tip}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#004953] mb-3">
                      ⚡ Smart Contract Benefits:
                    </h4>
                    <ul className="space-y-2">
                      {[
                        'No human can control or steal your funds',
                        'Game rules are enforced automatically by code',
                        'Instant payouts when you win',
                        'Complete transparency - all transactions are public',
                      ].map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Shield className="w-4 h-4 text-[#004953] mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-[#708090] dark:text-[#96abdc] transition-colors duration-300">
                            {benefit}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="p-8 lg:p-12">
              <h2 className="text-3xl font-bold text-[#002244] dark:text-white mb-8 text-center transition-colors duration-300">
                Account Security Features
              </h2>

              <div className="space-y-8">
                {securityFeatures.map((feature, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-4">
                        <feature.icon className="w-8 h-8 text-[#ed5925]" />
                        <div>
                          <h3 className="text-xl font-bold text-[#002244] dark:text-white transition-colors duration-300">
                            {feature.feature}
                          </h3>
                          <p className="text-[#708090] dark:text-[#96abdc] transition-colors duration-300">
                            {feature.description}
                          </p>
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            feature.importance === 'Critical'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                              : feature.importance === 'High'
                                ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                          }`}
                        >
                          {feature.importance}
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <h4 className="font-semibold text-[#002244] dark:text-white mb-3 transition-colors duration-300">
                        Setup Instructions:
                      </h4>
                      <ol className="space-y-2">
                        {feature.setup.map((step, stepIndex) => (
                          <li
                            key={stepIndex}
                            className="flex items-start gap-2"
                          >
                            <div className="bg-[#ed5925] text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">
                              {stepIndex + 1}
                            </div>
                            <span className="text-sm text-[#708090] dark:text-[#96abdc] transition-colors duration-300">
                              {step}
                            </span>
                          </li>
                        ))}
                      </ol>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Security Best Practices */}
              <div className="mt-12 bg-gradient-to-r from-[#004953] to-[#002244] rounded-xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-6 text-center">
                  <Shield className="w-8 h-8 inline-block mr-2 text-[#ed5925]" />
                  Security Best Practices
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-bold mb-3 text-[#96abdc]">
                      Do's
                    </h4>
                    <ul className="space-y-2">
                      {[
                        'Enable 2FA on your account immediately',
                        'Use a unique password for this account',
                        'Keep your email account secure',
                        'Log out from public computers',
                        'Review your account activity regularly',
                      ].map((tip, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-[#ed5925] mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-3 text-[#96abdc]">
                      Don'ts
                    </h4>
                    <ul className="space-y-2">
                      {[
                        'Never share your login credentials',
                        "Don't save passwords on public computers",
                        'Never click suspicious email links',
                        "Don't use the same password elsewhere",
                        'Never share 2FA codes with anyone',
                      ].map((tip, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="p-8 lg:p-12">
              <h2 className="text-3xl font-bold text-[#002244] dark:text-white mb-8 text-center transition-colors duration-300">
                Account Preferences & Settings
              </h2>

              <div className="space-y-8">
                {preferencesOptions.map((category, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-[#002244] dark:text-white transition-colors duration-300">
                        {category.category}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {category.options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className="flex items-center justify-between p-4 bg-[#faf9f5] dark:bg-[#1a1a2e] rounded-lg transition-colors duration-300"
                          >
                            <div>
                              <h4 className="font-semibold text-[#002244] dark:text-white transition-colors duration-300">
                                {option.name}
                              </h4>
                              <p className="text-sm text-[#708090] dark:text-[#96abdc] transition-colors duration-300">
                                {option.description}
                              </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                defaultChecked
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#ed5925]/20 dark:peer-focus:ring-[#ed5925]/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#ed5925]"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Additional Settings */}
              <div className="mt-12 bg-[#faf9f5] dark:bg-[#1a1a2e] rounded-xl p-8 transition-colors duration-300">
                <h3 className="text-2xl font-bold text-[#002244] dark:text-white mb-6 transition-colors duration-300">
                  Additional Account Settings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-[#ed5925] mb-3">
                      🌍 Regional Settings
                    </h4>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-sm font-medium text-[#002244] dark:text-white mb-1 transition-colors duration-300">
                          Time Zone
                        </label>
                        <select className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-[#002244] dark:text-white">
                          <option>Eastern Time (ET)</option>
                          <option>Central Time (CT)</option>
                          <option>Mountain Time (MT)</option>
                          <option>Pacific Time (PT)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#002244] dark:text-white mb-1 transition-colors duration-300">
                          Currency Display
                        </label>
                        <select className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-[#002244] dark:text-white">
                          <option>USD ($)</option>
                          <option>Bitcoin (₿)</option>
                          <option>Ethereum (Ξ)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-[#ed5925] mb-3">
                      🎮 Gaming Preferences
                    </h4>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-sm font-medium text-[#002244] dark:text-white mb-1 transition-colors duration-300">
                          Default Game Type
                        </label>
                        <select className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-[#002244] dark:text-white">
                          <option>Weekly Cash Games</option>
                          <option>Season-Long Leagues</option>
                          <option>Free-to-Play Games</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#002244] dark:text-white mb-1 transition-colors duration-300">
                          Auto-Join Boards
                        </label>
                        <select className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-[#002244] dark:text-white">
                          <option>Disabled</option>
                          <option>Home Team Games Only</option>
                          <option>All Games</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Related Links */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-[#002244] dark:text-white mb-8 transition-colors duration-300">
            Related Help Topics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a
              href="/payment-guide"
              className="bg-white dark:bg-[#002244] rounded-xl p-6 border border-gray-200 dark:border-[#004953] hover:shadow-lg transition-all duration-200 text-center group"
            >
              <Wallet className="w-12 h-12 text-[#ed5925] mx-auto mb-4 group-hover:scale-110 transition-transform duration-200" />
              <h4 className="font-bold text-[#002244] dark:text-white mb-2 transition-colors duration-300">
                Wallet Connection
              </h4>
              <p className="text-[#708090] dark:text-[#96abdc] text-sm transition-colors duration-300">
                Connect your Solana wallet to play
              </p>
            </a>
            <a
              href="/technical-support"
              className="bg-white dark:bg-[#002244] rounded-xl p-6 border border-gray-200 dark:border-[#004953] hover:shadow-lg transition-all duration-200 text-center group"
            >
              <Settings className="w-12 h-12 text-[#ed5925] mx-auto mb-4 group-hover:scale-110 transition-transform duration-200" />
              <h4 className="font-bold text-[#002244] dark:text-white mb-2 transition-colors duration-300">
                Technical Support
              </h4>
              <p className="text-[#708090] dark:text-[#96abdc] text-sm transition-colors duration-300">
                Troubleshooting and tech help
              </p>
            </a>
            <a
              href="/how-to-play"
              className="bg-white dark:bg-[#002244] rounded-xl p-6 border border-gray-200 dark:border-[#004953] hover:shadow-lg transition-all duration-200 text-center group"
            >
              <User className="w-12 h-12 text-[#ed5925] mx-auto mb-4 group-hover:scale-110 transition-transform duration-200" />
              <h4 className="font-bold text-[#002244] dark:text-white mb-2 transition-colors duration-300">
                How to Play
              </h4>
              <p className="text-[#708090] dark:text-[#96abdc] text-sm transition-colors duration-300">
                Learn the game basics
              </p>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AccountGuideContent;
