import React from 'react';
import Link from 'next/link';
import { getMarkdownContent, MarkdownRenderer } from '@/lib/markdown';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CBLOverviewPage() {
  const content = getMarkdownContent('cbl/overview.md');

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="mb-8">
          <MarkdownRenderer content={content} />
        </div>
        
        {/* Call to Action */}
        <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <Button size="lg" className="w-full sm:w-auto">
            <Link href="/cbl/dashboard" className="block">
              Apply to Become a CBL
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            <Link href="/how-to-play" className="block">
              Learn More About Football Squares
            </Link>
          </Button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="text-2xl mr-3">🎯</span>
              Community Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300">
              Create and manage multiple game boards with custom rules that fit your community's needs.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="text-2xl mr-3">💰</span>
              Earn Rewards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300">
              Get a percentage of platform fees plus bonuses for active community engagement and growth.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="text-2xl mr-3">🚀</span>
              Priority Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300">
              Get priority customer support, early access to features, and influence on platform development.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Requirements Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>CBL Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-gray-600 dark:text-gray-300">
            <li className="flex items-start">
              <span className="text-green-500 mr-3 mt-1">✓</span>
              Active participant in at least 5 completed football squares games
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-3 mt-1">✓</span>
              Demonstrated community leadership or management experience
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-3 mt-1">✓</span>
              Commitment to follow CBL guidelines and best practices
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-3 mt-1">✓</span>
              Ability to manage and grow a community of 25+ active players
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}