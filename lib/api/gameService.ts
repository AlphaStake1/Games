// Game Service - Handles NFL schedule and game data integration
// Replaces mock game generation with real NFL API integration

import {
  ApiResponse,
  ApiErrorCode,
  GameScheduleResponse,
  NFLScheduleFilters,
  GameStatus,
  PaginatedResponse,
  PaginationParams,
} from './types';
import { GameSchedule } from '@/lib/boardTypes';
import { NFLTeam, NFL_TEAMS, getTeamById } from '@/lib/nflTeams';
import { mockDataService } from './mockDataService';

// NFL API Configuration
const NFL_API_BASE_URL =
  process.env.NEXT_PUBLIC_NFL_API_URL || 'https://api.nfl.com/v1';
const FALLBACK_API_URL =
  process.env.NEXT_PUBLIC_FALLBACK_NFL_API ||
  'https://site.api.espn.com/apis/site/v2/sports/football/nfl';
const API_TIMEOUT = 15000; // 15 seconds for external APIs

export class GameService {
  private static instance: GameService;
  private cache: Map<string, { data: any; expiry: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor() {
    // Bind methods to preserve context
    this.getCurrentSeason = this.getCurrentSeason.bind(this);
    this.getCurrentWeek = this.getCurrentWeek.bind(this);
  }

  static getInstance(): GameService {
    if (!GameService.instance) {
      GameService.instance = new GameService();
    }
    return GameService.instance;
  }

  // Generic request handler with caching and fallback
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    useCache: boolean = true,
  ): Promise<ApiResponse<T>> {
    const cacheKey = `${endpoint}_${JSON.stringify(options)}`;

    // Check cache first
    if (useCache) {
      const cached = this.cache.get(cacheKey);
      if (cached && cached.expiry > Date.now()) {
        return {
          success: true,
          data: cached.data,
          timestamp: Date.now(),
        };
      }
    }

    const urls = [
      `${NFL_API_BASE_URL}${endpoint}`,
      `${FALLBACK_API_URL}${endpoint}`,
    ];

    for (const url of urls) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

        const response = await fetch(url, {
          ...options,
          headers: {
            Accept: 'application/json',
            'User-Agent': 'WeeklyFootballSquares/1.0',
            ...options.headers,
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // Cache successful responses
        if (useCache) {
          this.cache.set(cacheKey, {
            data: data.data || data,
            expiry: Date.now() + this.CACHE_DURATION,
          });
        }

        return {
          success: true,
          data: data.data || data,
          timestamp: Date.now(),
        };
      } catch (error) {
        console.warn(
          `Failed to fetch from ${url}:`,
          error instanceof Error ? error.message : String(error),
        );
        // Continue to next URL
      }
    }

    // All URLs failed - fallback to mock data
    console.warn('NFL API calls failed, falling back to mock data');

    // Try to extract mock data based on endpoint
    if (endpoint.includes('/schedule')) {
      const mockGames = mockDataService.generateWeeklyGames();
      return {
        success: true,
        data: mockGames as any as T,
        timestamp: Date.now(),
      };
    }

    return {
      success: false,
      error: {
        code: ApiErrorCode.NETWORK_ERROR,
        message: 'Failed to fetch data from all available sources',
        retryable: true,
      },
      timestamp: Date.now(),
    };
  }

  // Get current NFL season
  getCurrentSeason(): number {
    const now = new Date();
    const currentYear = now.getFullYear();
    // NFL season typically starts in September
    return now.getMonth() >= 8 ? currentYear : currentYear - 1;
  }

  // Get current NFL week
  getCurrentWeek(): number {
    // For development purposes, always return week 10 to simulate mid-season
    // In production, this would calculate based on the actual NFL schedule
    return 10;

    // Original calculation (commented out for development):
    // const now = new Date();
    // const seasonStart = new Date(this.getCurrentSeason(), 8, 1); // September 1st
    // const diffTime = now.getTime() - seasonStart.getTime();
    // const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
    // return Math.max(1, Math.min(18, diffWeeks + 1)); // Weeks 1-18
  }

  // Get NFL schedule with filters
  async getSchedule(
    filters: NFLScheduleFilters = {},
  ): Promise<ApiResponse<GameScheduleResponse[]>> {
    const params = new URLSearchParams();

    // Set defaults
    const season = filters.season || this.getCurrentSeason();
    const week = filters.week || this.getCurrentWeek();

    params.append('season', season.toString());
    if (week) params.append('week', week.toString());
    if (filters.teamId) params.append('team', filters.teamId);
    if (filters.gameType) params.append('seasonType', filters.gameType);

    const endpoint = `/schedule?${params.toString()}`;
    const response = await this.makeRequest<any>(endpoint);

    if (!response.success) {
      return response as ApiResponse<GameScheduleResponse[]>;
    }

    // Transform the response to our format
    try {
      const games = this.transformScheduleResponse(response.data);
      return {
        success: true,
        data: games,
        timestamp: response.timestamp,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: ApiErrorCode.VALIDATION_ERROR,
          message: 'Failed to parse schedule data',
          details: {
            error: error instanceof Error ? error.message : String(error),
          },
        },
        timestamp: Date.now(),
      };
    }
  }

