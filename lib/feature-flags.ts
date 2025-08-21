/**
 * Feature Flag System for A/B Testing
 * Allows parallel testing of UX improvements vs original design
 */

import React from 'react';

export type FeatureFlags = {
  // UX Improvement Flags
  enhancedNavigation: boolean;
  progressiveHomepage: boolean;
  mobileOptimization: boolean;
  accessibilityEnhancements: boolean;

  // Deployment Environment
  useNewUX: boolean;

  // Traffic Split (0-100)
  newUXTrafficPercentage: number;
};

// Default flags for different environments
const defaultFlags: Record<string, FeatureFlags> = {
  development: {
    enhancedNavigation: true,
    progressiveHomepage: true,
    mobileOptimization: true,
    accessibilityEnhancements: true,
    useNewUX: true,
    newUXTrafficPercentage: 100,
  },

  production: {
    enhancedNavigation: false,
    progressiveHomepage: false,
    mobileOptimization: false,
    accessibilityEnhancements: false,
    useNewUX: false,
    newUXTrafficPercentage: 20, // Start with 20% traffic
  },

  staging: {
    enhancedNavigation: true,
    progressiveHomepage: true,
    mobileOptimization: true,
    accessibilityEnhancements: true,
    useNewUX: true,
    newUXTrafficPercentage: 50,
  },
};

// Environment detection
const getEnvironment = (): string => {
  if (typeof window === 'undefined') {
    return process.env.NODE_ENV || 'development';
  }

  const hostname = window.location.hostname;
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    return 'development';
  }
  if (hostname.includes('staging') || hostname.includes('preview')) {
    return 'staging';
  }
  return 'production';
};

// Feature flag getter with environment override
export const getFeatureFlags = (): FeatureFlags => {
  const env = getEnvironment();
  const baseFlags = defaultFlags[env] || defaultFlags.development;

  // Allow URL override for testing (development only)
  if (env === 'development' && typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const forceNewUX = urlParams.get('newux');

    if (forceNewUX === 'true') {
      return { ...baseFlags, useNewUX: true, newUXTrafficPercentage: 100 };
    }
    if (forceNewUX === 'false') {
      return { ...baseFlags, useNewUX: false, newUXTrafficPercentage: 0 };
    }
  }

  // Traffic-based A/B testing in production
  if (env === 'production' && typeof window !== 'undefined') {
    const userId = getUserId(); // Get consistent user ID
    const userBucket = hashUserId(userId) % 100;
    const shouldUseNewUX = userBucket < baseFlags.newUXTrafficPercentage;

    return {
      ...baseFlags,
      useNewUX: shouldUseNewUX,
      enhancedNavigation: shouldUseNewUX,
      progressiveHomepage: shouldUseNewUX,
      mobileOptimization: shouldUseNewUX,
      accessibilityEnhancements: shouldUseNewUX,
    };
  }

  return baseFlags;
};

// Utility functions
const getUserId = (): string => {
  // Check for existing user ID in localStorage
  let userId = localStorage.getItem('ab_test_user_id');
  if (!userId) {
    // Generate consistent user ID based on browser fingerprint
    userId = generateUserFingerprint();
    localStorage.setItem('ab_test_user_id', userId);
  }
  return userId;
};

const generateUserFingerprint = (): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Fingerprint text', 2, 2);
  }

  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    canvas.toDataURL(),
  ].join('|');

  return btoa(fingerprint).substring(0, 16);
};

const hashUserId = (userId: string): number => {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    const char = userId.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
};

// React hook for feature flags

export const useFeatureFlags = (): FeatureFlags => {
  const [flags, setFlags] = React.useState<FeatureFlags>(getFeatureFlags());

  React.useEffect(() => {
    // Re-evaluate flags on client side
    setFlags(getFeatureFlags());
  }, []);

  return flags;
};

// Analytics tracking for A/B tests
export const trackFeatureFlagUsage = (
  flag: keyof FeatureFlags,
  enabled: boolean,
) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'feature_flag_usage', {
      flag_name: flag,
      flag_enabled: enabled,
      user_id: getUserId(),
      environment: getEnvironment(),
    });
  }
};
