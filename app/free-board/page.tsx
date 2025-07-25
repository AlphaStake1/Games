'use client';

import { useState } from 'react';
import {
  Play,
  Users,
  Star,
  PenTool,
  Image as ImageIcon,
  ArrowLeft,
  Info,
} from 'lucide-react';
import { Metadata } from 'next';

const SUPERBOWL_WINNER = 'Kansas City Chiefs'; // Update this yearly as needed

const upgradeOptions = [
  {
    id: 'default-signature',
    label: 'Default Signature',
    description:
      'Plain black, handwritten "First Name + Last Initial" the system grants every player automatically.',
    icon: PenTool,
    price: '$0',
  },
  {
    id: 'custom-signature',
    label: 'Custom Signature',
    description: 'Same handwritten look, but in any color.',
    icon: Star,
    price: '$3',
  },
  {
    id: 'custom-hand-drawn-symbol',
    label: 'Custom Hand-Drawn Symbol',
    description:
      'Player-supplied simple doodle/icon (photo, scan, or stylus drawing).',
    icon: Users,
    price: '$3',
  },
  {
    id: 'house-generated-artwork',
    label: 'House-Generated Artwork',
    description:
      'Static full-color art produced by the Football Squares design team.',
    icon: ImageIcon,
    price: '$7',
  },
  {
    id: 'ai-generated-artwork',
    label: 'AI-Generated Artwork',
    description:
      "AI image created from the player's text prompt or transformed from their user-generated or user-uploaded art.",
    icon: Play,
    price: '$14',
  },
  {
    id: 'premium-animated',
    label: 'Premium (VIP) Animated',
    description:
      'User-generated or user-uploaded art that we convert to an animated NFT; VIP-only access.',
    icon: Star,
    price: '$21',
  },
];

