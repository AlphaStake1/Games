/**
 * Lazy loading wrapper for large content components
 * Provides performance optimization through React.lazy and Suspense
 */

'use client';

import React, { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader } from '@/lib/icons';
import { colors } from '@/lib/design-tokens';

interface LazyContentWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const DefaultFallback = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <Card className="w-96 text-center">
      <CardHeader>
        <CardTitle className="flex items-center justify-center gap-2">
          <Loader
            className="w-6 h-6 animate-spin"
            style={{ color: colors.primary.blue }}
          />
          Loading Content
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">
          Please wait while we prepare the content for you...
        </p>
      </CardContent>
    </Card>
  </div>
);

export const LazyContentWrapper: React.FC<LazyContentWrapperProps> = ({
  children,
  fallback = <DefaultFallback />,
}) => {
  return <Suspense fallback={fallback}>{children}</Suspense>;
};

// Higher-order component for creating memoized content components
export const withMemoization = <P extends object>(
  Component: React.ComponentType<P>,
  displayName?: string,
) => {
  const MemoizedComponent = React.memo(Component);

  if (displayName) {
    MemoizedComponent.displayName = displayName;
  }

  return MemoizedComponent;
};

// Lazy loading factory for content components
export const createLazyComponent = <P extends Record<string, any>>(
  importFunction: () => Promise<{ default: React.ComponentType<P> }>,
  fallback?: React.ReactNode,
) => {
  const LazyComponent = React.lazy(importFunction);

  return (props: P) => (
    <LazyContentWrapper fallback={fallback}>
      <LazyComponent {...(props as any)} />
    </LazyContentWrapper>
  );
};
