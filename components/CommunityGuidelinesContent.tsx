'use client';

import React, { useState } from 'react';
import {
  Shield,
  Users,
  AlertTriangle,
  Heart,
  MessageSquare,
  Flag,
  Eye,
  Scale,
  Lightbulb,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
} from 'lucide-react';

export default function CommunityGuidelinesContent() {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const communityValues = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: 'Respect & Inclusivity',
      description:
        'Treat all community members with dignity and respect, regardless of background or experience level.',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Fair Play',
      description:
        'Maintain integrity in all games and interactions. No cheating, exploitation, or unfair advantages.',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Supportive Community',
      description:
        'Help newcomers learn, celebrate successes together, and create a welcoming environment for all.',
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: 'Constructive Communication',
      description:
        'Share knowledge, provide helpful feedback, and engage in meaningful discussions.',
    },
  ];

  const conductRules = [
    {
      category: 'Respectful Communication',
      icon: <MessageSquare className="w-5 h-5" />,
      rules: [
        'Use appropriate language and maintain a professional tone',
        'No harassment, bullying, or personal attacks',
        'Respect different opinions and engage in civil discourse',
        'Avoid excessive use of caps (shouting) or spam messages',
        'No discrimination based on race, gender, religion, or other protected characteristics',
      ],
      examples: {
        good: [
          'Great strategy! I never thought of that approach.',
          'I disagree with this approach, but here&apos;s why...',
          'Welcome to the community! Happy to help you get started.',
        ],
        bad: [
          'That&apos;s the dumbest thing I&apos;ve ever heard',
          'You&apos;re obviously new here and don&apos;t know anything',
          'STOP BEING SO STUPID!!!',
        ],
      },
    },
    {
      category: 'Content Guidelines',
      icon: <Eye className="w-5 h-5" />,
      rules: [
        'Keep content relevant to Football Squares and related topics',
        'No explicit, offensive, or inappropriate material',
        'Respect intellectual property and don&apos;t share copyrighted content',
        'No spam, self-promotion, or commercial advertising without permission',
        'Use spoiler tags for major game results in discussion threads',
      ],
      examples: {
        good: [
          'Here&apos;s a strategy that worked well for me last season',
          'Check out this interesting article about square probability',
          'Congratulations to all the winners in last night&apos;s game!',
        ],
        bad: [
          'Buy my gambling system for guaranteed wins!',
          'Click here for hot singles in your area',
          'The game ended 21-14 (posted immediately after without spoiler warning)',
        ],
      },
    },
  ];

  const prohibitedActivities = [
    {
      category: 'Cheating & Exploitation',
      severity: 'High',
      activities: [
        'Using bots or automated scripts',
        'Creating multiple accounts for unfair advantage',
        'Exploiting bugs or glitches for personal gain',
        'Sharing account credentials or allowing account access',
        'Manipulating game outcomes or results',
      ],
      consequences: 'Immediate account suspension or permanent ban',
    },
    {
      category: 'Harmful Behavior',
      severity: 'High',
      activities: [
        'Threatening or intimidating other users',
        'Doxxing or sharing personal information without consent',
        'Impersonating staff members or other users',
        'Encouraging self-harm or dangerous activities',
        'Scamming or fraudulent activities',
      ],
      consequences: 'Immediate account suspension and potential legal action',
    },
    {
      category: 'Disruptive Conduct',
      severity: 'Medium',
      activities: [
        'Excessive trolling or inflammatory posts',
        'Coordinated harassment campaigns',
        'Deliberate spreading of misinformation',
        'Circumventing moderation actions',
        'Disrupting organized community events',
      ],
      consequences: 'Warning, temporary suspension, or permanent restrictions',
    },
  ];

  const reportingProcess = [
    {
      step: 1,
      title: 'Identify the Issue',
      description: 'Determine what type of violation has occurred',
      details: [
        'Screenshot or document the problematic content/behavior',
        'Note the username, time, and location of the incident',
        'Gather any relevant context or additional evidence',
        'Determine the severity and urgency of the issue',
      ],
    },
    {
      step: 2,
      title: 'Submit Report',
      description: 'Use the appropriate reporting channel',
      details: [
        'In-platform: Use the &apos;Report&apos; button on posts or profiles',
        'Email: Send detailed report to moderation@footballsquares.com',
        'Emergency: For immediate threats, contact support immediately',
        'Include all gathered evidence and clear description of violation',
      ],
    },
    {
      step: 3,
      title: 'Investigation',
      description: 'Our moderation team reviews the report',
      details: [
        'Initial review within 24 hours for standard reports',
        'Priority review within 2 hours for urgent/safety issues',
        'Temporary actions may be taken to prevent further harm',
        'Additional evidence may be requested if needed',
      ],
    },
    {
      step: 4,
      title: 'Resolution',
      description: 'Appropriate action is taken based on findings',
      details: [
        'Reporter receives confirmation when case is resolved',
        'Violator is notified of any actions taken against their account',
        'Appeals process is available for disputed decisions',
        'Follow-up monitoring may be implemented',
      ],
    },
  ];

  const moderationActions = [
    {
      action: 'Warning',
      description: 'Official notice of guideline violation',
      duration: 'Permanent record',
      triggers: 'Minor violations, first-time offenses',
      appeal: 'Available within 7 days',
    },
    {
      action: 'Content Removal',
      description: 'Specific posts or comments deleted',
      duration: 'Immediate and permanent',
      triggers: 'Policy-violating content',
      appeal: 'Available within 14 days',
    },
    {
      action: 'Temporary Restriction',
      description: 'Limited access to certain features',
      duration: '1-30 days depending on severity',
      triggers: 'Repeated violations, disruptive behavior',
      appeal: 'Available within 7 days',
    },
    {
      action: 'Account Suspension',
      description: 'Complete access revoked temporarily',
      duration: '1-90 days depending on violation',
      triggers: 'Serious violations, pattern of misconduct',
      appeal: 'Available within 14 days',
    },
    {
      action: 'Permanent Ban',
      description: 'Permanent account termination',
      duration: 'Permanent',
      triggers: 'Severe violations, repeat offenders',
      appeal: 'Available within 30 days with exceptional circumstances only',
    },
  ];

  const safetyTips = [
    {
      category: 'Personal Information',
      tips: [
        'Never share personal details like full name, address, or phone number',
        'Use a unique username that doesn&apos;t reveal your identity',
        'Be cautious about sharing photos that could identify you or your location',
        'Keep financial information private and secure',
      ],
    },
    {
      category: 'Online Interactions',
      tips: [
        'Be skeptical of users asking for personal information or meetings',
        'Report any inappropriate private messages immediately',
        'Don&apos;t click suspicious links or download files from unknown users',
        'Trust your instincts - if something feels wrong, report it',
      ],
    },
    {
      category: 'Account Security',
      tips: [
        'Use a strong, unique password for your account',
        'Enable two-factor authentication if available',
        'Log out from shared or public computers',
        'Never share your login credentials with others',
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
                <Users className="w-12 h-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Community Guidelines
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
              Building a respectful, inclusive, and enjoyable community for all
              Football Squares enthusiasts
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {communityValues.map((value, index) => (
                <div
                  key={index}
                  className="bg-white bg-opacity-10 p-4 rounded-lg backdrop-blur-sm"
                >
                  <div className="text-[#ed5925] mb-2">{value.icon}</div>
                  <h3 className="font-bold mb-2">{value.title}</h3>
                  <p className="text-sm text-blue-100">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-[#001a1a] border-b border-gray-200 dark:border-[#004953] sticky top-0 z-50 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-1 py-4">
            {[
              {
                id: 'overview',
                label: 'Overview',
                icon: <Eye className="w-4 h-4" />,
              },
              {
                id: 'conduct',
                label: 'Code of Conduct',
                icon: <Shield className="w-4 h-4" />,
              },
              {
                id: 'prohibited',
                label: 'Prohibited Activities',
                icon: <XCircle className="w-4 h-4" />,
              },
              {
                id: 'reporting',
                label: 'Reporting',
                icon: <Flag className="w-4 h-4" />,
              },
              {
                id: 'moderation',
                label: 'Moderation',
                icon: <Scale className="w-4 h-4" />,
              },
              {
                id: 'safety',
                label: 'Safety Tips',
                icon: <AlertTriangle className="w-4 h-4" />,
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
            <div className="space-y-12">
              <div className="bg-white dark:bg-[#001a1a] rounded-xl shadow-xl p-8 border border-gray-200 dark:border-[#004953] transition-colors duration-300">
                <h2 className="text-3xl font-bold text-[#002244] dark:text-white mb-6 transition-colors duration-300">
                  Welcome to Our Community
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <p className="text-[#708090] dark:text-[#96abdc] text-lg leading-relaxed mb-6 transition-colors duration-300">
                      Football Squares is more than just a platform - it&apos;s
                      a community of passionate football fans who come together
                      to enjoy the game, share strategies, and build lasting
                      connections.
                    </p>
                    <h3 className="text-xl font-bold text-[#002244] dark:text-white mb-4 transition-colors duration-300">
                      Our Mission
                    </h3>
                    <p className="text-[#708090] dark:text-[#96abdc] leading-relaxed transition-colors duration-300">
                      To create a safe, inclusive, and enjoyable environment
                      where football enthusiasts can engage in fair competition,
                      share knowledge, and celebrate the sport we all love.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-[#001a1a] rounded-xl shadow-xl p-6 border border-gray-200 dark:border-[#004953] transition-colors duration-300">
                  <h3 className="text-xl font-bold text-[#002244] dark:text-white mb-4 flex items-center gap-2 transition-colors duration-300">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    What We Encourage
                  </h3>
                  <ul className="space-y-2">
                    {[
                      'Helping newcomers learn the game',
                      'Sharing strategies and tips',
                      'Celebrating wins and supporting losses',
                      'Constructive feedback and discussions',
                      'Reporting issues to keep community safe',
                    ].map((item, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-[#708090] dark:text-[#96abdc] transition-colors duration-300"
                      >
                        <ArrowRight className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white dark:bg-[#001a1a] rounded-xl shadow-xl p-6 border border-gray-200 dark:border-[#004953] transition-colors duration-300">
                  <h3 className="text-xl font-bold text-[#002244] dark:text-white mb-4 flex items-center gap-2 transition-colors duration-300">
                    <XCircle className="w-5 h-5 text-red-500" />
                    What We Don't Allow
                  </h3>
                  <ul className="space-y-2">
                    {[
                      'Harassment or bullying of any kind',
                      'Cheating or exploitation of game mechanics',
                      'Spam or excessive self-promotion',
                      'Sharing personal information',
                      'Toxic behavior or unsportsmanlike conduct',
                    ].map((item, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-[#708090] dark:text-[#96abdc] transition-colors duration-300"
                      >
                        <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Code of Conduct Section */}
          {activeTab === 'conduct' && (
            <div className="space-y-8">
              <div className="bg-white dark:bg-[#001a1a] rounded-xl shadow-xl p-8 border border-gray-200 dark:border-[#004953] transition-colors duration-300">
                <h2 className="text-3xl font-bold text-[#002244] dark:text-white mb-6 flex items-center gap-3 transition-colors duration-300">
                  <Shield className="w-8 h-8 text-[#ed5925]" />
                  Code of Conduct
                </h2>
                <p className="text-[#708090] dark:text-[#96abdc] text-lg mb-8 transition-colors duration-300">
                  Our code of conduct establishes the foundation for respectful
                  and positive interactions within our community.
                </p>

                <div className="space-y-8">
                  {conductRules.map((section, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 dark:border-[#004953] rounded-lg transition-colors duration-300"
                    >
                      <button
                        onClick={() => toggleSection(`conduct-${index}`)}
                        className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 dark:hover:bg-[#002244] transition-colors duration-300"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-[#ed5925]">{section.icon}</div>
                          <h3 className="text-xl font-bold text-[#002244] dark:text-white transition-colors duration-300">
                            {section.category}
                          </h3>
                        </div>
                        <ArrowRight
                          className={`w-5 h-5 text-[#708090] transform transition-transform duration-300 ${
                            expandedSection === `conduct-${index}`
                              ? 'rotate-90'
                              : ''
                          }`}
                        />
                      </button>

                      {expandedSection === `conduct-${index}` && (
                        <div className="px-6 pb-6">
                          <div className="mb-6">
                            <h4 className="font-semibold text-[#002244] dark:text-white mb-3 transition-colors duration-300">
                              Rules:
                            </h4>
                            <ul className="space-y-2">
                              {section.rules.map((rule, ruleIndex) => (
                                <li
                                  key={ruleIndex}
                                  className="flex items-start gap-2 text-[#708090] dark:text-[#96abdc] transition-colors duration-300"
                                >
                                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                  {rule}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                              <h5 className="font-semibold text-green-800 dark:text-green-400 mb-2">
                                ✅ Good Examples:
                              </h5>
                              <ul className="space-y-2">
                                {section.examples.good.map(
                                  (example, exampleIndex) => (
                                    <li
                                      key={exampleIndex}
                                      className="text-sm text-green-700 dark:text-green-300 italic"
                                    >
                                      "{example}"
                                    </li>
                                  ),
                                )}
                              </ul>
                            </div>

                            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                              <h5 className="font-semibold text-red-800 dark:text-red-400 mb-2">
                                ❌ Bad Examples:
                              </h5>
                              <ul className="space-y-2">
                                {section.examples.bad.map(
                                  (example, exampleIndex) => (
                                    <li
                                      key={exampleIndex}
                                      className="text-sm text-red-700 dark:text-red-300 italic"
                                    >
                                      "{example}"
                                    </li>
                                  ),
                                )}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Prohibited Activities Section */}
          {activeTab === 'prohibited' && (
            <div className="space-y-8">
              <div className="bg-white dark:bg-[#001a1a] rounded-xl shadow-xl p-8 border border-gray-200 dark:border-[#004953] transition-colors duration-300">
                <h2 className="text-3xl font-bold text-[#002244] dark:text-white mb-6 flex items-center gap-3 transition-colors duration-300">
                  <XCircle className="w-8 h-8 text-red-500" />
                  Prohibited Activities
                </h2>
                <p className="text-[#708090] dark:text-[#96abdc] text-lg mb-8 transition-colors duration-300">
                  The following activities are strictly prohibited and will
                  result in immediate action against your account.
                </p>

                <div className="space-y-6">
                  {prohibitedActivities.map((category, index) => (
                    <div
                      key={index}
                      className="border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20 p-6 rounded-r-lg"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-red-800 dark:text-red-300">
                          {category.category}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            category.severity === 'High'
                              ? 'bg-red-500 text-white'
                              : 'bg-orange-500 text-white'
                          }`}
                        >
                          {category.severity} Risk
                        </span>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2">
                          Prohibited Activities:
                        </h4>
                        <ul className="space-y-2">
                          {category.activities.map(
                            (activity, activityIndex) => (
                              <li
                                key={activityIndex}
                                className="flex items-start gap-2 text-red-700 dark:text-red-300"
                              >
                                <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                {activity}
                              </li>
                            ),
                          )}
                        </ul>
                      </div>

                      <div className="bg-red-100 dark:bg-red-900/40 p-3 rounded-lg">
                        <h5 className="font-semibold text-red-800 dark:text-red-300 mb-1">
                          Consequences:
                        </h5>
                        <p className="text-red-700 dark:text-red-300 text-sm">
                          {category.consequences}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-6 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-yellow-800 dark:text-yellow-300 mb-2">
                        Important Notice
                      </h3>
                      <p className="text-yellow-700 dark:text-yellow-300">
                        Violating these guidelines can result in permanent
                        account termination and may be reported to appropriate
                        authorities when illegal activities are involved. We
                        maintain zero tolerance for activities that harm our
                        community or violate applicable laws.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reporting Section */}
          {activeTab === 'reporting' && (
            <div className="space-y-8">
              <div className="bg-white dark:bg-[#001a1a] rounded-xl shadow-xl p-8 border border-gray-200 dark:border-[#004953] transition-colors duration-300">
                <h2 className="text-3xl font-bold text-[#002244] dark:text-white mb-6 flex items-center gap-3 transition-colors duration-300">
                  <Flag className="w-8 h-8 text-[#ed5925]" />
                  Reporting Process
                </h2>
                <p className="text-[#708090] dark:text-[#96abdc] text-lg mb-8 transition-colors duration-300">
                  Help us maintain a safe community by reporting violations
                  quickly and effectively.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {reportingProcess.map((step, index) => (
                    <div key={index} className="relative">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-[#ed5925] text-white rounded-full flex items-center justify-center font-bold">
                            {step.step}
                          </div>
                          {index < reportingProcess.length - 1 && (
                            <div className="w-px h-16 bg-gray-200 dark:bg-[#004953] mt-4 ml-5 lg:hidden"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-[#002244] dark:text-white mb-2 transition-colors duration-300">
                            {step.title}
                          </h3>
                          <p className="text-[#708090] dark:text-[#96abdc] mb-4 transition-colors duration-300">
                            {step.description}
                          </p>
                          <ul className="space-y-2">
                            {step.details.map((detail, detailIndex) => (
                              <li
                                key={detailIndex}
                                className="flex items-start gap-2 text-sm text-[#708090] dark:text-[#96abdc] transition-colors duration-300"
                              >
                                <ArrowRight className="w-3 h-3 text-[#ed5925] mt-1 flex-shrink-0" />
                                {detail}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-[#ed5925] to-[#ed5925]/80 p-6 rounded-lg text-white">
                  <h3 className="text-xl font-bold mb-4">
                    Emergency Reporting
                  </h3>
                  <p className="mb-4">
                    For immediate threats, harassment, or urgent safety
                    concerns, contact us immediately:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <strong>Emergency Email:</strong>
                      <br />
                      emergency@footballsquares.com
                    </div>
                    <div>
                      <strong>24/7 Support:</strong>
                      <br />
                      Live chat available
                    </div>
                    <div>
                      <strong>Response Time:</strong>
                      <br />
                      Within 30 minutes
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Moderation Section */}
          {activeTab === 'moderation' && (
            <div className="space-y-8">
              <div className="bg-white dark:bg-[#001a1a] rounded-xl shadow-xl p-8 border border-gray-200 dark:border-[#004953] transition-colors duration-300">
                <h2 className="text-3xl font-bold text-[#002244] dark:text-white mb-6 flex items-center gap-3 transition-colors duration-300">
                  <Scale className="w-8 h-8 text-[#ed5925]" />
                  Moderation Actions
                </h2>
                <p className="text-[#708090] dark:text-[#96abdc] text-lg mb-8 transition-colors duration-300">
                  Understanding our moderation process and the actions we may
                  take to maintain community standards.
                </p>

                <div className="space-y-6">
                  {moderationActions.map((action, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 dark:border-[#004953] rounded-lg p-6 transition-colors duration-300"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-[#002244] dark:text-white transition-colors duration-300">
                          {action.action}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            action.action === 'Warning'
                              ? 'bg-yellow-500 text-white'
                              : action.action === 'Content Removal'
                                ? 'bg-orange-500 text-white'
                                : action.action === 'Temporary Restriction'
                                  ? 'bg-blue-500 text-white'
                                  : action.action === 'Account Suspension'
                                    ? 'bg-red-500 text-white'
                                    : 'bg-black text-white'
                          }`}
                        >
                          {action.duration}
                        </span>
                      </div>

                      <p className="text-[#708090] dark:text-[#96abdc] mb-4 transition-colors duration-300">
                        {action.description}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-[#002244] dark:text-white mb-2 transition-colors duration-300">
                            Common Triggers:
                          </h4>
                          <p className="text-sm text-[#708090] dark:text-[#96abdc] transition-colors duration-300">
                            {action.triggers}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#002244] dark:text-white mb-2 transition-colors duration-300">
                            Appeal Process:
                          </h4>
                          <p className="text-sm text-[#708090] dark:text-[#96abdc] transition-colors duration-300">
                            {action.appeal}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-6 rounded-lg">
                  <h3 className="font-bold text-blue-800 dark:text-blue-300 mb-4">
                    Appeals Process
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                        How to Appeal:
                      </h4>
                      <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                        <li>• Email appeals@footballsquares.com</li>
                        <li>• Include your username and case reference</li>
                        <li>• Provide clear explanation of your position</li>
                        <li>• Submit any additional evidence</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                        Review Process:
                      </h4>
                      <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                        <li>• Independent review by senior moderators</li>
                        <li>• Response within 3-5 business days</li>
                        <li>• Decision communicated with reasoning</li>
                        <li>• Final decisions are binding</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Safety Tips Section */}
          {activeTab === 'safety' && (
            <div className="space-y-8">
              <div className="bg-white dark:bg-[#001a1a] rounded-xl shadow-xl p-8 border border-gray-200 dark:border-[#004953] transition-colors duration-300">
                <h2 className="text-3xl font-bold text-[#002244] dark:text-white mb-6 flex items-center gap-3 transition-colors duration-300">
                  <AlertTriangle className="w-8 h-8 text-[#ed5925]" />
                  Safety & Security Tips
                </h2>
                <p className="text-[#708090] dark:text-[#96abdc] text-lg mb-8 transition-colors duration-300">
                  Protect yourself and others by following these essential
                  safety guidelines.
                </p>

                <div className="space-y-8">
                  {safetyTips.map((section, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800"
                    >
                      <h3 className="text-xl font-bold text-green-800 dark:text-green-300 mb-4">
                        {section.category}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {section.tips.map((tip, tipIndex) => (
                          <div
                            key={tipIndex}
                            className="flex items-start gap-3 bg-white dark:bg-[#001a1a] p-4 rounded-lg"
                          >
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
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
                      <h3 className="font-bold text-red-800 dark:text-red-300 mb-4">
                        Red Flags - Report Immediately
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ul className="space-y-2">
                          <li className="text-red-700 dark:text-red-300 text-sm">
                            • Users asking for personal information
                          </li>
                          <li className="text-red-700 dark:text-red-300 text-sm">
                            • Requests to move conversations off-platform
                          </li>
                          <li className="text-red-700 dark:text-red-300 text-sm">
                            • Offers that seem too good to be true
                          </li>
                        </ul>
                        <ul className="space-y-2">
                          <li className="text-red-700 dark:text-red-300 text-sm">
                            • Aggressive or threatening behavior
                          </li>
                          <li className="text-red-700 dark:text-red-300 text-sm">
                            • Suspicious links or file requests
                          </li>
                          <li className="text-red-700 dark:text-red-300 text-sm">
                            • Attempts to bypass security measures
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
