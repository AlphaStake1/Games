// Geolocation Service - Automatically assigns NFL teams based on user location
// Used to provide local team assignments for non-VIP users

import { NFLTeam, getTeamById } from './nflTeams';

// Geographic mappings for NFL teams by state and major cities
const TEAM_MAPPINGS = {
  // States with clear NFL team assignments
  AL: 'atl', // Alabama -> Atlanta Falcons
  AK: 'sea', // Alaska -> Seattle Seahawks
  AZ: 'ari', // Arizona -> Arizona Cardinals
  AR: 'no', // Arkansas -> New Orleans Saints
  CA: {
    // California has multiple teams - use cities
    'Los Angeles': 'lar',
    'San Francisco': 'sf',
    Oakland: 'sf',
    'San Diego': 'lar',
    Sacramento: 'sf',
    default: 'sf', // Default to 49ers for other CA cities
  },
  CO: 'den', // Colorado -> Denver Broncos
  CT: 'ne', // Connecticut -> New England Patriots
  DE: 'phi', // Delaware -> Philadelphia Eagles
  FL: {
    // Florida has multiple teams
    Miami: 'mia',
    Tampa: 'tb',
    Jacksonville: 'jax',
    Orlando: 'tb',
    default: 'mia',
  },
  GA: 'atl', // Georgia -> Atlanta Falcons
  HI: 'sf', // Hawaii -> San Francisco 49ers
  ID: 'sea', // Idaho -> Seattle Seahawks
  IL: 'chi', // Illinois -> Chicago Bears
  IN: 'ind', // Indiana -> Indianapolis Colts
  IA: 'kc', // Iowa -> Kansas City Chiefs
  KS: 'kc', // Kansas -> Kansas City Chiefs
  KY: 'cin', // Kentucky -> Cincinnati Bengals
  LA: 'no', // Louisiana -> New Orleans Saints
  ME: 'ne', // Maine -> New England Patriots
  MD: 'bal', // Maryland -> Baltimore Ravens
  MA: 'ne', // Massachusetts -> New England Patriots
  MI: 'det', // Michigan -> Detroit Lions
  MN: 'min', // Minnesota -> Minnesota Vikings
  MS: 'no', // Mississippi -> New Orleans Saints
  MO: 'kc', // Missouri -> Kansas City Chiefs
  MT: 'den', // Montana -> Denver Broncos
  NE: 'kc', // Nebraska -> Kansas City Chiefs
  NV: 'lv', // Nevada -> Las Vegas Raiders
  NH: 'ne', // New Hampshire -> New England Patriots
  NJ: 'nyj', // New Jersey -> New York Jets
  NM: 'den', // New Mexico -> Denver Broncos
  NY: {
    // New York has multiple teams
    'New York': 'nyj',
    Manhattan: 'nyj',
    Brooklyn: 'nyj',
    Queens: 'nyj',
    Bronx: 'nyj',
    'Staten Island': 'nyj',
    Buffalo: 'buf',
    Rochester: 'buf',
    Syracuse: 'buf',
    Albany: 'buf',
    default: 'nyj',
  },
  NC: 'car', // North Carolina -> Carolina Panthers
  ND: 'min', // North Dakota -> Minnesota Vikings
  OH: {
    // Ohio has multiple teams
    Cincinnati: 'cin',
    Cleveland: 'cle',
    Columbus: 'cin',
    Toledo: 'cle',
    default: 'cle',
  },
  OK: 'dal', // Oklahoma -> Dallas Cowboys
  OR: 'sea', // Oregon -> Seattle Seahawks
  PA: {
    // Pennsylvania has multiple teams
    Philadelphia: 'phi',
    Pittsburgh: 'pit',
    Harrisburg: 'phi',
    default: 'phi',
  },
  RI: 'ne', // Rhode Island -> New England Patriots
  SC: 'car', // South Carolina -> Carolina Panthers
  SD: 'min', // South Dakota -> Minnesota Vikings
  TN: 'ten', // Tennessee -> Tennessee Titans
  TX: {
    // Texas has multiple teams
    Dallas: 'dal',
    Houston: 'hou',
    Austin: 'dal',
    'San Antonio': 'dal',
    'Fort Worth': 'dal',
    'El Paso': 'dal',
    default: 'dal',
  },
  UT: 'den', // Utah -> Denver Broncos
  VT: 'ne', // Vermont -> New England Patriots
  VA: 'was', // Virginia -> Washington Commanders
  WA: 'sea', // Washington -> Seattle Seahawks
  WV: 'pit', // West Virginia -> Pittsburgh Steelers
  WI: 'gb', // Wisconsin -> Green Bay Packers
  WY: 'den', // Wyoming -> Denver Broncos
  DC: 'was', // Washington DC -> Washington Commanders
};

