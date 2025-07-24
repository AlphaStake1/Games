'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Users, TrendingUp, ArrowRight } from 'lucide-react';

interface CBLCallToActionCardProps {
  className?: string;
}

const CBLCallToActionCard: React.FC<CBLCallToActionCardProps> = ({ className = '' }) => {
  return (
    <Card className={`bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-200 dark:border-blue-800 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <Crown className="w-5 h-5 mr-2 text-yellow-600" />
          Want to run your own board?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Become a Community Board Leader and earn rewards while managing your own football squares community.
        </p>
        
        <div className="space-y-2 text-xs">
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Users className="w-3 h-3 mr-2 text-blue-500" />
            <span>Manage multiple game boards</span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <TrendingUp className="w-3 h-3 mr-2 text-green-500" />
            <span>Earn leadership rewards</span>
          </div>
        </div>

        <Button asChild size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
          <Link href="/cbl/overview" className="flex items-center justify-center">
            Learn More
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default CBLCallToActionCard;