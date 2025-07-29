'use client';

import { useState, useCallback } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface ConferenceQuote {
  slug: string;
  name: string;
  price: number;
  passesSold: number;
  seatsLeft: number;
  tier: number;
  gasEstimate: number;
  priceUSD: number;
}

interface Order {
  orderId: string;
  preparedTx: any;
  expiresAt: string;
}

interface PurchaseState {
  isModalOpen: boolean;
  isProcessing: boolean;
  currentQuote: ConferenceQuote | null;
  error: string | null;
}

// Simulated API functions - replace with real endpoints
const simulateAPI = {
  async getQuote(slug: string): Promise<ConferenceQuote> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const conferences = {
      eastern: { name: 'Eastern', price: 25, passesSold: 67, tier: 1 },
      southern: { name: 'Southern', price: 50, passesSold: 43, tier: 2 },
      northern: { name: 'Northern', price: 100, passesSold: 28, tier: 3 },
      western: { name: 'Western', price: 200, passesSold: 15, tier: 4 },
      'south-east': { name: 'South-East', price: 500, passesSold: 7, tier: 5 },
    };

    const config = conferences[slug as keyof typeof conferences];
    if (!config) throw new Error('Conference not found');

    // Simulate some randomness in seats sold
    const randomAdjustment = Math.floor(Math.random() * 3) - 1;
    const adjustedSold = Math.max(
      0,
      Math.min(100, config.passesSold + randomAdjustment),
    );

    return {
      slug,
      name: config.name,
      price: config.price,
      passesSold: adjustedSold,
      seatsLeft: 100 - adjustedSold,
      tier: config.tier,
      gasEstimate: 0.03, // ~$0.03 gas for 3 transactions
      priceUSD: config.price,
    };
  },

  async createOrder(slug: string, walletAddress: string): Promise<Order> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Simulate order creation
    return {
      orderId: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      preparedTx: {
        to: '0x742d35Cc6634C0532925a3b8D96Fb644dd2e7f5c', // Mock contract address
        value: '0x16345785d8a0000', // Mock value in wei
        data: '0xa22cb465000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001',
      },
      expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes
    };
  },

  async abortOrder(orderId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    console.log(`Order ${orderId} aborted`);
  },
};

