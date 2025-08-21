/**
 * Version Switcher Component
 * Allows switching between original and enhanced UX versions
 */

'use client';

import React from 'react';
import { useFeatureFlags, type FeatureFlags } from '@/lib/feature-flags';
import UnifiedSidebar from './UnifiedSidebar';
import { EnhancedUnifiedSidebar } from './enhanced/EnhancedUnifiedSidebar';

// Component wrapper for feature flag conditional rendering
export const FeatureFlag: React.FC<{
  flag: keyof FeatureFlags;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ flag, children, fallback = null }) => {
  const flags = useFeatureFlags();

  return flags[flag] ? <>{children}</> : <>{fallback}</>;
};

export const NavigationVersionSwitcher: React.FC = () => {
  const flags = useFeatureFlags();

  return (
    <FeatureFlag flag="enhancedNavigation" fallback={<UnifiedSidebar />}>
      <EnhancedUnifiedSidebar />
    </FeatureFlag>
  );
};

// Development-only version switcher UI
export const DevVersionControls: React.FC = () => {
  const flags = useFeatureFlags();

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const toggleNewUX = () => {
    const currentUrl = new URL(window.location.href);
    const newUXParam = currentUrl.searchParams.get('newux');

    if (newUXParam === 'true') {
      currentUrl.searchParams.set('newux', 'false');
    } else {
      currentUrl.searchParams.set('newux', 'true');
    }

    window.location.href = currentUrl.toString();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-gray-900 text-white p-4 rounded-lg shadow-lg">
      <h3 className="text-sm font-semibold mb-2">UX Version Control</h3>
      <div className="space-y-2 text-xs">
        <div>Current: {flags.useNewUX ? 'Enhanced UX' : 'Original UX'}</div>
        <button
          onClick={toggleNewUX}
          className="px-3 py-1 bg-blue-600 rounded text-white hover:bg-blue-700"
        >
          Switch Version
        </button>
        <div className="mt-2 space-y-1">
          <div>Enhanced Nav: {flags.enhancedNavigation ? '✓' : '✗'}</div>
          <div>Progressive Home: {flags.progressiveHomepage ? '✓' : '✗'}</div>
          <div>Mobile Opt: {flags.mobileOptimization ? '✓' : '✗'}</div>
          <div>
            A11y Enhanced: {flags.accessibilityEnhancements ? '✓' : '✗'}
          </div>
        </div>
      </div>
    </div>
  );
};
