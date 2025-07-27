'use client';

import Link from 'next/link';
import {
  gameBasics,
  scoringExamples,
  boardTypes,
  strategies,
  rules,
  payoutExamples,
  faqs,
  tips,
} from '@/lib/data/game-data';
import {
  TabContainer,
  TabPanel,
  useTabNavigation,
} from '@/components/ui/TabContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Grid,
  Trophy,
  Target,
  BarChart,
  Info,
  DollarSign,
  CheckCircle,
  ArrowRight,
} from '@/lib/icons';

const HowToPlayContent = () => {
  const tabs = [
    { id: 'getting-started', label: 'Getting Started', icon: Grid },
    { id: 'game-rules', label: 'Game Rules', icon: Trophy },
    { id: 'strategies', label: 'Strategy & Tips', icon: Target },
  ];

  const renderCallToAction = () => (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 text-center mt-8">
      <h3 className="text-2xl font-bold mb-4">Ready to Play?</h3>
      <p className="text-xl mb-6">
        Join fellow fanatics enjoying the excitement of football squares!
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/season-pass">
          <Button className="bg-white text-blue-600 hover:bg-gray-100 dark:bg-gray-100 dark:text-blue-600 dark:hover:bg-gray-200 px-8 py-3 text-lg font-medium">
            Season-Long Competition
            <Trophy className="w-5 h-5 ml-2" />
          </Button>
        </Link>
        <Link href="/boards">
          <Button className="bg-orange-500 text-white hover:bg-orange-600 px-8 py-3 text-lg font-medium">
            Weekly Cash Games
            <DollarSign className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );

  // Remove the conflicting useTabNavigation hook - let TabContainer manage state
  // const { activeTab, setActiveTab } = useTabNavigation(tabs, 'getting-started');

  const renderGettingStarted = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold mb-4 text-primary">
          Welcome to Football Squares!
        </h2>
        <p className="text-xl text-muted-foreground mb-6">
          The easiest and most exciting way to enjoy football games. No football
          knowledge required - it's all about luck!
        </p>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="bg-card rounded-lg p-4 shadow-sm">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-primary" />
            <h4 className="font-medium">Easy to Play</h4>
            <p className="text-muted-foreground">
              Just pick squares and watch the game
            </p>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-sm">
            <DollarSign className="w-8 h-8 mx-auto mb-2 text-primary" />
            <h4 className="font-medium">Win Real Money</h4>
            <p className="text-muted-foreground">
              Crypto payouts every quarter
            </p>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-sm">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-primary" />
            <h4 className="font-medium">Fair & Transparent</h4>
            <p className="text-muted-foreground">
              Provably fair random number generation
            </p>
          </div>
        </div>
      </div>

      {/* How It Works Steps */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-center mb-8">How It Works</h3>

        <div className="grid gap-6">
          {gameBasics.map((step, index) => {
            const IconComponent = step.icon;
            const isLast = index === gameBasics.length - 1;

            return (
              <div key={index} className="relative">
                <Card className="shadow-lg border-l-4 border-primary">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground">
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <IconComponent className="w-6 h-6 text-primary" />
                          <h4 className="text-xl font-bold">{step.title}</h4>
                        </div>
                        <p className="text-muted-foreground font-normal mt-1">
                          {step.description}
                        </p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-3 ml-16">
                      {step.details.map((detail, detailIndex) => (
                        <div
                          key={detailIndex}
                          className="flex items-start gap-2"
                        >
                          <CheckCircle className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
                          <p className="text-sm text-muted-foreground">
                            {detail}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scoring Examples */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-center">Scoring Examples</h3>
        <p className="text-center text-muted-foreground mb-6">
          Here's how winners are determined based on the last digit of each
          team's score:
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {scoringExamples.map((example, index) => (
            <Card key={index} className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>{example.scenario}</span>
                  <Badge className="bg-primary text-primary-foreground">
                    {example.payout}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold mb-2">
                    <span className="text-blue-600">
                      {Math.floor(example.homeScore / 10)}
                    </span>
                    <span className="text-red-600">
                      {example.homeScore % 10}
                    </span>
                    {' - '}
                    <span className="text-blue-600">
                      {Math.floor(example.awayScore / 10)}
                    </span>
                    <span className="text-red-600">
                      {example.awayScore % 10}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground mb-3">
                    Winning Square: Column {example.winningSquare.col}, Row{' '}
                    {example.winningSquare.row}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground text-center bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                  {example.explanation}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Board Types */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-center">Example Board Types</h3>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {boardTypes.map((board, index) => {
            const IconComponent = board.icon;
            return (
              <Card
                key={index}
                className="shadow-sm hover:shadow-lg transition-shadow"
              >
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-3">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center bg-primary">
                      <IconComponent className="w-8 h-8 text-primary-foreground" />
                    </div>
                  </div>
                  <CardTitle className="text-lg">{board.type}</CardTitle>
                  <div className="text-2xl font-bold text-primary">
                    {board.entryFee}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 text-center">
                    {board.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    {board.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-start gap-2"
                      >
                        <CheckCircle className="w-3 h-3 mt-0.5 text-green-500 flex-shrink-0" />
                        <p className="text-xs text-muted-foreground">
                          {feature}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                    <h5 className="text-xs font-medium mb-2">
                      Payout Structure:
                    </h5>
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <div>Q1: {board.payoutStructure.q1}</div>
                      <div>Q2: {board.payoutStructure.q2}</div>
                      <div>Q3: {board.payoutStructure.q3}</div>
                      <div>Final: {board.payoutStructure.final}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick Tips */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Info className="w-5 h-5 text-primary" />
          Quick Tips for Beginners
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {tips.slice(0, 4).map((tip, index) => {
            const IconComponent = tip.icon;
            return (
              <div key={index} className="flex items-start gap-3">
                <IconComponent className="w-5 h-5 mt-1 flex-shrink-0 text-primary" />
                <div>
                  <h4 className="font-medium mb-1">{tip.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {tip.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {renderCallToAction()}
    </div>
  );

  const renderGameRules = () => (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 text-center">
        <h3 className="text-2xl font-bold mb-4 text-primary">
          Introductory Game Rules
        </h3>
        <p className="text-muted-foreground">
          Understanding these rules ensures fair play and helps you make
          informed decisions. For more comprehensive Rule set for all Game
          types, follow the link in the footer "Rules".
        </p>
      </div>

      {/* Rules Categories */}
      <div className="grid gap-6">
        {rules.map((category, index) => {
          const IconComponent = category.icon;
          return (
            <Card key={index} className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconComponent className="w-6 h-6 text-primary" />
                  {category.category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {category.rules.map((rule, ruleIndex) => (
                    <div
                      key={ruleIndex}
                      className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                    >
                      <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-primary-foreground bg-primary">
                        {ruleIndex + 1}
                      </div>
                      <p className="text-muted-foreground">{rule}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {renderCallToAction()}
    </div>
  );

  const renderStrategies = () => (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center">
        <h3 className="text-2xl font-bold mb-4 text-primary">
          Strategy & Tips
        </h3>
        <p className="text-muted-foreground">
          While football squares is primarily luck-based, these strategies can
          help you make smarter decisions.
        </p>
      </div>

      {/* Strategy Categories */}
      <div className="grid gap-8">
        {strategies.map((category, index) => {
          const IconComponent = category.icon;
          return (
            <Card key={index} className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconComponent className="w-6 h-6 text-primary" />
                  {category.category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-1 gap-6">
                  {category.tips.map((tip, tipIndex) => (
                    <div
                      key={tipIndex}
                      className="border-l-4 pl-6 border-primary"
                    >
                      <h4 className="font-bold mb-2 text-lg">{tip.title}</h4>
                      <p className="text-muted-foreground mb-3">
                        {tip.description}
                      </p>
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                        <p className="text-sm text-muted-foreground">
                          <strong>Why this works:</strong> {tip.reasoning}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* All Tips */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-center">General Tips</h3>

        <div className="grid md:grid-cols-2 gap-4">
          {tips.map((tip, index) => {
            const IconComponent = tip.icon;
            return (
              <Card key={index} className="shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <IconComponent className="w-6 h-6 mt-1 flex-shrink-0 text-primary" />
                    <div>
                      <h4 className="font-medium mb-2">{tip.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {tip.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {renderCallToAction()}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <TabContainer tabs={tabs} defaultTab="getting-started">
        <TabPanel value="getting-started">{renderGettingStarted()}</TabPanel>

        <TabPanel value="game-rules">{renderGameRules()}</TabPanel>

        <TabPanel value="strategies">{renderStrategies()}</TabPanel>
      </TabContainer>
    </div>
  );
};

export default HowToPlayContent;
