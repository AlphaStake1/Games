/**
 * Technical support content data
 * Extracted from TechnicalSupportContent.tsx to reduce component size
 */

import {
  Shield,
  Zap,
  Monitor,
  MessageCircle,
  HelpCircle,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Globe,
  Smartphone,
  Settings,
  Clock,
  Mail,
  Phone,
  Search,
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
} from '@/lib/icons';

export const commonIssues = [
  {
    category: 'Login & Account Issues',
    icon: Shield,
    problems: [
      {
        issue: 'Cannot log into my account',
        solutions: [
          'Check that your email and password are correct',
          'Try resetting your password using the forgot password link',
          'Clear your browser cache and cookies',
          'Ensure caps lock is off when typing password',
        ],
        severity: 'high',
      },
      {
        issue: 'Account verification email not received',
        solutions: [
          'Check your spam/junk folder',
          'Add support@footballsquares.com to your contacts',
          'Request a new verification email from your account settings',
          'Contact support if no email arrives within 1 hour',
        ],
        severity: 'medium',
      },
      {
        issue: 'Two-factor authentication problems',
        solutions: [
          'Ensure your device clock is synchronized',
          'Try generating a new code from your authenticator app',
          'Use backup codes if available',
          'Contact support to reset 2FA if locked out',
        ],
        severity: 'high',
      },
    ],
  },
  {
    category: 'Payment & Transaction Issues',
    icon: Zap,
    problems: [
      {
        issue: 'Crypto transaction not showing up',
        solutions: [
          'Check the transaction on the blockchain explorer',
          'Ensure you sent to the correct wallet address',
          'Wait for required network confirmations (usually 3-6)',
          'Contact support with transaction hash if delayed over 1 hour',
        ],
        severity: 'high',
      },
      {
        issue: 'Withdrawal request pending',
        solutions: [
          'Check if additional verification is required',
          'Ensure withdrawal address is correct and verified',
          'Note that withdrawals are processed within 24-48 hours',
          'Contact support if pending over 48 hours',
        ],
        severity: 'medium',
      },
      {
        issue: 'Payment method not accepted',
        solutions: [
          'Verify your payment method is supported in your region',
          'Check minimum and maximum transaction limits',
          'Ensure sufficient balance for transaction and fees',
          'Try an alternative supported payment method',
        ],
        severity: 'low',
      },
    ],
  },
  {
    category: 'Game & Board Issues',
    icon: Settings,
    problems: [
      {
        issue: 'Cannot purchase squares',
        solutions: [
          'Ensure you have sufficient account balance',
          'Check that the board is still accepting purchases',
          "Verify you haven't exceeded purchase limits",
          'Try refreshing the page and attempting again',
        ],
        severity: 'medium',
      },
      {
        issue: 'Squares not showing as owned',
        solutions: [
          'Refresh the page to update square ownership',
          'Check your account transaction history',
          'Ensure payment was completed successfully',
          'Contact support if discrepancy persists',
        ],
        severity: 'medium',
      },
      {
        issue: 'Game results seem incorrect',
        solutions: [
          'Verify results against official NFL scores',
          'Check the specific game rules for your board',
          'Review payout calculation methodology',
          'Contact support with specific details if disputed',
        ],
        severity: 'high',
      },
    ],
  },
];

export const walletTroubleshooting = [
  {
    category: 'Connection Issues',
    icon: Zap,
    solutions: [
      {
        problem: "Wallet won't connect",
        steps: [
          'Ensure your wallet extension is installed and unlocked',
          "Check that you're on the correct blockchain network",
          'Try refreshing the page and reconnecting',
          'Clear browser cache if issues persist',
        ],
      },
      {
        problem: 'Transaction failed',
        steps: [
          'Check if you have sufficient balance for gas fees',
          'Verify the transaction details before confirming',
          'Try increasing gas limit or price if using advanced settings',
          'Wait for network congestion to clear and retry',
        ],
      },
      {
        problem: 'Wrong network selected',
        steps: [
          'Switch to the correct network in your wallet',
          'Add the network manually if not listed',
          'Ensure the network RPC URL is correct',
          'Contact support for network configuration help',
        ],
      },
    ],
  },
  {
    category: 'Security Best Practices',
    icon: Shield,
    recommendations: [
      {
        title: 'Wallet Security',
        practices: [
          'Never share your private keys or seed phrase',
          'Use hardware wallets for large amounts',
          'Enable all available security features',
          'Regularly update wallet software',
        ],
      },
      {
        title: 'Transaction Safety',
        practices: [
          'Double-check recipient addresses before sending',
          'Start with small test transactions for new addresses',
          'Verify smart contract addresses on official sources',
          'Be cautious of phishing websites and fake apps',
        ],
      },
      {
        title: 'Account Protection',
        practices: [
          'Use unique, strong passwords for all accounts',
          'Enable two-factor authentication where available',
          'Regularly monitor account activity',
          'Log out of accounts when using shared devices',
        ],
      },
    ],
  },
];

