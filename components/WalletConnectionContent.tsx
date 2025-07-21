'use client';

import React, { useState } from 'react';
import {
  Wallet,
  Shield,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Eye,
  Zap,
  Link,
} from 'lucide-react';

export default function WalletConnectionContent() {
  const [activeTab, setActiveTab] = useState('overview');

  const phantomFeatures = [
    {
      title: 'Multi-Chain Support',
      description: 'Supports Solana and Ethereum networks in one wallet',
      icon: '🔗',
      benefits: [
        'Trade SOL, ETH, and ERC-20 tokens',
        'Switch networks seamlessly',
        'Single wallet for multiple chains',
      ],
    },
    {
      title: 'Built-in Exchange',
      description: 'Swap tokens directly within the wallet',
      icon: '🔄',
      benefits: ['Best price routing', 'Low fees', 'Instant swaps'],
    },
    {
      title: 'NFT Gallery',
      description: 'View and manage your NFT collection',
      icon: '🖼️',
      benefits: ['Full NFT support', 'Easy transfers', 'Collection management'],
    },
  ];

  const officialResources = [
    {
      title: 'Phantom Wallet Official Setup Guide',
      description: 'Complete visual guide from Phantom team',
      type: 'Official Guide',
      url: 'https://help.phantom.app/hc/en-us/articles/8071074929299-How-to-buy-SOL-in-Phantom',
      icon: '📖',
      features: [
        'Step-by-step screenshots',
        'Troubleshooting tips',
        'Security best practices',
      ],
    },
    {
      title: 'Phantom Mobile App Tutorial',
      description: 'Official video walkthrough for mobile setup',
      type: 'Video Tutorial',
      url: 'https://www.youtube.com/watch?v=phantom-mobile-setup',
      icon: '📱',
      features: [
        'iOS and Android setup',
        'Face ID/Touch ID configuration',
        'Mobile-specific features',
      ],
    },
    {
      title: 'Phantom Browser Extension Guide',
      description: 'Desktop browser extension installation and setup',
      type: 'Browser Guide',
      url: 'https://help.phantom.app/hc/en-us/articles/4418394342035-How-to-create-a-new-wallet',
      icon: '🌐',
      features: [
        'Chrome, Firefox, Edge support',
        'Extension security',
        'Desktop features',
      ],
    },
    {
      title: 'Multi-Chain Setup (SOL + ETH)',
      description: 'Configure both Solana and Ethereum networks',
      type: 'Advanced Guide',
      url: 'https://help.phantom.app/hc/en-us/articles/16225267094547-How-to-use-Ethereum-and-Polygon-on-Phantom',
      icon: '🔗',
      features: [
        'Network switching',
        'EVM compatibility',
        'Cross-chain transactions',
      ],
    },
  ];

  const buyingOptions = [
    {
      platform: 'Phantom Wallet',
      method: 'Buy SOL directly in-app',
      fees: '2.9% + network fees',
      time: 'Instant',
      guide:
        'https://help.phantom.app/hc/en-us/articles/8071074929299-How-to-buy-SOL-in-Phantom',
      video: 'https://www.youtube.com/watch?v=phantom-buy-sol',
      official: true,
      recommended: true,
    },
    {
      platform: 'Coinbase',
      method: 'Buy SOL, then transfer to Phantom',
      fees: '1.49% + $0.99',
      time: '5-10 minutes',
      guide:
        'https://help.coinbase.com/en/coinbase/trading-and-funding/buying-selling-or-converting-crypto/how-to-buy-sell-or-convert-crypto',
      video: 'https://www.youtube.com/watch?v=coinbase-buy-crypto',
      official: true,
    },
    {
      platform: 'Cash App',
      method: 'Buy Bitcoin, convert to SOL via exchange',
      fees: '1.76% spread + conversion fees',
      time: '15-30 minutes',
      guide: 'https://cash.app/help/us/en-us/3081-bitcoin',
      video: 'https://www.youtube.com/watch?v=cashapp-bitcoin',
      official: true,
    },
    {
      platform: 'Kraken',
      method: 'Professional trading platform',
      fees: '0.16% - 0.26%',
      time: '1-5 business days',
      guide:
        'https://support.kraken.com/hc/en-us/articles/360000613806-How-to-buy-and-sell-cryptocurrencies-and-FX-on-Kraken',
      video: 'https://www.youtube.com/watch?v=kraken-tutorial',
      official: true,
    },
  ];

  const setupSteps = [
    {
      step: 1,
      title: 'Install Phantom Wallet',
      description: 'Download official Phantom wallet for Solana and Ethereum',
      details: [
        'Visit phantom.app for official download links',
        'Install browser extension (Chrome, Firefox, Edge) or mobile app',
        'Create new wallet with secure 12-word seed phrase',
        'Store seed phrase offline in secure location',
        'Enable biometric authentication if using mobile',
      ],
      officialGuide:
        'https://help.phantom.app/hc/en-us/articles/4418394342035-How-to-create-a-new-wallet',
      tips: 'Never share your seed phrase. Phantom team will never ask for it.',
    },
    {
      step: 2,
      title: 'Buy SOL in Phantom',
      description: 'Purchase SOL directly within Phantom wallet (recommended)',
      details: [
        "Click 'Buy' button in Phantom wallet",
        'Choose SOL as currency to purchase',
        'Connect debit card or bank account',
        'Start with small amount ($20-50) to test',
        'SOL appears instantly in your wallet',
      ],
      officialGuide:
        'https://help.phantom.app/hc/en-us/articles/8071074929299-How-to-buy-SOL-in-Phantom',
      tips: 'Buying directly in Phantom is fastest. Alternative: buy on exchange and transfer.',
    },
    {
      step: 3,
      title: 'Connect to Football Squares',
      description: 'Link Phantom wallet to participate in games',
      details: [
        "Click 'Connect Wallet' on Football Squares website",
        "Select 'Phantom' from wallet options",
        'Approve connection in Phantom popup',
        'Your wallet address appears in top navigation',
        'Wallet stays connected for future games',
      ],
      officialGuide:
        'https://help.phantom.app/hc/en-us/articles/4412004792595-Connecting-to-dApps',
      tips: 'Only connect to trusted sites. Phantom shows site security info.',
    },
    {
      step: 4,
      title: 'Play Football Squares',
      description: 'Purchase squares and play trustless games',
      details: [
        'Browse available games and select squares',
        'Review game details: entry cost, prize pool, timing',
        "Click 'Buy Squares' and confirm in Phantom",
        'Smart contract automatically handles payouts',
        'View game progress and winnings in real-time',
      ],
      officialGuide:
        'https://help.phantom.app/hc/en-us/articles/4412004777491-Confirming-a-transaction',
      tips: 'Transaction fees are ~$0.01. Winnings appear instantly when game ends.',
    },
  ];

  const securityTips = [
    {
      category: 'Seed Phrase Security',
      tips: [
        'Never share your 12/24-word seed phrase with anyone',
        'Store seed phrase offline (paper, metal backup)',
        'Never enter seed phrase on suspicious websites',
        'Coach B will never ask for your seed phrase',
      ],
    },
    {
      category: 'Transaction Safety',
      tips: [
        'Always verify transaction details before signing',
        'Check recipient address matches the game contract',
        'Start with small amounts when learning',
        'Monitor transactions on Solana explorer',
      ],
    },
    {
      category: 'General Wallet Security',
      tips: [
        'Use hardware wallets for large amounts',
        'Keep software wallets updated',
        'Use strong passwords and 2FA when available',
        'Be cautious of phishing attempts',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] dark:from-[#001a1a] dark:to-[#002244] transition-colors duration-300">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#002244] to-[#004953] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <Wallet className="w-12 h-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Wallet Connection Guide
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
              Connect your Solana wallet to participate in trustless Football
              Squares
            </p>
            <div className="bg-[#ed5925] bg-opacity-20 backdrop-blur-sm rounded-lg p-6 max-w-3xl mx-auto">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-[#ed5925] flex-shrink-0 mt-1" />
                <div className="text-left">
                  <h3 className="font-bold text-white mb-2">
                    Trustless System
                  </h3>
                  <p className="text-blue-100">
                    Your wallet connects directly to smart contracts on Solana.
                    No deposits, withdrawals, or custodial risk. Game rules are
                    enforced by immutable code, not human judgment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-[#001a1a] border-b border-gray-200 dark:border-[#004953] transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-1 py-4">
            {[
              {
                id: 'overview',
                label: 'Overview',
                icon: <Eye className="w-4 h-4" />,
              },
              {
                id: 'phantom',
                label: 'Phantom Features',
                icon: <Wallet className="w-4 h-4" />,
              },
              {
                id: 'resources',
                label: 'Official Guides',
                icon: <ExternalLink className="w-4 h-4" />,
              },
              {
                id: 'setup',
                label: 'Setup Process',
                icon: <Zap className="w-4 h-4" />,
              },
              {
                id: 'security',
                label: 'Security Tips',
                icon: <Shield className="w-4 h-4" />,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-[#ed5925] text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-[#002244] text-[#708090] dark:text-[#96abdc] hover:bg-[#ed5925] hover:text-white'
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Overview Section */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="bg-white dark:bg-[#001a1a] rounded-xl shadow-xl p-8 border border-gray-200 dark:border-[#004953] transition-colors duration-300">
                <h2 className="text-3xl font-bold text-[#002244] dark:text-white mb-6 transition-colors duration-300">
                  How Wallet Connection Works
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <p className="text-[#708090] dark:text-[#96abdc] text-lg leading-relaxed mb-6 transition-colors duration-300">
                      Football Squares uses a trustless system built on Solana
                      smart contracts. Your wallet connects directly to the
                      blockchain - no middleman, no custody risk.
                    </p>
                    <h3 className="text-xl font-bold text-[#002244] dark:text-white mb-4 transition-colors duration-300">
                      What This Means For You
                    </h3>
                    <ul className="space-y-2">
                      {[
                        'You maintain full control of your funds',
                        'Smart contracts enforce all game rules automatically',
                        'Winnings are distributed immediately by code',
                        'No human can interfere with payouts',
                      ].map((item, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-[#708090] dark:text-[#96abdc] transition-colors duration-300"
                        >
                          <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-gradient-to-br from-[#ed5925] to-[#ed5925]/80 p-6 rounded-lg text-white">
                    <h3 className="text-xl font-bold mb-4">Quick Facts</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Blockchain:</span>
                        <span className="font-bold">Solana</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Transaction Fees:</span>
                        <span className="font-bold">~$0.01</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Confirmation Time:</span>
                        <span className="font-bold">~400ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Custody:</span>
                        <span className="font-bold">Self-Custodial</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-6 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-yellow-800 dark:text-yellow-300 mb-2">
                      Important Notice
                    </h3>
                    <p className="text-yellow-700 dark:text-yellow-300">
                      Coach B is an information assistant, not a gaming
                      operator. All games are powered by autonomous smart
                      contracts. Players are responsible for understanding tax
                      obligations on any on-chain winnings.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Phantom Features Section */}
          {activeTab === 'phantom' && (
            <div className="space-y-8">
              <div className="bg-white dark:bg-[#001a1a] rounded-xl shadow-xl p-8 border border-gray-200 dark:border-[#004953] transition-colors duration-300">
                <h2 className="text-3xl font-bold text-[#002244] dark:text-white mb-6 transition-colors duration-300">
                  Why Phantom Wallet?
                </h2>
                <p className="text-[#708090] dark:text-[#96abdc] text-lg mb-8 transition-colors duration-300">
                  Phantom is the recommended wallet for Football Squares. It now
                  supports both Solana and Ethereum networks, making it perfect
                  for all your crypto needs.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {phantomFeatures.map((feature, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 dark:border-[#004953] bg-white dark:bg-[#001a1a] rounded-lg p-6 transition-colors duration-300"
                    >
                      <div className="text-4xl mb-4">{feature.icon}</div>
                      <h3 className="text-xl font-bold text-[#002244] dark:text-white mb-2 transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-[#708090] dark:text-[#96abdc] mb-4 transition-colors duration-300">
                        {feature.description}
                      </p>
                      <ul className="space-y-1">
                        {feature.benefits.map((benefit, benefitIndex) => (
                          <li
                            key={benefitIndex}
                            className="flex items-center gap-2 text-sm text-[#708090] dark:text-[#96abdc]"
                          >
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Official Resources Section */}
          {activeTab === 'resources' && (
            <div className="space-y-8">
              <div className="bg-white dark:bg-[#001a1a] rounded-xl shadow-xl p-8 border border-gray-200 dark:border-[#004953] transition-colors duration-300">
                <h2 className="text-3xl font-bold text-[#002244] dark:text-white mb-6 transition-colors duration-300">
                  Official Phantom Guides & Resources
                </h2>
                <p className="text-[#708090] dark:text-[#96abdc] text-lg mb-8 transition-colors duration-300">
                  Use these official resources from Phantom and major exchanges
                  for setup and troubleshooting.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {officialResources.map((resource, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 dark:border-[#004953] bg-white dark:bg-[#001a1a] rounded-lg p-6 transition-colors duration-300 hover:shadow-lg"
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-3xl">{resource.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-bold text-[#002244] dark:text-white transition-colors duration-300">
                              {resource.title}
                            </h3>
                            <span className="bg-[#ed5925] text-white text-xs px-2 py-1 rounded-full">
                              {resource.type}
                            </span>
                          </div>
                          <p className="text-[#708090] dark:text-[#96abdc] mb-4 transition-colors duration-300">
                            {resource.description}
                          </p>
                          <ul className="space-y-1 mb-4">
                            {resource.features.map((feature, featureIndex) => (
                              <li
                                key={featureIndex}
                                className="flex items-center gap-2 text-sm text-[#708090] dark:text-[#96abdc]"
                              >
                                <CheckCircle className="w-3 h-3 text-green-500" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-[#ed5925] hover:text-[#ed5925]/80 font-medium transition-colors duration-300"
                          >
                            <ExternalLink className="w-4 h-4" />
                            View Official Guide
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-[#001a1a] rounded-xl shadow-xl p-8 border border-gray-200 dark:border-[#004953] transition-colors duration-300">
                <h2 className="text-2xl font-bold text-[#002244] dark:text-white mb-6 transition-colors duration-300">
                  Where to Buy SOL
                </h2>
                <p className="text-[#708090] dark:text-[#96abdc] text-lg mb-8 transition-colors duration-300">
                  Compare official buying options from trusted platforms.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {buyingOptions.map((option, index) => (
                    <div
                      key={index}
                      className={`border-2 rounded-lg p-6 transition-all duration-300 ${
                        option.recommended
                          ? 'border-[#ed5925] bg-[#ed5925]/5 dark:bg-[#ed5925]/10'
                          : 'border-gray-200 dark:border-[#004953] bg-white dark:bg-[#001a1a]'
                      }`}
                    >
                      {option.recommended && (
                        <div className="bg-[#ed5925] text-white text-xs px-3 py-1 rounded-full inline-block mb-3 font-bold">
                          RECOMMENDED
                        </div>
                      )}
                      <h3 className="text-xl font-bold text-[#002244] dark:text-white mb-2 transition-colors duration-300">
                        {option.platform}
                      </h3>
                      <p className="text-[#708090] dark:text-[#96abdc] mb-4 transition-colors duration-300">
                        {option.method}
                      </p>
                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div>
                          <span className="text-[#708090] dark:text-[#96abdc]">
                            Fees:
                          </span>
                          <br />
                          <span className="font-bold text-[#002244] dark:text-white">
                            {option.fees}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#708090] dark:text-[#96abdc]">
                            Time:
                          </span>
                          <br />
                          <span className="font-bold text-[#002244] dark:text-white">
                            {option.time}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <a
                          href={option.guide}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-[#ed5925] hover:text-[#ed5925]/80 font-medium text-sm transition-colors duration-300"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Official Guide
                        </a>
                        {option.video && (
                          <a
                            href={option.video}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors duration-300"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Video Tutorial
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Setup Process Section */}
          {activeTab === 'setup' && (
            <div className="space-y-8">
              <div className="bg-white dark:bg-[#001a1a] rounded-xl shadow-xl p-8 border border-gray-200 dark:border-[#004953] transition-colors duration-300">
                <h2 className="text-3xl font-bold text-[#002244] dark:text-white mb-6 transition-colors duration-300">
                  Step-by-Step Setup
                </h2>
                <p className="text-[#708090] dark:text-[#96abdc] text-lg mb-8 transition-colors duration-300">
                  Follow these steps to get your wallet connected and ready to
                  play.
                </p>

                <div className="space-y-8">
                  {setupSteps.map((step, index) => (
                    <div key={index} className="flex gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-[#ed5925] text-white rounded-full flex items-center justify-center font-bold text-lg">
                          {step.step}
                        </div>
                        {index < setupSteps.length - 1 && (
                          <div className="w-px h-16 bg-gray-200 dark:bg-[#004953] mt-4 ml-6"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-[#002244] dark:text-white mb-2 transition-colors duration-300">
                          {step.title}
                        </h3>
                        <p className="text-[#708090] dark:text-[#96abdc] mb-4 transition-colors duration-300">
                          {step.description}
                        </p>
                        <ul className="space-y-2 mb-4">
                          {step.details.map((detail, detailIndex) => (
                            <li
                              key={detailIndex}
                              className="flex items-start gap-2 text-[#708090] dark:text-[#96abdc] transition-colors duration-300"
                            >
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              {detail}
                            </li>
                          ))}
                        </ul>

                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg mb-4">
                          <div className="flex items-start gap-2">
                            <Shield className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                              <strong>Pro Tip:</strong> {step.tips}
                            </p>
                          </div>
                        </div>

                        <a
                          href={step.officialGuide}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-[#ed5925] hover:text-[#ed5925]/80 font-medium transition-colors duration-300"
                        >
                          <ExternalLink className="w-4 h-4" />
                          View Official Phantom Guide
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Security Tips Section */}
          {activeTab === 'security' && (
            <div className="space-y-8">
              <div className="bg-white dark:bg-[#001a1a] rounded-xl shadow-xl p-8 border border-gray-200 dark:border-[#004953] transition-colors duration-300">
                <h2 className="text-3xl font-bold text-[#002244] dark:text-white mb-6 flex items-center gap-3 transition-colors duration-300">
                  <Shield className="w-8 h-8 text-[#ed5925]" />
                  Security Best Practices
                </h2>
                <p className="text-[#708090] dark:text-[#96abdc] text-lg mb-8 transition-colors duration-300">
                  Protect your funds and maintain security with these essential
                  practices.
                </p>

                <div className="space-y-8">
                  {securityTips.map((section, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800"
                    >
                      <h3 className="text-xl font-bold text-blue-800 dark:text-blue-300 mb-4">
                        {section.category}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {section.tips.map((tip, tipIndex) => (
                          <div
                            key={tipIndex}
                            className="flex items-start gap-3 bg-white dark:bg-[#001a1a] p-4 rounded-lg"
                          >
                            <Shield className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-[#708090] dark:text-[#96abdc] transition-colors duration-300">
                              {tip}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-6 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-red-800 dark:text-red-300 mb-2">
                        Never Share These
                      </h3>
                      <ul className="space-y-1 text-red-700 dark:text-red-300">
                        <li>• Your 12/24-word seed phrase</li>
                        <li>• Private keys or wallet passwords</li>
                        <li>• Wallet file backups</li>
                        <li>• Any recovery information</li>
                      </ul>
                      <p className="text-red-700 dark:text-red-300 mt-3 text-sm">
                        Coach B will never ask for any of this information.
                        Anyone requesting it is attempting to steal your funds.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Notice */}
      <div className="bg-[#002244] text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-blue-100">
            Coach B is an information assistant, not a gaming operator. All
            games are powered by autonomous smart contracts on Solana.
          </p>
        </div>
      </div>
    </div>
  );
}
