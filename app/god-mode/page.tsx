'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Crown,
  DollarSign,
  Users,
  BarChart3,
  Shield,
  Settings,
  ExternalLink,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Activity,
  Globe,
  Database,
  Zap,
  Mail,
  FileText,
  Gamepad2,
  CreditCard,
  Eye,
  UserCheck,
  Briefcase,
  BookOpen,
  HelpCircle,
  Scale,
  Lock,
  Smartphone,
  Monitor,
  Server,
  Cpu,
  MemoryStick,
  Wifi,
  Clock,
  Calendar,
  Target,
} from 'lucide-react';

export default function GodModePage() {
  const [activeView, setActiveView] = useState('overview');
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Mock data - in production this would come from APIs
  const platformStats = {
    totalUsers: 15247,
    activeUsers24h: 2156,
    totalRevenue: 2450000,
    monthlyRecurring: 185000,
    totalBoards: 8923,
    activeBoardsNow: 156,
    totalTransactions: 45231,
    avgTransactionValue: 54.12,
    conversionRate: 23.4,
    churnRate: 4.2,
    cblCount: 89,
    activeCBLs: 67,
    supportTickets: 23,
    criticalIssues: 2,
  };

  const moneyFlow = {
    inbound: {
      playerPurchases: 125000,
      seasonPassSales: 45000,
      nftSales: 12000,
      premiumUpgrades: 8500,
    },
    outbound: {
      playerPayouts: 89000,
      cblRewards: 15500,
      operatingCosts: 25000,
      developmentCosts: 18000,
      marketingSpend: 12000,
    },
    netProfit: 31000,
    profitMargin: 16.3,
  };

  const systemHealth = {
    uptime: 99.94,
    responseTime: 145,
    errorRate: 0.02,
    dbConnections: 45,
    memoryUsage: 67,
    cpuUsage: 23,
    diskUsage: 42,
    networkLatency: 12,
  };

  const allPages = {
    'Core Game Pages': [
      { name: 'Home Page', path: '/', description: 'Main landing page' },
      {
        name: 'Free Board',
        path: '/free-board',
        description: 'Free to play boards',
      },
      {
        name: 'Season Pass',
        path: '/season-pass',
        description: 'Premium season access',
      },
      {
        name: 'Season Pass Conferences',
        path: '/season-pass/conferences',
        description: 'Conference selection',
      },
      {
        name: 'Season Pass Dashboard',
        path: '/season-pass/dashboard',
        description: 'Season pass user dashboard',
      },
      {
        name: 'Season Pass Rules',
        path: '/season-pass/rules',
        description: 'Season pass rules and guidelines',
      },
      {
        name: 'Boards List',
        path: '/boards',
        description: 'All available boards',
      },
      {
        name: 'Board Leader Dashboard',
        path: '/board-leader',
        description: 'Board leader management',
      },
      {
        name: 'Player Dashboard',
        path: '/player/dashboard',
        description: 'Individual player stats',
      },
      {
        name: 'Fantasy Football',
        path: '/fantasy',
        description: 'Fantasy football integration',
      },
      {
        name: 'Demo Page',
        path: '/demo',
        description: 'Platform demonstration',
      },
      { name: 'Test Page', path: '/test', description: 'Testing environment' },
    ],
    'CBL (Community Board Leader) Pages': [
      {
        name: 'CBL Overview',
        path: '/cbl/overview',
        description: 'CBL program overview',
      },
      {
        name: 'CBL Dashboard',
        path: '/cbl/dashboard',
        description: 'CBL management dashboard',
      },
      {
        name: 'CBL Resources',
        path: '/cbl/resources',
        description:
          'Email templates, marketing materials, style guides, Coach B integration',
      },
      {
        name: 'CBL Guidelines',
        path: '/cbl/guidelines',
        description: 'CBL rules and best practices',
      },
      {
        name: 'CBL Application',
        path: '/cbl/apply',
        description: 'Apply to become a CBL',
      },
      {
        name: 'CBL Learn More',
        path: '/cbl/learn-more',
        description: 'Detailed CBL information',
      },
    ],
    'NFT & Customization': [
      { name: 'My NFTs', path: '/my-nfts', description: 'User NFT collection' },
      {
        name: 'Create NFT Hub',
        path: '/create-nft',
        description: 'NFT creation landing',
      },
      {
        name: 'AI Generated Artwork',
        path: '/create-nft/ai-generated-artwork',
        description: 'AI art creation',
      },
      {
        name: 'Custom Hand-drawn Symbol',
        path: '/create-nft/custom-hand-drawn-symbol',
        description: 'Custom symbol creation',
      },
      {
        name: 'Custom Signature',
        path: '/create-nft/custom-signature',
        description: 'Signature NFTs',
      },
      {
        name: 'House Generated Artwork',
        path: '/create-nft/house-generated-artwork',
        description: 'House artwork',
      },
      {
        name: 'Premium Animated',
        path: '/create-nft/premium-animated',
        description: 'Animated NFTs',
      },
    ],
    'Education & Support': [
      {
        name: 'How to Play',
        path: '/how-to-play',
        description: 'Game instructions',
      },
      { name: 'Rules', path: '/rules', description: 'Official game rules' },
      { name: 'FAQ', path: '/faq', description: 'Frequently asked questions' },
      {
        name: 'Crypto Basics',
        path: '/crypto-basics',
        description: 'Cryptocurrency education',
      },
      {
        name: 'What are NFTs',
        path: '/what-are-nfts',
        description: 'NFT education',
      },
      {
        name: 'Wallet Guide',
        path: '/wallet-guide',
        description: 'Wallet setup instructions',
      },
      {
        name: 'Education Wallet Guide',
        path: '/education/wallet-guide',
        description: 'Detailed wallet education',
      },
      {
        name: 'Payment Guide',
        path: '/payment-guide',
        description: 'Payment methods and setup',
      },
      {
        name: 'Technical Support',
        path: '/technical-support',
        description: 'Technical help center',
      },
    ],
    'Legal & Compliance': [
      {
        name: 'Terms of Service',
        path: '/terms',
        description: 'Platform terms and conditions',
      },
      {
        name: 'Privacy Policy',
        path: '/privacy',
        description: 'Privacy and data protection',
      },
      {
        name: 'Community Guidelines',
        path: '/community-guidelines',
        description: 'Community behavior rules',
      },
      {
        name: 'Legal Compliance',
        path: '/legal-compliance',
        description: 'Legal and regulatory compliance',
      },
    ],
    'API & Developer': [
      {
        name: 'API Subscribe',
        path: '/api/subscribe',
        description: 'Email subscription endpoint',
      },
    ],
    'Admin & Management': [
      {
        name: 'God Mode Dashboard',
        path: '/god-mode',
        description:
          'Complete platform oversight, financial tracking, system monitoring, emergency controls',
      },
    ],
    'Leaderboard Pages': [
      {
        name: 'Leaderboard',
        path: '/season-pass/leaderboard',
        description: 'Main leaderboard page',
      },
      {
        name: 'Eastern Conference Leaderboard',
        path: '/season-pass/leaderboard/1',
        description: 'Leaderboard for the Eastern Conference',
      },
      {
        name: 'Southern Conference Leaderboard',
        path: '/season-pass/leaderboard/2',
        description: 'Leaderboard for the Southern Conference',
      },
      {
        name: 'Northern Conference Leaderboard',
        path: '/season-pass/leaderboard/3',
        description: 'Leaderboard for the Northern Conference',
      },
      {
        name: 'Western Conference Leaderboard',
        path: '/season-pass/leaderboard/4',
        description: 'Leaderboard for the Western Conference',
      },
      {
        name: 'South-East Conference Leaderboard',
        path: '/season-pass/leaderboard/5',
        description: 'Leaderboard for the South-East Conference',
      },
    ],
  };

  const criticalActions = [
    {
      name: 'Emergency Stop All Games',
      type: 'danger',
      description: 'Immediately halt all active games',
    },
    {
      name: 'Freeze All Transactions',
      type: 'danger',
      description: 'Stop all financial transactions',
    },
    {
      name: 'Enable Maintenance Mode',
      type: 'warning',
      description: 'Put platform in maintenance mode',
    },
    {
      name: 'Broadcast Emergency Alert',
      type: 'warning',
      description: 'Send alert to all users',
    },
    {
      name: 'Export All Data',
      type: 'info',
      description: 'Create complete data backup',
    },
    {
      name: 'Reset VRF System',
      type: 'info',
      description: 'Restart randomization system',
    },
  ];

  const recentAlerts = [
    {
      type: 'critical',
      message: 'VRF response timeout on board #8923',
      time: '2 min ago',
    },
    {
      type: 'warning',
      message: 'High memory usage on game server 3',
      time: '15 min ago',
    },
    {
      type: 'info',
      message: 'Scheduled maintenance completed successfully',
      time: '1 hour ago',
    },
    {
      type: 'warning',
      message: 'Unusual betting pattern detected on board #8920',
      time: '2 hours ago',
    },
  ];

  return (
    <div
      className={`min-h-screen p-6 transition-colors duration-300 ${
        isDarkMode
          ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white'
          : 'bg-gradient-to-br from-gray-100 via-blue-50 to-purple-50 text-gray-900'
      }`}
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Crown className="h-10 w-10 text-yellow-400" />
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                God Mode Dashboard
              </h1>
              <p className="text-gray-300">
                Complete platform oversight and management control
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setIsDarkMode(!isDarkMode)}
              variant="outline"
              size="sm"
              className="text-gray-300 border-gray-600 hover:bg-gray-700"
            >
              {isDarkMode ? '☀️ Light' : '🌙 Dark'}
            </Button>
            <Badge
              variant="outline"
              className="text-green-400 border-green-400"
            >
              LIVE
            </Badge>
            <Badge variant="outline" className="text-blue-400 border-blue-400">
              {new Date().toLocaleString()}
            </Badge>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
        <Card
          className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Users className="h-5 w-5 text-blue-400" />
              <span className="text-2xl font-bold">
                {platformStats.totalUsers.toLocaleString()}
              </span>
            </div>
            <p
              className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
            >
              Total Users
            </p>
          </CardContent>
        </Card>

        <Card
          className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <DollarSign className="h-5 w-5 text-green-400" />
              <span className="text-2xl font-bold">
                ${(platformStats.totalRevenue / 1000000).toFixed(1)}M
              </span>
            </div>
            <p
              className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
            >
              Total Revenue
            </p>
          </CardContent>
        </Card>

        <Card
          className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Activity className="h-5 w-5 text-orange-400" />
              <span className="text-2xl font-bold">
                {platformStats.activeBoardsNow}
              </span>
            </div>
            <p
              className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
            >
              Active Boards
            </p>
          </CardContent>
        </Card>

        <Card
          className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Briefcase className="h-5 w-5 text-purple-400" />
              <span className="text-2xl font-bold">
                {platformStats.activeCBLs}
              </span>
            </div>
            <p
              className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
            >
              Active CBLs
            </p>
          </CardContent>
        </Card>

        <Card
          className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <span className="text-2xl font-bold">
                {platformStats.criticalIssues}
              </span>
            </div>
            <p
              className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
            >
              Critical Issues
            </p>
          </CardContent>
        </Card>

        <Card
          className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-2xl font-bold">{systemHealth.uptime}%</span>
            </div>
            <p
              className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
            >
              Uptime
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Navigation */}
      <div className="space-y-6">
        <div
          className={`grid w-full grid-cols-6 rounded-lg p-1 ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-200'}`}
        >
          <button
            onClick={() => setActiveView('overview')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              activeView === 'overview'
                ? 'bg-purple-600 text-white'
                : isDarkMode
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveView('navigation')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              activeView === 'navigation'
                ? 'bg-purple-600 text-white'
                : isDarkMode
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-300'
            }`}
          >
            All Pages
          </button>
          <button
            onClick={() => setActiveView('financials')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              activeView === 'financials'
                ? 'bg-purple-600 text-white'
                : isDarkMode
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-300'
            }`}
          >
            Money Flow
          </button>
          <button
            onClick={() => setActiveView('users')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              activeView === 'users'
                ? 'bg-purple-600 text-white'
                : isDarkMode
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-300'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveView('system')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              activeView === 'system'
                ? 'bg-purple-600 text-white'
                : isDarkMode
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-300'
            }`}
          >
            System
          </button>
          <button
            onClick={() => setActiveView('emergency')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              activeView === 'emergency'
                ? 'bg-purple-600 text-white'
                : isDarkMode
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-300'
            }`}
          >
            Emergency
          </button>
        </div>

        {/* Overview View */}
        {activeView === 'overview' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Recent Alerts */}
              <Card
                className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}
              >
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <AlertTriangle className="h-5 w-5 mr-2 text-yellow-400" />
                    Recent Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentAlerts.map((alert, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-3 bg-gray-700/50 rounded"
                    >
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${
                          alert.type === 'critical'
                            ? 'bg-red-500'
                            : alert.type === 'warning'
                              ? 'bg-yellow-500'
                              : 'bg-blue-500'
                        }`}
                      />
                      <div className="flex-1">
                        <p className="text-sm text-gray-200">{alert.message}</p>
                        <p className="text-xs text-gray-400">{alert.time}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Key Metrics */}
              <Card
                className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}
              >
                <CardHeader>
                  <CardTitle
                    className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                  >
                    Key Performance Indicators
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span
                        className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                      >
                        Conversion Rate
                      </span>
                      <span className="text-green-400">
                        {platformStats.conversionRate}%
                      </span>
                    </div>
                    <Progress
                      value={platformStats.conversionRate}
                      className="h-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span
                        className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                      >
                        Churn Rate
                      </span>
                      <span className="text-red-400">
                        {platformStats.churnRate}%
                      </span>
                    </div>
                    <Progress value={platformStats.churnRate} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span
                        className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                      >
                        System Health
                      </span>
                      <span className="text-green-400">
                        {systemHealth.uptime}%
                      </span>
                    </div>
                    <Progress value={systemHealth.uptime} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* All Pages Navigation View */}
        {activeView === 'navigation' && (
          <div className="space-y-6">
            {Object.entries(allPages).map(([category, pages]) => (
              <Card
                key={category}
                className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}
              >
                <CardHeader>
                  <CardTitle
                    className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                  >
                    {category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {pages.map((page, index) => (
                      <Link key={index} href={page.path} className="block">
                        <div
                          className={`p-3 rounded transition-colors group ${isDarkMode ? 'bg-gray-700/50 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4
                                className={`font-medium ${isDarkMode ? 'text-gray-200 group-hover:text-white' : 'text-gray-800 group-hover:text-gray-900'}`}
                              >
                                {page.name}
                              </h4>
                              <p
                                className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                              >
                                {page.description}
                              </p>
                              <p className="text-xs text-blue-400 font-mono mt-1">
                                {page.path}
                              </p>
                            </div>
                            <ExternalLink
                              className={`h-4 w-4 ${isDarkMode ? 'text-gray-400 group-hover:text-white' : 'text-gray-500 group-hover:text-gray-700'}`}
                            />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Financial View */}
        {activeView === 'financials' && (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Inbound Money */}
            <Card
              className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}
            >
              <CardHeader>
                <CardTitle className="text-green-400">
                  Inbound Revenue
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span
                    className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                  >
                    Player Purchases
                  </span>
                  <span className="text-green-400">
                    ${moneyFlow.inbound.playerPurchases.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span
                    className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                  >
                    Season Pass Sales
                  </span>
                  <span className="text-green-400">
                    ${moneyFlow.inbound.seasonPassSales.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span
                    className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                  >
                    NFT Sales
                  </span>
                  <span className="text-green-400">
                    ${moneyFlow.inbound.nftSales.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span
                    className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                  >
                    Premium Upgrades
                  </span>
                  <span className="text-green-400">
                    ${moneyFlow.inbound.premiumUpgrades.toLocaleString()}
                  </span>
                </div>
                <div className="border-t border-gray-600 pt-2 mt-4">
                  <div className="flex justify-between font-bold">
                    <span
                      className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                    >
                      Total Inbound
                    </span>
                    <span className="text-green-400">
                      $
                      {Object.values(moneyFlow.inbound)
                        .reduce((a, b) => a + b, 0)
                        .toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Outbound Money */}
            <Card
              className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}
            >
              <CardHeader>
                <CardTitle className="text-red-400">
                  Outbound Expenses
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span
                    className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                  >
                    Player Payouts
                  </span>
                  <span className="text-red-400">
                    ${moneyFlow.outbound.playerPayouts.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span
                    className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                  >
                    CBL Rewards
                  </span>
                  <span className="text-red-400">
                    ${moneyFlow.outbound.cblRewards.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span
                    className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                  >
                    Operating Costs
                  </span>
                  <span className="text-red-400">
                    ${moneyFlow.outbound.operatingCosts.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span
                    className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                  >
                    Development
                  </span>
                  <span className="text-red-400">
                    ${moneyFlow.outbound.developmentCosts.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span
                    className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                  >
                    Marketing
                  </span>
                  <span className="text-red-400">
                    ${moneyFlow.outbound.marketingSpend.toLocaleString()}
                  </span>
                </div>
                <div className="border-t border-gray-600 pt-2 mt-4">
                  <div className="flex justify-between font-bold">
                    <span
                      className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                    >
                      Total Outbound
                    </span>
                    <span className="text-red-400">
                      $
                      {Object.values(moneyFlow.outbound)
                        .reduce((a, b) => a + b, 0)
                        .toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Net Profit */}
            <Card
              className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}
            >
              <CardHeader>
                <CardTitle className="text-yellow-400">
                  Net Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">
                    ${moneyFlow.netProfit.toLocaleString()}
                  </div>
                  <p className="text-gray-300">Net Profit (Monthly)</p>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {moneyFlow.profitMargin}%
                  </div>
                  <p className="text-gray-300">Profit Margin</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span
                      className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                    >
                      Efficiency Score
                    </span>
                    <span className="text-green-400">87%</span>
                  </div>
                  <Progress value={87} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Users View */}
        {activeView === 'users' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card
              className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}
            >
              <CardHeader>
                <CardTitle className="text-blue-400">User Analytics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span
                    className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                  >
                    Total Users
                  </span>
                  <span
                    className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                  >
                    {platformStats.totalUsers.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span
                    className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                  >
                    Active (24h)
                  </span>
                  <span className="text-green-400">
                    {platformStats.activeUsers24h.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span
                    className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                  >
                    CBLs
                  </span>
                  <span className="text-purple-400">
                    {platformStats.cblCount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span
                    className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                  >
                    Support Tickets
                  </span>
                  <span className="text-yellow-400">
                    {platformStats.supportTickets}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card
              className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}
            >
              <CardHeader>
                <CardTitle className="text-green-400">
                  Transaction Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span
                    className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                  >
                    Total Transactions
                  </span>
                  <span
                    className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                  >
                    {platformStats.totalTransactions.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span
                    className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                  >
                    Avg Value
                  </span>
                  <span className="text-green-400">
                    ${platformStats.avgTransactionValue}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span
                    className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                  >
                    Success Rate
                  </span>
                  <span className="text-green-400">98.7%</span>
                </div>
                <div className="flex justify-between">
                  <span
                    className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                  >
                    Failed Payments
                  </span>
                  <span className="text-red-400">1.3%</span>
                </div>
              </CardContent>
            </Card>

            <Card
              className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}
            >
              <CardHeader>
                <CardTitle className="text-purple-400">Content Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span
                    className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                  >
                    Total Boards
                  </span>
                  <span
                    className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                  >
                    {platformStats.totalBoards.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span
                    className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                  >
                    Active Now
                  </span>
                  <span className="text-green-400">
                    {platformStats.activeBoardsNow}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span
                    className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                  >
                    Completed Today
                  </span>
                  <span className="text-blue-400">47</span>
                </div>
                <div className="flex justify-between">
                  <span
                    className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                  >
                    Scheduled
                  </span>
                  <span className="text-yellow-400">123</span>
                </div>
              </CardContent>
            </Card>

            <Card
              className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}
            >
              <CardHeader>
                <CardTitle className="text-orange-400">
                  Growth Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span
                    className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                  >
                    New Users (24h)
                  </span>
                  <span className="text-green-400">+156</span>
                </div>
                <div className="flex justify-between">
                  <span
                    className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                  >
                    Churn Rate
                  </span>
                  <span className="text-red-400">
                    {platformStats.churnRate}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span
                    className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                  >
                    Retention (30d)
                  </span>
                  <span className="text-green-400">76%</span>
                </div>
                <div className="flex justify-between">
                  <span
                    className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                  >
                    LTV
                  </span>
                  <span className="text-green-400">$284</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* System Health View */}
        {activeView === 'system' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card
              className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}
            >
              <CardHeader>
                <CardTitle className="text-green-400 flex items-center">
                  <Server className="h-5 w-5 mr-2" />
                  Server Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span
                      className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                    >
                      Uptime
                    </span>
                    <span className="text-green-400">
                      {systemHealth.uptime}%
                    </span>
                  </div>
                  <Progress value={systemHealth.uptime} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span
                      className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                    >
                      Response Time
                    </span>
                    <span className="text-yellow-400">
                      {systemHealth.responseTime}ms
                    </span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span
                      className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                    >
                      Error Rate
                    </span>
                    <span className="text-green-400">
                      {systemHealth.errorRate}%
                    </span>
                  </div>
                  <Progress value={systemHealth.errorRate} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card
              className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}
            >
              <CardHeader>
                <CardTitle className="text-blue-400 flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  Database
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span
                      className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                    >
                      Connections
                    </span>
                    <span className="text-blue-400">
                      {systemHealth.dbConnections}/100
                    </span>
                  </div>
                  <Progress
                    value={systemHealth.dbConnections}
                    className="h-2"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span
                      className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                    >
                      Query Performance
                    </span>
                    <span className="text-green-400">Excellent</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span
                      className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                    >
                      Storage Used
                    </span>
                    <span className="text-yellow-400">67%</span>
                  </div>
                  <Progress value={67} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card
              className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}
            >
              <CardHeader>
                <CardTitle className="text-orange-400 flex items-center">
                  <Cpu className="h-5 w-5 mr-2" />
                  Resources
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span
                      className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                    >
                      CPU Usage
                    </span>
                    <span className="text-green-400">
                      {systemHealth.cpuUsage}%
                    </span>
                  </div>
                  <Progress value={systemHealth.cpuUsage} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span
                      className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                    >
                      Memory Usage
                    </span>
                    <span className="text-yellow-400">
                      {systemHealth.memoryUsage}%
                    </span>
                  </div>
                  <Progress value={systemHealth.memoryUsage} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span
                      className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                    >
                      Disk Usage
                    </span>
                    <span className="text-green-400">
                      {systemHealth.diskUsage}%
                    </span>
                  </div>
                  <Progress value={systemHealth.diskUsage} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card
              className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}
            >
              <CardHeader>
                <CardTitle className="text-purple-400 flex items-center">
                  <Wifi className="h-5 w-5 mr-2" />
                  Network
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span
                      className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                    >
                      Latency
                    </span>
                    <span className="text-green-400">
                      {systemHealth.networkLatency}ms
                    </span>
                  </div>
                  <Progress value={90} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span
                      className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                    >
                      Throughput
                    </span>
                    <span className="text-green-400">High</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span
                      className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                    >
                      CDN Status
                    </span>
                    <span className="text-green-400">Healthy</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Emergency Actions View */}
        {activeView === 'emergency' && (
          <div className="space-y-6">
            <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle className="h-6 w-6 text-red-400" />
                <h3 className="text-xl font-bold text-red-400">
                  Emergency Controls
                </h3>
              </div>
              <p className="text-gray-300">
                These actions should only be used in critical situations. All
                emergency actions are logged and require confirmation.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {criticalActions.map((action, index) => (
                <Card
                  key={index}
                  className={`border-2 ${
                    action.type === 'danger'
                      ? 'border-red-500 bg-red-900/20'
                      : action.type === 'warning'
                        ? 'border-yellow-500 bg-yellow-900/20'
                        : 'border-blue-500 bg-blue-900/20'
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="text-center space-y-4">
                      <div
                        className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center ${
                          action.type === 'danger'
                            ? 'bg-red-500'
                            : action.type === 'warning'
                              ? 'bg-yellow-500'
                              : 'bg-blue-500'
                        }`}
                      >
                        {action.type === 'danger' ? (
                          <AlertTriangle className="h-6 w-6 text-white" />
                        ) : action.type === 'warning' ? (
                          <Shield className="h-6 w-6 text-white" />
                        ) : (
                          <Settings className="h-6 w-6 text-white" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-white mb-2">
                          {action.name}
                        </h4>
                        <p className="text-sm text-gray-300 mb-4">
                          {action.description}
                        </p>
                      </div>
                      <Button
                        variant={
                          action.type === 'danger' ? 'destructive' : 'default'
                        }
                        className="w-full"
                      >
                        Execute
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
