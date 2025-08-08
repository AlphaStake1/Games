# Deployment Guide - Football Squares Testnet Release

This guide covers the complete deployment process for the testnet release, including environment setup, testing, and security verification.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and pnpm
- Docker (for security scanning)
- Git configured with proper hooks

### Environment Setup

1. **Update `.env.local`** with required variables:

```bash
# Solana Configuration
NEXT_PUBLIC_SOLANA_NETWORK=testnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.testnet.solana.com

# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://your-api-server.com
NEXT_PUBLIC_WS_URL=wss://your-websocket-server.com

# Optional: Premium RPC for better performance
# NEXT_PUBLIC_SOLANA_RPC_URL=https://solana-testnet.alchemyapi.io/v2/YOUR_KEY
```

2. **Install dependencies:**

```bash
pnpm install
```

3. **Run development server:**

```bash
pnpm run dev
```

## 🧪 Testing Pipeline

### 1. Run E2E Tests

```bash
# Run all Playwright tests
pnpm run test:e2e

# Run with UI for debugging
pnpm run test:e2e:ui

# Run specific test file
pnpm run test:e2e tests/e2e/app-shell.spec.ts
```

### 2. Security Scanning

```bash
# Frontend security scan
pnpm run security:frontend

# Check for secrets
pnpm run security:secrets

# TypeScript compilation check
pnpm run lint && tsc --noEmit
```

### 3. Build Verification

```bash
# Production build
pnpm run build

# Test production build locally
pnpm run start
```

## 🔒 Security Configuration

### Pre-push Hooks

Git hooks automatically run security checks before pushing:

- Frontend security scanning with semgrep
- Secrets detection
- TypeScript compilation check

### Content Security Policy

CSP headers are automatically configured based on environment. For production deployment, ensure:

- `NEXT_PUBLIC_BASE_URL` is set correctly
- API and WebSocket URLs are whitelisted
- External services (RPC, analytics) are included

### Environment Validation

The app validates required environment variables on startup:

- **Required**: `NEXT_PUBLIC_SOLANA_RPC_URL`
- **Recommended**: `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_WS_URL`
- Warnings shown for missing optional variables

## 🏗️ Production Deployment

### 1. Environment Configuration

```bash
# Production environment variables
NODE_ENV=production
NEXT_PUBLIC_SOLANA_NETWORK=testnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.testnet.solana.com
NEXT_PUBLIC_API_BASE_URL=https://api.footballsquares.app
NEXT_PUBLIC_WS_URL=wss://ws.footballsquares.app
NEXT_PUBLIC_BASE_URL=https://footballsquares.app

# Optional: Error reporting
NEXT_PUBLIC_ENABLE_ERROR_REPORTING=true
NEXT_PUBLIC_ERROR_ENDPOINT=https://errors.footballsquares.app

# Optional: API configuration
NEXT_PUBLIC_USE_PRODUCTION_APIS=true
NEXT_PUBLIC_USE_MOCKS=false
```

### 2. Build and Deploy

```bash
# Production build with static export
pnpm run build

# Deploy the ./out directory to your hosting provider
# (Vercel, Netlify, AWS S3 + CloudFront, etc.)
```

### 3. Post-deployment Verification

- [ ] Network banner shows correct network (Testnet)
- [ ] WebSocket connections establish successfully
- [ ] RPC connections are healthy (check network banner)
- [ ] All major routes load without errors
- [ ] Chat widget opens/closes properly
- [ ] Board selection interface displays correctly

## 🔧 State Management Architecture

The app uses Zustand stores for centralized state:

### NetworkStore

- RPC connection status and latency
- WebSocket connectivity
- Network validation

### WalletStore

- Wallet connection state
- Network mismatch detection
- Transaction tracking

### BoardStore

- Board availability and selection
- Loading states per game
- Error handling

### UserPrefsStore

- UI preferences (theme, layout)
- Notification settings
- Onboarding progress
- Persisted in localStorage

## 🐛 Error Handling & Telemetry

### Client Error Reporting

Errors are automatically captured and reported:

```typescript
import { showError, reportError } from '@/lib/notifications/toastManager';
import { errorReporter } from '@/lib/telemetry/errorReporter';

// Automatic error reporting with user-friendly toast
showError('Connection failed', networkError);

// Manual error reporting
errorReporter.captureAPIError(error, '/api/boards', 500);
```

### Toast Notifications

Structured notifications for all user interactions:

- API errors with retry actions
- Wallet errors with contextual help
- WebSocket connection status
- Transaction confirmations

## 📊 Real-time Features

### WebSocket Connection

- Automatic reconnection with exponential backoff
- Online/offline detection
- Message queuing during disconnections
- Heartbeat monitoring

### Real-time Updates

- Board availability updates
- Game status changes
- Transaction confirmations
- Debounced UI updates (250ms) to prevent jitter

## 🎯 Performance Optimizations

### API Configuration

- Smart fallback to mocks in development
- Production endpoint validation
- Timeout and retry configuration
- Rate limiting and backoff

### UI Performance

- Debounced real-time updates
- Lazy loading for heavy components
- Optimized image loading
- Reduced chat latency (500-900ms)

## 📱 Accessibility Features

### Chat Widget

- ARIA live regions for screen readers
- Keyboard navigation (Escape to minimize)
- localStorage state persistence
- Focus management

### Board Selector

- Price/rake badges for immediate clarity
- Kickoff countdown timers
- Clear availability indicators
- VIP upgrade prompts

## 🔍 Monitoring & Debugging

### Development Tools

```bash
# View error reports
console.log(errorReporter.getRecentErrors());

# Check WebSocket status
console.log(websocketService.getStatus());

# Inspect store state
console.log(useNetworkStore.getState());
console.log(useBoardStore.getState());
```

### Production Monitoring

- Client error reporting to external service
- Network status monitoring
- WebSocket connection health
- Performance metrics (Web Vitals)

## 🚨 Troubleshooting

### Common Issues

**Network Banner Not Showing**

- Verify `NEXT_PUBLIC_SOLANA_NETWORK` is set
- Check RPC URL accessibility
- Ensure NetworkBanner is imported in layout

**WebSocket Connection Failed**

- Check `NEXT_PUBLIC_WS_URL` format (ws:// or wss://)
- Verify WebSocket server is running
- Check browser network tab for connection errors

**Board Data Not Loading**

- Verify API endpoints are accessible
- Check console for API errors
- Ensure mock fallbacks are working in development

**Wallet Connection Issues**

- Check network mismatch warnings
- Verify Solana network configuration
- Test with different wallet adapters

### Performance Issues

- Enable React DevTools Profiler
- Check WebSocket message frequency
- Monitor bundle size with `pnpm run build --analyze`
- Use Lighthouse for performance auditing

## 📋 Pre-release Checklist

- [ ] All environment variables configured
- [ ] E2E tests passing
- [ ] Security scans clean
- [ ] Build succeeds without warnings
- [ ] Network banner displays correctly
- [ ] WebSocket connections stable
- [ ] Error handling working
- [ ] Toast notifications functioning
- [ ] Accessibility features verified
- [ ] Mobile responsive design tested
- [ ] Performance metrics acceptable

## 🔄 Post-launch Monitoring

### Key Metrics

- Network connection success rate
- WebSocket uptime
- Error reporting volume
- User engagement (board joins)
- Performance (Core Web Vitals)

### Alerts Setup

- API error rate > 5%
- WebSocket disconnection rate > 10%
- Client error spikes
- RPC latency > 2 seconds

---

This deployment guide ensures a smooth testnet launch with proper monitoring, security, and user experience optimization.
