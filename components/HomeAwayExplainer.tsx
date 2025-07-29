'use client';

import React from 'react';
import { Info, Home, Plane } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export type BoardType = 'geographic' | 'vip' | 'season' | 'general';

interface HomeAwayExplainerProps {
  boardType?: BoardType;
  variant?: 'tooltip' | 'inline' | 'card';
  className?: string;
}

const getExplanationContent = (boardType: BoardType) => {
  switch (boardType) {
    case 'geographic':
      return {
        title: 'Geographic Boards',
        homeDesc: 'Your chosen team (always displayed on top)',
        awayDesc: 'Opposition team (displayed on left side)',
        note: 'HOME team positioning is based on your geographic preference, not game location.',
      };
    case 'vip':
      return {
        title: 'VIP Boards',
        homeDesc: 'Team playing at their home stadium',
        awayDesc: "Team playing at opponent's stadium",
        note: 'HOME/AWAY reflects actual game location status.',
      };
    case 'season':
      return {
        title: 'Season/Half-Season Boards',
        homeDesc: 'Team playing at their home stadium',
        awayDesc: "Team playing at opponent's stadium",
        note: 'HOME/AWAY reflects actual game location for all games in the season.',
      };
    default:
      return {
        title: 'Board Layout',
        homeDesc: 'Team displayed horizontally across the top',
        awayDesc: 'Team displayed vertically along the left side',
        note: "WIN based on the last digit of each team's score.",
      };
  }
};

const TooltipExplainer: React.FC<{
  boardType: BoardType;
  className?: string;
}> = ({ boardType, className = '' }) => {
  const content = getExplanationContent(boardType);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            className={`inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 ${className}`}
          >
            <Info className="w-4 h-4" />
            <span className="text-sm font-medium">HOME/AWAY?</span>
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs p-4" side="bottom">
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">{content.title}</h4>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Home className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <span className="font-medium text-blue-600">HOME:</span>
                  <p className="text-xs text-gray-600">{content.homeDesc}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Plane className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                <div>
                  <span className="font-medium text-red-600">AWAY:</span>
                  <p className="text-xs text-gray-600">{content.awayDesc}</p>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 italic border-t pt-2">
              {content.note}
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const InlineExplainer: React.FC<{
  boardType: BoardType;
  className?: string;
}> = ({ boardType, className = '' }) => {
  const content = getExplanationContent(boardType);

  return (
    <div className={`flex flex-wrap items-center gap-2 text-sm ${className}`}>
      <div className="flex items-center gap-1">
        <Home className="w-4 h-4 text-blue-600" />
        <Badge variant="outline" className="text-xs">
          HOME: {content.homeDesc}
        </Badge>
      </div>
      <div className="flex items-center gap-1">
        <Plane className="w-4 h-4 text-red-600" />
        <Badge variant="outline" className="text-xs">
          AWAY: {content.awayDesc}
        </Badge>
      </div>
    </div>
  );
};

const CardExplainer: React.FC<{ boardType: BoardType; className?: string }> = ({
  boardType,
  className = '',
}) => {
  const content = getExplanationContent(boardType);

  return (
    <Card
      className={`border-blue-100 bg-blue-50 dark:bg-blue-950 dark:border-blue-800 ${className}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-blue-900 dark:text-blue-100">
              {content.title} - HOME/AWAY Explanation
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-start gap-2">
                <Home className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <span className="font-medium text-blue-700 dark:text-blue-300">
                    HOME:
                  </span>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {content.homeDesc}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Plane className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                <div>
                  <span className="font-medium text-red-700 dark:text-red-300">
                    AWAY:
                  </span>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {content.awayDesc}
                  </p>
                </div>
              </div>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-300 italic border-t border-blue-200 dark:border-blue-700 pt-2">
              💡 {content.note}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const HomeAwayExplainer: React.FC<HomeAwayExplainerProps> = ({
  boardType = 'general',
  variant = 'tooltip',
  className = '',
}) => {
  switch (variant) {
    case 'inline':
      return <InlineExplainer boardType={boardType} className={className} />;
    case 'card':
      return <CardExplainer boardType={boardType} className={className} />;
    default:
      return <TooltipExplainer boardType={boardType} className={className} />;
  }
};

export default HomeAwayExplainer;
