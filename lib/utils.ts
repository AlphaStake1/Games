import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { NFLTeam } from './nflTeams';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getTeamColorStrip(
  homeTeam: NFLTeam,
  awayTeam: NFLTeam,
): {
  homeColor: string;
  awayColor: string;
} {
  const normalizeColor = (color: string): string =>
    color.toLowerCase().replace('#', '');

  const homeColorNorm = normalizeColor(homeTeam.primaryColor);
  const awayColorNorm = normalizeColor(awayTeam.primaryColor);

  // If both teams have the same primary color, use home primary + away secondary
  if (homeColorNorm === awayColorNorm) {
    return {
      homeColor: homeTeam.primaryColor,
      awayColor: awayTeam.secondaryColor,
    };
  }

  // Check for Colts special case (only one color and white/silver)
  const isColtsType = (team: NFLTeam): boolean => {
    const secondary = normalizeColor(team.secondaryColor);
    return (
      secondary === 'ffffff' ||
      secondary === 'a2aaad' ||
      secondary === 'a5acaf' ||
      secondary === 'b0b7bc' ||
      secondary === '869397'
    );
  };

  // If home team is Colts-type and away team has blue primary, use away secondary
  if (
    isColtsType(homeTeam) &&
    awayColorNorm.includes('00') &&
    (awayColorNorm.includes('2244') ||
      awayColorNorm.includes('2265') ||
      awayColorNorm.includes('2340') ||
      awayColorNorm.includes('2c5f') ||
      awayColorNorm.includes('3594') ||
      awayColorNorm.includes('76b6') ||
      awayColorNorm.includes('80c6') ||
      awayColorNorm.includes('85ca'))
  ) {
    return {
      homeColor: homeTeam.primaryColor,
      awayColor: awayTeam.secondaryColor,
    };
  }

  // If away team is Colts-type and home team has blue primary, use home primary + away secondary
  if (
    isColtsType(awayTeam) &&
    homeColorNorm.includes('00') &&
    (homeColorNorm.includes('2244') ||
      homeColorNorm.includes('2265') ||
      homeColorNorm.includes('2340') ||
      homeColorNorm.includes('2c5f') ||
      homeColorNorm.includes('3594') ||
      homeColorNorm.includes('76b6') ||
      homeColorNorm.includes('80c6') ||
      homeColorNorm.includes('85ca'))
  ) {
    return {
      homeColor: homeTeam.primaryColor,
      awayColor: awayTeam.secondaryColor,
    };
  }

  // Default: Home primary + Away primary
  return {
    homeColor: homeTeam.primaryColor,
    awayColor: awayTeam.primaryColor,
  };
}
