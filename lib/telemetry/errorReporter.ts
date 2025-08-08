interface ErrorContext {
  userId?: string;
  component?: string;
  action?: string;
  metadata?: Record<string, any>;
  timestamp: number;
  url: string;
  userAgent: string;
}

interface ClientError extends Error {
  code?: string;
  statusCode?: number;
  context?: ErrorContext;
}

class ErrorReporter {
  private errors: ClientError[] = [];
  private maxErrors = 50;

  constructor() {
    // Capture unhandled errors
    if (typeof window !== 'undefined') {
      window.addEventListener('error', this.handleGlobalError.bind(this));
      window.addEventListener(
        'unhandledrejection',
        this.handleUnhandledRejection.bind(this),
      );
    }
  }

  private handleGlobalError(event: ErrorEvent) {
    this.captureError(new Error(event.message), {
      component: 'Global',
      action: 'unhandled_error',
      metadata: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      },
    });
  }

  private handleUnhandledRejection(event: PromiseRejectionEvent) {
    const error =
      event.reason instanceof Error
        ? event.reason
        : new Error(String(event.reason));
    this.captureError(error, {
      component: 'Global',
      action: 'unhandled_promise_rejection',
    });
  }

  public captureError(error: Error, context: Partial<ErrorContext> = {}): void {
    const clientError: ClientError = {
      ...error,
      context: {
        timestamp: Date.now(),
        url: typeof window !== 'undefined' ? window.location.href : '',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        ...context,
      },
    };

    // Add to local storage for debugging
    this.errors.unshift(clientError);
    if (this.errors.length > this.maxErrors) {
      this.errors.pop();
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Client Error:', clientError);
    }

    // Send to external service (Sentry, LogRocket, etc.)
    this.sendToExternalService(clientError);
  }

  private async sendToExternalService(error: ClientError): Promise<void> {
    // Only send in production or when explicitly enabled
    if (
      process.env.NODE_ENV !== 'production' &&
      process.env.NEXT_PUBLIC_ENABLE_ERROR_REPORTING !== 'true'
    ) {
      return;
    }

    try {
      // Replace with actual error reporting service
      const endpoint = process.env.NEXT_PUBLIC_ERROR_ENDPOINT;
      if (!endpoint) return;

      await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: error.message,
          stack: error.stack,
          code: error.code,
          statusCode: error.statusCode,
          context: error.context,
        }),
      });
    } catch (reportingError) {
      console.warn('Failed to send error report:', reportingError);
    }
  }

  public getRecentErrors(): ClientError[] {
    return [...this.errors];
  }

  public clearErrors(): void {
    this.errors = [];
  }

  // Utility methods for common error types
  public captureAPIError(
    error: Error,
    endpoint: string,
    statusCode?: number,
  ): void {
    this.captureError(error, {
      component: 'API',
      action: 'request_failed',
      metadata: { endpoint, statusCode },
    });
  }

  public captureWalletError(error: Error, action: string): void {
    this.captureError(error, {
      component: 'Wallet',
      action,
    });
  }

  public captureWebSocketError(error: Error, action: string): void {
    this.captureError(error, {
      component: 'WebSocket',
      action,
    });
  }

  public captureBoardError(
    error: Error,
    action: string,
    boardId?: string,
  ): void {
    this.captureError(error, {
      component: 'Board',
      action,
      metadata: { boardId },
    });
  }
}

// Singleton instance
export const errorReporter = new ErrorReporter();

// Utility function for components
export function reportError(
  error: Error,
  context?: Partial<ErrorContext>,
): void {
  errorReporter.captureError(error, context);
}

// Error reporting utility for React components
export function withErrorReporting<T extends object>(componentName: string) {
  return {
    captureComponentError: (error: Error, action = 'component_error') => {
      errorReporter.captureError(error, {
        component: componentName,
        action,
      });
    },
  };
}