export const usePurchasePass = () => {
  const { connected, publicKey, sendTransaction, connect } = useWallet();
  const { connection } = useConnection();
  const router = useRouter();
  const { toast } = useToast();

  const [state, setState] = useState<PurchaseState>({
    isModalOpen: false,
    isProcessing: false,
    currentQuote: null,
    error: null,
  });

  // Analytics tracking
  const track = useCallback(
    (event: string, properties: Record<string, any>) => {
      // Replace with your analytics service
      console.log('Analytics:', event, properties);

      // Example: Google Analytics 4
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', event, properties);
      }
    },
    [],
  );

  const openModal = useCallback(
    async (conferenceSlug: string) => {
      setState((prev) => ({ ...prev, isProcessing: true, error: null }));

      try {
        const quote = await simulateAPI.getQuote(conferenceSlug);

        // Check if sold out
        if (quote.seatsLeft <= 0) {
          toast({
            title: 'Conference Sold Out',
            description: `${quote.name} conference is full. Try another tier!`,
            variant: 'destructive',
          });
          setState((prev) => ({ ...prev, isProcessing: false }));
          return;
        }

        // Track analytics
        track('BeginCheckout', {
          slug: quote.slug,
          price: quote.price,
          tier: quote.tier,
          seatsLeft: quote.seatsLeft,
        });

        setState((prev) => ({
          ...prev,
          isModalOpen: true,
          currentQuote: quote,
          isProcessing: false,
        }));
      } catch (error) {
        console.error('Failed to get quote:', error);
        toast({
          title: 'Error',
          description:
            'Failed to load conference information. Please try again.',
          variant: 'destructive',
        });
        setState((prev) => ({ ...prev, isProcessing: false }));
      }
    },
    [toast, track],
  );

  const closeModal = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isModalOpen: false,
      currentQuote: null,
      error: null,
    }));
  }, []);

  const connectWallet = useCallback(async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      toast({
        title: 'Wallet Connection Failed',
        description: 'Please try connecting your wallet again.',
        variant: 'destructive',
      });
      throw error;
    }
  }, [connect, toast]);

  const confirmPurchase = useCallback(async () => {
    if (!state.currentQuote || !publicKey || !sendTransaction) {
      return;
    }

    setState((prev) => ({ ...prev, isProcessing: true, error: null }));

    const { update: updateToast } = toast({
      title: 'Processing Purchase',
      description: 'Creating order...',
    });

    let order: Order | null = null;

    try {
      // Create order and reserve seat
      order = await simulateAPI.createOrder(
        state.currentQuote.slug,
        publicKey.toString(),
      );

      updateToast({
        title: 'Please Confirm Transaction',
        description: 'Approve the transaction in your wallet...',
      });

      // Simulate wallet transaction
      // In real implementation, this would use the prepared transaction
      await new Promise((resolve, reject) => {
        const shouldSucceed = Math.random() > 0.1; // 90% success rate for demo

        setTimeout(() => {
          if (shouldSucceed) {
            resolve('0x' + Math.random().toString(16).substr(2, 64)); // Mock tx hash
          } else {
            reject(new Error('Transaction was rejected by user'));
          }
        }, 2000);
      });

      updateToast({
        title: 'Transaction Submitted',
        description: 'Waiting for confirmation...',
      });

      // Simulate confirmation wait
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Success!
      const seatIndex = 100 - state.currentQuote.seatsLeft + 1;

      updateToast({
        title: 'Purchase Successful!',
        description: `You now own ${state.currentQuote.name} #${seatIndex}`,
        variant: 'default',
      });

      // Track successful purchase
      track('PurchaseConfirmed', {
        slug: state.currentQuote.slug,
        price: state.currentQuote.price,
        tier: state.currentQuote.tier,
        seatIndex,
        txHash: 'mock_tx_hash',
      });

      // Close modal and redirect
      closeModal();

      // Redirect to conference board or my-nfts
      router.push(`/conference/${state.currentQuote.slug}/board`);
    } catch (error: any) {
      console.error('Purchase failed:', error);

      // Abort the order if it was created
      if (order) {
        try {
          await simulateAPI.abortOrder(order.orderId);
        } catch (abortError) {
          console.error('Failed to abort order:', abortError);
        }
      }

      let errorMessage = 'An unknown error occurred. Please try again.';

      if (error.message.includes('rejected')) {
        errorMessage =
          'Transaction was cancelled. Your seat has been released.';
      } else if (error.message.includes('insufficient')) {
        errorMessage =
          'Insufficient funds. Please add more SOL to your wallet.';
      } else if (error.message.includes('network')) {
        errorMessage =
          'Network error. Please check your connection and try again.';
      }

      updateToast({
        title: 'Purchase Failed',
        description: errorMessage,
        variant: 'destructive',
      });

      setState((prev) => ({
        ...prev,
        error: errorMessage,
        isProcessing: false,
      }));
    }
  }, [
    state.currentQuote,
    publicKey,
    sendTransaction,
    toast,
    track,
    closeModal,
    router,
  ]);

  // Check if user already owns a pass in this conference
  const checkExistingPass = useCallback(
    async (conferenceSlug: string): Promise<boolean> => {
      if (!publicKey) return false;

      // This would query the blockchain/database for existing passes
      // For demo, randomly return false (no existing pass)
      return Math.random() < 0.1; // 10% chance of already owning a pass
    },
    [publicKey],
  );

  // Get button text based on conference state
  const getButtonText = useCallback(
    async (conferenceSlug: string, basePrice: string): Promise<string> => {
      try {
        const quote = await simulateAPI.getQuote(conferenceSlug);

        if (quote.seatsLeft === 0) {
          return 'Sold Out';
        }

        if (connected) {
          const hasExistingPass = await checkExistingPass(conferenceSlug);
          if (hasExistingPass) {
            return `Buy Another Pass – ${basePrice}`;
          }
        }

        return `Buy ${quote.name} Pass – ${basePrice}`;
      } catch {
        return `Buy Pass – ${basePrice}`;
      }
    },
    [connected, checkExistingPass],
  );

  return {
    // State
    isModalOpen: state.isModalOpen,
    isProcessing: state.isProcessing,
    currentQuote: state.currentQuote,
    error: state.error,
    walletConnected: connected,

    // Actions
    openModal,
    closeModal,
    connectWallet,
    confirmPurchase,
    checkExistingPass,
    getButtonText,
  };
};
