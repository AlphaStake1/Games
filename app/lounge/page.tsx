'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  MessageSquare,
  Users,
  Trophy,
  TrendingUp,
  ExternalLink,
  MessageCircle,
  Bot,
  Crown,
} from 'lucide-react';

const LoungePage = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load official Telegram Discussion Widget
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;

    // Configure for OC Phil bot discussion
    script.setAttribute('data-telegram-discussion', 'OC_Phil_bot');
    script.setAttribute('data-comments-limit', '15');
    script.setAttribute('data-height', '400');
    script.setAttribute('data-color', '255c7e'); // Brand primary blue
    script.setAttribute('data-dark-color', 'ed5925'); // Brand accent orange
    script.setAttribute('data-colorful', '1');
    script.setAttribute('data-dark', '1'); // Support dark mode

    // Append to the widget container instead of body
    const widgetContainer = document.getElementById(
      'telegram-discussion-widget',
    );
    if (widgetContainer) {
      widgetContainer.appendChild(script);

      script.onload = () => {
        setIsLoaded(true);
      };

      script.onerror = () => {
        console.error('Failed to load Telegram widget');
        setIsLoaded(true); // Still show fallback
      };
    }

    return () => {
      // Clean up the script if it exists
      if (widgetContainer && script.parentNode) {
        widgetContainer.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 dark:from-blue-950 to-orange-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <MessageSquare className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              The Squares Lounge
            </h1>
            <Bot className="w-10 h-10 text-orange-600" />
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Central hub for Community Board Leaders - connect with OC Phil,
            share strategies, and celebrate wins while building your own
            platform communities
          </p>
        </div>

        {/* Community Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                127
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-400">
                Active CBLs
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
            <CardContent className="p-4 text-center">
              <Trophy className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                1,247
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">
                Boards This Week
              </div>
            </CardContent>
          </Card>

          <Card className="bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                $47.2K
              </div>
              <div className="text-sm text-orange-600 dark:text-orange-400">
                Total Winnings
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800">
            <CardContent className="p-4 text-center">
              <MessageCircle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                2.1K
              </div>
              <div className="text-sm text-purple-600 dark:text-purple-400">
                Messages Today
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Chat Area */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="live-chat" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="live-chat">Live Chat</TabsTrigger>
                <TabsTrigger value="announcements">Announcements</TabsTrigger>
                <TabsTrigger value="strategy">Strategy Hub</TabsTrigger>
              </TabsList>

              <TabsContent value="live-chat" className="mt-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Community Chat
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-700"
                      >
                        23 Online
                      </Badge>
                      <Button size="sm" variant="outline" asChild>
                        <a
                          href="https://t.me/OC_Phil_bot"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Open in Telegram
                        </a>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Official Telegram Discussion Widget Container */}
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 min-h-[400px]">
                      {!isLoaded ? (
                        <div className="flex items-center justify-center h-64">
                          <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                            <p className="text-gray-600 dark:text-gray-400">
                              Loading OC Phil community chat...
                            </p>
                          </div>
                        </div>
                      ) : (
                        <>
                          {/* Official Telegram Discussion Widget */}
                          <div
                            id="telegram-discussion-widget"
                            className="w-full min-h-[350px]"
                          >
                            {/* Widget will be injected here by Telegram script */}
                          </div>

                          {/* Fallback if widget doesn't load */}
                          <div className="text-center text-gray-600 dark:text-gray-400 py-4 border-t">
                            <p className="text-sm mb-2">
                              Can't see the chat? Open directly in Telegram:
                            </p>
                            <Button size="sm" asChild>
                              <a
                                href="https://t.me/OC_Phil_bot"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="w-3 h-3 mr-1" />
                                Open in Telegram
                              </a>
                            </Button>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline">
                        Share Board
                      </Button>
                      <Button size="sm" variant="outline">
                        Ask OC Phil
                      </Button>
                      <Button size="sm" variant="outline">
                        Strategy Tips
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="announcements" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Crown className="w-5 h-5 text-yellow-600" />
                      Platform Announcements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4 py-2">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary">New Feature</Badge>
                        <span className="text-sm text-gray-500">
                          2 hours ago
                        </span>
                      </div>
                      <h4 className="font-semibold">
                        Advanced Board Analytics Released!
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Franchise tier CBLs now have access to detailed
                        performance metrics and competitor analysis.
                      </p>
                    </div>

                    <div className="border-l-4 border-green-500 pl-4 py-2">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary">Event</Badge>
                        <span className="text-sm text-gray-500">1 day ago</span>
                      </div>
                      <h4 className="font-semibold">
                        Championship Sunday Bonus Weekend
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Double Orange Points for all boards created this
                        weekend! 🏆
                      </p>
                    </div>

                    <div className="border-l-4 border-orange-500 pl-4 py-2">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary">Update</Badge>
                        <span className="text-sm text-gray-500">
                          3 days ago
                        </span>
                      </div>
                      <h4 className="font-semibold">OC Phil Gets Smarter</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Our AI coach now provides personalized strategy
                        recommendations based on your board history.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="strategy" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      Strategy Hub
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Bot className="w-4 h-4 text-blue-600" />
                          OC Phil's Tip of the Day
                        </h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                          "Prime time games (8:20 PM EST) typically see 40%
                          faster board fills than afternoon games. Schedule your
                          high-value boards accordingly!"
                        </p>
                        <Button size="sm" variant="outline">
                          Ask for More Tips
                        </Button>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="border rounded-lg p-4">
                          <h5 className="font-medium mb-2">
                            🎯 Hot Squares This Week
                          </h5>
                          <div className="text-sm space-y-1">
                            <div>0-0: 12% win rate</div>
                            <div>7-3: 8% win rate</div>
                            <div>3-7: 7% win rate</div>
                          </div>
                        </div>

                        <div className="border rounded-lg p-4">
                          <h5 className="font-medium mb-2">
                            📊 Optimal Pricing
                          </h5>
                          <div className="text-sm space-y-1">
                            <div>Casual: $10-20/square</div>
                            <div>Competitive: $25-50/square</div>
                            <div>High Stakes: $75+/square</div>
                          </div>
                        </div>
                      </div>

                      <Button className="w-full">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Join Strategy Discussion
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* OC Phil Card */}
            <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950 to-red-950 border-orange-200 dark:border-orange-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-6 h-6 text-orange-600" />
                  Meet OC Phil
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                  Your AI offensive coordinator is here to help you dominate the
                  game!
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Online & Ready to Coach</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-600" />
                    <span>127 CBLs Coached Today</span>
                  </div>
                </div>
                <Button className="w-full mt-4" asChild>
                  <a
                    href="https://t.me/OC_Phil_bot"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Chat with OC Phil
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Top CBLs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-yellow-600" />
                  Top CBLs This Week
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-yellow-500 text-white text-xs">
                        1
                      </Badge>
                      <span className="font-medium">SquaresMaster</span>
                    </div>
                    <span className="text-sm text-gray-600">47 boards</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-gray-400 text-white text-xs">
                        2
                      </Badge>
                      <span className="font-medium">GridWarrior</span>
                    </div>
                    <span className="text-sm text-gray-600">42 boards</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-amber-600 text-white text-xs">
                        3
                      </Badge>
                      <span className="font-medium">TDScorer</span>
                    </div>
                    <span className="text-sm text-gray-600">38 boards</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4" size="sm">
                  View Full Leaderboard
                </Button>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  size="sm"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Create Board Thread
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  size="sm"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Find CBL Partners
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  size="sm"
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  Share a Win
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  size="sm"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Get Strategy Help
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoungePage;
