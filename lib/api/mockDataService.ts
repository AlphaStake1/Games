// Mock Data Service - Provides sample NFL schedule and board data for development
// This replaces external API calls that are failing

import {
  GameScheduleResponse,
  BoardAvailabilityResponse,
  BoardState,
  GameStatus,
  ApiResponse,
} from './types';
import { NFL_TEAMS, NFLTeam, getTeamById } from '@/lib/nflTeams';

export class MockDataService {
  private static instance: MockDataService;

  static getInstance(): MockDataService {
    if (!MockDataService.instance) {
      MockDataService.instance = new MockDataService();
    }
    return MockDataService.instance;
  }

  // Generate mock NFL schedule for Weekly House boards
  generateWeeklyGames(
    currentWeek: number = 1,
    season: number = 2025,
  ): GameScheduleResponse[] {
    const games: GameScheduleResponse[] = [];
    const today = new Date(); // Use current real date for proper development

    // Create games for entire season (18 weeks + playoffs)
    for (let week = 1; week <= 22; week++) {
      const weekGames = this.generateWeekGames(week, season, today);
      games.push(...weekGames);
    }

    return games;
  }

  // Get games organized by week for the game selector
  getGamesByWeek(
    currentWeek: number = 1,
    season: number = 2025,
  ): Map<number, GameScheduleResponse[]> {
    const gamesByWeek = new Map<number, GameScheduleResponse[]>();
    const today = new Date(); // Use current real date

    // Create games for entire season (18 weeks + playoffs)
    for (let week = 1; week <= 22; week++) {
      const weekGames = this.generateWeekGames(week, season, today);
      gamesByWeek.set(week, weekGames);
    }

    return gamesByWeek;
  }

  private generateWeekGames(
    week: number,
    season: number,
    baseDate: Date,
  ): GameScheduleResponse[] {
    const games: GameScheduleResponse[] = [];

    // Calculate the date for this week
    // For development, use current date as base and spread games around it
    const now = new Date();
    const seasonStartDate = new Date(now);
    seasonStartDate.setDate(now.getDate() - 7); // Start season a week ago
    const daysFromSeasonStart = (week - 1) * 7; // Each week is 7 days apart
    const gameDate = new Date(seasonStartDate);
    gameDate.setDate(gameDate.getDate() + daysFromSeasonStart);

    // Generate different matchups for each week to create variety
    const weeklyMatchups = this.getMatchupsForWeek(week);

    weeklyMatchups.forEach((matchup, index) => {
      const homeTeam = getTeamById(matchup[0]);
      const awayTeam = getTeamById(matchup[1]);

      if (homeTeam && awayTeam) {
        const gameTime = new Date(gameDate);

        // Set game times for different slots (Thursday, Sunday, Monday)
        if (index === 0 && week > 1) {
          // Thursday Night Football (except week 1)
          gameTime.setDate(gameTime.getDate() + 4); // Thursday
          gameTime.setHours(20, 15, 0, 0); // 8:15 PM ET
        } else if (index === weeklyMatchups.length - 1 && week > 1) {
          // Monday Night Football
          gameTime.setDate(gameTime.getDate() + 8); // Monday
          gameTime.setHours(20, 15, 0, 0); // 8:15 PM ET
        } else {
          // Sunday games
          gameTime.setDate(gameTime.getDate() + 6); // Sunday
          const timeSlots = [13, 16, 20]; // 1PM, 4PM, 8PM ET
          gameTime.setHours(timeSlots[index % timeSlots.length], 0, 0, 0);
        }

        const isPlayoffs = week > 18;
        const gameType = isPlayoffs ? this.getPlayoffGameType(week) : 'regular';

        games.push({
          gameId: `nfl_${season}_w${week}_${matchup[1]}_at_${matchup[0]}`,
          week,
          homeTeam,
          awayTeam,
          gameDate: gameTime.toISOString(),
          kickoffTime: gameTime.toISOString(),
          isPlayoffs,
          gameType,
          season,
          venue: {
            name: `${homeTeam.city} Stadium`,
            city: homeTeam.city,
            state: 'XX',
          },
        });
      }
    });

    return games;
  }

