interface APIConfig {
  useProductionEndpoints: boolean;
  useMockFallback: boolean;
  endpoints: {
    api: string;
    websocket: string;
    nfl: string;
    fallbackNfl?: string;
  };
  timeouts: {
    api: number;
    websocket: number;
    nfl: number;
  };
  retries: {
    maxRetries: number;
    backoffMultiplier: number;
    maxBackoffMs: number;
  };
}

function getEnvironment(): 'development' | 'production' | 'test' {
  if (typeof window === 'undefined') {
    return (process.env.NODE_ENV as any) || 'development';
  }
  return (process.env.NODE_ENV as any) || 'development';
}

function getAPIConfig(): APIConfig {
  const env = getEnvironment();
  const isDev = env === 'development';
  const isProduction = env === 'production';

  // In production, prefer real endpoints unless explicitly configured to use mocks
  const useProductionEndpoints =
    isProduction || process.env.NEXT_PUBLIC_USE_PRODUCTION_APIS === 'true';

  // Allow mocks in development or when explicitly enabled
  const useMockFallback =
    (isDev && process.env.NEXT_PUBLIC_USE_MOCKS !== 'false') ||
    process.env.NEXT_PUBLIC_USE_MOCKS === 'true';

  const config: APIConfig = {
    useProductionEndpoints,
    useMockFallback,
    endpoints: {
      api:
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        (isDev ? 'http://localhost:3001' : ''),
      websocket:
        process.env.NEXT_PUBLIC_WS_URL || (isDev ? 'ws://localhost:8080' : ''),
      nfl:
        process.env.NEXT_PUBLIC_NFL_API_URL ||
        'https://api.sportsdata.io/v3/nfl',
      fallbackNfl: process.env.NEXT_PUBLIC_FALLBACK_NFL_API,
    },
    timeouts: {
      api: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT_MS || '10000'),
      websocket: parseInt(process.env.NEXT_PUBLIC_WS_TIMEOUT_MS || '5000'),
      nfl: parseInt(process.env.NEXT_PUBLIC_NFL_TIMEOUT_MS || '8000'),
    },
    retries: {
      maxRetries: parseInt(process.env.NEXT_PUBLIC_MAX_RETRIES || '3'),
      backoffMultiplier: parseFloat(
        process.env.NEXT_PUBLIC_BACKOFF_MULTIPLIER || '1.5',
      ),
      maxBackoffMs: parseInt(process.env.NEXT_PUBLIC_MAX_BACKOFF_MS || '10000'),
    },
  };

  // Validation
  if (isProduction && !config.endpoints.api) {
    console.error('Missing NEXT_PUBLIC_API_BASE_URL in production');
  }

  if (isProduction && !config.endpoints.websocket) {
    console.error('Missing NEXT_PUBLIC_WS_URL in production');
  }

  // Log configuration in development
  if (isDev) {
    console.log('API Configuration:', {
      environment: env,
      useProductionEndpoints: config.useProductionEndpoints,
      useMockFallback: config.useMockFallback,
      endpoints: config.endpoints,
    });
  }

  return config;
}

export const apiConfig = getAPIConfig();

export function shouldUseMocks(): boolean {
  return apiConfig.useMockFallback && !apiConfig.useProductionEndpoints;
}

export function shouldFallbackToMocks(error?: Error): boolean {
  if (!apiConfig.useMockFallback) return false;

  // Fallback scenarios:
  // 1. Network errors (no connection)
  // 2. 5xx server errors
  // 3. Timeout errors
  if (error) {
    const errorMessage = error.message.toLowerCase();
    return (
      errorMessage.includes('network') ||
      errorMessage.includes('timeout') ||
      errorMessage.includes('500') ||
      errorMessage.includes('502') ||
      errorMessage.includes('503') ||
      errorMessage.includes('504')
    );
  }

  return false;
}

export function getEndpoint(service: keyof APIConfig['endpoints']): string {
  const endpoint = apiConfig.endpoints[service];
  if (!endpoint) {
    throw new Error(`Missing endpoint configuration for service: ${service}`);
  }
  return endpoint;
}

export function getTimeout(service: keyof APIConfig['timeouts']): number {
  return apiConfig.timeouts[service];
}

export function getRetryConfig() {
  return apiConfig.retries;
}
