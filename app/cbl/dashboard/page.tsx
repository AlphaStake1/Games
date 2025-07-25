'use client';

import React from 'react';
import { withAuth } from '@/lib/auth';
import { getMarkdownContent, MarkdownRenderer } from '@/lib/markdown';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import InfoTooltip from '@/components/InfoTooltip';
import {
  Users,
  DollarSign,
  Trophy,
  TrendingUp,
  Calendar,
  Settings,
  Plus,
  BarChart3,
} from 'lucide-react';

function CBLDashboard() {
  // In a real app, this would come from an API or database
  const dashboardStats = {
    activeBoards: 12,
    totalPlayers: 247,
    revenueGenerated: 3450,
    leadershipRewards: 345,
    weeklyGrowth: 12.5,
    boardFillRate: 94,
  };

  const activeBoards = [
    {
      id: 1,
      name: 'NFL Week 15 - Championship Board',
      players: 89,
      maxPlayers: 100,
      entryFee: 50,
      status: 'active',
      prizePool: 4500,
    },
    {
      id: 2,
      name: 'Monday Night Special',
      players: 34,
      maxPlayers: 50,
      entryFee: 25,
      status: 'filling',
      prizePool: 850,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Boards</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardStats.activeBoards}
            </div>
            <p className="text-xs text-muted-foreground">+2 from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Players</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardStats.totalPlayers}
            </div>
            <p className="text-xs text-muted-foreground">
              +{dashboardStats.weeklyGrowth}% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center">
              <CardTitle className="text-sm font-medium">
                Revenue Generated
              </CardTitle>
              <InfoTooltip
                title="Price Floor Strategy"
                description="Setting optimal entry fees maximizes both participation and revenue. The price floor represents the minimum viable entry fee that maintains player engagement while ensuring profitability."
                playbookLink="/docs/cbl-playbook#price-floor-quick-look"
              />
            </div>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${dashboardStats.revenueGenerated.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">This season</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center">
              <CardTitle className="text-sm font-medium">
                Leadership Rewards
              </CardTitle>
              <InfoTooltip
                title="Wallet Cap Management"
                description="Your reward earnings are subject to wallet capacity limits based on your CBL tier and community performance. Managing your wallet cap effectively ensures maximum reward collection and optimal cash flow."
                playbookLink="/docs/cbl-playbook#wallet-cap-optimization"
              />
            </div>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${dashboardStats.leadershipRewards}
            </div>
            <p className="text-xs text-muted-foreground">10% of revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Boards */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center">
            <CardTitle>Active Boards</CardTitle>
            <InfoTooltip
              title="Blue-Point Performance Meter"
              description="The Blue-Point meter tracks your board's engagement and completion rates. Higher scores indicate better player retention and satisfaction, leading to increased rewards and community growth opportunities."
              playbookLink="/docs/cbl-playbook#blue-point-optimization"
            />
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create New Board
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeBoards.map((board) => (
              <div
                key={board.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium">{board.name}</h4>
                    <Badge
                      variant={
                        board.status === 'active' ? 'default' : 'secondary'
                      }
                    >
                      {board.status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>
                      {board.players}/{board.maxPlayers} players
                    </span>
                    <span>${board.entryFee} entry</span>
                    <span>${board.prizePool.toLocaleString()} prize pool</span>
                  </div>
                  <Progress
                    value={(board.players / board.maxPlayers) * 100}
                    className="w-48"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button className="h-20 flex-col space-y-2">
          <Plus className="h-6 w-6" />
          <span>Create Board</span>
        </Button>
        <Button variant="outline" className="h-20 flex-col space-y-2">
          <Users className="h-6 w-6" />
          <span>Manage Players</span>
        </Button>
        <Button variant="outline" className="h-20 flex-col space-y-2">
          <BarChart3 className="h-6 w-6" />
          <span>View Analytics</span>
        </Button>
        <Button variant="outline" className="h-20 flex-col space-y-2">
          <Calendar className="h-6 w-6" />
          <span>Schedule Games</span>
        </Button>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-muted-foreground">2 hours ago</span>
              <span>New player joined "Monday Night Special"</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-muted-foreground">5 hours ago</span>
              <span>Championship Board reached 80% capacity</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-muted-foreground">1 day ago</span>
              <span>Weekly payout of $245 processed</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default withAuth(CBLDashboard, 'CBL_ROLE');