  // Get games for a specific team
  async getTeamGames(
    teamId: string,
    options: {
      season?: number;
      weeks?: number[];
      upcoming?: boolean;
    } = {},
  ): Promise<ApiResponse<GameScheduleResponse[]>> {
    console.log('GameService.getTeamGames called with:', { teamId, options });

    const season = options.season || this.getCurrentSeason();
    const team = getTeamById(teamId);

    if (!team) {
      console.error('Invalid team ID:', teamId);
      return {
        success: false,
        error: {
          code: ApiErrorCode.VALIDATION_ERROR,
          message: `Invalid team ID: ${teamId}`,
        },
        timestamp: Date.now(),
      };
    }

    const filters: NFLScheduleFilters = {
      season,
      teamId,
    };

    try {
      const allGamesResponse = await this.getSchedule(filters);

      if (!allGamesResponse.success) {
        throw new Error('API fetch failed, using mock data fallback');
      }

      let games = allGamesResponse.data!;
      if (options.upcoming) {
        games = games.filter((game) => {
          const gameDate = new Date(game.gameDate);
          return gameDate >= new Date();
        });
      }

      if (options.weeks && options.weeks.length > 0) {
        games = games.filter((game) => options.weeks!.includes(game.week));
      }

      return {
        success: true,
        data: games,
        timestamp: allGamesResponse.timestamp,
      };
    } catch (error) {
      console.warn(
        'API call failed, falling back to mock data for getTeamGames:',
        error,
      );
      return mockDataService.getTeamGames(teamId, {
        upcomingOnly: options.upcoming,
        season,
        weeks: options.weeks,
      });
    }
  }

