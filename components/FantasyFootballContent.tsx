'use client';

import { useState } from 'react';
import {
  Trophy,
  Users,
  Target,
  Calendar,
  TrendingUp,
  Star,
  CheckCircle,
  ArrowRight,
  Play,
  BarChart3,
  Zap,
  Shield,
  Clock,
  DollarSign,
  Award,
  Gamepad2,
  RefreshCw,
  LineChart,
  UserPlus,
  Shuffle,
  Timer,
  Crown,
  Medal,
  Flame,
  ExternalLink,
} from 'lucide-react';

const FantasyFootballContent = () => {
  const [activeTab, setActiveTab] = useState('basics');

  const tabs = [
    { id: 'basics', label: 'The Basics', icon: Trophy },
    { id: 'platforms', label: 'Platform Guide', icon: Users },
    { id: 'scoring', label: 'Scoring & Strategy', icon: Target },
    { id: 'getting-started', label: 'Getting Started', icon: Play },
  ];

  const platforms = [
    {
      id: 'espn',
      name: 'ESPN Fantasy',
      logo: '🏈',
      color: 'from-red-600 to-red-800',
      url: 'https://www.espn.com/fantasy/football/',
      buttonText: 'Go For It',
      strengths:
        'Huge public-league pool, robust mobile app, free advanced live scoring (FantasyCast)',
      unique:
        'Salary-cap (FAB) waivers; in-app player video highlights; lineup-optimizer prompts after injury alerts',
      bestFor: 'Largest public leagues / mainstream feel',
      features: [
        'FantasyCast live scoring',
        'Video highlights integration',
        'Injury alert optimizer',
        'Large public league pool',
      ],
    },
    {
      id: 'nfl',
      name: 'NFL Fantasy',
      logo: '🏆',
      color: 'from-blue-600 to-blue-800',
      url: 'https://fantasy.nfl.com/',
      buttonText: 'Blitz',
      strengths:
        'Official league flavor with exclusive video highlights and Next Gen Stats overlays',
      unique:
        'The mobile app\'s "Optimize Lineup" button auto-starts your best roster each week—great for busy beginners',
      bestFor: 'Official NFL branding & highlight videos',
      features: [
        'Official NFL content',
        'Next Gen Stats integration',
        'Auto-optimize lineup feature',
        'Exclusive video highlights',
      ],
    },
    {
      id: 'yahoo',
      name: 'Yahoo Fantasy',
      logo: '⚡',
      color: 'from-purple-600 to-purple-800',
      url: 'https://football.fantasysports.yahoo.com/',
      buttonText: 'Tush-Push It',
      strengths:
        'All-rounder with premium upsells. 24/7 mock drafts, integrated research tabs during drafts',
      unique:
        'Fantasy Plus features: Draft Scout (ADP heat-map), Trade Hub, and optimal-lineup suggestions',
      bestFor: 'Deep mobile tools & premium helpers',
      features: [
        '24/7 mock drafts',
        'Draft Scout ADP heat-map',
        'Trade Hub with metrics',
        'Fantasy Plus premium tools',
      ],
    },
    {
      id: 'sleeper',
      name: 'Sleeper',
      logo: '💤',
      color: 'from-green-600 to-green-800',
      url: 'https://sleeper.com/',
      buttonText: 'Hail Mary',
      strengths:
        'Social-first & ad-free. Built-in league chat with read receipts and meme GIFs',
      unique:
        'Dynasty and best-ball formats are one-click add-ons. Scoring customization is unmatched—tiered PPR, first-down points',
      bestFor: 'Chatty leagues, dynasty, or creative scoring',
      features: [
        'Built-in league chat with GIFs',
        'Dynasty league support',
        'Custom scoring options',
        'Fastest push notifications',
      ],
    },
    {
      id: 'cbs',
      name: 'CBS Sports Fantasy',
      logo: '📊',
      color: 'from-orange-600 to-orange-800',
      url: 'https://www.cbssports.com/fantasy/football/',
      buttonText: 'Fumble Recovery',
      strengths:
        'Max-flexibility for custom leagues. Hundreds of scoring categories, IDP support',
      unique:
        'Multi-matchup schedules, and the ability to lock or unlock any rule mid-season',
      bestFor: 'Full commissioner control & paid cash leagues',
      features: [
        'Hundreds of scoring categories',
        'IDP (Individual Defensive Player) support',
        'Mid-season rule changes',
        'Multi-matchup scheduling',
      ],
    },
    {
      id: 'draftsharks',
      name: 'DraftSharks',
      logo: '🦈',
      color: 'from-gray-600 to-gray-800',
      url: 'https://www.draftsharks.com/',
      buttonText: 'Sack It',
      strengths:
        'Not a host—an analytics toolkit. Offers Draft War Room, real-time injury predictor',
      unique:
        'Live-draft sync you can overlay on any host site. Great if you want data-driven edges',
      bestFor: 'Elite prep analytics layered on top',
      features: [
        'Draft War Room analytics',
        'Real-time injury predictor',
        'Live-draft sync overlay',
        'Advanced statistical tools',
      ],
    },
  ];

  const scoringTypes = [
    {
      type: 'Standard',
      description: 'Traditional scoring without points for receptions',
      points: [
        { action: 'Rushing/Receiving Yard', points: '0.1' },
        { action: 'Passing Yard', points: '0.04' },
        { action: 'Rushing/Receiving TD', points: '6' },
        { action: 'Passing TD', points: '4' },
        { action: 'Interception/Fumble', points: '-2' },
      ],
    },
    {
      type: 'PPR (Point Per Reception)',
      description:
        'Adds 1 point for each reception, favoring pass-catching players',
      points: [
        { action: 'Reception', points: '1' },
        { action: 'Rushing/Receiving Yard', points: '0.1' },
        { action: 'Passing Yard', points: '0.04' },
        { action: 'Rushing/Receiving TD', points: '6' },
        { action: 'Passing TD', points: '4' },
      ],
    },
    {
      type: 'Half-PPR',
      description:
        'Compromise between Standard and PPR with 0.5 points per reception',
      points: [
        { action: 'Reception', points: '0.5' },
        { action: 'Rushing/Receiving Yard', points: '0.1' },
        { action: 'Passing Yard', points: '0.04' },
        { action: 'Rushing/Receiving TD', points: '6' },
        { action: 'Passing TD', points: '4' },
      ],
    },
  ];

  const weeklySteps = [
    {
      step: 'Set Lineup',
      icon: Users,
      description: 'Lock in your starting players before their games begin',
      tips: 'Check injury reports, weather conditions, and matchup difficulty',
    },
    {
      step: 'Waiver Wire',
      icon: UserPlus,
      description: 'Claim free agents once a week to improve your roster',
      tips: 'Prioritize players with upcoming favorable matchups or increased opportunity',
    },
    {
      step: 'Make Trades',
      icon: Shuffle,
      description: 'Swap players with other managers for roster balance',
      tips: 'Target teams with complementary needs and offer fair value',
    },
    {
      step: 'Monitor Scoring',
      icon: BarChart3,
      description: "Track your players' performance throughout the games",
      tips: 'Use live scoring apps to follow your team in real-time',
    },
  ];

  const draftStrategies = [
    {
      strategy: 'Zero RB',
      description:
        'Wait on running backs and load up on WRs and elite TEs early',
      pros: [
        'Less injury risk early',
        'WR/TE more consistent',
        'RB depth available late',
      ],
      cons: ['Requires waiver wire success', 'Can lack early RB production'],
    },
    {
      strategy: 'Robust RB',
      description: 'Draft RBs early and often to secure the scarce position',
      pros: ['Secures scarce position', 'Trade leverage', 'Consistent touches'],
      cons: ['Higher injury risk', 'May miss elite WRs'],
    },
    {
      strategy: 'Best Player Available',
      description:
        'Simply draft the highest-ranked player regardless of position',
      pros: ['Maximizes talent', 'Flexible approach', 'Good for beginners'],
      cons: ['Can create positional imbalances', 'May miss positional runs'],
    },
    {
      strategy: 'Late Round QB',
      description: 'Wait until rounds 10+ to draft a quarterback',
      pros: [
        'QB depth is deep',
        'More skill position talent',
        'Streaming options available',
      ],
      cons: ['May miss elite QB upside', 'Requires backup plan'],
    },
  ];

  const glossaryTerms = [
    {
      term: 'ADP',
      definition:
        'Average Draft Position - where players typically get drafted',
    },
    {
      term: 'FAB',
      definition: 'Free-Agent Budget - blind bids for waiver wire claims',
    },
    {
      term: 'Handcuff',
      definition: 'Backup RB who would start if the starter gets injured',
    },
    {
      term: 'Streaming',
      definition:
        'Starting different defenses/kickers each week based on matchups',
    },
    {
      term: 'Boom/Bust',
      definition: 'Players with high variance - useful in underdog matchups',
    },
    {
      term: 'Floor',
      definition: 'The minimum points a player is likely to score',
    },
    {
      term: 'Ceiling',
      definition: 'The maximum points a player could realistically score',
    },
    {
      term: 'Stacking',
      definition: 'Starting QB + WR from same team for correlated scoring',
    },
    {
      term: 'Waiver Priority',
      definition: 'Order in which teams can claim free agents',
    },
    {
      term: 'FLEX',
      definition: 'Roster spot that can be filled by RB, WR, or TE',
    },
  ];

  return (
    <main className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#002244] dark:text-white mb-6 transition-colors duration-300">
            Fantasy Football Guide
          </h1>
          <p className="text-xl text-[#708090] dark:text-[#96abdc] max-w-3xl mx-auto mb-8 transition-colors duration-300">
            Master the season-long game of "draft-manage-score-repeat." Learn
            everything you need to know to dominate your fantasy football league
            from draft day to championship glory.
          </p>
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-[#ed5925] to-[#96abdc] p-1 rounded-full">
              <button className="bg-white dark:bg-[#002244] text-[#002244] dark:text-white px-8 py-3 rounded-full font-bold hover:bg-gray-50 dark:hover:bg-[#004953] transition-colors duration-200 inline-flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Start Your Fantasy Journey
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
          {/* The Basics Tab */}
          {activeTab === 'basics' && (
            <div className="p-8 lg:p-12">
              <h2 className="text-3xl font-bold text-[#002244] dark:text-white mb-8 text-center transition-colors duration-300">
                Fantasy Football Fundamentals
              </h2>

              {/* Core Concept */}
              <div className="mb-12">
                <div className="bg-gradient-to-r from-[#004953] to-[#002244] rounded-xl p-8 text-white mb-8">
                  <div className="text-center">
                    <Trophy className="w-16 h-16 text-[#96abdc] mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-4">
                      The Core Concept
                    </h3>
                    <p className="text-lg text-[#96abdc] max-w-3xl mx-auto">
                      Fantasy football is a season-long game where you assemble
                      a roster of real NFL players, earn points from their
                      weekly on-field stats, make strategic moves, and compete
                      for league bragging rights or prize money.
                    </p>
                  </div>
                </div>

                {/* Season Timeline */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[
                    {
                      phase: 'Draft',
                      icon: Users,
                      time: 'Pre-Season',
                      description:
                        'Build your initial roster by selecting players in draft order',
                      color: 'from-[#ed5925] to-[#d14a1f]',
                    },
                    {
                      phase: 'Manage',
                      icon: RefreshCw,
                      time: 'Weekly',
                      description:
                        'Set lineups, claim free agents, make trades, and optimize your roster',
                      color: 'from-[#96abdc] to-[#7a95d1]',
                    },
                    {
                      phase: 'Score',
                      icon: BarChart3,
                      time: 'Game Days',
                      description:
                        "Earn points based on your players' real NFL performance",
                      color: 'from-[#004953] to-[#003a42]',
                    },
                    {
                      phase: 'Compete',
                      icon: Crown,
                      time: 'Playoffs',
                      description:
                        'Battle through playoffs for championship glory and prizes',
                      color: 'from-[#8d594d] to-[#6b4238]',
                    },
                  ].map((phase, index) => (
                    <div key={index} className="text-center">
                      <div
                        className={`bg-gradient-to-r ${phase.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}
                      >
                        <phase.icon className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="text-lg font-bold text-[#002244] dark:text-white mb-2 transition-colors duration-300">
                        {phase.phase}
                      </h4>
                      <p className="text-sm text-[#ed5925] font-semibold mb-2">
                        {phase.time}
                      </p>
                      <p className="text-[#708090] dark:text-[#96abdc] text-sm transition-colors duration-300">
                        {phase.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Roster Composition */}
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-[#002244] dark:text-white mb-6 transition-colors duration-300">
                  Typical Roster Composition
                </h3>
                <div className="bg-[#faf9f5] dark:bg-[#1a1a2e] rounded-xl p-6 transition-colors duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      {
                        position: 'Quarterback (QB)',
                        count: '1 starter',
                        description:
                          'Earns points for passing yards, TDs, and rushing stats',
                      },
                      {
                        position: 'Running Back (RB)',
                        count: '2 starters',
                        description:
                          'Points for rushing/receiving yards, TDs, and receptions',
                      },
                      {
                        position: 'Wide Receiver (WR)',
                        count: '2-3 starters',
                        description:
                          'Points for receiving yards, TDs, and receptions',
                      },
                      {
                        position: 'Tight End (TE)',
                        count: '1 starter',
                        description:
                          'Points for receiving stats, often harder to predict',
                      },
                      {
                        position: 'FLEX (RB/WR/TE)',
                        count: '1 starter',
                        description:
                          'Flexible spot for your best remaining skill player',
                      },
                      {
                        position: 'Defense/ST (DST)',
                        count: '1 starter',
                        description:
                          'Points for sacks, turnovers, TDs, and points allowed',
                      },
                      {
                        position: 'Kicker (K)',
                        count: '1 starter',
                        description:
                          'Points for field goals and extra points made',
                      },
                      {
                        position: 'Bench Players',
                        count: '5-7 players',
                        description:
                          'Backups, handcuffs, and players for bye weeks',
                      },
                    ].map((pos, index) => (
                      <div
                        key={index}
                        className="bg-white dark:bg-[#002244] rounded-lg p-4 border border-gray-200 dark:border-[#004953] transition-colors duration-300"
                      >
                        <h4 className="font-bold text-[#002244] dark:text-white mb-1 transition-colors duration-300">
                          {pos.position}
                        </h4>
                        <p className="text-[#ed5925] font-semibold text-sm mb-2">
                          {pos.count}
                        </p>
                        <p className="text-[#708090] dark:text-[#96abdc] text-sm transition-colors duration-300">
                          {pos.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Weekly Cycle */}
              <div>
                <h3 className="text-2xl font-bold text-[#002244] dark:text-white mb-6 transition-colors duration-300">
                  The Weekly Cycle
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {weeklySteps.map((step, index) => (
                    <div
                      key={index}
                      className="bg-[#faf9f5] dark:bg-[#1a1a2e] rounded-xl p-6 text-center hover:shadow-md transition-all duration-200"
                    >
                      <div className="bg-gradient-to-r from-[#ed5925] to-[#96abdc] w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                        <step.icon className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="text-lg font-bold text-[#002244] dark:text-white mb-2 transition-colors duration-300">
                        {step.step}
                      </h4>
                      <p className="text-[#708090] dark:text-[#96abdc] text-sm mb-3 transition-colors duration-300">
                        {step.description}
                      </p>
                      <p className="text-xs text-[#ed5925] font-medium">
                        💡 {step.tips}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Platform Guide Tab */}
          {activeTab === 'platforms' && (
            <div className="p-8 lg:p-12">
              <h2 className="text-3xl font-bold text-[#002244] dark:text-white mb-8 text-center transition-colors duration-300">
                Platform Comparison Guide
              </h2>

              {/* Platform Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {platforms.map((platform) => (
                  <div
                    key={platform.id}
                    className={`bg-white dark:bg-[#002244] border-2 rounded-xl p-6 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 border-gray-200 dark:border-[#004953] hover:border-[#ed5925]`}
                  >
                    <div className="text-center mb-4">
                      <div
                        className={`bg-gradient-to-r ${platform.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3`}
                      >
                        <span className="text-2xl">{platform.logo}</span>
                      </div>
                      <h3 className="text-xl font-bold text-[#002244] dark:text-white transition-colors duration-300">
                        {platform.name}
                      </h3>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div>
                        <h4 className="font-semibold text-[#ed5925] text-sm mb-1">
                          Best For:
                        </h4>
                        <p className="text-[#708090] dark:text-[#96abdc] text-sm transition-colors duration-300">
                          {platform.bestFor}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-[#ed5925] text-sm mb-1">
                          Key Strengths:
                        </h4>
                        <p className="text-[#708090] dark:text-[#96abdc] text-sm transition-colors duration-300">
                          {platform.strengths}
                        </p>
                      </div>
                    </div>

                    <a
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-[#ed5925] to-[#96abdc] text-white px-6 py-3 rounded-lg font-semibold hover:from-[#d14a1f] hover:to-[#7a95d1] transition-all duration-200 transform hover:scale-105 w-full justify-center"
                      aria-label={`Open ${platform.name} in new tab`}
                    >
                      {platform.buttonText}
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                ))}
              </div>

              {/* Platform Decision Matrix */}
              <div className="bg-[#faf9f5] dark:bg-[#1a1a2e] rounded-xl p-8 transition-colors duration-300">
                <h3 className="text-2xl font-bold text-[#002244] dark:text-white mb-6 text-center transition-colors duration-300">
                  Which Platform Should You Choose?
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-[#004953]">
                        <th className="text-left py-3 px-4 font-semibold text-[#002244] dark:text-white transition-colors duration-300">
                          If you value...
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-[#002244] dark:text-white transition-colors duration-300">
                          Choose
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['Largest public leagues / mainstream feel', 'ESPN'],
                        [
                          'Official NFL branding & highlight videos',
                          'NFL Fantasy',
                        ],
                        [
                          'Deep mobile tools & premium helpers',
                          'Yahoo (+Fantasy Plus)',
                        ],
                        [
                          'Chatty leagues, dynasty, or creative scoring',
                          'Sleeper',
                        ],
                        [
                          'Full commissioner control & paid cash leagues',
                          'CBS Sports',
                        ],
                        [
                          'Elite prep analytics layered on top',
                          'DraftSharks (addon)',
                        ],
                      ].map(([criteria, platform], index) => (
                        <tr
                          key={index}
                          className="border-b border-gray-100 dark:border-[#004953] hover:bg-gray-50 dark:hover:bg-[#1a1a2e]"
                        >
                          <td className="py-3 px-4 text-[#708090] dark:text-[#96abdc] transition-colors duration-300">
                            {criteria}
                          </td>
                          <td className="py-3 px-4 font-semibold text-[#ed5925]">
                            {platform}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Scoring & Strategy Tab */}
          {activeTab === 'scoring' && (
            <div className="p-8 lg:p-12">
              <h2 className="text-3xl font-bold text-[#002244] dark:text-white mb-8 text-center transition-colors duration-300">
                Scoring Systems & Draft Strategies
              </h2>

              {/* Scoring Types */}
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-[#002244] dark:text-white mb-6 transition-colors duration-300">
                  Understanding Scoring Systems
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {scoringTypes.map((scoring, index) => (
                    <div
                      key={index}
                      className="bg-[#faf9f5] dark:bg-[#1a1a2e] rounded-xl p-6 transition-colors duration-300"
                    >
                      <h4 className="text-xl font-bold text-[#002244] dark:text-white mb-3 transition-colors duration-300">
                        {scoring.type}
                      </h4>
                      <p className="text-[#708090] dark:text-[#96abdc] text-sm mb-4 transition-colors duration-300">
                        {scoring.description}
                      </p>
                      <div className="space-y-2">
                        {scoring.points.map((point, pointIndex) => (
                          <div
                            key={pointIndex}
                            className="flex justify-between items-center text-sm"
                          >
                            <span className="text-[#708090] dark:text-[#96abdc] transition-colors duration-300">
                              {point.action}
                            </span>
                            <span className="font-bold text-[#ed5925]">
                              {point.points} pts
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Draft Strategies */}
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-[#002244] dark:text-white mb-6 transition-colors duration-300">
                  Popular Draft Strategies
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {draftStrategies.map((strategy, index) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-[#002244] rounded-xl p-6 border border-gray-200 dark:border-[#004953] transition-colors duration-300"
                    >
                      <h4 className="text-xl font-bold text-[#002244] dark:text-white mb-3 transition-colors duration-300">
                        {strategy.strategy}
                      </h4>
                      <p className="text-[#708090] dark:text-[#96abdc] mb-4 transition-colors duration-300">
                        {strategy.description}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-semibold text-green-600 text-sm mb-2">
                            ✅ Pros
                          </h5>
                          <ul className="space-y-1">
                            {strategy.pros.map((pro, proIndex) => (
                              <li
                                key={proIndex}
                                className="text-xs text-[#708090] dark:text-[#96abdc] transition-colors duration-300"
                              >
                                • {pro}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-semibold text-red-600 text-sm mb-2">
                            ❌ Cons
                          </h5>
                          <ul className="space-y-1">
                            {strategy.cons.map((con, conIndex) => (
                              <li
                                key={conIndex}
                                className="text-xs text-[#708090] dark:text-[#96abdc] transition-colors duration-300"
                              >
                                • {con}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Glossary */}
              <div>
                <h3 className="text-2xl font-bold text-[#002244] dark:text-white mb-6 transition-colors duration-300">
                  Fantasy Football Glossary
                </h3>
                <div className="bg-[#faf9f5] dark:bg-[#1a1a2e] rounded-xl p-6 transition-colors duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {glossaryTerms.map((term, index) => (
                      <div
                        key={index}
                        className="bg-white dark:bg-[#002244] rounded-lg p-4 border border-gray-200 dark:border-[#004953] transition-colors duration-300"
                      >
                        <h4 className="font-bold text-[#ed5925] mb-1">
                          {term.term}
                        </h4>
                        <p className="text-[#708090] dark:text-[#96abdc] text-sm transition-colors duration-300">
                          {term.definition}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Getting Started Tab */}
          {activeTab === 'getting-started' && (
            <div className="p-8 lg:p-12">
              <h2 className="text-3xl font-bold text-[#002244] dark:text-white mb-8 text-center transition-colors duration-300">
                Your 5-Step Launch Checklist
              </h2>

              {/* Step-by-Step Guide */}
              <div className="space-y-8 mb-12">
                {[
                  {
                    step: 1,
                    title: 'Pick Your Platform',
                    description:
                      'Choose the fantasy platform that best fits your needs and preferences',
                    action:
                      'Use our platform comparison guide above to make your decision',
                    icon: Target,
                  },
                  {
                    step: 2,
                    title: 'Join or Create a League',
                    description:
                      'Find a league to join or create your own with friends',
                    action:
                      'Public leagues for fastest entry; private leagues for custom rules with friends',
                    icon: Users,
                  },
                  {
                    step: 3,
                    title: 'Practice with Mock Drafts',
                    description:
                      'Get familiar with draft strategy and player values',
                    action:
                      'Complete at least 2 mock drafts to learn ADP trends (Yahoo/ESPN lobbies)',
                    icon: Gamepad2,
                  },
                  {
                    step: 4,
                    title: 'Prepare for Draft Day',
                    description:
                      'Research players, print rankings, and set up your draft environment',
                    action:
                      'Print or open rankings (DraftSharks/Yahoo Kit) and prepare your draft space',
                    icon: Trophy,
                  },
                  {
                    step: 5,
                    title: 'Set Up Management Reminders',
                    description:
                      'Stay on top of weekly tasks and important deadlines',
                    action:
                      'Set reminders for waivers (Tuesday night) and lineup locks (Thu 8 PM ET & Sunday noon)',
                    icon: Clock,
                  },
                ].map((step) => (
                  <div
                    key={step.step}
                    className="flex items-start gap-6 bg-white dark:bg-[#002244] rounded-xl p-6 border border-gray-200 dark:border-[#004953] transition-colors duration-300"
                  >
                    <div className="bg-gradient-to-r from-[#ed5925] to-[#96abdc] w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-[#002244] dark:text-white mb-2 transition-colors duration-300">
                        {step.title}
                      </h3>
                      <p className="text-[#708090] dark:text-[#96abdc] mb-3 transition-colors duration-300">
                        {step.description}
                      </p>
                      <div className="bg-[#ed5925] bg-opacity-10 border-l-4 border-[#ed5925] p-3 rounded">
                        <p className="text-sm text-[#002244] dark:text-white font-medium transition-colors duration-300">
                          🎯 Action: {step.action}
                        </p>
                      </div>
                    </div>
                    <step.icon className="w-8 h-8 text-[#708090] dark:text-[#96abdc] flex-shrink-0 transition-colors duration-300" />
                  </div>
                ))}
              </div>

              {/* Pro Tips */}
              <div className="bg-gradient-to-r from-[#004953] to-[#002244] rounded-xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-6 text-center">
                  <Flame className="w-8 h-8 inline-block mr-2 text-[#ed5925]" />
                  Pro Tips for Success
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-bold mb-3 text-[#96abdc]">
                      Draft Strategy
                    </h4>
                    <ul className="space-y-2">
                      {[
                        'Start safe with high-floor players, finish bold with high-ceiling picks',
                        'Consider stacking QB + WR from same team for correlated scoring',
                        "Don't reach for players just because you like the team",
                        'Have a backup plan for every position',
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
                      Season Management
                    </h4>
                    <ul className="space-y-2">
                      {[
                        'Stay active on the waiver wire - championships are won there',
                        "Don't be afraid to make trades, but ensure fair value",
                        'Stream defenses and kickers based on matchups',
                        'Keep an eye on playoff schedules when making moves',
                      ].map((tip, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-[#ed5925] mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Popular Fantasy Football Platforms */}
          <section className="py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                  Popular Fantasy Football Platforms
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Quick access to the most popular fantasy football platforms
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  {
                    name: 'ESPN Fantasy',
                    url: 'https://fantasy.espn.com',
                    icon: '🏈',
                    color: 'from-red-600 to-red-800',
                  },
                  {
                    name: 'Yahoo Fantasy',
                    url: 'https://football.fantasysports.yahoo.com',
                    icon: '⚡',
                    color: 'from-purple-600 to-purple-800',
                  },
                  {
                    name: 'NFL Fantasy',
                    url: 'https://fantasy.nfl.com',
                    icon: '🏆',
                    color: 'from-blue-600 to-blue-800',
                  },
                  {
                    name: 'Sleeper',
                    url: 'https://sleeper.app',
                    icon: '💤',
                    color: 'from-green-600 to-green-800',
                  },
                  {
                    name: 'CBS Sports',
                    url: 'https://www.cbssports.com/fantasy/football',
                    icon: '📊',
                    color: 'from-orange-600 to-orange-800',
                  },
                  {
                    name: 'FanDuel',
                    url: 'https://www.fanduel.com',
                    icon: '🎲',
                    color: 'from-indigo-600 to-indigo-800',
                  },
                ].map((platform, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group rounded-lg"
                  >
                    <div className="p-4 text-center">
                      <div
                        className={`bg-gradient-to-r ${platform.color} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-200`}
                      >
                        <span className="text-2xl">{platform.icon}</span>
                      </div>
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-2">
                        {platform.name}
                      </h4>
                      <button
                        className="w-full text-xs border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 px-3 py-2 rounded transition-colors duration-200"
                        onClick={() => {
                          if (typeof window !== 'undefined') {
                            window.open(platform.url, '_blank');
                          }
                        }}
                      >
                        Visit Site
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Fantasy Football Season Overview */}
          <section className="py-16 bg-white dark:bg-black transition-colors duration-300">
            <div className="max-w-6xl mx-auto">
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
                  Fantasy Football Season Overview
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-blue-600">17</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Regular Season Weeks
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-green-600">32</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      NFL Teams
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-purple-600">18</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Total Season Weeks
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-orange-600">
                      272
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Regular Season Games
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Fantasy to Squares Bridge Section */}
          <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 transition-colors duration-300">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                  🎯 Use Fantasy Insights for Football Squares
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Leverage your fantasy football knowledge to enhance your
                  squares strategy
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-800">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Strategic Advantages
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400">
                        Analyze team scoring trends and patterns
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400">
                        Understand weather and injury impacts
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400">
                        Leverage advanced stats for better picks
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400">
                        Track player performance correlations
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-800">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Ready to Play Squares?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Now that you understand fantasy football, apply that
                    knowledge to our Football Squares games for even more
                    excitement!
                  </p>
                  <button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        window.location.href = '/';
                      }
                    }}
                  >
                    <ArrowRight className="w-5 h-5" />
                    Play Football Squares
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default FantasyFootballContent;
