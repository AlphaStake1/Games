"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Eye,
  Key
} from "lucide-react";
import Link from "next/link";

const WalletGuideContent = () => {
  const exchanges = [
    {
      name: "Coinbase",
      logo: "🔵",
      description: "Most beginner-friendly exchange",
      fees: "~1.5% for purchases",
      cryptos: ["Bitcoin", "Ethereum", "Solana", "USDC"],
      url: "https://coinbase.com"
    },
    {
      name: "Cash App",
      logo: "💚",
      description: "Simple Bitcoin purchases",
      fees: "~2% for purchases",
      cryptos: ["Bitcoin only"],
      url: "https://cash.app"
    },
    {
      name: "Venmo",
      logo: "🔷",
      description: "Easy crypto for existing users",
      fees: "~3% for purchases",
      cryptos: ["Bitcoin", "Ethereum", "Litecoin", "Bitcoin Cash"],
      url: "https://venmo.com"
    },
    {
      name: "Robinhood",
      logo: "🟢",
      description: "Commission-free trading",
      fees: "No fees for purchases",
      cryptos: ["Bitcoin", "Ethereum", "Solana", "USDC"],
      url: "https://robinhood.com"
    },
    {
      name: "Gemini",
      logo: "🔶",
      description: "Security-focused exchange",
      fees: "~1.5% for purchases",
      cryptos: ["Bitcoin", "Ethereum", "Solana", "USDC"],
      url: "https://gemini.com"
    },
    {
      name: "Kraken",
      logo: "🟣",
      description: "Advanced trading features",
      fees: "~1.5% for purchases",
      cryptos: ["Bitcoin", "Ethereum", "Solana", "USDT"],
      url: "https://kraken.com"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
          Complete Wallet Guide
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
          New to crypto? No problem! This comprehensive guide will walk you through everything you need 
          to get started with Football Squares, from buying your first cryptocurrency to connecting your wallet.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold transition-colors duration-200">
            Get Started Now
          </Button>
          <Button variant="outline" className="border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 px-8 py-3 text-lg">
            Watch Video Tutorial
          </Button>
        </div>
      </div>

      {/* Step 1: Understanding Crypto */}
      <Card className="mb-12 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-900 dark:text-white flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
            Understanding Cryptocurrency
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Cryptocurrency is digital money that works on the internet. For Football Squares, we accept these types:
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">🪙 Bitcoin (BTC)</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">The original cryptocurrency, widely accepted and trusted.</p>
              </div>
              <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">⚡ Ethereum (ETH)</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Popular for smart contracts and decentralized applications.</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">🌟 Solana (SOL)</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Fast and low-cost blockchain, our platform's preferred currency.</p>
              </div>
              <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">💵 Stablecoins (USDC)</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Digital dollars that maintain stable value.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 2: Choose an Exchange */}
      <Card className="mb-12 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-900 dark:text-white flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
            Choose a Cryptocurrency Exchange
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            These platforms let you buy cryptocurrency with your credit card, debit card, or bank account:
          </p>

          <div className="grid gap-4">
            {exchanges.map((exchange, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{exchange.logo}</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{exchange.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{exchange.description}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">Fees: {exchange.fees}</p>
                      <div className="flex flex-wrap gap-1">
                        {exchange.cryptos.map((crypto, i) => (
                          <span key={i} className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                            {crypto}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => window.open(exchange.url, '_blank')}
                  >
                    Visit <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Recommended for Beginners
            </h4>
            <p className="text-blue-800 dark:text-blue-200 text-sm">
              <strong>Coinbase</strong> or <strong>Robinhood</strong> are the easiest to start with. 
              They have user-friendly apps and good customer support.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Step 3: Install Phantom Wallet */}
      <Card className="mb-12 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-900 dark:text-white flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
            Install Phantom Wallet
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Phantom is a browser wallet that lets you store and use Solana cryptocurrency safely:
          </p>

          <div className="space-y-6">
            <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Download className="w-5 h-5 text-blue-600" />
                Download & Install
              </h4>
              <ol className="space-y-3 text-gray-600 dark:text-gray-400">
                <li className="flex gap-3">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                  <span>Visit <a href="https://phantom.app" target="_blank" className="text-blue-600 hover:underline">phantom.app</a> in your browser</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                  <span>Click "Add to Chrome" (or your browser)</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                  <span>Click "Add Extension" when prompted</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</span>
                  <span>Pin the Phantom icon to your browser toolbar</span>
                </li>
              </ol>
            </div>

            <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Key className="w-5 h-5 text-blue-600" />
                Create Your Wallet
              </h4>
              <ol className="space-y-3 text-gray-600 dark:text-gray-400">
                <li className="flex gap-3">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                  <span>Click the Phantom icon in your browser</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                  <span>Choose "Create New Wallet"</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                  <span>Create a strong password</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</span>
                  <span><strong>IMPORTANT:</strong> Write down your Secret Recovery Phrase and store it safely</span>
                </li>
              </ol>
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Critical Security Warning
            </h4>
            <ul className="text-red-800 dark:text-red-200 text-sm space-y-1">
              <li>• Never share your Secret Recovery Phrase with anyone</li>
              <li>• Write it down on paper and store it in a safe place</li>
              <li>• If someone gets your phrase, they can steal all your crypto</li>
              <li>• Phantom will NEVER ask for your recovery phrase</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Step 4: Transfer Crypto to Phantom */}
      <Card className="mb-12 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-900 dark:text-white flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
            Transfer Crypto to Your Phantom Wallet
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Now you need to move your cryptocurrency from the exchange to your Phantom wallet:
          </p>

          <div className="space-y-6">
            <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-blue-600" />
                Get Your Phantom Address
              </h4>
              <ol className="space-y-3 text-gray-600 dark:text-gray-400">
                <li className="flex gap-3">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                  <span>Open your Phantom wallet</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                  <span>Click "Receive" or the wallet address at the top</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                  <span>Copy your wallet address (starts with letters/numbers)</span>
                </li>
              </ol>
            </div>

            <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                Send from Exchange
              </h4>
              <ol className="space-y-3 text-gray-600 dark:text-gray-400">
                <li className="flex gap-3">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                  <span>Log into your exchange (Coinbase, etc.)</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                  <span>Find "Send" or "Withdraw" option</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                  <span>Select the cryptocurrency you want to send</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</span>
                  <span>Paste your Phantom wallet address</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">5</span>
                  <span>Enter the amount and confirm the transaction</span>
                </li>
              </ol>
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Transfer Tips
            </h4>
            <ul className="text-yellow-800 dark:text-yellow-200 text-sm space-y-1">
              <li>• Start with a small test amount first</li>
              <li>• Double-check the wallet address before sending</li>
              <li>• Transfers can take 5-30 minutes to complete</li>
              <li>• Keep some SOL for transaction fees (network fees)</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Step 5: Connect to Football Squares */}
      <Card className="mb-12 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-900 dark:text-white flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">5</div>
            Connect to Football Squares
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Now you're ready to connect your wallet and start playing:
          </p>

          <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-blue-600" />
              Connect Your Wallet
            </h4>
            <ol className="space-y-3 text-gray-600 dark:text-gray-400">
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                <span>Go to <Link href="/" className="text-blue-600 hover:underline">Football Squares homepage</Link></span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                <span>Click "Connect Wallet" in the top right</span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                <span>Select "Phantom" from the wallet options</span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</span>
                <span>Approve the connection in your Phantom wallet</span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">5</span>
                <span>You're connected! Start playing Football Squares</span>
              </li>
            </ol>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              You're Ready!
            </h4>
            <p className="text-green-800 dark:text-green-200 text-sm">
              Congratulations! You now have everything you need to play Football Squares with cryptocurrency. 
              Your wallet is secure, funded, and connected.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Video Tutorial Section */}
      <Card className="mb-12 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <CardHeader>
          <CardTitle className="text-2xl text-white flex items-center gap-2">
            <Play className="w-6 h-6" />
            Complete Video Tutorial
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-blue-100 text-lg">
            Watch our comprehensive 15-minute video tutorial that covers everything from buying your first 
            cryptocurrency to playing your first Football Squares game.
          </p>
          
          <div className="bg-black rounded-lg aspect-video flex items-center justify-center">
            <div className="text-center">
              <Play className="w-16 h-16 text-white mx-auto mb-4" />
              <p className="text-white">Video Tutorial Coming Soon</p>
              <p className="text-gray-400 text-sm">Full walkthrough of the entire process</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <Button className="bg-white text-blue-600 hover:bg-gray-100">
              <Play className="w-4 h-4 mr-2" />
              Watch Tutorial
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              Download PDF Guide
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Need Help Section */}
      <Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-900 dark:text-white text-center">
            Need Help?
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Our support team is here to help you get started with cryptocurrency and Football Squares.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Contact Support
            </Button>
            <Link href="/faq">
              <Button variant="outline" className="border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800">
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