  // Get playoff game type based on week
  private getPlayoffGameType(
    week: number,
  ): 'wildcard' | 'divisional' | 'conference' | 'superbowl' {
    if (week === 19) return 'wildcard';
    if (week === 20) return 'divisional';
    if (week === 21) return 'conference';
    if (week === 22) return 'superbowl';
    return 'wildcard';
  }

  // Generate different matchups for each week to provide variety
  private getMatchupsForWeek(week: number): string[][] {
    // Full 2025 NFL Season Schedule with Dallas Cowboys games
    const allMatchups: string[][][] = [
      // Week 1 - September 4-8, 2025
      [
        ['dal', 'cle'], // Cowboys vs Browns (Thursday Night opener)
        ['buf', 'mia'], // Bills vs Dolphins
        ['gb', 'chi'], // Packers vs Bears
        ['kc', 'cin'], // Chiefs vs Bengals
        ['sf', 'pit'], // 49ers vs Steelers
        ['sea', 'den'], // Seahawks vs Broncos
        ['lar', 'ari'], // Rams vs Cardinals
        ['ne', 'phi'], // Patriots vs Eagles (Monday Night)
      ],
      // Week 2 - September 11-15, 2025
      [
        ['phi', 'dal'], // Eagles vs Cowboys (NFC East rivalry)
        ['buf', 'nyj'], // Bills vs Jets
        ['det', 'gb'], // Lions vs Packers
        ['bal', 'cin'], // Ravens vs Bengals
        ['sf', 'lar'], // 49ers vs Rams
        ['kc', 'lv'], // Chiefs vs Raiders
        ['ten', 'hou'], // Titans vs Texans
        ['pit', 'ne'], // Steelers vs Patriots (Monday Night)
      ],
      // Week 3 - September 18-22, 2025
      [
        ['dal', 'was'], // Cowboys vs Commanders (NFC East)
        ['mia', 'buf'], // Dolphins vs Bills
        ['min', 'gb'], // Vikings vs Packers
        ['cin', 'pit'], // Bengals vs Steelers
        ['lar', 'sf'], // Rams vs 49ers
        ['den', 'kc'], // Broncos vs Chiefs
        ['ari', 'sea'], // Cardinals vs Seahawks
        ['chi', 'det'], // Bears vs Lions (Monday Night)
      ],
      // Week 4 - September 25-29, 2025
      [
        ['nyg', 'dal'], // Giants vs Cowboys (NFC East)
        ['buf', 'bal'], // Bills vs Ravens
        ['gb', 'min'], // Packers vs Vikings
        ['pit', 'cin'], // Steelers vs Bengals
        ['sf', 'sea'], // 49ers vs Seahawks
        ['kc', 'lar'], // Chiefs vs Rams
        ['lv', 'den'], // Raiders vs Broncos
        ['phi', 'was'], // Eagles vs Commanders (Monday Night)
      ],
      // Week 5 - October 2-6, 2025
      [
        ['dal', 'car'], // Cowboys vs Panthers
        ['nyj', 'buf'], // Jets vs Bills
        ['det', 'min'], // Lions vs Vikings
        ['bal', 'pit'], // Ravens vs Steelers
        ['sea', 'lar'], // Seahawks vs Rams
        ['ari', 'sf'], // Cardinals vs 49ers
        ['den', 'lv'], // Broncos vs Raiders
        ['kc', 'ne'], // Chiefs vs Patriots (Monday Night)
      ],
      // Week 6 - October 9-13, 2025
      [
        ['tb', 'dal'], // Buccaneers vs Cowboys
        ['buf', 'ten'], // Bills vs Titans
        ['chi', 'gb'], // Bears vs Packers
        ['cin', 'bal'], // Bengals vs Ravens
        ['sf', 'ari'], // 49ers vs Cardinals
        ['lar', 'sea'], // Rams vs Seahawks
        ['kc', 'den'], // Chiefs vs Broncos
        ['pit', 'lv'], // Steelers vs Raiders (Monday Night)
      ],
      // Week 7 - October 16-20, 2025
      [
        ['dal', 'det'], // Cowboys vs Lions
        ['mia', 'nyj'], // Dolphins vs Jets
        ['gb', 'was'], // Packers vs Commanders
        ['pit', 'bal'], // Steelers vs Ravens
        ['sf', 'kc'], // 49ers vs Chiefs
        ['sea', 'ari'], // Seahawks vs Cardinals
        ['den', 'lar'], // Broncos vs Rams
        ['buf', 'ne'], // Bills vs Patriots (Monday Night)
      ],
      // Week 8 - October 23-27, 2025
      [
        ['atl', 'dal'], // Falcons vs Cowboys
        ['nyj', 'ne'], // Jets vs Patriots
        ['min', 'det'], // Vikings vs Lions
        ['bal', 'cin'], // Ravens vs Bengals
        ['lar', 'sf'], // Rams vs 49ers
        ['lv', 'kc'], // Raiders vs Chiefs
        ['ari', 'den'], // Cardinals vs Broncos
        ['gb', 'chi'], // Packers vs Bears (Monday Night)
      ],
      // Week 9 - October 30-November 3, 2025
      [
        ['dal', 'no'], // Cowboys vs Saints
        ['buf', 'mia'], // Bills vs Dolphins
        ['det', 'gb'], // Lions vs Packers
        ['pit', 'cin'], // Steelers vs Bengals
        ['sf', 'sea'], // 49ers vs Seahawks
        ['kc', 'ari'], // Chiefs vs Cardinals
        ['den', 'lv'], // Broncos vs Raiders
        ['phi', 'nyg'], // Eagles vs Giants (Monday Night)
      ],
      // Week 10 - November 6-10, 2025
      [
        ['phi', 'dal'], // Eagles vs Cowboys (NFC East rivalry)
        ['mia', 'buf'], // Dolphins vs Bills
        ['chi', 'min'], // Bears vs Vikings
        ['cin', 'bal'], // Bengals vs Ravens
        ['sea', 'sf'], // Seahawks vs 49ers
        ['lar', 'kc'], // Rams vs Chiefs
        ['lv', 'ari'], // Raiders vs Cardinals
        ['gb', 'det'], // Packers vs Lions (Monday Night)
      ],
      // Week 11 - November 13-17, 2025
      [
        ['dal', 'hou'], // Cowboys vs Texans (Texas rivalry)
        ['nyj', 'buf'], // Jets vs Bills
        ['min', 'gb'], // Vikings vs Packers
        ['bal', 'pit'], // Ravens vs Steelers
        ['sf', 'lar'], // 49ers vs Rams
        ['den', 'kc'], // Broncos vs Chiefs
        ['ari', 'sea'], // Cardinals vs Seahawks
        ['ne', 'mia'], // Patriots vs Dolphins (Monday Night)
      ],
      // Week 12 - November 20-24, 2025 (Thanksgiving Week)
      [
        ['dal', 'nyg'], // Cowboys vs Giants (Thanksgiving Day)
        ['det', 'chi'], // Lions vs Bears (Thanksgiving Day)
        ['buf', 'ne'], // Bills vs Patriots
        ['gb', 'min'], // Packers vs Vikings
        ['pit', 'cin'], // Steelers vs Bengals
        ['sf', 'ari'], // 49ers vs Cardinals
        ['kc', 'lv'], // Chiefs vs Raiders
        ['sea', 'lar'], // Seahawks vs Rams
      ],
      // Week 13 - November 27-December 1, 2025
      [
        ['was', 'dal'], // Commanders vs Cowboys (NFC East)
        ['mia', 'nyj'], // Dolphins vs Jets
        ['det', 'min'], // Lions vs Vikings
        ['bal', 'cin'], // Ravens vs Bengals
        ['lar', 'sf'], // Rams vs 49ers
        ['ari', 'kc'], // Cardinals vs Chiefs
        ['den', 'sea'], // Broncos vs Seahawks
        ['phi', 'buf'], // Eagles vs Bills (Monday Night)
      ],
      // Week 14 - December 4-8, 2025
      [
        ['dal', 'cin'], // Cowboys vs Bengals
        ['buf', 'lar'], // Bills vs Rams
        ['gb', 'det'], // Packers vs Lions
        ['pit', 'bal'], // Steelers vs Ravens
        ['sf', 'chi'], // 49ers vs Bears
        ['kc', 'sea'], // Chiefs vs Seahawks
        ['lv', 'ari'], // Raiders vs Cardinals
        ['ne', 'nyj'], // Patriots vs Jets (Monday Night)
      ],
      // Week 15 - December 11-15, 2025
      [
        ['car', 'dal'], // Panthers vs Cowboys
        ['nyj', 'mia'], // Jets vs Dolphins
        ['min', 'chi'], // Vikings vs Bears
        ['cin', 'pit'], // Bengals vs Steelers
        ['sea', 'sf'], // Seahawks vs 49ers
        ['ari', 'lar'], // Cardinals vs Rams
        ['den', 'kc'], // Broncos vs Chiefs
        ['buf', 'det'], // Bills vs Lions (Monday Night)
      ],
      // Week 16 - December 18-22, 2025
      [
        ['dal', 'tb'], // Cowboys vs Buccaneers
        ['ne', 'buf'], // Patriots vs Bills
        ['det', 'chi'], // Lions vs Bears
        ['bal', 'pit'], // Ravens vs Steelers
        ['sf', 'den'], // 49ers vs Broncos
        ['lar', 'ari'], // Rams vs Cardinals
        ['kc', 'lv'], // Chiefs vs Raiders
        ['sea', 'gb'], // Seahawks vs Packers (Monday Night)
      ],
      // Week 17 - December 25-29, 2025
      [
        ['was', 'dal'], // Commanders vs Cowboys (rivalry finale)
        ['buf', 'nyj'], // Bills vs Jets
        ['gb', 'min'], // Packers vs Vikings
        ['cin', 'bal'], // Bengals vs Ravens
        ['sf', 'lar'], // 49ers vs Rams
        ['sea', 'ari'], // Seahawks vs Cardinals
        ['kc', 'den'], // Chiefs vs Broncos
        ['pit', 'ne'], // Steelers vs Patriots
      ],
      // Week 18 - January 1-5, 2026 (Regular Season Finale)
      [
        ['dal', 'phi'], // Cowboys vs Eagles (season finale)
        ['mia', 'buf'], // Dolphins vs Bills
        ['det', 'gb'], // Lions vs Packers
        ['pit', 'bal'], // Steelers vs Ravens
        ['lar', 'sf'], // Rams vs 49ers
        ['ari', 'sea'], // Cardinals vs Seahawks
        ['lv', 'kc'], // Raiders vs Chiefs
        ['nyj', 'ne'], // Jets vs Patriots
      ],
      // Week 19 - January 8-12, 2026 (Wild Card Round)
      [
        ['dal', 'tb'], // Cowboys vs Buccaneers (Wild Card)
        ['buf', 'den'], // Bills vs Broncos (Wild Card)
        ['gb', 'phi'], // Packers vs Eagles (Wild Card)
        ['pit', 'hou'], // Steelers vs Texans (Wild Card)
        ['lar', 'min'], // Rams vs Vikings (Wild Card)
        ['kc', 'mia'], // Chiefs vs Dolphins (Wild Card)
      ],
      // Week 20 - January 15-19, 2026 (Divisional Round)
      [
        ['dal', 'sf'], // Cowboys vs 49ers (Divisional)
        ['buf', 'bal'], // Bills vs Ravens (Divisional)
        ['gb', 'det'], // Packers vs Lions (Divisional)
        ['kc', 'hou'], // Chiefs vs Texans (Divisional)
      ],
      // Week 21 - January 22-26, 2026 (Conference Championships)
      [
        ['dal', 'gb'], // Cowboys vs Packers (NFC Championship)
        ['buf', 'kc'], // Bills vs Chiefs (AFC Championship)
      ],
      // Week 22 - February 8, 2026 (Super Bowl LX)
      [
        ['dal', 'buf'], // Cowboys vs Bills (Super Bowl)
      ],
    ];

    // Return the appropriate week's matchups, fallback to week 1 if out of bounds
    if (week >= 1 && week <= allMatchups.length) {
      return allMatchups[week - 1];
    }

    // Fallback for any week beyond our schedule
    return allMatchups[0];
  }

