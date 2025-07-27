// Error Boundary Components for API Integration
// Provides graceful error handling and fallback UI

'use client';

import React, { Component, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, RefreshCw, Wifi, WifiOff, Bug } from '@/lib/icons';

// Props for Error Boundary
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  showErrorDetails?: boolean;
  retryButton?: boolean;
  onRetry?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

// Main Error Boundary Class Component
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log error for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <Card className="border-red-200 bg-red-50 dark:bg-red-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
              <AlertTriangle className="w-5 h-5" />
              Something went wrong
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-red-600 dark:text-red-400">
              An unexpected error occurred while loading this component.
            </p>

            {this.props.showErrorDetails && this.state.error && (
              <Alert>
                <Bug className="w-4 h-4" />
                <AlertDescription className="font-mono text-xs">
                  {this.state.error.message}
                </AlertDescription>
              </Alert>
            )}

            {this.props.retryButton && (
              <Button onClick={this.handleRetry} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            )}
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

// API Error Display Component
interface ApiErrorDisplayProps {
  error: string | null;
  retryAction?: () => void;
  className?: string;
}

export const ApiErrorDisplay: React.FC<ApiErrorDisplayProps> = ({
  error,
  retryAction,
  className = '',
}) => {
  if (!error) return null;

  return (
    <Alert className={`border-red-200 bg-red-50 dark:bg-red-950 ${className}`}>
      <AlertTriangle className="w-4 h-4" />
      <AlertDescription className="flex items-center justify-between">
        <span className="text-red-600 dark:text-red-400">{error}</span>
        {retryAction && (
          <Button onClick={retryAction} variant="outline" size="sm">
            <RefreshCw className="w-3 h-3 mr-1" />
            Retry
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};

// Loading State Component
interface LoadingStateProps {
  message?: string;
  showSpinner?: boolean;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  showSpinner = true,
  className = '',
}) => (
  <div className={`flex items-center justify-center p-8 ${className}`}>
    <div className="text-center">
      {showSpinner && (
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-500" />
      )}
      <p className="text-gray-600 dark:text-gray-400">{message}</p>
    </div>
  </div>
);

// Network Status Indicator
interface NetworkStatusProps {
  isOnline: boolean;
  isConnected: boolean;
  className?: string;
}

export const NetworkStatus: React.FC<NetworkStatusProps> = ({
  isOnline,
  isConnected,
  className = '',
}) => (
  <Badge
    variant={isOnline && isConnected ? 'default' : 'secondary'}
    className={`text-xs ${className}`}
  >
    {isOnline && isConnected ? (
      <>
        <Wifi className="w-3 h-3 mr-1" />
        Connected
      </>
    ) : (
      <>
        <WifiOff className="w-3 h-3 mr-1" />
        {!isOnline ? 'Offline' : 'Disconnected'}
      </>
    )}
  </Badge>
);

// Empty State Component
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = '',
}) => (
  <div className={`text-center py-12 ${className}`}>
    {icon && <div className="mb-4">{icon}</div>}
    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
      {title}
    </h3>
    {description && (
      <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md mx-auto">
        {description}
      </p>
    )}
    {action && (
      <Button onClick={action.onClick} variant="outline">
        {action.label}
      </Button>
    )}
  </div>
);

// Retry Wrapper Component
interface RetryWrapperProps {
  children: ReactNode;
  onRetry: () => void;
  error?: string | null;
  loading?: boolean;
  retryCount?: number;
  maxRetries?: number;
}

export const RetryWrapper: React.FC<RetryWrapperProps> = ({
  children,
  onRetry,
  error,
  loading,
  retryCount = 0,
  maxRetries = 3,
}) => {
  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    const canRetry = retryCount < maxRetries;

    return (
      <Card className="border-red-200 bg-red-50 dark:bg-red-950">
        <CardContent className="p-6 text-center">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h3 className="text-lg font-medium text-red-700 dark:text-red-300 mb-2">
            Failed to Load Data
          </h3>
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>

          {canRetry ? (
            <div className="space-y-2">
              <Button onClick={onRetry} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again ({maxRetries - retryCount} attempts left)
              </Button>
              <p className="text-xs text-gray-500">
                Attempt {retryCount + 1} of {maxRetries + 1}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                Maximum retry attempts reached
              </p>
              <p className="text-xs text-gray-500">
                Please refresh the page or contact support if the problem
                persists
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
};

// Suspense-like component for async operations
interface AsyncBoundaryProps {
  children: ReactNode;
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
  loadingMessage?: string;
  emptyState?: ReactNode;
  isEmpty?: boolean;
}

export const AsyncBoundary: React.FC<AsyncBoundaryProps> = ({
  children,
  loading,
  error,
  onRetry,
  loadingMessage,
  emptyState,
  isEmpty = false,
}) => {
  if (loading) {
    return <LoadingState message={loadingMessage} />;
  }

  if (error) {
    return <ApiErrorDisplay error={error} retryAction={onRetry} />;
  }

  if (isEmpty && emptyState) {
    return <>{emptyState}</>;
  }

  return <>{children}</>;
};

// Hook for handling online/offline status
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = React.useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true,
  );

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};
