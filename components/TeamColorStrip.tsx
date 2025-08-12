'use client';

import React from 'react';
import { NFLTeam } from '@/lib/nflTeams';
import { getTeamColorStrip } from '@/lib/utils';

interface TeamColorStripProps {
  homeTeam: NFLTeam;
  awayTeam: NFLTeam;
  className?: string;
  separator?: 'V' | '/';
  height?: string;
}

const TeamColorStrip: React.FC<TeamColorStripProps> = ({
  homeTeam,
  awayTeam,
  className = '',
  separator = 'V',
  height = 'h-2',
}) => {
  const { homeColor, awayColor } = getTeamColorStrip(homeTeam, awayTeam);

  return (
    <div
      className={`relative flex items-center overflow-hidden rounded-t-lg ${height} ${className}`}
    >
      {/* Home team color (left side) */}
      <div className="flex-1 h-full" style={{ backgroundColor: homeColor }} />

      {/* Center separator */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-full w-6 h-6 flex items-center justify-center border-2 border-gray-200 dark:border-gray-600">
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
            {separator}
          </span>
        </div>
      </div>

      {/* Away team color (right side) */}
      <div className="flex-1 h-full" style={{ backgroundColor: awayColor }} />
    </div>
  );
};

export default TeamColorStrip;
