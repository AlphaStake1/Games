// Content Security Policy configuration for production

export interface CSPDirectives {
  'default-src': string[];
  'script-src': string[];
  'style-src': string[];
  'img-src': string[];
  'connect-src': string[];
  'font-src': string[];
  'object-src': string[];
  'media-src': string[];
  'frame-src': string[];
  'worker-src': string[];
  'child-src': string[];
  'form-action': string[];
  'base-uri': string[];
  'manifest-src': string[];
}

function getCSPDirectives(): CSPDirectives {
  const isProduction = process.env.NODE_ENV === 'production';
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || 'https://footballsquares.app';
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  const wsUrl = process.env.NEXT_PUBLIC_WS_URL || '';
  const heroMediaUrl = process.env.NEXT_PUBLIC_HERO_MEDIA_URL || '';
  const heroMediaAltUrl = process.env.NEXT_PUBLIC_HERO_MEDIA_ALT || '';

  // Extract domains from URLs
  const apiDomain = apiUrl ? new URL(apiUrl).origin : '';
  const wsDomain = wsUrl ? new URL(wsUrl).origin.replace('http', 'ws') : '';
  const heroMediaOrigin = heroMediaUrl ? new URL(heroMediaUrl).origin : '';
  const heroMediaAltOrigin = heroMediaAltUrl
    ? new URL(heroMediaAltUrl).origin
    : '';

  return {
    'default-src': ["'self'"],

    'script-src': [
      "'self'",
      "'unsafe-inline'", // Next.js requires this for development
      "'unsafe-eval'", // Required for React DevTools and Next.js
      ...(isProduction ? [] : ["'unsafe-eval'"]), // Remove unsafe-eval in production
      // Wallet adapters and blockchain libraries
      'https://cdn.jsdelivr.net',
      'https://unpkg.com',
      // Embeds
      'https://tenor.com',
      // Analytics (if used)
      'https://www.google-analytics.com',
      'https://www.googletagmanager.com',
      // Error reporting (if used)
      'https://*.sentry.io',
    ],

    'style-src': [
      "'self'",
      "'unsafe-inline'", // Required for CSS-in-JS and Tailwind
      // Google Fonts
      'https://fonts.googleapis.com',
      // CDN stylesheets
      'https://cdn.jsdelivr.net',
      'https://unpkg.com',
      ...(heroMediaOrigin ? [heroMediaOrigin] : []),
    ],

    'img-src': [
      "'self'",
      'data:', // For inline images and SVGs
      'blob:', // For generated images
      baseUrl,
      // Team logos and external images
      'https://*.nfl.com',
      'https://*.espn.com',
      'https://*.sportsdata.io',
      // Social media images
      'https://*.twitter.com',
      'https://*.instagram.com',
      // CDN images
      'https://cdn.jsdelivr.net',
      'https://unpkg.com',
      // Tenor media CDN
      'https://*.tenor.com',
      // Hero media origins
      ...(heroMediaOrigin ? [heroMediaOrigin] : []),
      ...(heroMediaAltOrigin ? [heroMediaAltOrigin] : []),
    ],

    'connect-src': [
      "'self'",
      baseUrl,
      // API endpoints
      ...(apiDomain ? [apiDomain] : []),
      // WebSocket connections
      ...(wsDomain ? [wsDomain] : []),
      'ws://localhost:*', // Development WebSocket
      'wss://localhost:*',
      // Solana RPC endpoints
      'https://api.mainnet-beta.solana.com',
      'https://api.testnet.solana.com',
      'https://api.devnet.solana.com',
      // Premium RPC providers
      'https://*.alchemyapi.io',
      'https://*.helius.xyz',
      'https://*.quiknode.pro',
      // NFL data APIs
      'https://*.sportsdata.io',
      'https://*.espn.com',
      // Analytics
      'https://www.google-analytics.com',
      'https://*.sentry.io',
    ],

    'font-src': [
      "'self'",
      // Google Fonts
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      // CDN fonts
      'https://cdn.jsdelivr.net',
    ],

    'object-src': ["'none'"], // Disable plugins

    'media-src': [
      "'self'",
      baseUrl,
      ...(heroMediaOrigin ? [heroMediaOrigin] : []),
      // Video/audio content
      'https://*.nfl.com',
      'https://*.youtube.com',
      // Tenor GIF/video variants
      'https://*.tenor.com',
    ],

    'frame-src': [
      // Wallet connection frames
      'https://phantom.app',
      'https://solflare.com',
      // Social media embeds (if needed)
      'https://www.youtube.com',
      'https://twitter.com',
      // Tenor embed
      'https://tenor.com',
      'https://*.tenor.com',
    ],

    'worker-src': [
      "'self'",
      'blob:', // For Web Workers
    ],

    'child-src': ["'self'", 'blob:'],

    'form-action': [
      "'self'",
      baseUrl,
      // Payment processors (if used)
    ],

    'base-uri': ["'self'"],

    'manifest-src': ["'self'"],
  };
}

export function generateCSPHeader(): string {
  const directives = getCSPDirectives();

  const cspString = Object.entries(directives)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ');

  return cspString;
}

// Nonce generation for inline scripts (if needed)
export function generateNonce(): string {
  const crypto = require('crypto');
  return crypto.randomBytes(16).toString('base64');
}

// CSP reporting (optional)
export function getCSPReportingConfig() {
  const reportingEndpoint = process.env.CSP_REPORT_URI;

  if (reportingEndpoint) {
    return {
      'report-uri': reportingEndpoint,
      'report-to': 'csp-violations',
    };
  }

  return {};
}

// Development vs Production CSP
export function getEnvironmentCSP(): string {
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (isDevelopment) {
    // More permissive CSP for development
    return [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://tenor.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: * https://*.tenor.com",
      "connect-src 'self' ws: wss: *",
      "font-src 'self' data: *",
      'frame-src https://tenor.com https://*.tenor.com',
      "media-src 'self' https://*.tenor.com",
    ].join('; ');
  }

  // Strict CSP for production
  return generateCSPHeader();
}

// Next.js security headers configuration
export function getSecurityHeaders() {
  return [
    {
      key: 'Content-Security-Policy',
      value: getEnvironmentCSP(),
    },
    {
      key: 'X-Frame-Options',
      value: 'DENY',
    },
    {
      key: 'X-Content-Type-Options',
      value: 'nosniff',
    },
    {
      key: 'Referrer-Policy',
      value: 'strict-origin-when-cross-origin',
    },
    {
      key: 'Permissions-Policy',
      value: 'camera=(), microphone=(), geolocation=()',
    },
    {
      key: 'Strict-Transport-Security',
      value: 'max-age=31536000; includeSubDomains',
    },
    {
      key: 'X-XSS-Protection',
      value: '1; mode=block',
    },
  ];
}
