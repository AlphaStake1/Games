'use client';

import { useState } from 'react';
import {
  HelpCircle,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Wifi,
  Globe,
  Smartphone,
  Monitor,
  Settings,
  Zap,
  Shield,
  Clock,
  Mail,
  MessageCircle,
  Phone,
  Search,
  ArrowRight,
  ExternalLink,
  Copy,
  Eye,
  EyeOff,
  AlertCircle,
  Info,
  Bug,
  Wrench,
  Download,
  Upload,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const TechnicalSupportContent = () => {
  const [activeTab, setActiveTab] = useState('common-issues');

  const tabs = [
    { id: 'common-issues', label: 'Common Issues', icon: HelpCircle },
    { id: 'wallet-troubleshooting', label: 'Wallet Issues', icon: Zap },
    { id: 'browser-support', label: 'Browser & Device', icon: Monitor },
    { id: 'contact-support', label: 'Contact Support', icon: MessageCircle },
  ];

  const commonIssues = [
    {
      category: 'Login & Account Issues',
      icon: Shield,
      problems: [
        {
          issue: "Can't log into my account",
          causes: [
            'Forgot password',
            'Account locked after multiple failed attempts',
            'Email not verified',
            'Browser cookies/cache issues',
          ],
          solutions: [
            "Use 'Forgot Password' link on login page",
            'Wait 30 minutes if account is locked, then try again',
            'Check email (including spam) for verification link',
            'Clear browser cache and cookies, try incognito mode',
            'Try a different browser or device',
          ],
          difficulty: 'Easy',
        },
        {
          issue: 'Not receiving verification emails',
          causes: [
            'Email in spam/junk folder',
            'Email filters blocking our domain',
            'Incorrect email address entered',
            'Email server delays',
          ],
          solutions: [
            'Check spam, junk, and promotions folders',
            'Add support@footballsquares.com to your contacts',
            'Verify email address spelling in account settings',
            'Wait 5-10 minutes and check again',
            'Try requesting a new verification email',
          ],
          difficulty: 'Easy',
        },
        {
          issue: '2FA codes not working',
          causes: [
            'Phone time sync issues',
            'Authenticator app time drift',
            'Codes expired (30-second window)',
            'Wrong authenticator app',
          ],
          solutions: [
            "Sync your phone's time automatically",
            'Resync your authenticator app time',
            'Generate a fresh code and use immediately',
            'Use backup codes if available',
            'Contact support to reset 2FA',
          ],
          difficulty: 'Intermediate',
        },
      ],
    },
    {
      category: 'Wallet Connection Issues',
      icon: Zap,
      problems: [
        {
          issue: 'Wallet not connecting to game',
          causes: [
            'Phantom wallet not installed or locked',
            'Network connection issues',
            'Browser blocking wallet extension',
            'Wrong network selected in wallet',
          ],
          solutions: [
            'Install Phantom wallet from phantom.app',
            'Unlock your wallet and refresh the page',
            'Enable the wallet extension in browser settings',
            'Switch to Solana mainnet in wallet settings',
            'Try connecting in incognito mode',
          ],
          difficulty: 'Easy',
        },
        {
          issue: 'Transaction failed or stuck',
          causes: [
            'Insufficient SOL for transaction fees',
            'Network congestion on Solana',
            'Transaction timeout',
            'Smart contract execution failure',
          ],
          solutions: [
            'Ensure you have enough SOL for fees (~$0.01)',
            'Wait a few minutes and try again',
            'Check Solana network status at status.solana.com',
            'Refresh wallet connection and retry',
            'Contact support if issue persists',
          ],
          difficulty: 'Intermediate',
        },
        {
          issue: 'Winnings not appearing in wallet',
          causes: [
            'Smart contract payout still processing',
            'Looking at wrong wallet address',
            'Token not added to wallet display',
            'Network sync delay',
          ],
          solutions: [
            'Wait for smart contract execution (usually instant)',
            "Verify you're checking the correct wallet",
            'Manually add token to wallet if needed',
            'Check transaction on Solana explorer',
            'Contact support with wallet address and game details',
          ],
          difficulty: 'Intermediate',
        },
      ],
    },
    {
      category: 'Game & Board Issues',
      icon: Globe,
      problems: [
        {
          issue: "Can't join a board",
          causes: [
            'Board already full',
            'Account not verified',
            'Insufficient balance',
            'Geographic restrictions',
          ],
          solutions: [
            'Try other available boards',
            'Complete account verification',
            'Add funds to your account',
            'Check if your location is supported',
            'Contact support for assistance',
          ],
          difficulty: 'Easy',
        },
        {
          issue: 'Board not loading or showing correctly',
          causes: [
            'Browser cache issues',
            'JavaScript disabled',
            'Ad blocker interference',
            'Slow internet connection',
          ],
          solutions: [
            'Refresh page (Ctrl+F5 or Cmd+Shift+R)',
            'Clear browser cache and cookies',
            'Disable ad blockers for our site',
            'Enable JavaScript in browser settings',
            'Try different browser or device',
          ],
          difficulty: 'Easy',
        },
        {
          issue: 'Numbers not showing after board fills',
          causes: [
            'Random number generation in progress',
            'Browser display refresh needed',
            'Smart contract delay',
            'Cache showing old data',
          ],
          solutions: [
            'Wait 5-10 minutes for number assignment',
            'Refresh your browser page',
            'Clear cache and reload',
            'Check again in a few minutes',
            'Contact support if delayed over 30 minutes',
          ],
          difficulty: 'Easy',
        },
      ],
    },
  ];

  const walletIssues = [
    {
      wallet: 'MetaMask',
      icon: Zap,
      commonProblems: [
        {
          problem: 'MetaMask not connecting',
          solutions: [
            'Make sure MetaMask extension is installed and unlocked',
            'Refresh the page and try connecting again',
            'Note: MetaMask is primarily for Ethereum - consider using Phantom for better Solana support',
            'Disable other wallet extensions temporarily',
            'Try connecting in incognito/private mode',
          ],
        },
        {
          problem: 'Transaction stuck or pending',
          solutions: [
            'Wait for network congestion to clear (can take hours)',
            'Speed up transaction by paying higher gas fees',
            'Cancel transaction if still pending (costs gas)',
            'Set higher gas limit for future transactions',
            'Check Ethereum network status at ethgasstation.info',
          ],
        },
        {
          problem: 'High gas fees (Ethereum)',
          solutions: [
            'Switch to Solana for much lower fees (~$0.01)',
            'Wait for lower network congestion (nights/weekends)',
            'Use gas tracker websites to find optimal times',
            'Consider our Solana-based games for better experience',
            'Ethereum games are legacy - Solana is recommended',
          ],
        },
      ],
    },
    {
      wallet: 'Phantom',
      icon: Zap,
      commonProblems: [
        {
          problem: 'Phantom wallet not detected',
          solutions: [
            'Install Phantom extension from phantom.app',
            'Unlock your Phantom wallet',
            'Refresh the page after installation',
            "Make sure you're using a supported browser",
            'Disable other wallet extensions that might conflict',
          ],
        },
        {
          problem: 'Transaction failed on Solana',
          solutions: [
            'Check if you have enough SOL for transaction fees (~$0.01)',
            'Network might be congested, try again in a few minutes',
            'Increase transaction fee slightly if option available',
            "Make sure you're connected to Solana mainnet",
            'Check Solana network status at status.solana.com',
          ],
        },
        {
          problem: 'Wrong network selected',
          solutions: [
            'Switch to Solana Mainnet Beta in Phantom settings',
            'Disconnect and reconnect wallet',
            'Check network indicator in top of Phantom',
            'Refresh page after switching networks',
            'Make sure dApp is compatible with Solana',
          ],
        },
      ],
    },
    {
      wallet: 'General Crypto',
      icon: Shield,
      commonProblems: [
        {
          problem: 'Sent to wrong address',
          solutions: [
            'Check if transaction is still pending (can sometimes cancel)',
            'If confirmed, funds are likely lost permanently',
            'Double-check you used correct network (ETH vs BSC vs Polygon)',
            "Contact receiving platform if it's another exchange",
            'Always send small test amount first',
          ],
        },
        {
          problem: 'Wallet shows different balance',
          solutions: [
            'Wait for wallet to sync with network (can take minutes)',
            'Refresh/reload your wallet application',
            'Check transaction on blockchain explorer',
            "Make sure you're looking at correct network",
            'Contact wallet support if balance still incorrect',
          ],
        },
        {
          problem: 'Private key or seed phrase issues',
          solutions: [
            'NEVER share your private key or seed phrase with anyone',
            'Double-check spelling and word order when restoring',
            'Make sure you have the complete phrase (12/24 words)',
            'Try importing in a different wallet app',
            'If lost, funds cannot be recovered - start fresh',
          ],
        },
      ],
    },
  ];

  const browserSupport = [
    {
      category: 'Supported Browsers',
      icon: Globe,
      browsers: [
        {
          name: 'Chrome',
          version: '90+',
          recommendation: 'Recommended',
          notes: 'Best overall compatibility with all features',
        },
        {
          name: 'Firefox',
          version: '88+',
          recommendation: 'Fully Supported',
          notes: 'Good performance, all features work',
        },
        {
          name: 'Safari',
          version: '14+',
          recommendation: 'Supported',
          notes: 'MacOS/iOS only, some wallet limitations',
        },
        {
          name: 'Edge',
          version: '90+',
          recommendation: 'Supported',
          notes: 'Similar to Chrome, good compatibility',
        },
        {
          name: 'Opera',
          version: '76+',
          recommendation: 'Limited Support',
          notes: 'Basic features work, crypto wallet built-in',
        },
      ],
    },
    {
      category: 'Mobile Support',
      icon: Smartphone,
      devices: [
        {
          platform: 'iOS',
          version: '14+',
          browsers: ['Safari', 'Chrome', 'Firefox'],
          notes: 'Best experience with Safari, wallet apps recommended',
        },
        {
          platform: 'Android',
          version: '8+',
          browsers: ['Chrome', 'Firefox', 'Samsung Internet'],
          notes: 'Chrome recommended, good wallet app support',
        },
      ],
    },
    {
      category: 'System Requirements',
      icon: Monitor,
      requirements: [
        {
          component: 'RAM',
          minimum: '4 GB',
          recommended: '8 GB+',
          notes: 'More RAM helps with multiple tabs open',
        },
        {
          component: 'Internet',
          minimum: '1 Mbps',
          recommended: '5 Mbps+',
          notes: 'Stable connection important for real-time updates',
        },
        {
          component: 'Screen',
          minimum: '1024x768',
          recommended: '1920x1080+',
          notes: 'Responsive design works on smaller screens',
        },
      ],
    },
  ];

  const troubleshootingSteps = [
    {
      step: 1,
      title: 'Basic Troubleshooting',
      icon: RefreshCw,
      actions: [
        'Refresh the page (F5 or Ctrl+R)',
        'Clear browser cache and cookies',
        'Try incognito/private browsing mode',
        'Disable browser extensions temporarily',
        'Check internet connection stability',
      ],
    },
    {
      step: 2,
      title: 'Account & Login Issues',
      icon: Shield,
      actions: [
        'Verify your email address is correct',
        'Check spam folder for verification emails',
        'Reset password if login fails',
        'Try different browser or device',
        'Contact support if account is locked',
      ],
    },
    {
      step: 3,
      title: 'Wallet & Transaction Issues',
      icon: Zap,
      actions: [
        'Ensure wallet is connected and unlocked',
        'Check you have enough SOL for transaction fees',
        "Verify you're on the correct network (Solana)",
        'Try disconnecting and reconnecting wallet',
        'Wait and retry if network is congested',
      ],
    },
    {
      step: 4,
      title: 'Advanced Solutions',
      icon: Settings,
      actions: [
        'Update browser to latest version',
        'Check firewall/antivirus settings',
        'Try different network (mobile data vs WiFi)',
        'Reset wallet connection if using crypto',
        'Document error messages for support',
      ],
    },
  ];

  const contactMethods = [
    {
      method: 'Live Chat',
      icon: MessageCircle,
      availability: '24/7',
      responseTime: 'Usually under 5 minutes',
      bestFor: 'Quick questions, urgent issues',
      description:
        'Chat with our support team in real-time. Available on every page via the chat widget.',
      howTo: [
        'Click the chat bubble on any page',
        'Type your question or issue',
        'Provide account details if requested',
        'Follow agent instructions',
      ],
    },
    {
      method: 'Email Support',
      icon: Mail,
      availability: '24/7',
      responseTime: 'Within 24 hours, usually faster',
      bestFor: 'Complex issues, documentation needs',
      description:
        'Send detailed questions and get comprehensive responses from our support team.',
      howTo: [
        'Email support@footballsquares.com',
        'Include your username and email',
        'Describe the issue in detail',
        'Attach screenshots if helpful',
        'Include transaction IDs if payment-related',
      ],
    },
    {
      method: 'Community Discord',
      icon: MessageCircle,
      availability: 'Community-driven',
      responseTime: 'Varies',
      bestFor: 'General questions, community help',
      description:
        'Connect with other players and get help from the community.',
      howTo: [
        'Join our Discord server',
        'Go to #support channel',
        'Search previous questions first',
        'Post your question clearly',
        'Be patient and respectful',
      ],
    },
  ];

  const errorCodes = [
    {
      code: 'ERR_001',
      meaning: 'Invalid authentication token',
      solution:
        'Log out and log back in. Clear browser cache if issue persists.',
    },
    {
      code: 'ERR_002',
      meaning: 'Insufficient wallet balance',
      solution: 'Add funds to your wallet or choose a lower square price.',
    },
    {
      code: 'ERR_003',
      meaning: 'Transaction rejected by wallet',
      solution:
        'Check wallet connection, ensure sufficient SOL for fees, and retry.',
    },
    {
      code: 'ERR_004',
      meaning: 'Network timeout',
      solution: 'Check internet connection and try again. May be temporary.',
    },
    {
      code: 'ERR_005',
      meaning: 'Wallet connection required',
      solution: 'Connect your Phantom wallet to participate in games.',
    },
    {
      code: 'ERR_006',
      meaning: 'Geographic restriction',
      solution: 'This feature may not be available in your location.',
    },
    {
      code: 'ERR_007',
      meaning: 'Transaction limit exceeded',
      solution: 'Wait for limit reset or contact support for higher limits.',
    },
    {
      code: 'ERR_008',
      meaning: 'Smart contract error',
      solution: 'Network congestion. Wait and try again, or increase gas fees.',
    },
  ];

  return (
    <main className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#002244] dark:text-white mb-6 transition-colors duration-300">
            Technical Support Guide
          </h1>
          <p className="text-xl text-[#708090] dark:text-[#96abdc] max-w-3xl mx-auto mb-8 transition-colors duration-300">
            Get help with technical issues, troubleshoot problems, and learn how
            to resolve common issues with your Football Squares account,
            payments, and gaming experience.
          </p>
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-[#ed5925] to-[#96abdc] p-1 rounded-full">
              <button className="bg-white dark:bg-[#002244] text-[#002244] dark:text-white px-8 py-3 rounded-full font-bold hover:bg-gray-50 dark:hover:bg-[#004953] transition-colors duration-200 inline-flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Get Help Now
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
          {/* Common Issues Tab */}
          {activeTab === 'common-issues' && (
            <div className="p-8 lg:p-12">
              <h2 className="text-3xl font-bold text-[#002244] dark:text-white mb-8 text-center transition-colors duration-300">
                Common Issues & Solutions
              </h2>

              {/* Quick Troubleshooting Steps */}
              <div className="mb-12 bg-[#faf9f5] dark:bg-[#1a1a2e] rounded-xl p-8 transition-colors duration-300">
                <h3 className="text-2xl font-bold text-[#002244] dark:text-white mb-6 text-center transition-colors duration-300">
                  Quick Troubleshooting Steps
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {troubleshootingSteps.map((step) => (
                    <div key={step.step} className="text-center">
                      <div className="bg-gradient-to-r from-[#ed5925] to-[#96abdc] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <step.icon className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="font-bold text-[#002244] dark:text-white mb-3 transition-colors duration-300">
                        Step {step.step}: {step.title}
                      </h4>
                      <ul className="space-y-1">
                        {step.actions.map((action, index) => (
                          <li
                            key={index}
                            className="text-xs text-[#708090] dark:text-[#96abdc] transition-colors duration-300"
                          >
                            • {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Issue Categories */}
              <div className="space-y-8">
                {commonIssues.map((category, categoryIndex) => (
                  <Card key={categoryIndex}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-4">
                        <category.icon className="w-8 h-8 text-[#ed5925]" />
                        <h3 className="text-2xl font-bold text-[#002244] dark:text-white transition-colors duration-300">
                          {category.category}
                        </h3>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {category.problems.map((problem, problemIndex) => (
                          <div
                            key={problemIndex}
                            className="border border-gray-200 dark:border-[#004953] rounded-lg p-6 transition-colors duration-300"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-lg font-bold text-[#002244] dark:text-white transition-colors duration-300">
                                {problem.issue}
                              </h4>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-bold ${
                                  problem.difficulty === 'Easy'
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                                    : problem.difficulty === 'Intermediate'
                                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                                      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                                }`}
                              >
                                {problem.difficulty}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              <div>
                                <h5 className="font-semibold text-red-600 mb-3 flex items-center gap-2">
                                  <AlertTriangle className="w-4 h-4" />
                                  Possible Causes:
                                </h5>
                                <ul className="space-y-1">
                                  {problem.causes.map((cause, causeIndex) => (
                                    <li
                                      key={causeIndex}
                                      className="text-sm text-[#708090] dark:text-[#96abdc] transition-colors duration-300"
                                    >
                                      • {cause}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h5 className="font-semibold text-green-600 mb-3 flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4" />
                                  Solutions:
                                </h5>
                                <ol className="space-y-1">
                                  {problem.solutions.map(
                                    (solution, solutionIndex) => (
                                      <li
                                        key={solutionIndex}
                                        className="text-sm text-[#708090] dark:text-[#96abdc] transition-colors duration-300"
                                      >
                                        {solutionIndex + 1}. {solution}
                                      </li>
                                    ),
                                  )}
                                </ol>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Error Codes */}
              <div className="mt-12">
                <h3 className="text-2xl font-bold text-[#002244] dark:text-white mb-6 transition-colors duration-300">
                  Common Error Codes
                </h3>
                <div className="bg-[#faf9f5] dark:bg-[#1a1a2e] rounded-xl p-6 transition-colors duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {errorCodes.map((error, index) => (
                      <div
                        key={index}
                        className="bg-white dark:bg-[#002244] rounded-lg p-4 border border-gray-200 dark:border-[#004953] transition-colors duration-300"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span className="bg-[#ed5925] text-white px-2 py-1 rounded text-xs font-bold">
                            {error.code}
                          </span>
                          <h4 className="font-semibold text-[#002244] dark:text-white transition-colors duration-300">
                            {error.meaning}
                          </h4>
                        </div>
                        <p className="text-sm text-[#708090] dark:text-[#96abdc] transition-colors duration-300">
                          <strong>Solution:</strong> {error.solution}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Wallet Troubleshooting Tab */}
          {activeTab === 'wallet-troubleshooting' && (
            <div className="p-8 lg:p-12">
              <h2 className="text-3xl font-bold text-[#002244] dark:text-white mb-8 text-center transition-colors duration-300">
                Crypto Wallet Troubleshooting
              </h2>

              <div className="space-y-8">
                {walletIssues.map((wallet, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-4">
                        <wallet.icon className="w-8 h-8 text-[#ed5925]" />
                        <h3 className="text-2xl font-bold text-[#002244] dark:text-white transition-colors duration-300">
                          {wallet.wallet} Issues
                        </h3>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {wallet.commonProblems.map((problem, problemIndex) => (
                          <div
                            key={problemIndex}
                            className="border border-gray-200 dark:border-[#004953] rounded-lg p-6 transition-colors duration-300"
                          >
                            <h4 className="text-lg font-bold text-[#002244] dark:text-white mb-4 transition-colors duration-300">
                              {problem.problem}
                            </h4>
                            <div>
                              <h5 className="font-semibold text-[#ed5925] mb-3">
                                Solutions:
                              </h5>
                              <ol className="space-y-2">
                                {problem.solutions.map(
                                  (solution, solutionIndex) => (
                                    <li
                                      key={solutionIndex}
                                      className="flex items-start gap-2"
                                    >
                                      <span className="bg-[#ed5925] text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">
                                        {solutionIndex + 1}
                                      </span>
                                      <span className="text-sm text-[#708090] dark:text-[#96abdc] transition-colors duration-300">
                                        {solution}
                                      </span>
                                    </li>
                                  ),
                                )}
                              </ol>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* General Wallet Security */}
              <div className="mt-12 bg-gradient-to-r from-[#004953] to-[#002244] rounded-xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-6 text-center">
                  <Shield className="w-8 h-8 inline-block mr-2 text-[#ed5925]" />
                  Wallet Security Reminders
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-bold mb-3 text-[#96abdc]">
                      Always Remember:
                    </h4>
                    <ul className="space-y-2">
                      {[
                        'Never share your private key or seed phrase',
                        'Double-check wallet addresses before sending',
                        'Use official wallet websites and app stores only',
                        'Keep your wallet software updated',
                        'Start with small test transactions',
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
                      Red Flags:
                    </h4>
                    <ul className="space-y-2">
                      {[
                        'Anyone asking for your seed phrase',
                        'Fake wallet websites or apps',
                        "Urgent messages about 'validating' your wallet",
                        'Unsolicited offers or airdrops',
                        'Pressure to connect wallet to unknown sites',
                      ].map((warning, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{warning}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Browser & Device Support Tab */}
          {activeTab === 'browser-support' && (
            <div className="p-8 lg:p-12">
              <h2 className="text-3xl font-bold text-[#002244] dark:text-white mb-8 text-center transition-colors duration-300">
                Browser & Device Compatibility
              </h2>

              <div className="space-y-8">
                {browserSupport.map((category, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-4">
                        <category.icon className="w-8 h-8 text-[#ed5925]" />
                        <h3 className="text-2xl font-bold text-[#002244] dark:text-white transition-colors duration-300">
                          {category.category}
                        </h3>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {category.browsers && (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-gray-200 dark:border-[#004953]">
                                <th className="text-left py-3 px-4 font-semibold text-[#002244] dark:text-white transition-colors duration-300">
                                  Browser
                                </th>
                                <th className="text-left py-3 px-4 font-semibold text-[#002244] dark:text-white transition-colors duration-300">
                                  Version
                                </th>
                                <th className="text-left py-3 px-4 font-semibold text-[#002244] dark:text-white transition-colors duration-300">
                                  Status
                                </th>
                                <th className="text-left py-3 px-4 font-semibold text-[#002244] dark:text-white transition-colors duration-300">
                                  Notes
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {category.browsers.map(
                                (browser, browserIndex) => (
                                  <tr
                                    key={browserIndex}
                                    className="border-b border-gray-100 dark:border-[#004953] hover:bg-gray-50 dark:hover:bg-[#1a1a2e]"
                                  >
                                    <td className="py-3 px-4 font-semibold text-[#002244] dark:text-white transition-colors duration-300">
                                      {browser.name}
                                    </td>
                                    <td className="py-3 px-4 text-[#708090] dark:text-[#96abdc] transition-colors duration-300">
                                      {browser.version}
                                    </td>
                                    <td className="py-3 px-4">
                                      <span
                                        className={`px-2 py-1 rounded-full text-xs font-bold ${
                                          browser.recommendation ===
                                          'Recommended'
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                                            : browser.recommendation ===
                                                'Fully Supported'
                                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                                              : browser.recommendation ===
                                                  'Supported'
                                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
                                        }`}
                                      >
                                        {browser.recommendation}
                                      </span>
                                    </td>
                                    <td className="py-3 px-4 text-[#708090] dark:text-[#96abdc] text-sm transition-colors duration-300">
                                      {browser.notes}
                                    </td>
                                  </tr>
                                ),
                              )}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {category.devices && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {category.devices.map((device, deviceIndex) => (
                            <div
                              key={deviceIndex}
                              className="bg-[#faf9f5] dark:bg-[#1a1a2e] rounded-lg p-4 transition-colors duration-300"
                            >
                              <h4 className="font-bold text-[#002244] dark:text-white mb-2 transition-colors duration-300">
                                {device.platform} {device.version}
                              </h4>
                              <div className="mb-3">
                                <span className="text-sm text-[#708090] dark:text-[#96abdc] transition-colors duration-300">
                                  Supported Browsers:
                                </span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {device.browsers.map(
                                    (browser, browserIndex) => (
                                      <span
                                        key={browserIndex}
                                        className="bg-[#ed5925] text-white px-2 py-1 rounded text-xs"
                                      >
                                        {browser}
                                      </span>
                                    ),
                                  )}
                                </div>
                              </div>
                              <p className="text-sm text-[#708090] dark:text-[#96abdc] transition-colors duration-300">
                                {device.notes}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {category.requirements && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {category.requirements.map((req, reqIndex) => (
                            <div
                              key={reqIndex}
                              className="bg-[#faf9f5] dark:bg-[#1a1a2e] rounded-lg p-4 transition-colors duration-300"
                            >
                              <h4 className="font-bold text-[#002244] dark:text-white mb-2 transition-colors duration-300">
                                {req.component}
                              </h4>
                              <div className="space-y-1 mb-2">
                                <div className="flex justify-between">
                                  <span className="text-sm text-[#708090] dark:text-[#96abdc] transition-colors duration-300">
                                    Minimum:
                                  </span>
                                  <span className="text-sm font-semibold text-[#ed5925]">
                                    {req.minimum}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-[#708090] dark:text-[#96abdc] transition-colors duration-300">
                                    Recommended:
                                  </span>
                                  <span className="text-sm font-semibold text-[#004953] dark:text-[#96abdc] transition-colors duration-300">
                                    {req.recommended}
                                  </span>
                                </div>
                              </div>
                              <p className="text-xs text-[#708090] dark:text-[#96abdc] transition-colors duration-300">
                                {req.notes}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Performance Tips */}
              <div className="mt-12 bg-[#faf9f5] dark:bg-[#1a1a2e] rounded-xl p-8 transition-colors duration-300">
                <h3 className="text-2xl font-bold text-[#002244] dark:text-white mb-6 text-center transition-colors duration-300">
                  Performance Optimization Tips
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold text-[#ed5925] mb-3 flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Speed Improvements
                    </h4>
                    <ul className="space-y-2">
                      {[
                        'Close unnecessary browser tabs',
                        'Disable unused browser extensions',
                        'Clear cache and cookies regularly',
                        'Use wired internet when possible',
                        'Close other apps using internet',
                      ].map((tip, index) => (
                        <li
                          key={index}
                          className="text-sm text-[#708090] dark:text-[#96abdc] transition-colors duration-300"
                        >
                          • {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#ed5925] mb-3 flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Browser Settings
                    </h4>
                    <ul className="space-y-2">
                      {[
                        'Enable JavaScript (required)',
                        'Allow cookies for our site',
                        'Disable aggressive ad blockers',
                        'Update to latest browser version',
                        'Enable hardware acceleration',
                      ].map((tip, index) => (
                        <li
                          key={index}
                          className="text-sm text-[#708090] dark:text-[#96abdc] transition-colors duration-300"
                        >
                          • {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#ed5925] mb-3 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Security Balance
                    </h4>
                    <ul className="space-y-2">
                      {[
                        'Whitelist our domain in antivirus',
                        'Allow WebRTC for best experience',
                        "Don't use VPN for gaming (can cause issues)",
                        'Keep firewall reasonable (not ultra-strict)',
                        'Use trusted networks when possible',
                      ].map((tip, index) => (
                        <li
                          key={index}
                          className="text-sm text-[#708090] dark:text-[#96abdc] transition-colors duration-300"
                        >
                          • {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contact Support Tab */}
          {activeTab === 'contact-support' && (
            <div className="p-8 lg:p-12">
              <h2 className="text-3xl font-bold text-[#002244] dark:text-white mb-8 text-center transition-colors duration-300">
                Contact Support
              </h2>

              {/* Contact Methods */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {contactMethods.map((method, index) => (
                  <Card key={index} className="text-center">
                    <CardHeader>
                      <div className="mx-auto mb-4">
                        <div className="bg-gradient-to-r from-[#ed5925] to-[#96abdc] w-16 h-16 rounded-full flex items-center justify-center">
                          <method.icon className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <CardTitle className="text-xl font-bold text-[#002244] dark:text-white transition-colors duration-300">
                        {method.method}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-[#708090] dark:text-[#96abdc] transition-colors duration-300">
                              Available:
                            </span>
                            <span className="text-sm font-semibold text-[#ed5925]">
                              {method.availability}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-[#708090] dark:text-[#96abdc] transition-colors duration-300">
                              Response:
                            </span>
                            <span className="text-sm font-semibold text-[#ed5925]">
                              {method.responseTime}
                            </span>
                          </div>
                        </div>

                        <div className="bg-[#ed5925] bg-opacity-10 border-l-4 border-[#ed5925] p-3 rounded text-left">
                          <p className="text-sm font-medium text-[#002244] dark:text-white transition-colors duration-300">
                            <strong>Best For:</strong> {method.bestFor}
                          </p>
                        </div>

                        <p className="text-sm text-[#708090] dark:text-[#96abdc] text-left transition-colors duration-300">
                          {method.description}
                        </p>

                        <div>
                          <h5 className="font-semibold text-[#002244] dark:text-white mb-2 text-left transition-colors duration-300">
                            How to Use:
                          </h5>
                          <ol className="space-y-1 text-left">
                            {method.howTo.map((step, stepIndex) => (
                              <li
                                key={stepIndex}
                                className="text-sm text-[#708090] dark:text-[#96abdc] transition-colors duration-300"
                              >
                                {stepIndex + 1}. {step}
                              </li>
                            ))}
                          </ol>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* What to Include */}
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-[#002244] dark:text-white mb-6 transition-colors duration-300">
                  What Information to Include When Contacting Support
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-[#ed5925] mb-4 flex items-center gap-2">
                      <Info className="w-5 h-5" />
                      Account Information
                    </h4>
                    <ul className="space-y-2">
                      {[
                        'Your wallet address (public address only)',
                        'Game or transaction details',
                        'When the issue occurred',
                        'Last successful wallet connection',
                        'Browser and wallet extension versions',
                      ].map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-[#ed5925] mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-[#708090] dark:text-[#96abdc] transition-colors duration-300">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#ed5925] mb-4 flex items-center gap-2">
                      <Bug className="w-5 h-5" />
                      Issue Details
                    </h4>
                    <ul className="space-y-2">
                      {[
                        'Exact error messages (copy/paste)',
                        'What you were trying to do',
                        'When the problem started',
                        "Steps you've already tried",
                        'Screenshots if helpful',
                      ].map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-[#ed5925] mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-[#708090] dark:text-[#96abdc] transition-colors duration-300">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Technical Information */}
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-[#002244] dark:text-white mb-6 transition-colors duration-300">
                  Technical Information (For Complex Issues)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-[#faf9f5] dark:bg-[#1a1a2e] rounded-lg p-4 transition-colors duration-300">
                    <h4 className="font-semibold text-[#002244] dark:text-white mb-3 transition-colors duration-300">
                      Browser Info
                    </h4>
                    <ul className="space-y-1 text-sm text-[#708090] dark:text-[#96abdc] transition-colors duration-300">
                      <li>• Browser name and version</li>
                      <li>• Operating system</li>
                      <li>• Screen resolution</li>
                      <li>• Extensions installed</li>
                    </ul>
                  </div>
                  <div className="bg-[#faf9f5] dark:bg-[#1a1a2e] rounded-lg p-4 transition-colors duration-300">
                    <h4 className="font-semibold text-[#002244] dark:text-white mb-3 transition-colors duration-300">
                      Transaction Info
                    </h4>
                    <ul className="space-y-1 text-sm text-[#708090] dark:text-[#96abdc] transition-colors duration-300">
                      <li>• Transaction signature (Solana)</li>
                      <li>• Token amount and type</li>
                      <li>• Timestamp of transaction</li>
                      <li>• Wallet address (public key)</li>
                    </ul>
                  </div>
                  <div className="bg-[#faf9f5] dark:bg-[#1a1a2e] rounded-lg p-4 transition-colors duration-300">
                    <h4 className="font-semibold text-[#002244] dark:text-white mb-3 transition-colors duration-300">
                      Network Details
                    </h4>
                    <ul className="space-y-1 text-sm text-[#708090] dark:text-[#96abdc] transition-colors duration-300">
                      <li>• Internet connection type</li>
                      <li>• VPN usage (if any)</li>
                      <li>• Firewall/antivirus software</li>
                      <li>• Network restrictions</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Support Hours */}
              <div className="bg-gradient-to-r from-[#004953] to-[#002244] rounded-xl p-8 text-white text-center">
                <h3 className="text-2xl font-bold mb-4">
                  <Clock className="w-8 h-8 inline-block mr-2 text-[#ed5925]" />
                  Support Hours & Response Times
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <MessageCircle className="w-12 h-12 text-[#ed5925] mx-auto mb-3" />
                    <h4 className="font-bold mb-2">Live Chat</h4>
                    <p className="text-sm text-[#96abdc] mb-1">
                      24/7 Available
                    </p>
                    <p className="text-xs">Usually under 5 minutes</p>
                  </div>
                  <div>
                    <Mail className="w-12 h-12 text-[#ed5925] mx-auto mb-3" />
                    <h4 className="font-bold mb-2">Email Support</h4>
                    <p className="text-sm text-[#96abdc] mb-1">
                      24/7 Available
                    </p>
                    <p className="text-xs">Within 24 hours</p>
                  </div>
                  <div>
                    <Phone className="w-12 h-12 text-[#ed5925] mx-auto mb-3" />
                    <h4 className="font-bold mb-2">Priority Support</h4>
                    <p className="text-sm text-[#96abdc] mb-1">VIP Members</p>
                    <p className="text-xs">Within 2 hours</p>
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
              href="/account-guide"
              className="bg-white dark:bg-[#002244] rounded-xl p-6 border border-gray-200 dark:border-[#004953] hover:shadow-lg transition-all duration-200 text-center group"
            >
              <Shield className="w-12 h-12 text-[#ed5925] mx-auto mb-4 group-hover:scale-110 transition-transform duration-200" />
              <h4 className="font-bold text-[#002244] dark:text-white mb-2 transition-colors duration-300">
                Account Setup
              </h4>
              <p className="text-[#708090] dark:text-[#96abdc] text-sm transition-colors duration-300">
                Create and verify your account
              </p>
            </a>
            <a
              href="/payment-guide"
              className="bg-white dark:bg-[#002244] rounded-xl p-6 border border-gray-200 dark:border-[#004953] hover:shadow-lg transition-all duration-200 text-center group"
            >
              <Zap className="w-12 h-12 text-[#ed5925] mx-auto mb-4 group-hover:scale-110 transition-transform duration-200" />
              <h4 className="font-bold text-[#002244] dark:text-white mb-2 transition-colors duration-300">
                Wallet Guide
              </h4>
              <p className="text-[#708090] dark:text-[#96abdc] text-sm transition-colors duration-300">
                Connect your wallet and play
              </p>
            </a>
            <a
              href="/how-to-play"
              className="bg-white dark:bg-[#002244] rounded-xl p-6 border border-gray-200 dark:border-[#004953] hover:shadow-lg transition-all duration-200 text-center group"
            >
              <HelpCircle className="w-12 h-12 text-[#ed5925] mx-auto mb-4 group-hover:scale-110 transition-transform duration-200" />
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

export default TechnicalSupportContent;
