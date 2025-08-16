'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Shield,
  MessageSquare,
  Users,
  TrendingUp,
  Brain,
  Target,
  Star,
  Calendar,
  DollarSign,
  BarChart3,
  Lock,
  Crown,
  Lightbulb,
  Zap,
  Trophy,
  Globe,
} from 'lucide-react';

interface Message {
  id: string;
  author: string;
  authorTier: 'First Stream' | 'Drive Maker' | 'Franchise';
  platform: string;
  content: string;
  timestamp: Date;
  likes: number;
  replies: number;
  tags: string[];
}

interface AnalyticsData {
  totalRevenue: number;
  totalBoards: number;
  averageFillRate: number;
  topPerformers: Array<{
    name: string;
    platform: string;
    metric: string;
    value: string;
  }>;
}

const CBLCoachingRoom = () => {
  const [activeTab, setActiveTab] = useState('discussion');
  const [newMessage, setNewMessage] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('all');

  // Mock data - in production this would come from your backend
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      author: 'SquaresMaster_NYC',
      authorTier: 'Franchise',
      platform: 'Telegram',
      content:
        "Just hit my 3rd consecutive week with 100% fill rate on all boards. The key is posting boards Tuesday night for weekend games - gives people time to plan and creates anticipation. Also using OC Phil's automated celebration GIFs is driving massive engagement!",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      likes: 12,
      replies: 5,
      tags: ['strategy', 'automation', 'engagement'],
    },
    {
      id: '2',
      author: 'ChiTownGrids',
      authorTier: 'Drive Maker',
      platform: 'Discord',
      content:
        'Question for the room: Anyone else seeing lower participation for Thursday night games? My Sunday boards fill in hours but TNF struggles. Thinking about adjusting entry fees or trying different timing.',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      likes: 8,
      replies: 3,
      tags: ['question', 'timing', 'participation'],
    },
    {
      id: '3',
      author: 'SoCalSquares',
      authorTier: 'Drive Maker',
      platform: 'Instagram',
      content:
        'Game changer alert! Started doing "Square Spotlight" posts featuring past winners and their strategies. Engagement up 40% and getting 2-3 new followers asking about boards every day. Template available if anyone wants it.',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      likes: 15,
      replies: 8,
      tags: ['content', 'growth', 'template'],
    },
  ]);

  const analyticsData: AnalyticsData = {
    totalRevenue: 47250,
    totalBoards: 1247,
    averageFillRate: 87,
    topPerformers: [
      {
        name: 'SquaresMaster_NYC',
        platform: 'Telegram',
        metric: 'Revenue',
        value: '$3,240',
      },
      {
        name: 'SoCalSquares',
        platform: 'Instagram',
        metric: 'Growth',
        value: '+45%',
      },
      {
        name: 'ChiTownGrids',
        platform: 'Discord',
        metric: 'Fill Rate',
        value: '94%',
      },
      {
        name: 'DallasDriveTime',
        platform: 'X (Twitter)',
        metric: 'Engagement',
        value: '12.4%',
      },
    ],
  };

  const topics = [
    { id: 'all', label: 'All Topics', count: messages.length },
    { id: 'strategy', label: 'Strategy', count: 5 },
    { id: 'automation', label: 'Automation', count: 3 },
    { id: 'growth', label: 'Growth', count: 7 },
    { id: 'content', label: 'Content', count: 4 },
    { id: 'question', label: 'Questions', count: 6 },
  ];

  const handlePostMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      author: 'YourCBLName', // This would come from user context
      authorTier: 'Drive Maker', // This would come from user context
      platform: 'Multiple', // This would come from user profile
      content: newMessage,
      timestamp: new Date(),
      likes: 0,
      replies: 0,
      tags: ['discussion'],
    };

    setMessages([message, ...messages]);
    setNewMessage('');
  };

  const filteredMessages =
    selectedTopic === 'all'
      ? messages
      : messages.filter((msg) => msg.tags.includes(selectedTopic));

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Franchise':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'Drive Maker':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'First Stream':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'telegram':
        return '💬';
      case 'discord':
        return '🎮';
      case 'instagram':
        return '📸';
      case 'x (twitter)':
        return '🐦';
      case 'facebook':
        return '📘';
      default:
        return '🌐';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 dark:from-blue-950 to-orange-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              CBL Coaching Staff Room
            </h1>
            <Crown className="w-10 h-10 text-orange-600" />
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Private space for Community Board Leaders to share strategies,
            collaborate, and get exclusive coaching from OC Phil
          </p>
          <Badge
            variant="outline"
            className="mt-2 bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
          >
            <Lock className="w-3 h-3 mr-1" />
            CBL Members Only
          </Badge>
        </div>

        {/* Analytics Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
            <CardContent className="p-4 text-center">
              <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                ${analyticsData.totalRevenue.toLocaleString()}
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">
                Total CBL Revenue
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4 text-center">
              <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {analyticsData.totalBoards.toLocaleString()}
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-400">
                Boards Created
              </div>
            </CardContent>
          </Card>

          <Card className="bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800">
            <CardContent className="p-4 text-center">
              <BarChart3 className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                {analyticsData.averageFillRate}%
              </div>
              <div className="text-sm text-orange-600 dark:text-orange-400">
                Average Fill Rate
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800">
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                127
              </div>
              <div className="text-sm text-purple-600 dark:text-purple-400">
                Active CBLs
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 h-14">
            <TabsTrigger value="discussion" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Discussion
            </TabsTrigger>
            <TabsTrigger value="strategies" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Strategies
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="ocphil" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              OC Phil
            </TabsTrigger>
          </TabsList>

          {/* Discussion Tab */}
          <TabsContent value="discussion" className="mt-6">
            <div className="grid lg:grid-cols-4 gap-6">
              {/* Topic Filter Sidebar */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Topics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {topics.map((topic) => (
                      <Button
                        key={topic.id}
                        variant={
                          selectedTopic === topic.id ? 'default' : 'outline'
                        }
                        className="w-full justify-between"
                        onClick={() => setSelectedTopic(topic.id)}
                      >
                        <span>{topic.label}</span>
                        <Badge variant="secondary">{topic.count}</Badge>
                      </Button>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Discussion Feed */}
              <div className="lg:col-span-3 space-y-6">
                {/* Post New Message */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Share with the Team
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      placeholder="Share a strategy, ask a question, or help a fellow CBL..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        Your insights help everyone succeed 🚀
                      </div>
                      <Button
                        onClick={handlePostMessage}
                        disabled={!newMessage.trim()}
                      >
                        Share
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Messages Feed */}
                <div className="space-y-4">
                  {filteredMessages.map((message) => (
                    <Card
                      key={message.id}
                      className="hover:shadow-lg transition-shadow"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>
                                {message.author.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">
                                  {message.author}
                                </span>
                                <Badge
                                  className={getTierColor(message.authorTier)}
                                >
                                  {message.authorTier}
                                </Badge>
                                <span className="text-sm text-gray-500">
                                  {getPlatformIcon(message.platform)}{' '}
                                  {message.platform}
                                </span>
                              </div>
                              <div className="text-sm text-gray-500">
                                {message.timestamp.toLocaleDateString()} at{' '}
                                {message.timestamp.toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {message.content}
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-500"
                            >
                              <Star className="w-4 h-4 mr-1" />
                              {message.likes}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-500"
                            >
                              <MessageSquare className="w-4 h-4 mr-1" />
                              {message.replies}
                            </Button>
                          </div>
                          <div className="flex gap-1">
                            {message.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Strategies Tab */}
          <TabsContent value="strategies" className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-blue-50 dark:bg-blue-950">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    Pricing Strategies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                      <div className="font-medium">Dynamic Pricing</div>
                      <div className="text-gray-600 dark:text-gray-400">
                        Start low for trust, increase based on demand
                      </div>
                    </div>
                    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                      <div className="font-medium">Game Tier System</div>
                      <div className="text-gray-600 dark:text-gray-400">
                        Premium pricing for primetime and playoff games
                      </div>
                    </div>
                    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                      <div className="font-medium">Bundle Deals</div>
                      <div className="text-gray-600 dark:text-gray-400">
                        Multi-game packages for regular players
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-green-50 dark:bg-green-950">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Growth Tactics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                      <div className="font-medium">Referral Programs</div>
                      <div className="text-gray-600 dark:text-gray-400">
                        Reward members who bring friends
                      </div>
                    </div>
                    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                      <div className="font-medium">
                        Cross-Platform Promotion
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">
                        Share content across multiple platforms
                      </div>
                    </div>
                    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                      <div className="font-medium">Local Partnerships</div>
                      <div className="text-gray-600 dark:text-gray-400">
                        Partner with sports bars and local businesses
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-orange-50 dark:bg-orange-950">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-orange-600" />
                    Content Ideas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                      <div className="font-medium">Winner Spotlights</div>
                      <div className="text-gray-600 dark:text-gray-400">
                        Feature winners and their strategies
                      </div>
                    </div>
                    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                      <div className="font-medium">Behind the Scenes</div>
                      <div className="text-gray-600 dark:text-gray-400">
                        Show board creation and selection process
                      </div>
                    </div>
                    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                      <div className="font-medium">Educational Series</div>
                      <div className="text-gray-600 dark:text-gray-400">
                        &quot;Squares 101&quot; content for newcomers
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="mt-6">
            <div className="space-y-6">
              {/* Top Performers */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-600" />
                    Top Performing CBLs This Week
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {analyticsData.topPerformers.map((performer, index) => (
                      <div
                        key={index}
                        className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Badge className="text-xs">#{index + 1}</Badge>
                          <span className="text-xs text-gray-500">
                            {getPlatformIcon(performer.platform)}{' '}
                            {performer.platform}
                          </span>
                        </div>
                        <div className="font-semibold">{performer.name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {performer.metric}:{' '}
                          <span className="font-medium">{performer.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Platform Breakdown */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Platform Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span>💬 Telegram</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">34%</div>
                          <div className="text-sm text-gray-500">
                            CBL choice
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span>🎮 Discord</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">28%</div>
                          <div className="text-sm text-gray-500">
                            CBL choice
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span>📸 Instagram</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">21%</div>
                          <div className="text-sm text-gray-500">
                            CBL choice
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span>🐦 X (Twitter)</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">17%</div>
                          <div className="text-sm text-gray-500">
                            CBL choice
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>This Week</span>
                        <span className="font-semibold text-green-600">
                          +12.3%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>This Month</span>
                        <span className="font-semibold text-green-600">
                          +28.7%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Average per CBL</span>
                        <span className="font-semibold">$372</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Top CBL this month</span>
                        <span className="font-semibold">$3,240</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* OC Phil Tab */}
          <TabsContent value="ocphil" className="mt-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-blue-600" />
                      Chat with OC Phil - CBL Coach
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                            <Zap className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-blue-800 dark:text-blue-200">
                              OC Phil
                            </div>
                            <div className="text-blue-700 dark:text-blue-300 mt-1">
                              Welcome to the coaching staff room! I&apos;m here
                              to provide advanced strategies and insights
                              exclusively for CBLs. What can I help you optimize
                              today?
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <div className="font-semibold mb-2">
                          Quick Coach Commands:
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="p-2 bg-white dark:bg-gray-700 rounded">
                            <code>/analyze [platform]</code> - Platform
                            performance review
                          </div>
                          <div className="p-2 bg-white dark:bg-gray-700 rounded">
                            <code>/optimize [metric]</code> - Improvement
                            suggestions
                          </div>
                          <div className="p-2 bg-white dark:bg-gray-700 rounded">
                            <code>/strategy [game]</code> - Game-specific
                            tactics
                          </div>
                          <div className="p-2 bg-white dark:bg-gray-700 rounded">
                            <code>/competitor</code> - Market analysis
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Input
                          placeholder="Ask OC Phil anything about CBL strategy..."
                          className="flex-1"
                        />
                        <Button>Send</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">CBL Resources</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Globe className="w-4 h-4 mr-2" />
                      Platform Playbooks
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="w-4 h-4 mr-2" />
                      Content Calendar
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Analytics Dashboard
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Target className="w-4 h-4 mr-2" />
                      Milestone Tracker
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Upcoming Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="p-3 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950">
                        <div className="font-medium">CBL Strategy Session</div>
                        <div className="text-gray-600 dark:text-gray-400">
                          Tomorrow, 2 PM EST
                        </div>
                      </div>
                      <div className="p-3 border-l-4 border-green-500 bg-green-50 dark:bg-green-950">
                        <div className="font-medium">
                          Platform Update Training
                        </div>
                        <div className="text-gray-600 dark:text-gray-400">
                          Friday, 3 PM EST
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CBLCoachingRoom;