// International locations default to popular teams
const INTERNATIONAL_DEFAULTS = {
  Canada: 'buf', // Buffalo Bills (closest to most of Canada)
  Mexico: 'dal', // Dallas Cowboys (popular in Mexico)
  UK: 'ne', // New England Patriots (popular internationally)
  default: 'dal', // Dallas Cowboys as global default
};

interface GeolocationResult {
  team: NFLTeam;
  location: {
    city?: string;
    state?: string;
    country?: string;
  };
  isAutoAssigned: true;
}

export class GeolocationService {
  private static instance: GeolocationService;

  static getInstance(): GeolocationService {
    if (!GeolocationService.instance) {
      GeolocationService.instance = new GeolocationService();
    }
    return GeolocationService.instance;
  }

  // Get team assignment based on IP geolocation
  async getTeamByLocation(): Promise<GeolocationResult> {
    try {
      // Try to get location from IP geolocation API
      const locationData = await this.fetchLocationData();
      const teamId = this.getTeamIdFromLocation(locationData);
      const team = getTeamById(teamId);

      if (!team) {
        throw new Error(`Team not found for ID: ${teamId}`);
      }

      console.log('GeolocationService: Team assigned based on location:', {
        location: locationData,
        assignedTeam: team.abbreviation,
      });

      return {
        team,
        location: locationData,
        isAutoAssigned: true,
      };
    } catch (error) {
      console.error(
        'GeolocationService: Error getting location, using default:',
        error,
      );

      // Fallback to Dallas Cowboys if geolocation fails
      const defaultTeam = getTeamById('dal')!;
      return {
        team: defaultTeam,
        location: { country: 'Unknown' },
        isAutoAssigned: true,
      };
    }
  }

  // For demo/testing purposes - simulate Miami location
  getTeamByMockLocation(
    city: string = 'Miami',
    state: string = 'FL',
  ): GeolocationResult {
    const mockLocation = { city, state, country: 'US' };
    const teamId = this.getTeamIdFromLocation(mockLocation);
    const team = getTeamById(teamId)!;

    console.log('GeolocationService: Mock location team assignment:', {
      location: mockLocation,
      assignedTeam: team.abbreviation,
    });

    return {
      team,
      location: mockLocation,
      isAutoAssigned: true,
    };
  }

  // Fetch location data from IP geolocation service
  private async fetchLocationData(): Promise<{
    city?: string;
    state?: string;
    country?: string;
  }> {
    try {
      // Use a free IP geolocation service
      const response = await fetch('https://ipapi.co/json/', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Geolocation API request failed');
      }

      const data = await response.json();

      return {
        city: data.city,
        state: data.region_code, // US state code
        country: data.country_code,
      };
    } catch (error) {
      console.warn('Failed to fetch IP geolocation, using fallback');
      // For development/demo - simulate Miami location
      return { city: 'Miami', state: 'FL', country: 'US' };
    }
  }

  // Determine team ID based on location data
  private getTeamIdFromLocation(location: {
    city?: string;
    state?: string;
    country?: string;
  }): string {
    const { city, state, country } = location;

    // Handle US locations
    if (country === 'US' && state) {
      const stateMapping = TEAM_MAPPINGS[state as keyof typeof TEAM_MAPPINGS];

      if (typeof stateMapping === 'string') {
        return stateMapping;
      } else if (typeof stateMapping === 'object' && city) {
        // Handle states with multiple teams
        return (
          stateMapping[city as keyof typeof stateMapping] ||
          stateMapping.default
        );
      } else if (typeof stateMapping === 'object') {
        return stateMapping.default;
      }
    }

    // Handle international locations
    if (country && country !== 'US') {
      return (
        INTERNATIONAL_DEFAULTS[
          country as keyof typeof INTERNATIONAL_DEFAULTS
        ] || INTERNATIONAL_DEFAULTS.default
      );
    }

    // Default fallback
    return 'dal'; // Dallas Cowboys
  }

  // Check if user can change teams (VIP feature)
  canChangeTeam(isVIP: boolean): boolean {
    return isVIP;
  }

  // Get all available teams (for VIP users)
  getAllTeamsForSelection(): NFLTeam[] {
    if (!this.canChangeTeam(true)) {
      return [];
    }
    // Return all NFL teams for VIP users to choose from
    return []; // This would be populated from the full NFL teams list
  }
}

export const geolocationService = GeolocationService.getInstance();
