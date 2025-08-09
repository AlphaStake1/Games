'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Shield,
  Download,
  CreditCard,
  Wallet,
  Link as LinkIcon,
  Play,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Lock,
  ChevronDown,
  ChevronUp,
  Zap,
  DollarSign,
  ArrowRight,
  Info,
  MessageCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletStore } from '@/stores/walletStore';
import { Connection } from '@solana/web3.js';

const WalletGuideContent = () => {
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [solPrice, setSolPrice] = useState<number>(200);
  const { wallet, connected, publicKey, connect } = useWallet();
  const { balance, isConnected } = useWalletStore();
  const [isPhantomInstalled, setIsPhantomInstalled] = useState(false);

  useEffect(() => {
    // Check if Phantom is installed
    const checkPhantom = () => {
      const isInstalled = window?.phantom?.solana?.isPhantom;
      setIsPhantomInstalled(!!isInstalled);
    };

    checkPhantom();
    // Check again after a short delay (extension might load after page)
    setTimeout(checkPhantom, 1000);

    // Fetch SOL price (you may want to use a real API)
    // For now using a static approximation
    // SOL price ~$200, so 0.1 SOL = ~$20
    setSolPrice(200);
  }, []);

  // Calculate recommended SOL amount in USD
  const recommendedSOL = 0.1;
  const recommendedUSD = (recommendedSOL * solPrice).toFixed(2);

  // Dynamic CTA logic
  const getPrimaryCTA = () => {
    if (!isPhantomInstalled) {
      return {
        text: 'Install Phantom Wallet',
        action: () => window.open('https://phantom.app', '_blank'),
        variant: 'default' as const,
        icon: <Download className="w-4 h-4 mr-2" />,
      };
    }

    if (!isConnected) {
      return {
        text: 'Connect Wallet',
        action: async () => {
          try {
            await connect();
          } catch (error) {
            console.error('Failed to connect wallet:', error);
          }
        },
        variant: 'default' as const,
        icon: <Wallet className="w-4 h-4 mr-2" />,
      };
    }

    if (!balance || balance === 0) {
      return {
        text: `Buy ${recommendedSOL} SOL to Start`,
        action: () => openPhantomBuy(recommendedSOL),
        variant: 'default' as const,
        icon: <DollarSign className="w-4 h-4 mr-2" />,
      };
    }

    if (balance < 0.05) {
      return {
        text: `Low Balance: Add SOL (Current: ${balance.toFixed(3)} SOL)`,
        action: () => openPhantomBuy(recommendedSOL),
        variant: 'outline' as const,
        icon: <AlertTriangle className="w-4 h-4 mr-2" />,
      };
    }

    return {
      text: 'Play Now',
      action: () => (window.location.href = '/boards'),
      variant: 'default' as const,
      icon: <Play className="w-4 h-4 mr-2" />,
    };
  };

  const openPhantomBuy = (amount: number = 0.1) => {
    if (window?.phantom?.solana) {
      // Try to trigger in-wallet buy
      window.phantom.solana
        .request({
          method: 'openBuyFlow',
          params: { amount: amount.toString(), token: 'SOL' },
        })
        .catch(() => {
          // Fallback to web
          window.open(`https://phantom.app/buy`, '_blank');
        });
    } else {
      // Fallback to web
      window.open(`https://phantom.app/buy`, '_blank');
    }
  };

  const openCoach101Chat = () => {
    // Dispatch custom event to open Coach 101 chat
    window.dispatchEvent(new CustomEvent('openCoach101'));
  };

  const primaryCTA = getPrimaryCTA();

  // Visual progress indicators
  const getProgressStatus = () => {
    return {
      walletInstalled: isPhantomInstalled,
      walletConnected: isConnected,
      hasFunds: balance && balance >= 0.05,
      readyToPlay:
        isPhantomInstalled && isConnected && balance && balance >= 0.05,
    };
  };

  const progress = getProgressStatus();

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
          Get Started with SOL in Minutes
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
          The fastest way to play on Solana with low fees and fast confirmations
        </p>

        {/* Primary Dynamic CTA */}
        <div className="flex flex-col items-center gap-4">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold transition-colors duration-200"
            onClick={primaryCTA.action}
          >
            {primaryCTA.icon}
            {primaryCTA.text}
          </Button>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Once connected, we'll show you exactly what to do next
          </p>
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 mb-12">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Your Progress
        </h3>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center ${
                progress.walletInstalled ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              {progress.walletInstalled && (
                <CheckCircle className="w-3 h-3 text-white" />
              )}
            </div>
            <span
              className={`text-sm ${progress.walletInstalled ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}
            >
              Wallet Installed
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center ${
                progress.walletConnected ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              {progress.walletConnected && (
                <CheckCircle className="w-3 h-3 text-white" />
              )}
            </div>
            <span
              className={`text-sm ${progress.walletConnected ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}
            >
              Wallet Connected
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center ${
                progress.hasFunds
                  ? 'bg-green-500'
                  : progress.walletConnected
                    ? 'bg-yellow-500'
                    : 'bg-gray-300'
              }`}
            >
              {progress.hasFunds ? (
                <CheckCircle className="w-3 h-3 text-white" />
              ) : progress.walletConnected ? (
                <AlertTriangle className="w-3 h-3 text-white" />
              ) : null}
            </div>
            <span
              className={`text-sm ${progress.hasFunds ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}
            >
              {progress.hasFunds
                ? 'Funded with SOL'
                : `Add SOL (${recommendedSOL} SOL recommended)`}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center ${
                progress.readyToPlay ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              {progress.readyToPlay && (
                <CheckCircle className="w-3 h-3 text-white" />
              )}
            </div>
            <span
              className={`text-sm ${progress.readyToPlay ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-500'}`}
            >
              Ready to Play
            </span>
          </div>
        </div>
      </div>

      {/* Why SOL Callout */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-12">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Why We Use SOL
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Lightning Fast
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Transactions confirm in seconds
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Low Fees
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Less than $0.01 per play
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Built for Gaming
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Handles thousands of players simultaneously
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Easy to Buy
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Purchase directly in your wallet
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Step 1: Get a Wallet */}
      <Card className="mb-12 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-900 dark:text-white flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              1
            </div>
            Get a Wallet (Phantom Recommended)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Phantom is the best wallet for playing on Solana - it's secure, easy
            to use, and works on both desktop and mobile.
          </p>

          <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Download className="w-5 h-5 text-blue-600" />
              Install Phantom
            </h4>
            <ol className="space-y-3 text-gray-600 dark:text-gray-400">
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  1
                </span>
                <span>
                  Visit{' '}
                  <a
                    href="https://phantom.app"
                    target="_blank"
                    className="text-blue-600 hover:underline"
                  >
                    phantom.app
                  </a>{' '}
                  on your browser or mobile device
                </span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  2
                </span>
                <span>
                  Add to Chrome, Firefox, Brave, or Edge (or download mobile
                  app)
                </span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  3
                </span>
                <span>Create a new wallet and set a password</span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  4
                </span>
                <span className="font-semibold">
                  CRITICAL: Save your recovery phrase offline - never share it
                  with anyone!
                </span>
              </li>
            </ol>

            <div className="mt-4">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => window.open('https://phantom.app', '_blank')}
              >
                <Download className="w-4 h-4 mr-2" />
                Install Phantom
              </Button>
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2 flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Security Warning
            </h4>
            <ul className="text-red-800 dark:text-red-200 text-sm space-y-1">
              <li>
                • Write down your recovery phrase on paper and store it safely
              </li>
              <li>• Never share your recovery phrase with anyone</li>
              <li>• Phantom will NEVER ask for your recovery phrase</li>
              <li>• Anyone with your phrase can steal all your funds</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Step 2: Buy SOL */}
      <Card className="mb-12 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-900 dark:text-white flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              2
            </div>
            Buy SOL (In-Wallet Purchase)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <p className="text-green-900 dark:text-green-100 font-medium">
              Buy SOL to start playing
            </p>
            <p className="text-green-800 dark:text-green-200 text-sm mt-1">
              We recommend starting with {recommendedSOL} SOL (~$
              {recommendedUSD} USD). This typically covers your first plays and
              network fees.
            </p>
          </div>

          <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              Buy SOL in Phantom
            </h4>
            <ol className="space-y-3 text-gray-600 dark:text-gray-400">
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  1
                </span>
                <span>Open your Phantom wallet</span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  2
                </span>
                <span>Click the "Buy" button</span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  3
                </span>
                <span>
                  Choose a payment provider (MoonPay, Coinbase Pay, or Transak)
                </span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  4
                </span>
                <span>
                  Enter ${recommendedUSD} (for {recommendedSOL} SOL) and
                  complete purchase
                </span>
              </li>
            </ol>

            <div className="mt-4">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => openPhantomBuy(recommendedSOL)}
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Open Phantom to Buy SOL
              </Button>
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <p className="text-yellow-800 dark:text-yellow-200 text-sm">
              <strong>Note:</strong> Buy availability varies by state. If "Buy"
              isn't available in your location, see Alternative Funding Options
              below.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Alternative Funding Options (Collapsible) */}
      <Card className="mb-12 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 shadow-sm">
        <CardHeader
          className="cursor-pointer"
          onClick={() => setShowAlternatives(!showAlternatives)}
        >
          <CardTitle className="text-xl text-gray-900 dark:text-white flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-600" />
              Alternative Funding Options & Top-Ups
            </span>
            {showAlternatives ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </CardTitle>
        </CardHeader>
        {showAlternatives && (
          <CardContent className="space-y-6">
            <p className="text-gray-600 dark:text-gray-400">
              For restricted states, specific payment preferences, or if you
              hold Bitcoin in Cash App.
            </p>

            {/* Option A: Exchange Route */}
            <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                Option A: Buy on Exchange (Conservative)
              </h4>
              <ol className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>1. Create account on Coinbase or Kraken</li>
                <li>2. Buy SOL with USD</li>
                <li>3. Withdraw SOL to your Phantom address</li>
              </ol>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-3">
                Pros: Transparent pricing, account history, repeatable for
                future top-ups
              </p>
            </div>

            {/* Option B: Bitcoin Holders */}
            <div className="border border-orange-200 dark:border-orange-800 rounded-lg p-6 bg-orange-50 dark:bg-orange-900/20">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                Option B: Have Bitcoin in Cash App?
              </h4>

              <div className="space-y-4">
                <div>
                  <p className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">
                    Path 1: BTC→SOL Swap Service (Faster)
                  </p>
                  <ol className="space-y-1 text-sm text-gray-600 dark:text-gray-400 ml-4">
                    <li>
                      1. Use a service like ChangeNOW for BTC→SOL conversion
                    </li>
                    <li>2. Copy your Phantom SOL address carefully</li>
                    <li>
                      3. <strong>Send a small test amount first</strong>
                    </li>
                    <li>
                      4. After confirming SOL arrival, send remaining amount
                    </li>
                  </ol>
                  <div className="bg-red-50 dark:bg-red-900/20 rounded p-2 mt-2">
                    <p className="text-xs text-red-700 dark:text-red-300">
                      ⚠️ Cautions: Conversion fees, rate slippage, counterparty
                      risk. Always verify URLs and test first.
                    </p>
                  </div>
                </div>

                <div>
                  <p className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">
                    Path 2: Exchange Route (Safer)
                  </p>
                  <ol className="space-y-1 text-sm text-gray-600 dark:text-gray-400 ml-4">
                    <li>1. Send BTC from Cash App to Coinbase/Kraken</li>
                    <li>2. Trade BTC for SOL on the exchange</li>
                    <li>3. Withdraw SOL to your Phantom wallet</li>
                  </ol>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                    More steps but transparent pricing and repeatable
                  </p>
                </div>
              </div>
            </div>

            {/* Option C: Receive from Friend */}
            <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                Option C: Receive from a Friend
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Share your Phantom wallet address with someone who can send you
                SOL directly.
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Important Notes
              </h4>
              <ul className="text-blue-800 dark:text-blue-200 text-sm space-y-1">
                <li>• Always double-check wallet addresses before sending</li>
                <li>
                  • Bitcoin and Solana are different networks - be careful!
                </li>
                <li>• Test with small amounts first when using new services</li>
                <li>
                  • Faucets are for testnets only - not suitable for live
                  gameplay
                </li>
              </ul>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Step 3: Play */}
      <Card className="mb-12 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-900 dark:text-white flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              3
            </div>
            Play
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            You're ready! Connect your wallet and start playing Football
            Squares.
          </p>

          <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-blue-600" />
              Connect & Play
            </h4>
            <ol className="space-y-3 text-gray-600 dark:text-gray-400">
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  1
                </span>
                <span>Click "Connect Wallet" on any page</span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  2
                </span>
                <span>Select Phantom from the wallet options</span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  3
                </span>
                <span>Approve the connection in Phantom</span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  4
                </span>
                <span>Start playing Football Squares!</span>
              </li>
            </ol>

            <div className="mt-4">
              <Link href="/boards">
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <Play className="w-4 h-4 mr-2" />
                  Play Now
                </Button>
              </Link>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <p className="text-green-800 dark:text-green-200 text-sm">
              <strong>Helper:</strong> If you're missing anything, we'll
              automatically route you to the right step when you try to play.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Troubleshooting Section */}
      <Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-900 dark:text-white text-center">
            Need Help?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 dark:text-white">
              Common Issues:
            </h4>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex gap-2">
                <span className="font-medium">
                  Buy not available in my state:
                </span>
                <span>Use the Exchange route in Alternative Funding</span>
              </div>
              <div className="flex gap-2">
                <span className="font-medium">Can't connect wallet:</span>
                <span>Ensure Phantom is installed and unlocked</span>
              </div>
              <div className="flex gap-2">
                <span className="font-medium">Transactions failing:</span>
                <span>Check your SOL balance for fees (need ~0.001 SOL)</span>
              </div>
              <div className="flex gap-2">
                <span className="font-medium">Network mismatch:</span>
                <span>Switch to the correct network in Phantom settings</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={openCoach101Chat}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Ask Coach 101 on this page
            </Button>
            <Link href="/faq">
              <Button
                variant="outline"
                className="border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                View FAQ
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletGuideContent;
