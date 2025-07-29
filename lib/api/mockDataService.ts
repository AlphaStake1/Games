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
    currentWeek: number = 10,
    season: number = 2024,
  ): GameScheduleResponse[] {
    const games: GameScheduleResponse[] = [];
    const today = new Date();

    // Create games for 4 weeks: current week + next 3 weeks
    for (let week = currentWeek; week < currentWeek + 4; week++) {
      const weekGames = this.generateWeekGames(week, season, today);
      games.push(...weekGames);
    }

    return games;
  }

  // Get games organized by week for the game selector
  getGamesByWeek(
    currentWeek: number = 10,
    season: number = 2024,
  ): Map<number, GameScheduleResponse[]> {
    const gamesByWeek = new Map<number, GameScheduleResponse[]>();
    const today = new Date();

    // Create games for 4 weeks: current week + next 3 weeks
    for (let week = currentWeek; week < currentWeek + 4; week++) {
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

    // Calculate the date for this week (assuming games are played on Sundays)
    const daysFromNow = (week - 10) * 7; // Assuming current week is 10
    const gameDate = new Date(baseDate);
    gameDate.setDate(gameDate.getDate() + daysFromNow);

    // Generate different matchups for each week to create variety
    const weeklyMatchups = this.getMatchupsForWeek(week);

    weeklyMatchups.forEach((matchup, index) => {
      const homeTeam = getTeamById(matchup[0]);
      const awayTeam = getTeamById(matchup[1]);

      if (homeTeam && awayTeam) {
        const gameTime = new Date(gameDate);
        gameTime.setHours(13 + (index % 3), 0, 0, 0); // Games at 1PM, 2PM, 3PM etc.

        games.push({
          gameId: `nfl_${season}_w${week}_${matchup[1]}_${matchup[0]}_${Date.now()}_${index}`,
          week,
          homeTeam,
          awayTeam,
          gameDate: gameTime.toISOString(),
          kickoffTime: gameTime.toISOString(),
          isPlayoffs: false,
          gameType: 'regular',
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

  // Generate different matchups for each week to provide variety
  private getMatchupsForWeek(week: number): string[][] {
    const allMatchups = [
      // Week 10 matchups
      [
        ['dal', 'phi'], // Cowboys vs Eagles
        ['kc', 'buf'], // Chiefs vs Bills
        ['sf', 'sea'], // 49ers vs Seahawks
        ['gb', 'det'], // Packers vs Lions
        ['ne', 'mia'], // Patriots vs Dolphins
        ['den', 'lv'], // Broncos vs Raiders
        ['pit', 'bal'], // Steelers vs Ravens
        ['lar', 'ari'], // Rams vs Cardinals
      ],
      // Week 11 matchups
      [
        ['was', 'dal'], // Commanders vs Cowboys
        ['buf', 'nyj'], // Bills vs Jets
        ['sea', 'lar'], // Seahawks vs Rams
        ['chi', 'min'], // Bears vs Vikings
        ['mia', 'ne'], // Dolphins vs Patriots
        ['lv', 'kc'], // Raiders vs Chiefs
        ['bal', 'cin'], // Ravens vs Bengals
        ['ari', 'sf'], // Cardinals vs 49ers
      ],
      // Week 12 matchups
      [
        ['nyg', 'dal'], // Giants vs Cowboys
        ['buf', 'mia'], // Bills vs Dolphins
        ['sf', 'gb'], // 49ers vs Packers
        ['det', 'chi'], // Lions vs Bears
        ['nyj', 'ne'], // Jets vs Patriots
        ['kc', 'den'], // Chiefs vs Broncos
        ['cin', 'pit'], // Bengals vs Steelers
        ['lar', 'sea'], // Rams vs Seahawks
      ],
      // Week 13 matchups
      [
        ['dal', 'ten'], // Cowboys vs Titans
        ['mia', 'buf'], // Dolphins vs Bills
        ['gb', 'min'], // Packers vs Vikings
        ['chi', 'det'], // Bears vs Lions
        ['ne', 'nyj'], // Patriots vs Jets
        ['den', 'kc'], // Broncos vs Chiefs
        ['pit', 'cin'], // Steelers vs Bengals
        ['sea', 'ari'], // Seahawks vs Cardinals
      ],
    ];

    const weekIndex = (week - 10) % allMatchups.length;
    return allMatchups[weekIndex] || allMatchups[0];
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
      case 'tier_1':
        return 5;
      case 'tier_2':
        return 10;
      case 'tier_3':
        return 20;
      case 'tier_4':
        return 50;
      case 'tier_5':
        return 100;
      case 'tier_6':
        return 250;
      case 'tier_7':
        return 500;
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

    const { upcomingOnly = false, count = 10, season = 2024, weeks } = options;
    console.log('MockDataService: Parsed options:', {
      upcomingOnly,
      count,
      season,
      weeks,
    });

    const allGames = this.generateWeeklyGames(10, season);
    let teamGames = allGames.filter(
      (game) => game.homeTeam.id === teamId || game.awayTeam.id === teamId,
    );

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
    const tiers = [
      'tier_1',
      'tier_2',
      'tier_3',
      'tier_4',
      'tier_5',
      'tier_6',
      'tier_7',
    ];
    const boards = tiers.map((tierId) =>
      this.generateBoardAvailability(gameId, tierId),
    );

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
    const allGames = this.generateWeeklyGames();
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
      title: `Next 3 ${userTeam.city} ${userTeam.name} Games - Weekly House Boards`,
      games: teamGames,
    };
  }
}

export const mockDataService = MockDataService.getInstance();
