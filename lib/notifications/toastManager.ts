import { toast } from 'sonner';

interface ToastOptions {
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
}

class ToastManager {
  // Success notifications
  public success(message: string, options?: ToastOptions): void {
    toast.success(message, {
      description: options?.description,
      action: options?.action,
      duration: options?.duration || 4000,
    });
  }

  // Error notifications with structured reporting
  public error(
    message: string,
    error?: Error,
    options?: ToastOptions & { reportError?: boolean },
  ): void {
    // Report error if enabled (default true)
    if (options?.reportError !== false && error) {
      const { errorReporter } = require('../telemetry/errorReporter');
      errorReporter.captureError(error, {
        component: 'Toast',
        action: 'error_displayed',
        metadata: { message },
      });
    }

    toast.error(message, {
      description: options?.description,
      action:
        options?.action ||
        (error && process.env.NODE_ENV === 'development'
          ? {
              label: 'Details',
              onClick: () => console.error('Toast Error Details:', error),
            }
          : undefined),
      duration: options?.duration || 6000, // Longer for errors
    });
  }

  // Warning notifications
  public warning(message: string, options?: ToastOptions): void {
    toast.warning(message, {
      description: options?.description,
      action: options?.action,
      duration: options?.duration || 5000,
    });
  }

  // Info notifications
  public info(message: string, options?: ToastOptions): void {
    toast.info(message, {
      description: options?.description,
      action: options?.action,
      duration: options?.duration || 4000,
    });
  }

  // Loading notifications
  public loading(message: string): string | number {
    return toast.loading(message);
  }

  // Dismiss specific toast
  public dismiss(id: string | number): void {
    toast.dismiss(id);
  }

  // Specialized methods for common scenarios
  public apiError(endpoint: string, error: Error): void {
    let message = 'Request failed';
    let description = 'Please try again later';

    // Customize based on error type
    if (error.message.includes('network') || error.message.includes('fetch')) {
      message = 'Connection failed';
      description = 'Check your internet connection and try again';
    } else if (error.message.includes('timeout')) {
      message = 'Request timeout';
      description = 'The request took too long. Try again';
    } else if (error.message.includes('500')) {
      message = 'Server error';
      description = 'Something went wrong on our end';
    } else if (error.message.includes('401')) {
      message = 'Authentication required';
      description = 'Please connect your wallet and try again';
    } else if (error.message.includes('403')) {
      message = 'Access denied';
      description = "You don't have permission for this action";
    }

    this.error(message, error, {
      description,
      action: {
        label: 'Retry',
        onClick: () => window.location.reload(),
      },
    });
  }

  public walletError(error: Error, action: string): void {
    let message = 'Wallet error';
    let description = error.message;

    if (error.message.includes('rejected')) {
      message = 'Transaction rejected';
      description = 'You cancelled the transaction';
    } else if (error.message.includes('insufficient funds')) {
      message = 'Insufficient balance';
      description = 'Not enough SOL to complete this transaction';
    } else if (error.message.includes('not connected')) {
      message = 'Wallet not connected';
      description = 'Please connect your wallet first';
    }

    this.error(message, error, {
      description,
      reportError: !error.message.includes('rejected'), // Don't report user cancellations
    });
  }

  public websocketError(error: Error): void {
    this.error('Connection lost', error, {
      description: 'Reconnecting to live updates...',
      duration: 3000,
    });
  }

  public boardError(error: Error, boardId?: string): void {
    let message = 'Board operation failed';
    let description = 'Please try again';

    if (error.message.includes('not available')) {
      message = 'Board unavailable';
      description = 'This board is no longer available';
    } else if (error.message.includes('full')) {
      message = 'Board is full';
      description = 'All squares have been taken';
    } else if (error.message.includes('locked')) {
      message = 'Board locked';
      description = 'The game has started';
    }

    this.error(message, error, {
      description,
    });
  }

  // Network-related notifications
  public networkMismatch(expected: string, actual: string): void {
    this.warning('Network mismatch', {
      description: `Expected ${expected}, connected to ${actual}`,
      action: {
        label: 'Switch Network',
        onClick: () => {
          // This would trigger wallet network switch
          console.log('Switch network requested');
        },
      },
      duration: 8000,
    });
  }

  // Success scenarios
  public transactionSuccess(signature: string): void {
    this.success('Transaction confirmed', {
      description: `Transaction ${signature.slice(0, 8)}...${signature.slice(-8)}`,
      action: {
        label: 'View',
        onClick: () => {
          const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'testnet';
          const baseUrl =
            network === 'mainnet-beta'
              ? 'explorer.solana.com'
              : `explorer.solana.com/?cluster=${network}`;
          window.open(`https://${baseUrl}/tx/${signature}`, '_blank');
        },
      },
    });
  }

  public boardJoinedSuccess(boardId: string, squares: number): void {
    this.success(`Joined board successfully!`, {
      description: `Selected ${squares} square${squares > 1 ? 's' : ''}`,
    });
  }
}

// Singleton instance
export const toastManager = new ToastManager();

// Convenience exports
export const showSuccess = toastManager.success.bind(toastManager);
export const showError = toastManager.error.bind(toastManager);
export const showWarning = toastManager.warning.bind(toastManager);
export const showInfo = toastManager.info.bind(toastManager);
export const showLoading = toastManager.loading.bind(toastManager);
export const dismissToast = toastManager.dismiss.bind(toastManager);