  // Generate mock board availability for a game
  generateBoardAvailability(
    gameId: string,
    tierId: string,
  ): BoardAvailabilityResponse {
    const boardId = `${gameId}_${tierId}_${Date.now()}`;
    const fillPercentage = Math.floor(Math.random() * 80) + 10; // 10-90% filled
    const totalSquaresSold = Math.floor(fillPercentage);

    return {
      boardId,
      gameId,
      tierId,
      isActive: true,
      isLocked: false,
      isCancelled: false,
      boardState: BoardState.OPEN,
      totalSquaresSold,
      availableSquares: 100 - totalSquaresSold,
      createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // Created 1 hour ago
      lastUpdated: new Date().toISOString(),
      pricePerSquare: this.getTierPrice(tierId),
      maxSquaresPerUser: tierId.includes('vip') ? 10 : 5,
      fillPercentage,
      cancellationThreshold: 95,
      vrfStatus: {
        isRandomized: false,
        randomizationTxHash: undefined,
        randomizationTimestamp: undefined,
        homeNumbers: undefined,
        awayNumbers: undefined,
      },
    };
  }

  private getTierPrice(tierId: string): number {
    switch (tierId) {
      case 'tier-5':
        return 5;
      case 'tier-10':
        return 10;
      case 'tier-20':
        return 20;
      case 'tier-50':
        return 50;
      case 'tier-100':
        return 100;
      case 'tier-250':
        return 250;
      case 'tier-500':
        return 500;
      case 'tier-1000':
        return 1000;
      default:
        return 5;
    }
  }