export const browserSupport = [
  {
    category: 'Supported Browsers',
    icon: Globe,
    browsers: [
      {
        name: 'Chrome',
        version: '90+',
        status: 'Fully Supported',
        notes: 'Recommended browser for best experience',
      },
      {
        name: 'Firefox',
        version: '88+',
        status: 'Fully Supported',
        notes: 'Excellent compatibility with all features',
      },
      {
        name: 'Safari',
        version: '14+',
        status: 'Supported',
        notes: 'Some wallet extensions may have limited support',
      },
      {
        name: 'Edge',
        version: '90+',
        status: 'Fully Supported',
        notes: 'Chromium-based version recommended',
      },
      {
        name: 'Opera',
        version: '76+',
        status: 'Supported',
        notes: 'Built-in crypto wallet support available',
      },
    ],
  },
  {
    category: 'Mobile Devices',
    icon: Smartphone,
    devices: [
      {
        platform: 'iOS',
        version: '13+',
        browsers: ['Safari', 'Chrome', 'Firefox'],
        notes: 'Use wallet apps with built-in browsers when possible',
      },
      {
        platform: 'Android',
        version: '8+',
        browsers: ['Chrome', 'Firefox', 'Samsung Internet'],
        notes: 'MetaMask mobile app recommended for crypto features',
      },
    ],
  },
  {
    category: 'Common Browser Issues',
    icon: AlertTriangle,
    issues: [
      {
        problem: 'Page not loading correctly',
        solutions: [
          'Clear browser cache and cookies',
          'Disable browser extensions temporarily',
          'Try incognito/private browsing mode',
          'Update browser to latest version',
        ],
      },
      {
        problem: 'Wallet extension not detected',
        solutions: [
          'Ensure extension is installed and enabled',
          'Refresh the page after installing extension',
          'Check that extension has necessary permissions',
          'Try disabling other extensions that might conflict',
        ],
      },
    ],
  },
];

export const contactSupport = {
  methods: [
    {
      type: 'Email Support',
      icon: Mail,
      contact: 'support@footballsquares.com',
      hours: '24/7 - Response within 4 hours',
      bestFor: 'Account issues, technical problems, general inquiries',
    },
    {
      type: 'Live Chat',
      icon: MessageCircle,
      contact: 'Available on website',
      hours: '9 AM - 6 PM PST, Monday-Friday',
      bestFor: 'Quick questions, real-time troubleshooting',
    },
    {
      type: 'Phone Support',
      icon: Phone,
      contact: '1-800-SQUARES (1-800-778-2737)',
      hours: '9 AM - 6 PM PST, Monday-Friday',
      bestFor: 'Urgent issues, complex technical problems',
    },
  ],
  tipsBefore: [
    'Have your account email address ready',
    'Note any error messages you received',
    'Describe steps you took before the issue occurred',
    'Include screenshots if helpful',
    'Check your internet connection is stable',
  ],
  responseTime: {
    email: '4 hours during business days',
    chat: 'Usually immediate during business hours',
    phone: 'Immediate during business hours',
  },
};

export const troubleshootingSteps = {
  basic: [
    {
      step: 1,
      title: 'Refresh the Page',
      description: 'Often resolves temporary loading issues',
      icon: RefreshCw,
    },
    {
      step: 2,
      title: 'Clear Cache',
      description: 'Remove stored website data that might be corrupted',
      icon: Settings,
    },
    {
      step: 3,
      title: 'Check Internet',
      description: 'Ensure stable connection to our servers',
      icon: Globe,
    },
    {
      step: 4,
      title: 'Try Different Browser',
      description: 'Rule out browser-specific issues',
      icon: Monitor,
    },
  ],
  advanced: [
    {
      step: 1,
      title: 'Disable Extensions',
      description: 'Temporarily disable browser extensions',
      icon: Settings,
    },
    {
      step: 2,
      title: 'Check Console',
      description: 'Look for JavaScript errors in browser console',
      icon: Bug,
    },
    {
      step: 3,
      title: 'Network Analysis',
      description: 'Check for failed network requests',
      icon: Globe,
    },
    {
      step: 4,
      title: 'Contact Support',
      description: 'Provide detailed information about the issue',
      icon: MessageCircle,
    },
  ],
};

export const faqCategories = [
  {
    category: 'Account Management',
    icon: Shield,
    questions: [
      {
        q: 'How do I change my email address?',
        a: "Go to Account Settings > Profile Information and update your email. You'll need to verify the new email address.",
      },
      {
        q: 'Can I delete my account?',
        a: 'Yes, contact support to request account deletion. Note that this action is permanent and cannot be undone.',
      },
      {
        q: 'How do I enable two-factor authentication?',
        a: 'In Security Settings, click "Enable 2FA" and follow the setup process with your preferred authenticator app.',
      },
    ],
  },
  {
    category: 'Payments',
    icon: Zap,
    questions: [
      {
        q: 'What cryptocurrencies do you accept?',
        a: 'We accept Bitcoin, Ethereum, USDC, and USDT. More currencies may be added based on demand.',
      },
      {
        q: 'Are there transaction fees?',
        a: "We don't charge transaction fees, but network gas fees apply for blockchain transactions.",
      },
      {
        q: 'How long do withdrawals take?',
        a: 'Withdrawals are typically processed within 24-48 hours during business days.',
      },
    ],
  },
];