  // Get live game status and scores
  async getGameStatus(gameId: string): Promise<ApiResponse<GameStatus>> {
    const endpoint = `/games/${gameId}/status`;
    const response = await this.makeRequest<any>(endpoint, {}, false); // Don't cache live data

    if (!response.success) {
      return response as ApiResponse<GameStatus>;
    }

    try {
      const gameStatus = this.transformGameStatusResponse(response.data);
      return {
        success: true,
        data: gameStatus,
        timestamp: response.timestamp,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: ApiErrorCode.VALIDATION_ERROR,
          message: 'Failed to parse game status data',
          details: {
            error: error instanceof Error ? error.message : String(error),
          },
        },
        timestamp: Date.now(),
      };
    }
  }

  // Get multiple game statuses efficiently
  async getBatchGameStatuses(
    gameIds: string[],
  ): Promise<ApiResponse<Record<string, GameStatus>>> {
    const endpoint = '/games/batch-status';
    const response = await this.makeRequest<any>(
      endpoint,
      {
        method: 'POST',
        body: JSON.stringify({ gameIds }),
        headers: { 'Content-Type': 'application/json' },
      },
      false,
    );

    if (!response.success) {
      return response as ApiResponse<Record<string, GameStatus>>;
    }

    try {
      const statuses: Record<string, GameStatus> = {};
      for (const [gameId, statusData] of Object.entries(response.data)) {
        statuses[gameId] = this.transformGameStatusResponse(statusData);
      }

      return {
        success: true,
        data: statuses,
        timestamp: response.timestamp,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: ApiErrorCode.VALIDATION_ERROR,
          message: 'Failed to parse batch game status data',
          details: {
            error: error instanceof Error ? error.message : String(error),
          },
        },
        timestamp: Date.now(),
      };
    }
  }

  // Convert API response to our GameScheduleResponse format
  private transformScheduleResponse(data: any): GameScheduleResponse[] {
    // Handle different API response formats
    const games = data.games || data.events || data;

    if (!Array.isArray(games)) {
      throw new Error('Invalid schedule response format');
    }

    return (games as any[])
      .map((game: any) => {
        // ESPN API format
        if (game.competitions) {
          const competition = game.competitions[0];
          const teams = competition.competitors;
          const homeTeam = teams.find((t: any) => t.homeAway === 'home');
          const awayTeam = teams.find((t: any) => t.homeAway === 'away');

          return {
            gameId: game.id,
            week: game.week?.number || this.getCurrentWeek(),
            homeTeam: this.findNFLTeam(homeTeam.team.abbreviation),
            awayTeam: this.findNFLTeam(awayTeam.team.abbreviation),
            gameDate: game.date,
            kickoffTime: game.date,
            isPlayoffs: game.season?.type === 3,
            gameType: this.mapGameType(game.season?.type) as
              | 'regular'
              | 'wildcard'
              | 'divisional'
              | 'conference'
              | 'superbowl',
            season: game.season?.year || this.getCurrentSeason(),
            venue: {
              name: competition.venue?.fullName || '',
              city: competition.venue?.address?.city || '',
              state: competition.venue?.address?.state || '',
            },
          };
        }

        // NFL API format
        return {
          gameId: game.gameId || game.id,
          week: game.week,
          homeTeam: this.findNFLTeam(
            game.homeTeam?.abbreviation || game.home?.abbreviation,
          ),
          awayTeam: this.findNFLTeam(
            game.awayTeam?.abbreviation || game.away?.abbreviation,
          ),
          gameDate: game.gameDate || game.date,
          kickoffTime: game.gameTime || game.date,
          isPlayoffs: game.isPlayoffs || false,
          gameType: (game.gameType || 'regular') as
            | 'regular'
            | 'wildcard'
            | 'divisional'
            | 'conference'
            | 'superbowl',
          season: game.season || this.getCurrentSeason(),
          venue: game.venue,
          weather: game.weather,
        };
      })
      .filter((game) => game.homeTeam && game.awayTeam); // Filter out invalid games
  }

  // Convert API game status to our format
  private transformGameStatusResponse(data: any): GameStatus {
    // Handle different API formats
    if (data.competitions) {
      // ESPN format
      const competition = data.competitions[0];
      const status = competition.status;
      const teams = competition.competitors;
      const homeTeam = teams.find((t: any) => t.homeAway === 'home');
      const awayTeam = teams.find((t: any) => t.homeAway === 'away');

      return {
        gameId: data.id,
        status: this.mapGameStatus(status.type.name) as
          | 'scheduled'
          | 'pregame'
          | 'live'
          | 'halftime'
          | 'final'
          | 'postponed'
          | 'cancelled',
        quarter: this.mapQuarter(status.period) as any,
        timeRemaining: status.displayClock,
        homeScore: parseInt(homeTeam.score) || 0,
        awayScore: parseInt(awayTeam.score) || 0,
        lastUpdated: new Date().toISOString(),
        homeScoreByQuarter: homeTeam.linescores?.map((l: any) => l.value) || [],
        awayScoreByQuarter: awayTeam.linescores?.map((l: any) => l.value) || [],
        isOvertimeGame: status.period > 4,
      };
    }

    // NFL API format
    return {
      gameId: data.gameId || data.id,
      status: data.status,
      quarter: data.quarter,
      timeRemaining: data.timeRemaining,
      homeScore: data.homeScore || 0,
      awayScore: data.awayScore || 0,
      lastUpdated: data.lastUpdated || new Date().toISOString(),
      homeScoreByQuarter: data.homeScoreByQuarter || [],
      awayScoreByQuarter: data.awayScoreByQuarter || [],
      isOvertimeGame: data.isOvertimeGame || false,
      winningSquares: data.winningSquares,
    };
  }

  // Utility methods
  private findNFLTeam(abbreviation: string): NFLTeam {
    const team = NFL_TEAMS.find(
      (t) => t.abbreviation.toLowerCase() === abbreviation?.toLowerCase(),
    );

    if (!team) {
      console.warn(`Unknown team abbreviation: ${abbreviation}`);
      // Return a default team to prevent crashes
      return {
        id: 'unknown',
        name: 'Unknown',
        city: 'Unknown',
        abbreviation: abbreviation || 'UNK',
        conference: 'AFC',
        division: 'North',
        primaryColor: '#666666',
        secondaryColor: '#999999',
        logoUrl: '/assets/teams/default.png',
      };
    }

    return team;
  }

  private mapGameType(
    seasonType: number,
  ): 'regular' | 'wildcard' | 'divisional' | 'conference' | 'superbowl' {
    switch (seasonType) {
      case 1:
        return 'regular';
      case 2:
        return 'regular';
      case 3:
        return 'wildcard';
      case 4:
        return 'divisional';
      case 5:
        return 'conference';
      case 6:
        return 'superbowl';
      default:
        return 'regular';
    }
  }

  private mapGameStatus(
    status: string,
  ):
    | 'scheduled'
    | 'pregame'
    | 'live'
    | 'halftime'
    | 'final'
    | 'postponed'
    | 'cancelled' {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('scheduled')) return 'scheduled';
    if (statusLower.includes('pregame')) return 'pregame';
    if (statusLower.includes('in progress') || statusLower.includes('live'))
      return 'live';
    if (statusLower.includes('halftime')) return 'halftime';
    if (statusLower.includes('final')) return 'final';
    if (statusLower.includes('postponed')) return 'postponed';
    if (statusLower.includes('cancelled')) return 'cancelled';
    return 'scheduled';
  }

  private mapQuarter(period: number): string {
    if (period <= 4) return period.toString() as any;
    return 'OT';
  }

  // Convert GameScheduleResponse to our internal GameSchedule format
  convertToGameSchedule(gameResponse: GameScheduleResponse): GameSchedule {
    return {
      gameId: gameResponse.gameId,
      week: gameResponse.week,
      homeTeam: gameResponse.homeTeam,
      awayTeam: gameResponse.awayTeam,
      gameDate: new Date(gameResponse.gameDate),
      isPlayoffs: gameResponse.isPlayoffs,
      gameType: gameResponse.gameType,
    };
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear();
  }

  // Get cache stats
  getCacheStats(): { size: number; entries: string[] } {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys()),
    };
  }
}

// Export singleton instance
export const gameService = GameService.getInstance();

// Utility functions
export const GameUtils = {
  // Check if game is live
  isGameLive(status: GameStatus): boolean {
    return status.status === 'live';
  },

  // Check if game is completed
  isGameCompleted(status: GameStatus): boolean {
    return status.status === 'final';
  },

  // Check if game is upcoming
  isGameUpcoming(gameDate: string): boolean {
    return new Date(gameDate) > new Date();
  },

  // Get time until game starts
  getTimeUntilGame(gameDate: string): number {
    const game = new Date(gameDate);
    const now = new Date();
    return Math.max(0, game.getTime() - now.getTime());
  },

  // Format game time for display
  formatGameTime(gameDate: string): string {
    const date = new Date(gameDate);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
    });
  },
};
