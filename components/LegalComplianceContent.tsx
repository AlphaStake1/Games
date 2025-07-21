'use client';

import { useState } from 'react';
import {
  Shield,
  Globe,
  Scale,
  FileText,
  AlertTriangle,
  CheckCircle,
  Info,
  Lock,
  Eye,
  Users,
  MapPin,
  Gavel,
  HelpCircle,
  ExternalLink,
  Calendar,
  Clock,
  Mail,
  Building,
  CreditCard,
  Zap,
  UserCheck,
  Ban,
  AlertCircle,
  Flag,
  Home,
  Phone,
  Heart,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const LegalComplianceContent = () => {
  const [activeTab, setActiveTab] = useState('terms-summary');

  const tabs = [
    { id: 'terms-summary', label: 'Terms of Service', icon: FileText },
    { id: 'privacy-policy', label: 'Privacy Policy', icon: Lock },
    { id: 'geographic-rules', label: 'Geographic Rules', icon: Globe },
    { id: 'dispute-resolution', label: 'Dispute Resolution', icon: Gavel },
  ];

  const termsHighlights = [
    {
      category: 'Participation Requirements',
      icon: UserCheck,
      rules: [
        {
          title: 'Age Requirement',
          description: 'Must be 18+ years old to participate',
          importance: 'Critical',
          details: [
            'Legal gambling age in your jurisdiction applies',
            'You are responsible for verifying local laws',
            'No exceptions - this is legally required',
            'Smart contracts cannot verify age - this is on you',
          ],
        },
        {
          title: 'Wallet Ownership',
          description: 'Must own and control the wallet you connect',
          importance: 'High',
          details: [
            'Only connect wallets you personally control',
            'Never share your private keys or seed phrase',
            'Each person should use their own wallet',
            'Lost keys = lost access to winnings',
          ],
        },
        {
          title: 'Legal Compliance',
          description: 'Must comply with your local laws and regulations',
          importance: 'High',
          details: [
            'Check if online gambling is legal in your area',
            'You are responsible for tax obligations',
            'Some jurisdictions may be restricted',
            'Use of VPNs to circumvent restrictions is prohibited',
          ],
        },
      ],
    },
    {
      category: 'Gaming Rules',
      icon: Shield,
      rules: [
        {
          title: 'Fair Play',
          description: 'All participants must play fairly and honestly',
          importance: 'Critical',
          details: [
            'No collusion with other players',
            'No use of bots or automated systems',
            'No exploitation of software bugs',
            'Report suspected cheating immediately',
          ],
        },
        {
          title: 'Final Results',
          description: 'Official NFL scores determine all winners',
          importance: 'High',
          details: [
            'Only final, official NFL scores count',
            'Overtime scores are included',
            'Disputed games follow NFL official decisions',
            'No changes after games are marked complete',
          ],
        },
        {
          title: 'Game Cancellation',
          description: 'How cancelled or postponed games are handled',
          importance: 'Medium',
          details: [
            'Postponed games: all money held until completion',
            'Cancelled games: refunds issued to all participants',
            'Weather delays: games continue as scheduled by NFL',
            'Force majeure events handled case-by-case',
          ],
        },
      ],
    },
    {
      category: 'Smart Contract Rules',
      icon: Zap,
      rules: [
        {
          title: 'Wallet Transactions',
          description: 'All transactions handled by smart contracts on Solana',
          importance: 'Critical',
          details: [
            'Only personal wallets allowed - never share private keys',
            'Smart contracts automatically handle payouts',
            'All transactions are public on Solana blockchain',
            'No chargebacks possible - blockchain transactions are final',
          ],
        },
        {
          title: 'Gas Fees & Costs',
          description: 'Users responsible for transaction fees',
          importance: 'High',
          details: [
            'Solana network fees (~$0.01) paid by users',
            'No minimum transaction amounts',
            'No daily limits - smart contracts enforce game rules only',
            'Instant settlement when smart contract conditions are met',
          ],
        },
        {
          title: 'Tax Responsibility',
          description: 'Users responsible for reporting winnings',
          importance: 'High',
          details: [
            'Report gambling winnings to tax authorities',
            'Public blockchain makes transaction tracking possible',
            'Keep records of all wallet transactions',
            'Consult tax professional for guidance',
          ],
        },
      ],
    },
    {
      category: 'Prohibited Activities',
      icon: Ban,
      rules: [
        {
          title: 'Smart Contract Manipulation',
          description:
            'Cannot attempt to exploit smart contract vulnerabilities',
          importance: 'Critical',
          details: [
            'No attempts to manipulate smart contract execution',
            'No exploitation of code vulnerabilities',
            'Report bugs through responsible disclosure',
            'MEV (Maximum Extractable Value) attacks prohibited',
          ],
        },
        {
          title: 'Game Interference',
          description: 'Cannot interfere with fair game operation',
          importance: 'Critical',
          details: [
            'No coordination to manipulate outcomes',
            'No spreading false information about games',
            'No attempts to influence NFL game results',
            'Report suspicious activity to moderators',
          ],
        },
        {
          title: 'Platform Abuse',
          description: 'Cannot abuse platform features or systems',
          importance: 'High',
          details: [
            'No spam or excessive automated requests',
            'No creating multiple wallets to circumvent limits',
            'No harassment of other users',
            'Respect community guidelines and terms',
          ],
        },
      ],
    },
  ];

  const privacyHighlights = [
    {
      category: 'Information Collection',
      icon: Info,
      items: [
        {
          dataType: 'Wallet Information',
          collected: [
            'Public wallet addresses',
            'Transaction signatures',
            'Token balances (public)',
            'Connection timestamps',
          ],
          purpose: 'Game participation, payout processing, platform analytics',
          retention: 'Indefinitely (public blockchain data)',
        },
        {
          dataType: 'Gaming Data',
          collected: [
            'Game participation history',
            'Square selections',
            'Win/loss records',
            'Smart contract interactions',
          ],
          purpose: 'Game operation, statistics, user experience',
          retention: 'Indefinitely (business operations)',
        },
        {
          dataType: 'Technical Data',
          collected: [
            'IP addresses',
            'Browser information',
            'Device details',
            'Usage analytics',
          ],
          purpose: 'Security, platform improvement, analytics',
          retention: '2 years (security and analytics)',
        },
        {
          dataType: 'Optional Contact Info',
          collected: [
            'Email address (if provided)',
            'Discord username (if linked)',
            'Notification preferences',
          ],
          purpose: 'Communications, support, community features',
          retention: 'Until you request removal',
        },
      ],
    },
    {
      category: 'Information Sharing',
      icon: Users,
      items: [
        {
          recipient: 'Blockchain Networks',
          dataShared:
            'Public wallet addresses, transaction data, smart contract interactions',
          reason: 'Decentralized game operation and transparent payouts',
          protections:
            'Public blockchain data, no additional privacy beyond network design',
        },
        {
          recipient: 'Law Enforcement',
          dataShared: 'Public blockchain data, IP logs if legally required',
          reason: 'Legal compliance when required by valid legal process',
          protections: 'Only when legally compelled, legal review required',
        },
        {
          recipient: 'Service Providers',
          dataShared:
            'Technical logs, usage analytics, contact info (if provided)',
          reason: 'Platform maintenance, analytics, customer support',
          protections:
            'Data processing agreements, access controls, audit trails',
        },
        {
          recipient: 'Community Platforms',
          dataShared:
            'Public wallet addresses, game statistics (if you choose to share)',
          reason: 'Leaderboards, community features, social gaming',
          protections: 'Opt-in only, you control what information is shared',
        },
      ],
    },
    {
      category: 'User Rights',
      icon: Eye,
      rights: [
        {
          right: 'Access Your Data',
          description: 'Request a copy of all personal data we have about you',
          howTo: 'Submit request through account settings or contact support',
          timeframe: 'Within 30 days of request',
        },
        {
          right: 'Correct Your Data',
          description: 'Update or correct any inaccurate personal information',
          howTo: 'Update in account settings or contact support for assistance',
          timeframe: 'Immediate for most data, verification may be required',
        },
        {
          right: 'Delete Your Data',
          description:
            'Request deletion of your personal data (with limitations)',
          howTo:
            'Submit deletion request through support (note: some data must be retained legally)',
          timeframe: 'Within 30 days, subject to legal retention requirements',
        },
        {
          right: 'Data Portability',
          description: 'Receive your data in a portable format',
          howTo:
            'Request through support - data provided in common formats (CSV, JSON)',
          timeframe: 'Within 30 days of request',
        },
        {
          right: 'Opt-Out of Marketing',
          description: 'Stop receiving promotional communications',
          howTo:
            'Unsubscribe links in emails, or adjust preferences in account settings',
          timeframe:
            'Immediate for email, up to 10 days for other communications',
        },
      ],
    },
  ];

  const geographicRules = [
    {
      status: 'Fully Supported',
      icon: CheckCircle,
      color: 'green',
      regions: [
        {
          name: 'United States',
          details: 'Most states supported, some restrictions apply',
          restrictions: [
            'Washington state: Currently not supported',
            'Idaho: Under legal review',
            'Some tribal lands may have restrictions',
          ],
          requirements: [
            'Must be 18+ (21+ in some states for certain games)',
            'Valid US ID required',
            'US bank account or payment method',
            'Physical presence required (no VPN)',
          ],
        },
        {
          name: 'Canada',
          details: 'All provinces supported with full functionality',
          restrictions: [
            'Quebec: French language support required',
            'Some payment methods limited by province',
          ],
          requirements: [
            'Must be 18+ (19+ in some provinces)',
            'Valid Canadian ID required',
            'Canadian payment method preferred',
            'Compliance with provincial gaming laws',
          ],
        },
        {
          name: 'United Kingdom',
          details: 'Full support under UKGC licensing',
          restrictions: [
            'Must verify UK residence',
            'Enhanced due diligence for large transactions',
          ],
          requirements: [
            'Must be 18+',
            'Valid UK ID and proof of address',
            'UK bank account required',
            'Responsible gambling checks mandatory',
          ],
        },
      ],
    },
    {
      status: 'Limited Support',
      icon: AlertTriangle,
      color: 'yellow',
      regions: [
        {
          name: 'European Union',
          details: 'Selected countries with local licensing',
          restrictions: [
            'Germany: Limited game types',
            'Netherlands: Requires local license verification',
            'Some countries geo-blocked pending licensing',
          ],
          requirements: [
            'Local ID verification required',
            'Compliance with national gaming laws',
            'Enhanced responsible gaming measures',
            'Local payment methods may be limited',
          ],
        },
        {
          name: 'Australia/New Zealand',
          details: 'Limited functionality, working on licensing',
          restrictions: [
            'Crypto payments only currently',
            'Limited customer support hours',
            'Some game types not available',
          ],
          requirements: [
            'Must be 18+',
            'Valid local ID',
            'Understanding of legal status',
            'Crypto wallet required',
          ],
        },
      ],
    },
    {
      status: 'Not Supported',
      icon: Ban,
      color: 'red',
      regions: [
        {
          name: 'Prohibited Jurisdictions',
          details: 'These regions are currently not supported',
          countries: [
            'North Korea',
            'Iran',
            'Syria',
            'Cuba',
            'Russia',
            'Belarus',
            'Myanmar',
            'Afghanistan',
            'Venezuela',
            'Sudan',
          ],
          reason:
            'Sanctions, legal restrictions, or lack of regulatory framework',
        },
        {
          name: 'Under Review',
          details: "Regions we're evaluating for future support",
          countries: [
            'India',
            'Brazil',
            'Mexico',
            'Japan',
            'South Korea',
            'Indonesia',
          ],
          reason: 'Pending regulatory clarity or licensing discussions',
        },
      ],
    },
  ];

  const disputeProcess = [
    {
      step: 1,
      title: 'Internal Resolution',
      icon: HelpCircle,
      timeframe: '1-7 business days',
      description:
        'First, try to resolve the issue directly with our support team',
      process: [
        'Contact customer support via live chat or email',
        'Provide detailed description of the dispute',
        'Include relevant documentation (screenshots, transaction IDs)',
        'Our team will investigate and respond within 24-48 hours',
        'Most issues are resolved at this stage',
      ],
      escalation:
        'If not satisfied with response, you can escalate to management review',
    },
    {
      step: 2,
      title: 'Management Review',
      icon: Users,
      timeframe: '3-10 business days',
      description:
        'Senior management will review complex or unresolved disputes',
      process: [
        'Request escalation through support or directly via management email',
        'Provide case number from initial support interaction',
        'Management will review all evidence and communications',
        'Additional documentation may be requested',
        'Final decision will be communicated in writing',
      ],
      escalation:
        'If still not satisfied, you can pursue independent arbitration',
    },
    {
      step: 3,
      title: 'Independent Arbitration',
      icon: Scale,
      timeframe: '30-90 days',
      description:
        'Binding arbitration through our designated arbitration service',
      process: [
        'File arbitration request with designated service (details in Terms)',
        'Pay arbitration fees (may be refundable if you win)',
        'Both parties present evidence to independent arbitrator',
        'Arbitrator makes binding decision based on evidence',
        'Decision is final and enforceable',
      ],
      escalation: 'Arbitration decision is final - no further appeals',
    },
  ];

  const legalContacts = [
    {
      type: 'General Legal Inquiries',
      email: 'legal@footballsquares.com',
      description: 'Questions about terms, policies, or compliance matters',
      responseTime: '3-5 business days',
    },
    {
      type: 'Privacy & Data Protection',
      email: 'privacy@footballsquares.com',
      description: 'Data access requests, privacy concerns, GDPR/CCPA requests',
      responseTime: '5-10 business days',
    },
    {
      type: 'Compliance & Regulatory',
      email: 'compliance@footballsquares.com',
      description:
        'Regulatory questions, licensing inquiries, government requests',
      responseTime: '1-3 business days',
    },
    {
      type: 'Dispute Escalation',
      email: 'disputes@footballsquares.com',
      description: 'Formal dispute filing, management review requests',
      responseTime: '2-5 business days',
    },
  ];

  const compliancePrograms = [
    {
      program: 'Smart Contract Security',
      icon: Shield,
      description: 'Ensuring secure and transparent smart contract operations',
      measures: [
        'Open source smart contract code for transparency',
        'Third-party security audits of smart contracts',
        'Immutable game logic prevents manipulation',
        'Regular monitoring of contract execution',
        'Bug bounty programs for vulnerability disclosure',
      ],
    },
    {
      program: 'Platform Security',
      icon: UserCheck,
      description: 'Protecting user experience and platform integrity',
      measures: [
        'Secure wallet connection protocols',
        'DDoS protection and uptime monitoring',
        'Regular security assessments',
        'Encrypted communications for sensitive data',
        'Incident response and recovery procedures',
      ],
    },
    {
      program: 'Responsible Gaming',
      icon: Heart,
      description: 'Promoting safe and responsible gaming practices',
      measures: [
        'Educational resources about gambling risks',
        'Problem gambling resource links and support',
        'Community guidelines and moderation',
        'Self-imposed limits through wallet management',
        'Age awareness and local law compliance reminders',
      ],
    },
  ];

  return (
    <main className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#002244] dark:text-white mb-6 transition-colors duration-300">
            Legal & Compliance Guide
          </h1>
          <p className="text-xl text-[#708090] dark:text-[#96abdc] max-w-3xl mx-auto mb-8 transition-colors duration-300">
            Understand your rights, responsibilities, and the legal framework
            governing your Football Squares experience. Learn about our terms,
            privacy practices, and compliance measures.
          </p>
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-[#ed5925] to-[#96abdc] p-1 rounded-full">
              <button className="bg-white dark:bg-[#002244] text-[#002244] dark:text-white px-8 py-3 rounded-full font-bold hover:bg-gray-50 dark:hover:bg-[#004953] transition-colors duration-200 inline-flex items-center gap-2">
                <Scale className="w-5 h-5" />
                Legal Resources
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
          {/* Terms of Service Tab */}
          {activeTab === 'terms-summary' && (
            <div className="p-8 lg:p-12">
              <h2 className="text-3xl font-bold text-[#002244] dark:text-white mb-8 text-center transition-colors duration-300">
                Terms of Service Summary
              </h2>

              {/* Important Notice */}
              <div className="mb-12 bg-gradient-to-r from-[#ed5925] to-[#96abdc] rounded-xl p-8 text-white">
                <div className="flex items-center gap-4 mb-4">
                  <AlertTriangle className="w-8 h-8" />
                  <h3 className="text-2xl font-bold">Important Legal Notice</h3>
                </div>
                <p className="text-lg mb-4">
                  This page provides a summary of key terms for easy
                  understanding. The complete, legally binding Terms of Service
                  document takes precedence in all cases.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button className="bg-white text-[#002244] px-6 py-2 rounded-full font-bold hover:bg-gray-100 transition-colors duration-200 inline-flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Read Full Terms
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <button className="bg-white text-[#002244] px-6 py-2 rounded-full font-bold hover:bg-gray-100 transition-colors duration-200 inline-flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Last Updated: Dec 1, 2023
                  </button>
                </div>
              </div>

              {/* Terms Categories */}
              <div className="space-y-8">
                {termsHighlights.map((category, categoryIndex) => (
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
                        {category.rules.map((rule, ruleIndex) => (
                          <div
                            key={ruleIndex}
                            className="border border-gray-200 dark:border-[#004953] rounded-lg p-6 transition-colors duration-300"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-lg font-bold text-[#002244] dark:text-white transition-colors duration-300">
                                {rule.title}
                              </h4>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-bold ${
                                  rule.importance === 'Critical'
                                    ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                                    : rule.importance === 'High'
                                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                                }`}
                              >
                                {rule.importance}
                              </span>
                            </div>
                            <p className="text-[#708090] dark:text-[#96abdc] mb-4 transition-colors duration-300">
                              {rule.description}
                            </p>
                            <div>
                              <h5 className="font-semibold text-[#002244] dark:text-white mb-3 transition-colors duration-300">
                                Key Details:
                              </h5>
                              <ul className="space-y-2">
                                {rule.details.map((detail, detailIndex) => (
                                  <li
                                    key={detailIndex}
                                    className="flex items-start gap-2"
                                  >
                                    <CheckCircle className="w-4 h-4 text-[#ed5925] mt-0.5 flex-shrink-0" />
                                    <span className="text-sm text-[#708090] dark:text-[#96abdc] transition-colors duration-300">
                                      {detail}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Account Termination */}
              <div className="mt-12 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 rounded-xl p-8 transition-colors duration-300">
                <h3 className="text-2xl font-bold text-red-800 dark:text-red-300 mb-6 transition-colors duration-300">
                  Account Termination Policy
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-red-700 dark:text-red-400 mb-3 transition-colors duration-300">
                      Immediate Termination Triggers:
                    </h4>
                    <ul className="space-y-2">
                      {[
                        'False age information',
                        'Smart contract exploitation attempts',
                        'Bot or automated system usage',
                        'Underage gambling',
                        'Platform abuse or spam',
                        'Collusion or fraud',
                      ].map((trigger, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Ban className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-red-700 dark:text-red-400 transition-colors duration-300">
                            {trigger}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-700 dark:text-red-400 mb-3 transition-colors duration-300">
                      Your Rights Upon Termination:
                    </h4>
                    <ul className="space-y-2">
                      {[
                        'Wallet funds remain under your control (non-custodial)',
                        'Access to public blockchain transaction history',
                        'Explanation of termination reason',
                        'Appeal process for disputed terminations',
                        'Data deletion request (subject to legal holds)',
                      ].map((right, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-red-700 dark:text-red-400 transition-colors duration-300">
                            {right}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Privacy Policy Tab */}
          {activeTab === 'privacy-policy' && (
            <div className="p-8 lg:p-12">
              <h2 className="text-3xl font-bold text-[#002244] dark:text-white mb-8 text-center transition-colors duration-300">
                Privacy Policy Summary
              </h2>

              {/* Privacy Notice */}
              <div className="mb-12 bg-gradient-to-r from-[#004953] to-[#002244] rounded-xl p-8 text-white">
                <div className="flex items-center gap-4 mb-4">
                  <Lock className="w-8 h-8" />
                  <h3 className="text-2xl font-bold">Your Privacy Matters</h3>
                </div>
                <p className="text-lg mb-4">
                  We take your privacy seriously and are committed to protecting
                  your personal information. This summary explains our key
                  privacy practices in plain language.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button className="bg-[#ed5925] text-white px-6 py-2 rounded-full font-bold hover:bg-[#ed5925]/90 transition-colors duration-200 inline-flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Full Privacy Policy
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <button className="bg-[#96abdc] text-white px-6 py-2 rounded-full font-bold hover:bg-[#96abdc]/90 transition-colors duration-200 inline-flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Manage Privacy Settings
                  </button>
                </div>
              </div>

              {/* Data Collection */}
              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-4">
                      <Info className="w-8 h-8 text-[#ed5925]" />
                      <h3 className="text-2xl font-bold text-[#002244] dark:text-white transition-colors duration-300">
                        What Information We Collect
                      </h3>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {(
                        privacyHighlights[0].items as Array<{
                          dataType: string;
                          collected: string[];
                          purpose: string;
                          retention: string;
                        }>
                      ).map((item, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 dark:border-[#004953] rounded-lg p-6 transition-colors duration-300"
                        >
                          <h4 className="text-lg font-bold text-[#002244] dark:text-white mb-4 transition-colors duration-300">
                            {item.dataType}
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                              <h5 className="font-semibold text-[#ed5925] mb-2">
                                What We Collect:
                              </h5>
                              <ul className="space-y-1">
                                {item.collected.map((data, dataIndex) => (
                                  <li
                                    key={dataIndex}
                                    className="text-sm text-[#708090] dark:text-[#96abdc] transition-colors duration-300"
                                  >
                                    • {data}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h5 className="font-semibold text-[#ed5925] mb-2">
                                Why We Need It:
                              </h5>
                              <p className="text-sm text-[#708090] dark:text-[#96abdc] transition-colors duration-300">
                                {item.purpose}
                              </p>
                            </div>
                            <div>
                              <h5 className="font-semibold text-[#ed5925] mb-2">
                                How Long We Keep It:
                              </h5>
                              <p className="text-sm text-[#708090] dark:text-[#96abdc] transition-colors duration-300">
                                {item.retention}
                              </p>
                            </div>
                            <div>
                              <h5 className="font-semibold text-[#ed5925] mb-2">
                                Your Control:
                              </h5>
                              <div className="space-y-1">
                                <button className="text-xs bg-[#ed5925] text-white px-2 py-1 rounded hover:bg-[#ed5925]/90">
                                  View Data
                                </button>
                                <button className="text-xs bg-[#96abdc] text-white px-2 py-1 rounded hover:bg-[#96abdc]/90">
                                  Update Info
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Data Sharing */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-4">
                      <Users className="w-8 h-8 text-[#ed5925]" />
                      <h3 className="text-2xl font-bold text-[#002244] dark:text-white transition-colors duration-300">
                        Who We Share Information With
                      </h3>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {(
                        privacyHighlights[1].items as Array<{
                          recipient: string;
                          dataShared: string;
                          reason: string;
                          protections: string;
                        }>
                      ).map((sharing, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 dark:border-[#004953] rounded-lg p-6 transition-colors duration-300"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-bold text-[#002244] dark:text-white transition-colors duration-300">
                              {sharing.recipient}
                            </h4>
                            <span className="bg-[#ed5925] bg-opacity-10 text-[#ed5925] px-3 py-1 rounded-full text-xs font-bold">
                              Third Party
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <h5 className="font-semibold text-[#002244] dark:text-white mb-2 transition-colors duration-300">
                                Data Shared:
                              </h5>
                              <p className="text-sm text-[#708090] dark:text-[#96abdc] transition-colors duration-300">
                                {sharing.dataShared}
                              </p>
                            </div>
                            <div>
                              <h5 className="font-semibold text-[#002244] dark:text-white mb-2 transition-colors duration-300">
                                Reason:
                              </h5>
                              <p className="text-sm text-[#708090] dark:text-[#96abdc] transition-colors duration-300">
                                {sharing.reason}
                              </p>
                            </div>
                            <div>
                              <h5 className="font-semibold text-[#002244] dark:text-white mb-2 transition-colors duration-300">
                                Protections:
                              </h5>
                              <p className="text-sm text-[#708090] dark:text-[#96abdc] transition-colors duration-300">
                                {sharing.protections}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* User Rights */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-4">
                      <Eye className="w-8 h-8 text-[#ed5925]" />
                      <h3 className="text-2xl font-bold text-[#002244] dark:text-white transition-colors duration-300">
                        Your Privacy Rights & Controls
                      </h3>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {(
                        privacyHighlights[2].rights as Array<{
                          right: string;
                          description: string;
                          howTo: string;
                          timeframe: string;
                        }>
                      ).map((right, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-4 p-4 border border-gray-200 dark:border-[#004953] rounded-lg transition-colors duration-300"
                        >
                          <div className="bg-[#ed5925] w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                            <Eye className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-[#002244] dark:text-white mb-2 transition-colors duration-300">
                              {right.right}
                            </h4>
                            <p className="text-[#708090] dark:text-[#96abdc] mb-3 transition-colors duration-300">
                              {right.description}
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-semibold text-[#002244] dark:text-white transition-colors duration-300">
                                  How to use:
                                </span>
                                <span className="text-[#708090] dark:text-[#96abdc] transition-colors duration-300">
                                  {right.howTo}
                                </span>
                              </div>
                              <div>
                                <span className="font-semibold text-[#002244] dark:text-white transition-colors duration-300">
                                  Response time:
                                </span>
                                <span className="text-[#708090] dark:text-[#96abdc] transition-colors duration-300">
                                  {right.timeframe}
                                </span>
                              </div>
                            </div>
                          </div>
                          <button className="bg-[#ed5925] text-white px-4 py-2 rounded-lg hover:bg-[#ed5925]/90 transition-colors duration-200 flex-shrink-0">
                            Exercise Right
                          </button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Geographic Rules Tab */}
          {activeTab === 'geographic-rules' && (
            <div className="p-8 lg:p-12">
              <h2 className="text-3xl font-bold text-[#002244] dark:text-white mb-8 text-center transition-colors duration-300">
                Geographic Rules & Restrictions
              </h2>

              <div className="space-y-8">
                {geographicRules.map((status, statusIndex) => (
                  <Card key={statusIndex}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-4">
                        <status.icon
                          className={`w-8 h-8 ${
                            status.color === 'green'
                              ? 'text-green-600'
                              : status.color === 'yellow'
                                ? 'text-yellow-600'
                                : 'text-red-600'
                          }`}
                        />
                        <h3 className="text-2xl font-bold text-[#002244] dark:text-white transition-colors duration-300">
                          {status.status}
                        </h3>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {status.regions && (
                        <div className="space-y-6">
                          {status.regions.map((region, regionIndex) => (
                            <div
                              key={regionIndex}
                              className="border border-gray-200 dark:border-[#004953] rounded-lg p-6 transition-colors duration-300"
                            >
                              <h4 className="text-xl font-bold text-[#002244] dark:text-white mb-3 transition-colors duration-300">
                                {region.name}
                              </h4>
                              <p className="text-[#708090] dark:text-[#96abdc] mb-4 transition-colors duration-300">
                                {region.details}
                              </p>

                              {'restrictions' in region &&
                                region.restrictions && (
                                  <div className="mb-4">
                                    <h5 className="font-semibold text-yellow-600 mb-2">
                                      Restrictions:
                                    </h5>
                                    <ul className="space-y-1">
                                      {region.restrictions.map(
                                        (restriction, index) => (
                                          <li
                                            key={index}
                                            className="flex items-start gap-2"
                                          >
                                            <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                            <span className="text-sm text-[#708090] dark:text-[#96abdc] transition-colors duration-300">
                                              {restriction}
                                            </span>
                                          </li>
                                        ),
                                      )}
                                    </ul>
                                  </div>
                                )}

                              {'requirements' in region &&
                                region.requirements && (
                                  <div>
                                    <h5 className="font-semibold text-[#ed5925] mb-2">
                                      Requirements:
                                    </h5>
                                    <ul className="space-y-1">
                                      {region.requirements.map(
                                        (requirement, index) => (
                                          <li
                                            key={index}
                                            className="flex items-start gap-2"
                                          >
                                            <CheckCircle className="w-4 h-4 text-[#ed5925] mt-0.5 flex-shrink-0" />
                                            <span className="text-sm text-[#708090] dark:text-[#96abdc] transition-colors duration-300">
                                              {requirement}
                                            </span>
                                          </li>
                                        ),
                                      )}
                                    </ul>
                                  </div>
                                )}

                              {'countries' in region && region.countries && (
                                <div>
                                  <h5 className="font-semibold text-red-600 mb-2">
                                    Affected Countries:
                                  </h5>
                                  <div className="flex flex-wrap gap-2 mb-3">
                                    {region.countries.map((country, index) => (
                                      <span
                                        key={index}
                                        className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300 px-2 py-1 rounded text-xs"
                                      >
                                        {country}
                                      </span>
                                    ))}
                                  </div>
                                  <p className="text-sm text-[#708090] dark:text-[#96abdc] transition-colors duration-300">
                                    <strong>Reason:</strong> {region.reason}
                                  </p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* VPN Warning */}
              <div className="mt-12 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800/30 rounded-xl p-8 transition-colors duration-300">
                <h3 className="text-2xl font-bold text-yellow-800 dark:text-yellow-300 mb-6 transition-colors duration-300">
                  <Globe className="w-8 h-8 inline-block mr-2" />
                  VPN & Location Services Notice
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-yellow-700 dark:text-yellow-400 mb-3 transition-colors duration-300">
                      VPN Usage Policy:
                    </h4>
                    <ul className="space-y-2">
                      {[
                        'VPNs are prohibited during gameplay',
                        'Location verification required for all accounts',
                        'VPN detection may trigger account review',
                        'Use may violate licensing agreements',
                        'Contact support before traveling',
                      ].map((policy, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-yellow-700 dark:text-yellow-400 transition-colors duration-300">
                            {policy}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-yellow-700 dark:text-yellow-400 mb-3 transition-colors duration-300">
                      What We Track:
                    </h4>
                    <ul className="space-y-2">
                      {[
                        'IP address geolocation',
                        'Device GPS coordinates (if enabled)',
                        'Time zone and language settings',
                        'Network characteristics',
                        'Login patterns and locations',
                      ].map((tracking, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Info className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-yellow-700 dark:text-yellow-400 transition-colors duration-300">
                            {tracking}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Dispute Resolution Tab */}
          {activeTab === 'dispute-resolution' && (
            <div className="p-8 lg:p-12">
              <h2 className="text-3xl font-bold text-[#002244] dark:text-white mb-8 text-center transition-colors duration-300">
                Dispute Resolution Process
              </h2>

              {/* Process Overview */}
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-[#002244] dark:text-white mb-6 transition-colors duration-300">
                  How Disputes Are Resolved
                </h3>
                <div className="space-y-8">
                  {disputeProcess.map((step, index) => (
                    <div key={index} className="flex gap-6">
                      <div className="flex-shrink-0">
                        <div className="bg-gradient-to-r from-[#ed5925] to-[#96abdc] w-16 h-16 rounded-full flex items-center justify-center">
                          <step.icon className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="bg-white dark:bg-[#1a1a2e] rounded-lg p-6 border border-gray-200 dark:border-[#004953] transition-colors duration-300">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-xl font-bold text-[#002244] dark:text-white transition-colors duration-300">
                              Step {step.step}: {step.title}
                            </h4>
                            <span className="bg-[#ed5925] text-white px-3 py-1 rounded-full text-sm font-bold">
                              {step.timeframe}
                            </span>
                          </div>
                          <p className="text-[#708090] dark:text-[#96abdc] mb-4 transition-colors duration-300">
                            {step.description}
                          </p>
                          <div className="mb-4">
                            <h5 className="font-semibold text-[#002244] dark:text-white mb-2 transition-colors duration-300">
                              Process:
                            </h5>
                            <ol className="space-y-2">
                              {step.process.map((process, processIndex) => (
                                <li
                                  key={processIndex}
                                  className="flex items-start gap-2"
                                >
                                  <span className="bg-[#ed5925] text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">
                                    {processIndex + 1}
                                  </span>
                                  <span className="text-sm text-[#708090] dark:text-[#96abdc] transition-colors duration-300">
                                    {process}
                                  </span>
                                </li>
                              ))}
                            </ol>
                          </div>
                          <div className="bg-[#faf9f5] dark:bg-[#1a1a2e] rounded-lg p-4 transition-colors duration-300">
                            <p className="text-sm text-[#708090] dark:text-[#96abdc] transition-colors duration-300">
                              <strong>Next Step:</strong> {step.escalation}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Legal Contacts */}
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-[#002244] dark:text-white mb-6 transition-colors duration-300">
                  Legal Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {legalContacts.map((contact, index) => (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <h4 className="font-bold text-[#002244] dark:text-white mb-2 transition-colors duration-300">
                          {contact.type}
                        </h4>
                        <div className="flex items-center gap-2 mb-3">
                          <Mail className="w-4 h-4 text-[#ed5925]" />
                          <a
                            href={`mailto:${contact.email}`}
                            className="text-[#ed5925] hover:underline"
                          >
                            {contact.email}
                          </a>
                        </div>
                        <p className="text-sm text-[#708090] dark:text-[#96abdc] mb-2 transition-colors duration-300">
                          {contact.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[#96abdc]" />
                          <span className="text-xs text-[#96abdc]">
                            Response: {contact.responseTime}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Arbitration Details */}
              <div className="bg-[#faf9f5] dark:bg-[#1a1a2e] rounded-xl p-8 transition-colors duration-300">
                <h3 className="text-2xl font-bold text-[#002244] dark:text-white mb-6 transition-colors duration-300">
                  <Scale className="w-8 h-8 inline-block mr-2 text-[#ed5925]" />
                  Arbitration Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-[#002244] dark:text-white mb-3 transition-colors duration-300">
                      What is Arbitration?
                    </h4>
                    <p className="text-[#708090] dark:text-[#96abdc] mb-4 transition-colors duration-300">
                      Arbitration is a legal process where a neutral third party
                      (arbitrator) makes a binding decision about your dispute.
                      It's typically faster and less expensive than going to
                      court.
                    </p>
                    <h4 className="font-semibold text-[#002244] dark:text-white mb-3 transition-colors duration-300">
                      Our Arbitration Service:
                    </h4>
                    <ul className="space-y-2">
                      {[
                        'American Arbitration Association (AAA)',
                        'Online dispute resolution available',
                        'Arbitrator chosen from gaming law experts',
                        'Decisions final and binding',
                        'Faster than traditional litigation',
                      ].map((detail, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-[#ed5925] mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-[#708090] dark:text-[#96abdc] transition-colors duration-300">
                            {detail}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#002244] dark:text-white mb-3 transition-colors duration-300">
                      Costs & Fees:
                    </h4>
                    <div className="space-y-3">
                      <div className="bg-white dark:bg-[#002244] rounded-lg p-4 border border-gray-200 dark:border-[#004953] transition-colors duration-300">
                        <h5 className="font-semibold text-[#ed5925] mb-1">
                          Filing Fee:
                        </h5>
                        <p className="text-sm text-[#708090] dark:text-[#96abdc] transition-colors duration-300">
                          $200-$500 depending on claim amount
                        </p>
                      </div>
                      <div className="bg-white dark:bg-[#002244] rounded-lg p-4 border border-gray-200 dark:border-[#004953] transition-colors duration-300">
                        <h5 className="font-semibold text-[#ed5925] mb-1">
                          Arbitrator Fee:
                        </h5>
                        <p className="text-sm text-[#708090] dark:text-[#96abdc] transition-colors duration-300">
                          Split between parties (typically $1,000-$3,000 total)
                        </p>
                      </div>
                      <div className="bg-white dark:bg-[#002244] rounded-lg p-4 border border-gray-200 dark:border-[#004953] transition-colors duration-300">
                        <h5 className="font-semibold text-[#ed5925] mb-1">
                          Fee Refund:
                        </h5>
                        <p className="text-sm text-[#708090] dark:text-[#96abdc] transition-colors duration-300">
                          If you win, we may reimburse arbitration costs
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Compliance Programs */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-[#002244] dark:text-white mb-8 text-center transition-colors duration-300">
            Our Compliance Programs
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {compliancePrograms.map((program, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="mx-auto mb-4">
                    <div className="bg-gradient-to-r from-[#ed5925] to-[#96abdc] w-16 h-16 rounded-full flex items-center justify-center">
                      <program.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-center text-[#002244] dark:text-white transition-colors duration-300">
                    {program.program}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[#708090] dark:text-[#96abdc] text-center mb-4 transition-colors duration-300">
                    {program.description}
                  </p>
                  <ul className="space-y-2">
                    {program.measures.map((measure, measureIndex) => (
                      <li key={measureIndex} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-[#ed5925] mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-[#708090] dark:text-[#96abdc] transition-colors duration-300">
                          {measure}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-[#002244] dark:text-white mb-4 transition-colors duration-300">
            Need Legal Help?
          </h3>
          <p className="text-[#708090] dark:text-[#96abdc] mb-8 transition-colors duration-300">
            Our legal team is here to help answer your questions and resolve any
            concerns.
          </p>
          <div className="flex justify-center gap-4">
            <button className="bg-gradient-to-r from-[#ed5925] to-[#96abdc] text-white px-8 py-3 rounded-full font-bold hover:shadow-lg transition-all duration-200 inline-flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Contact Legal Team
            </button>
            <button className="bg-white dark:bg-[#002244] text-[#002244] dark:text-white px-8 py-3 rounded-full font-bold border border-gray-200 dark:border-[#004953] hover:bg-gray-50 dark:hover:bg-[#004953] transition-colors duration-200 inline-flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Download Terms PDF
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default LegalComplianceContent;
