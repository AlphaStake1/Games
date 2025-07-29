import React from 'react';
import Link from 'next/link';
import { getMarkdownContent, MarkdownRenderer } from '@/lib/markdown';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CBLOverviewPage() {
  const content = getMarkdownContent('cbl/overview.md');

  // Split content into parts for custom layout
  const whySectionStart = '### Why Lead?';
  const stepsSectionStart = "### Phil's 3-Step CBL Path";

  const beforeWhy = content.split(whySectionStart)[0];
  const whyToSteps = content
    .split(whySectionStart)[1]
    ?.split(stepsSectionStart)[0];
  const stepsAndAfter = content.split(stepsSectionStart)[1];

  const whySection = whyToSteps ? whySectionStart + whyToSteps : '';
  const stepsSection = stepsAndAfter ? stepsSectionStart + stepsAndAfter : '';

  return (
    <>
      <div className="max-w-4xl mx-auto pb-20 sm:pb-0">
        {/* Hero Content - Before Why Lead */}
        {beforeWhy && (
          <div className="mb-12 text-left">
            <MarkdownRenderer content={beforeWhy} />
          </div>
        )}

        {/* Two-Column Layout: Why Lead & 3-Step Path */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Why Lead Section */}
          {whySection && (
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 border-blue-200 dark:border-blue-800">
              <CardContent className="p-6">
                <MarkdownRenderer content={whySection} />
              </CardContent>
            </Card>
          )}

          {/* 3-Step CBL Path Section */}
          {stepsSection && (
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/30 border-orange-200 dark:border-orange-800">
              <CardContent className="p-6">
                <MarkdownRenderer content={stepsSection} />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Call to Action - Funnel Flow */}
        <div className="text-center space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center mb-12">
          <Button
            size="lg"
            className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700"
          >
            <Link href="/board-leader" className="block">
              📊 Learn Business Details
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            <Link href="/cbl/apply" className="block">
              Skip to Apply
            </Link>
          </Button>
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

      {/* Sticky Footer CTA for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 p-4 sm:hidden z-50">
        <div className="flex space-x-3">
          <Button className="flex-1 bg-orange-600 hover:bg-orange-700">
            <Link href="/board-leader" className="block">
              📊 Business Details
            </Link>
          </Button>
          <Button variant="outline" className="flex-1">
            <Link href="/cbl/apply" className="block">
              Skip to Apply
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
}