export default function FreeBoardPage() {
  const [selectedUpgrade, setSelectedUpgrade] = useState(upgradeOptions[0].id);
  const [claimedSquares, setClaimedSquares] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  const handleSquareClick = (row: number, col: number) => {
    const squareId = `${row}-${col}`;
    if (!claimedSquares.has(squareId)) {
      setIsLoading(true);
      // Simulate network delay
      setTimeout(() => {
        setClaimedSquares((prev) => new Set(prev).add(squareId));
        setIsLoading(false);
      }, 500);
    }
  };

  const handleUpgradeClick = (upgradeId: string) => {
    if (upgradeId === 'black-signature') return;

    setIsLoading(true);
    // Simulate upgrade process
    setTimeout(() => {
      setIsLoading(false);
      // Here you would integrate with wallet/payment system
      alert(
        `Upgrade to ${upgradeOptions.find((opt) => opt.id === upgradeId)?.label} initiated!`,
      );
    }, 1000);
  };

  // Structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Game',
    name: 'Free Football Squares Board - Dallas Cowboys vs Kansas City Chiefs',
    description:
      'Join our free Football Squares board featuring Dallas Cowboys vs Kansas City Chiefs. Claim your square and experience NFL squares with no cost.',
    gameLocation: {
      '@type': 'VirtualLocation',
      url: 'https://footballsquares.com/free-board',
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Football Squares',
      url: 'https://footballsquares.com',
    },
    datePublished: new Date().toISOString(),
    gameItem: {
      '@type': 'Thing',
      name: 'Football Squares Grid',
      description: 'Interactive 10x10 grid for Football Squares game',
    },
  };

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <main
        className="min-h-screen bg-[#faf9f5] dark:bg-[#1a1a2e] py-6 sm:py-12"
        lang="en"
      >
        <div className="max-w-4xl mx-auto px-4">
          {/* Breadcrumb Navigation */}
          <nav className="mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <a href="/" className="hover:text-[#ed5925] transition-colors">
                  Home
                </a>
              </li>
              <li>/</li>
              <li className="text-[#ed5925]" aria-current="page">
                Free Board
              </li>
            </ol>
          </nav>

          <header className="text-center mb-8">
            <h1 className="text-2xl sm:text-4xl font-bold text-[#002244] dark:text-white mb-4">
              Play For Free: House Board
            </h1>
            <p className="text-base sm:text-lg text-[#708090] dark:text-[#96abdc] mb-4">
              Join a free board featuring the Dallas Cowboys vs.{' '}
              {SUPERBOWL_WINNER}. Claim your square and experience Football
              Squares with no cost!
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 max-w-2xl mx-auto">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  <p className="font-medium mb-1">
                    How Football Squares Works:
                  </p>
                  <p>
                    Pick squares on the 10x10 grid. Numbers are randomly
                    assigned after all squares are claimed. Winners are
                    determined by the last digit of each team&apos;s score at
                    the end of each quarter.
                  </p>
                </div>
              </div>
            </div>
          </header>

          {/* Board Preview */}
          <section
            className="bg-white dark:bg-[#002244] rounded-2xl shadow-lg p-4 sm:p-6 mb-10"
            aria-labelledby="board-title"
          >
            <h2 id="board-title" className="sr-only">
              Game Board
            </h2>
            <div className="flex flex-col md:flex-row items-center justify-between mb-6">
              <div className="flex items-center gap-2 sm:gap-4 text-center">
                <span className="text-lg sm:text-2xl font-bold text-blue-700 dark:text-blue-300">
                  🏈 Dallas Cowboys
                </span>
                <span className="text-sm sm:text-lg font-semibold text-gray-500 dark:text-gray-300">
                  vs.
                </span>
                <span className="text-lg sm:text-2xl font-bold text-red-700 dark:text-red-300">
                  🏆 {SUPERBOWL_WINNER}
                </span>
              </div>
              <span className="bg-gradient-to-r from-[#ed5925] to-[#96abdc] text-white px-4 py-2 rounded-full font-semibold mt-4 md:mt-0 text-sm sm:text-base">
                Free House Board
              </span>
            </div>

            <div className="flex justify-center overflow-x-auto">
              <div className="inline-block border-2 border-gray-400 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                {/* Dallas Cowboys Banner - Top */}
                <div className="bg-gradient-to-r from-blue-700 to-blue-600 text-white px-4 py-2 text-center border-b-2 border-gray-400 dark:border-gray-600">
                  <div className="flex items-center justify-center gap-2">
                    <span className="font-bold text-sm sm:text-base">
                      DALLAS COWBOYS
                    </span>
                    <span className="text-lg sm:text-xl">🏈</span>
                  </div>
                </div>

                {/* Main Grid Container */}
                <div className="flex">
                  {/* Kansas City Chiefs Banner - Left */}
                  <div className="bg-gradient-to-b from-red-700 to-red-600 text-white flex flex-col items-center justify-center px-2 py-4 border-r-2 border-gray-400 dark:border-gray-600 min-h-[480px] sm:min-h-[640px]">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div
                        className="font-bold text-xs sm:text-sm whitespace-nowrap"
                        style={{
                          writingMode: 'vertical-rl',
                          textOrientation: 'mixed',
                          letterSpacing: '0.1em',
                          transform: 'rotate(180deg)',
                        }}
                      >
                        KANSAS CITY CHIEFS
                      </div>
                      <div className="text-lg sm:text-xl mt-4">🏆</div>
                    </div>
                  </div>

                  {/* Game Grid */}
                  <div
                    className="grid grid-cols-11 bg-white dark:bg-gray-800"
                    role="grid"
                    aria-label="Football Squares game board"
                    style={{ width: 'fit-content' }}
                  >
                    {/* Empty top-left corner */}
                    <div className="w-12 h-12 sm:w-16 sm:h-16 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700"></div>

                    {/* Top row - letter headers (RANDOMIZED) */}
                    {Array.from('RANDOMIZED').map((char, i) => (
                      <div
                        key={`col-header-${i}`}
                        className="w-12 h-12 sm:w-16 sm:h-16 border border-gray-300 dark:border-gray-600 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 flex items-center justify-center font-bold text-base sm:text-lg"
                        role="columnheader"
                      >
                        {char}
                      </div>
                    ))}

                    {/* Grid rows */}
                    {[...Array(10)].map((_, row) => (
                      <div key={`row-${row}`} className="contents" role="row">
                        {/* Row header - letters (RANDOMIZED) */}
                        <div
                          className="w-12 h-12 sm:w-16 sm:h-16 border border-gray-300 dark:border-gray-600 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 flex items-center justify-center font-bold text-base sm:text-lg"
                          role="rowheader"
                        >
                          {'RANDOMIZED'[row]}
                        </div>

                        {/* Row cells */}
                        {[...Array(10)].map((_, col) => {
                          const squareId = `${row}-${col}`;
                          const isClaimed = claimedSquares.has(squareId);

                          return (
                            <button
                              key={`cell-${row}-${col}`}
                              onClick={() => handleSquareClick(row, col)}
                              disabled={isClaimed || isLoading}
                              className={`
                              w-12 h-12 sm:w-16 sm:h-16
                              border border-gray-300 dark:border-gray-600
                              flex items-center justify-center
                              text-sm sm:text-base font-medium
                              transition-all duration-200
                              ${
                                isClaimed
                                  ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 cursor-not-allowed'
                                  : 'bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500'
                              }
                              ${isLoading ? 'opacity-50' : ''}
                            `}
                              aria-label={`Square ${row}-${col}${isClaimed ? ' (claimed)' : ' (available)'}`}
                              role="gridcell"
                            >
                              {isClaimed ? '✓' : ''}
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Claim Instructions */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Click any available square to claim it. Claimed squares:{' '}
                {claimedSquares.size}/100
              </p>
              <button
                className="bg-gradient-to-r from-[#ed5925] to-[#96abdc] text-white px-6 py-3 rounded-full font-bold text-sm sm:text-base hover:from-[#d14a1f] hover:to-[#7a95d1] transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
                disabled={claimedSquares.size === 0 || isLoading}
              >
                {isLoading
                  ? 'Processing...'
                  : `Confirm ${claimedSquares.size} Square${claimedSquares.size !== 1 ? 's' : ''}`}
              </button>
            </div>
          </section>

          {/* NFT Upgrade Options */}
          <section
            className="bg-white dark:bg-[#002244] rounded-2xl shadow-lg p-4 sm:p-6 mb-10"
            aria-labelledby="upgrade-title"
          >
            <h2
              id="upgrade-title"
              className="text-xl sm:text-2xl font-bold mb-4 text-[#002244] dark:text-white"
            >
              Upgrade Your Board Placement NFT
            </h2>
            <p className="text-sm sm:text-base text-[#708090] dark:text-[#96abdc] mb-6">
              Enhance your Football Squares experience with unique NFT upgrades.
              Each upgrade provides different visual and functional benefits.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {upgradeOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedUpgrade(option.id)}
                  className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border transition-all duration-200 text-left ${
                    selectedUpgrade === option.id
                      ? 'border-[#ed5925] bg-gradient-to-r from-[#ed5925]/10 to-[#96abdc]/10'
                      : 'border-gray-200 dark:border-gray-700 bg-transparent hover:border-[#ed5925]/50'
                  }`}
                  aria-pressed={selectedUpgrade === option.id}
                  aria-describedby={`desc-${option.id}`}
                >
                  <option.icon className="w-6 h-6 sm:w-8 sm:h-8 text-[#ed5925] flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-semibold text-sm sm:text-lg text-[#002244] dark:text-white flex items-center justify-between">
                      {option.label}
                      <span className="text-xs sm:text-sm text-[#ed5925] font-medium">
                        {option.price}
                      </span>
                    </div>
                    <div
                      id={`desc-${option.id}`}
                      className="text-xs sm:text-sm text-[#708090] dark:text-[#96abdc] mt-1"
                    >
                      {option.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => handleUpgradeClick(selectedUpgrade)}
                className="bg-gradient-to-r from-[#ed5925] to-[#96abdc] text-white px-6 sm:px-8 py-3 rounded-full font-bold text-sm sm:text-lg hover:from-[#d14a1f] hover:to-[#7a95d1] transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={selectedUpgrade === 'black-signature' || isLoading}
              >
                {isLoading
                  ? 'Processing...'
                  : selectedUpgrade === 'default-signature'
                    ? 'Upgrade Your NFT'
                    : `Upgrade to ${upgradeOptions.find((opt) => opt.id === selectedUpgrade)?.label}`}
              </button>
            </div>
          </section>

          {/* Game Information */}
          <section
            className="bg-white dark:bg-[#002244] rounded-2xl shadow-lg p-4 sm:p-6 mb-10"
            aria-labelledby="game-info-title"
          >
            <h2
              id="game-info-title"
              className="text-xl sm:text-2xl font-bold mb-4 text-[#002244] dark:text-white"
            >
              Game Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg text-[#002244] dark:text-white mb-2">
                  How to Play
                </h3>
                <ul className="text-sm text-[#708090] dark:text-[#96abdc] space-y-1">
                  <li>• Select available squares on the 10x10 grid</li>
                  <li>
                    • Numbers 0-9 are randomly assigned to rows and columns
                  </li>
                  <li>
                    • Winners determined by last digit of each team&apos;s score
                  </li>
                  <li>• Points awarded at the end of each quarter</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-[#002244] dark:text-white mb-2">
                  Game Details
                </h3>
                <dl className="text-sm text-[#708090] dark:text-[#96abdc] space-y-1">
                  <div className="flex justify-between">
                    <dt>Entry Fee:</dt>
                    <dd className="font-medium text-green-600 dark:text-green-400">
                      FREE
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Max Squares:</dt>
                    <dd>5 per player</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Prize Pool:</dt>
                    <dd>House sponsored</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Status:</dt>
                    <dd className="text-blue-600 dark:text-blue-400">Open</dd>
                  </div>
                </dl>
              </div>
            </div>
          </section>

          {/* Navigation */}
          <nav className="flex justify-between items-center">
            <a
              href="/"
              className="inline-flex items-center gap-2 text-[#ed5925] hover:underline font-semibold text-sm sm:text-base transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </a>
            <a
              href="/how-to-play"
              className="inline-flex items-center gap-2 text-[#ed5925] hover:underline font-semibold text-sm sm:text-base transition-colors"
            >
              Learn More
              <Info className="w-4 h-4" />
            </a>
          </nav>
        </div>
      </main>
    </>
  );
}