  // Get games for a specific team with flexible options
  async getTeamGames(
    teamId: string,
    options: {
      upcomingOnly?: boolean;
      count?: number;
      season?: number;
      weeks?: number[];
    } = {},
  ): Promise<ApiResponse<GameScheduleResponse[]>> {
    console.log('MockDataService.getTeamGames called with:', {
      teamId,
      options,
    });

    const team = getTeamById(teamId);
    console.log('MockDataService: Team lookup result:', {
      teamId,
      team: team ? team.abbreviation : 'NOT_FOUND',
    });
    if (!team) {
      console.error('MockDataService: Invalid team ID:', teamId);
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: `Invalid team ID: ${teamId}`,
        },
        timestamp: Date.now(),
      };
    }

    const { upcomingOnly = false, count = 10, season = 2025, weeks } = options;
    console.log('MockDataService: Parsed options:', {
      upcomingOnly,
      count,
      season,
      weeks,
    });

    const allGames = this.generateWeeklyGames(1, season);
    console.log('MockDataService: Generated total games:', allGames.length);
    let teamGames = allGames.filter(
      (game) => game.homeTeam.id === teamId || game.awayTeam.id === teamId,
    );
    console.log('MockDataService: Team games found:', teamGames.length);

    // Filter by weeks if specified
    if (weeks && weeks.length > 0) {
      teamGames = teamGames.filter((game) => weeks.includes(game.week));
    }

    // Filter upcoming games if requested
    if (upcomingOnly) {
      const now = new Date();
      teamGames = teamGames.filter((game) => {
        const gameDate = new Date(game.gameDate);
        return gameDate >= now;
      });
    }

    // Limit results if count is specified
    if (count > 0) {
      teamGames = teamGames.slice(0, count);
    }

    console.log('MockDataService: Returning games:', {
      success: true,
      gamesCount: teamGames.length,
      firstGame: teamGames[0]
        ? {
            gameId: teamGames[0].gameId,
            week: teamGames[0].week,
            homeTeam: teamGames[0].homeTeam.abbreviation,
            awayTeam: teamGames[0].awayTeam.abbreviation,
          }
        : null,
    });

    return {
      success: true,
      data: teamGames,
      timestamp: Date.now(),
    };
  }

  // Get games for a specific team (upcoming only) - legacy method
  async getTeamUpcomingGames(
    teamId: string,
    count: number = 3,
  ): Promise<ApiResponse<GameScheduleResponse[]>> {
    return this.getTeamGames(teamId, { upcomingOnly: true, count });
  }

  // Get boards for a specific game
  async getGameBoards(
    gameId: string,
  ): Promise<ApiResponse<BoardAvailabilityResponse[]>> {
    console.log('MockDataService.getGameBoards called with gameId:', gameId);
    const tiers = [
      'tier-5',
      'tier-10',
      'tier-20',
      'tier-50',
      'tier-100',
      'tier-250',
      'tier-500',
      'tier-1000',
    ];
    const boards = tiers.map((tierId) =>
      this.generateBoardAvailability(gameId, tierId),
    );

    console.log('MockDataService.getGameBoards: Generated boards:', {
      gameId,
      boardCount: boards.length,
      firstBoard: boards[0]
        ? {
            boardId: boards[0].boardId,
            tierId: boards[0].tierId,
            pricePerSquare: boards[0].pricePerSquare,
            availableSquares: boards[0].availableSquares,
          }
        : null,
    });

    return {
      success: true,
      data: boards,
      timestamp: Date.now(),
    };
  }

  // Get game status (mock)
  async getGameStatus(gameId: string): Promise<ApiResponse<GameStatus>> {
    const mockStatus: GameStatus = {
      gameId,
      status: 'scheduled',
      quarter: 1,
      timeRemaining: '15:00',
      homeScore: 0,
      awayScore: 0,
      lastUpdated: new Date().toISOString(),
      homeScoreByQuarter: [0, 0, 0, 0],
      awayScoreByQuarter: [0, 0, 0, 0],
      isOvertimeGame: false,
    };

    return {
      success: true,
      data: mockStatus,
      timestamp: Date.now(),
    };
  }

  // Generate next 3 games projection specifically for Weekly House boards
  generateNext3GamesProjection(userTeam: NFLTeam): {
    title: string;
    games: Array<{
      gameId: string;
      week: number;
      opponent: NFLTeam;
      isHome: boolean;
      gameDate: Date;
      availableTiers: Array<{
        tierId: string;
        tierName: string;
        pricePerSquare: number;
        estimatedFillRate: number;
        isVipOnly: boolean;
      }>;
    }>;
  } {
    const allGames = this.generateWeeklyGames(1, 2025);
    const teamGames = allGames
      .filter(
        (game) =>
          game.homeTeam.id === userTeam.id || game.awayTeam.id === userTeam.id,
      )
      .slice(0, 3)
      .map((game) => {
        const isHome = game.homeTeam.id === userTeam.id;
        const opponent = isHome ? game.awayTeam : game.homeTeam;

        return {
          gameId: game.gameId,
          week: game.week,
          opponent,
          isHome,
          gameDate: new Date(game.gameDate),
          availableTiers: [
            {
              tierId: 'tier_1',
              tierName: 'Tier 1 - Casual',
              pricePerSquare: 5,
              estimatedFillRate: Math.floor(Math.random() * 30) + 60, // 60-90%
              isVipOnly: false,
            },
            {
              tierId: 'tier_2',
              tierName: 'Tier 2 - Standard',
              pricePerSquare: 10,
              estimatedFillRate: Math.floor(Math.random() * 25) + 50, // 50-75%
              isVipOnly: false,
            },
            {
              tierId: 'tier_3',
              tierName: 'Tier 3 - Premium',
              pricePerSquare: 20,
              estimatedFillRate: Math.floor(Math.random() * 20) + 30, // 30-50%
              isVipOnly: false,
            },
            {
              tierId: 'tier_5',
              tierName: 'Tier 5 - VIP Elite',
              pricePerSquare: 100,
              estimatedFillRate: Math.floor(Math.random() * 15) + 15, // 15-30%
              isVipOnly: true,
            },
          ],
        };
      });

    return {
      title: `Next 3 ${userTeam.city} ${userTeam.name} Games - 2025 Season`,
      games: teamGames,
    };
  }
}

export const mockDataService = MockDataService.getInstance();
