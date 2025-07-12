"use client";

import { useState, useEffect } from "react";
import {
  Grid3X3,
  Trophy,
  DollarSign,
  Users,
  Clock,
  Target,
  CheckCircle,
  ArrowRight,
  Play,
  Wallet,
  Shield,
  Zap,
} from "lucide-react";

const HowToPlayContent = () => {
  const [activeTab, setActiveTab] = useState("basics");
  const [selectedSquare, setSelectedSquare] = useState<number | null>(null);
  const [playerNames, setPlayerNames] = useState<string[]>([]);
  const [sampleGrid, setSampleGrid] = useState<any[]>([]);
  const [xAxisNumbers, setXAxisNumbers] = useState<number[]>([]);
  const [yAxisNumbers, setYAxisNumbers] = useState<number[]>([]);

  // Generate 100 unique names with first name + last initial
  const generatePlayerNames = () => {
    const firstNames = [
      "James",
      "Maria",
      "Alex",
      "Katie",
      "Michael",
      "Sarah",
      "David",
      "Emma",
      "Chris",
      "Lisa",
      "Ryan",
      "Anna",
      "Tyler",
      "Nicole",
      "Brandon",
      "Jessica",
      "Kevin",
      "Ashley",
      "Jason",
      "Amanda",
      "Daniel",
      "Stephanie",
      "Matthew",
      "Rachel",
      "Andrew",
      "Lauren",
      "Joshua",
      "Megan",
      "Justin",
      "Samantha",
      "Robert",
      "Elizabeth",
      "John",
      "Jennifer",
      "William",
      "Michelle",
      "Thomas",
      "Kimberly",
      "Richard",
      "Amy",
      "Charles",
      "Angela",
      "Joseph",
      "Melissa",
      "Christopher",
      "Brenda",
      "Anthony",
      "Emma",
      "Mark",
      "Olivia",
      "Donald",
      "Cynthia",
      "Steven",
      "Marie",
      "Paul",
      "Janet",
      "Kenneth",
      "Catherine",
      "Joshua",
      "Frances",
      "Kevin",
      "Christine",
      "Brian",
      "Samantha",
      "George",
      "Edward",
      "Ronald",
      "Carolyn",
      "Timothy",
      "Janet",
      "Jason",
      "Virginia",
      "Jeffrey",
      "Maria",
      "Ryan",
      "Heather",
      "Jacob",
      "Diane",
      "Gary",
      "Julie",
      "Nicholas",
      "Joyce",
      "Eric",
      "Victoria",
      "Jonathan",
      "Kelly",
      "Stephen",
      "Christina",
      "Larry",
      "Joan",
      "Justin",
      "Evelyn",
      "Scott",
      "Judith",
    ];

    const lastInitials = [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
    ];

    const names = [];
    const usedCombinations = new Set();

    for (let i = 0; i < 100; i++) {
      let name;
      let attempts = 0;
      do {
        const firstName =
          firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastInitial =
          lastInitials[Math.floor(Math.random() * lastInitials.length)];
        name = `${firstName} ${lastInitial}.`;
        attempts++;
      } while (usedCombinations.has(name) && attempts < 50);

      usedCombinations.add(name);
      names.push(name);
    }

    return names;
  };

  // Generate randomized axis numbers
  const generateRandomNumbers = () => {
    const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    // Shuffle X-axis numbers
    const xNumbers = [...numbers];
    for (let i = xNumbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [xNumbers[i], xNumbers[j]] = [xNumbers[j], xNumbers[i]];
    }

    // Shuffle Y-axis numbers
    const yNumbers = [...numbers];
    for (let i = yNumbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [yNumbers[i], yNumbers[j]] = [yNumbers[j], yNumbers[i]];
    }

    return { xNumbers, yNumbers };
  };

  // Sample grid for demonstration
  const createSampleGrid = (
    names: string[],
    xNumbers: number[],
    yNumbers: number[],
  ) => {
    const grid = [];
    // NFT symbols for some squares
    const nftSymbols = ["🏆", "⭐", "🎯", "💎", "🔥", "⚡", "🎨", "🌟"];
    const nftSquares = [5, 12, 23, 34, 45, 56, 67, 78]; // Random squares with NFTs

    for (let i = 0; i < 100; i++) {
      const hasNFT = nftSquares.includes(i);
      const row = Math.floor(i / 10);
      const col = i % 10;

      // Find winning squares based on the randomized numbers and game scores
      // Game scores: 1st Quarter 7-3, 2nd Quarter 4-0, 3rd Quarter 7-7, Final 6-0
      // X-axis (horizontal) number first, then Y-axis (vertical) number
      const homeNumbers = [7, 4, 7, 6]; // Last digits of Cowboys scores
      const awayNumbers = [3, 0, 7, 0]; // Last digits of Eagles scores

      let isWinning = false;
      let quarter = null;

      // Check if this square matches any winning combination
      // X-axis number (horizontal) corresponds to HOME TEAM, Y-axis number (vertical) corresponds to AWAY TEAM
      for (let q = 0; q < homeNumbers.length; q++) {
        const homeNumIndex = xNumbers.indexOf(homeNumbers[q]); // X-axis position
        const awayNumIndex = yNumbers.indexOf(awayNumbers[q]); // Y-axis position

        if (col === homeNumIndex && row === awayNumIndex) {
          isWinning = true;
          quarter =
            q === 0 ? "1st" : q === 1 ? "2nd" : q === 2 ? "3rd" : "Final";
          break;
        }
      }

      grid.push({
        id: i + 1,
        player: names[i],
        isSelected: i === selectedSquare,
        isWinning: isWinning,
        quarter: quarter,
        hasNFT: hasNFT,
        nftSymbol: hasNFT ? nftSymbols[nftSquares.indexOf(i)] : null,
        row: row,
        col: col,
      });
    }
    return grid;
  };

  // Initialize player names and grid on client side only
  useEffect(() => {
    const names = generatePlayerNames();
    const { xNumbers, yNumbers } = generateRandomNumbers();
    setPlayerNames(names);
    setXAxisNumbers(xNumbers);
    setYAxisNumbers(yNumbers);
    setSampleGrid(createSampleGrid(names, xNumbers, yNumbers));
  }, []);

  // Update selected square in grid when selectedSquare changes
  useEffect(() => {
    if (
      playerNames.length > 0 &&
      xAxisNumbers.length > 0 &&
      yAxisNumbers.length > 0
    ) {
      setSampleGrid((prevGrid) =>
        prevGrid.map((square, index) => ({
          ...square,
          isSelected: index === selectedSquare,
        })),
      );
    }
  }, [
    selectedSquare,
    playerNames.length,
    xAxisNumbers.length,
    yAxisNumbers.length,
  ]);

  const tabs = [
    { id: "basics", label: "Game Basics", icon: Grid3X3 },
    { id: "rules", label: "Rules & Scoring", icon: Trophy },
    { id: "crypto", label: "Crypto Payouts", icon: Wallet },
    { id: "strategy", label: "Tips & Strategy", icon: Target },
  ];

  const gameSteps = [
    {
      step: 1,
      title: "Choose Your Game",
      description: "Select from available NFL games and join a squares board.",
      icon: Grid3X3,
      details:
        "Browse active games and pick the matchup you want to play. Each game has its own 10x10 grid with 100 squares available.",
    },
    {
      step: 2,
      title: "Claim Your Squares",
      description: "Purchase one or more squares on the 10x10 grid.",
      icon: Target,
      details:
        "Click on empty squares to claim them. You can buy multiple squares to increase your chances of winning.",
    },
    {
      step: 3,
      title: "Numbers Are Drawn",
      description: "Random numbers 0-9 are assigned to rows and columns.",
      icon: Users,
      details:
        "After all squares are sold, numbers are randomly assigned to each row (one team) and column (other team).",
    },
    {
      step: 4,
      title: "Watch & Win",
      description: "Win prizes based on the score at the end of each quarter.",
      icon: Trophy,
      details:
        "Your square wins if the last digit of each team's score matches your row and column numbers.",
    },
  ];

  // Mock game data with corrected scores that match the winning squares
  const mockGameData = {
    homeTeam: "Dallas Cowboys",
    awayTeam: "Philadelphia Eagles",
    quarters: [
      {
        quarter: "1st Quarter",
        homeScore: 7, // Last digit 7
        awayScore: 3, // Last digit 3 → 7-3 combination
        winningNumbers: { home: 7, away: 3 },
        winningSquare: "7-3",
        payout: "15%",
      },
      {
        quarter: "2nd Quarter",
        homeScore: 14, // Last digit 4
        awayScore: 10, // Last digit 0 → 4-0 combination
        winningNumbers: { home: 4, away: 0 },
        winningSquare: "4-0",
        payout: "25%",
      },
      {
        quarter: "3rd Quarter",
        homeScore: 17, // Last digit 7
        awayScore: 17, // Last digit 7 → 7-7 combination
        winningNumbers: { home: 7, away: 7 },
        winningSquare: "7-7",
        payout: "15%",
      },
      {
        quarter: "Final Score",
        homeScore: 26, // Last digit 6
        awayScore: 20, // Last digit 0 → 6-0 combination
        winningNumbers: { home: 6, away: 0 },
        winningSquare: "6-0",
        payout: "45%",
      },
    ],
  };

  const scoringExamples = [
    {
      quarter: "1st Quarter",
      score: "Cowboys: 7, Eagles: 3",
      winner: "Square at 7-3 combination",
      payout: "15%",
    },
    {
      quarter: "2nd Quarter",
      score: "Cowboys: 14, Eagles: 10",
      winner: "Square at 4-0 combination",
      payout: "25%",
    },
    {
      quarter: "3rd Quarter",
      score: "Cowboys: 17, Eagles: 17",
      winner: "Square at 7-7 combination",
      payout: "15%",
    },
    {
      quarter: "Final Score",
      score: "Cowboys: 26, Eagles: 20",
      winner: "Square at 6-0 combination",
      payout: "45%",
    },
  ];

  const cryptoFeatures = [
    {
      icon: Shield,
      title: "Secure Transactions",
      description:
        "All payments and payouts are handled through secure blockchain transactions.",
    },
    {
      icon: Zap,
      title: "Instant Payouts",
      description:
        "Winners receive their crypto payouts automatically when each quarter ends.",
    },
    {
      icon: Wallet,
      title: "Multiple Currencies",
      description:
        "Play with Bitcoin, Ethereum, Solana, and various stablecoins.",
    },
  ];

  const strategies = [
    {
      title: "Corner Strategy",
      description:
        "Squares with 0, 3, 7 are historically more likely to win due to common football scoring patterns.",
      tip: "Focus on squares that end in these numbers for better odds.",
    },
    {
      title: "Multiple Squares",
      description:
        "Buying multiple squares increases your chances, but also increases your investment.",
      tip: "Balance risk and reward based on your budget and confidence in the game.",
    },
    {
      title: "Quarter Analysis",
      description:
        "Different quarters have different payout percentages - final score usually pays the most.",
      tip: "Consider which quarters matter most for your strategy and budget accordingly.",
    },
    {
      title: "Team Research",
      description:
        "Research team scoring patterns and tendencies for the season.",
      tip: "Some teams consistently score in certain patterns that could inform your square selection.",
    },
  ];

  // Don't render the grid until player names are loaded
  if (
    playerNames.length === 0 ||
    xAxisNumbers.length === 0 ||
    yAxisNumbers.length === 0
  ) {
    return (
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#ed5925] mx-auto"></div>
            <p className="mt-4 text-[#708090] dark:text-[#96abdc]">
              Loading game content...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#002244] dark:text-white mb-6 transition-colors duration-300">
            How To Play Football Squares
          </h1>
          <p className="text-xl text-[#708090] dark:text-[#96abdc] max-w-3xl mx-auto mb-8 transition-colors duration-300">
            Master the game that makes every NFL matchup exciting. Learn the
            rules, understand the scoring, and discover winning strategies.
          </p>
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-[#ed5925] to-[#96abdc] p-1 rounded-full">
              <button className="bg-white dark:bg-[#002244] text-[#002244] dark:text-white px-8 py-3 rounded-full font-bold hover:bg-gray-50 dark:hover:bg-[#004953] transition-colors duration-200 inline-flex items-center gap-2">
                <Play className="w-5 h-5" />
                Watch Tutorial Video
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-[#ed5925] to-[#96abdc] text-white shadow-lg"
                  : "bg-white dark:bg-[#002244] text-[#708090] dark:text-[#96abdc] hover:text-[#002244] dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#004953] border border-gray-200 dark:border-[#004953]"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-[#002244] rounded-2xl shadow-lg overflow-hidden transition-colors duration-300">
          {/* Game Basics Tab */}
          {activeTab === "basics" && (
            <div className="p-8 lg:p-12">
              <h2 className="text-3xl font-bold text-[#002244] dark:text-white mb-8 text-center transition-colors duration-300">
                Game Basics
              </h2>

              {/* Mock Game Scoreboard */}
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-[#002244] dark:text-white mb-6 text-center transition-colors duration-300">
                  Sample Game: {mockGameData.homeTeam} vs{" "}
                  {mockGameData.awayTeam}
                </h3>

                <div className="bg-[#002244] rounded-xl p-6 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {mockGameData.quarters.map((quarter, index) => (
                      <div
                        key={index}
                        className="bg-white dark:bg-[#004953] rounded-lg p-4 text-center"
                      >
                        <h4 className="font-bold text-[#002244] dark:text-white mb-2 transition-colors duration-300">
                          {quarter.quarter}
                        </h4>
                        <div className="space-y-2 mb-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-blue-600 font-semibold">
                              Cowboys:
                            </span>
                            <span className="font-bold text-[#002244] dark:text-white transition-colors duration-300">
                              {quarter.homeScore}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-green-600 font-semibold">
                              Eagles:
                            </span>
                            <span className="font-bold text-[#002244] dark:text-white transition-colors duration-300">
                              {quarter.awayScore}
                            </span>
                          </div>
                        </div>
                        <div className="border-t border-gray-200 dark:border-[#708090] pt-2">
                          <p className="text-xs text-[#708090] dark:text-[#96abdc] mb-1 transition-colors duration-300">
                            Winning Numbers:
                          </p>
                          <p className="font-bold text-[#ed5925] text-sm">
                            {quarter.winningNumbers.home} -{" "}
                            {quarter.winningNumbers.away}
                          </p>
                          <p className="text-xs text-[#708090] dark:text-[#96abdc] transition-colors duration-300">
                            Square {quarter.winningSquare}
                          </p>
                        </div>
                        <div className="mt-2">
                          <span className="bg-[#ed5925] text-white text-xs px-2 py-1 rounded-full">
                            {quarter.payout} payout
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-center text-sm text-[#708090] dark:text-[#96abdc] mb-6 transition-colors duration-300">
                  <p className="mb-2">
                    <strong>How it works:</strong> The winning numbers come from
                    the last digit of each team's score.
                  </p>
                  <p>
                    For example, Cowboys 7 - Eagles 3 = winning numbers 7-3,
                    which corresponds to the 7-3 combination square.
                  </p>
                </div>
              </div>

              {/* Interactive Grid Demo */}
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-[#002244] dark:text-white mb-6 text-center transition-colors duration-300">
                  Interactive Squares Grid
                </h3>
                <div className="bg-[#faf9f5] dark:bg-[#1a1a2e] rounded-xl p-6 transition-colors duration-300">
                  <div className="w-full overflow-x-auto">
                    {/* Main Grid Container with proper spacing and alignment */}
                    <div className="inline-block border-2 border-black min-w-full">
                      {/* Top section: Empty corner + Cowboys banner */}
                      <div className="flex">
                        {/* Empty corner space above Y-axis - aligned with Y-axis column width */}
                        <div className="w-32 h-16 bg-gray-300 border-r-2 border-black flex items-center justify-center">
                          <span className="text-xs font-bold text-gray-600">
                            Teams
                          </span>
                        </div>

                        {/* Cowboys Header - spans the width of the 10 columns */}
                        <div className="flex-1">
                          <div className="bg-gradient-to-r from-blue-600 to-black text-white text-center py-4 font-bold text-lg h-16 flex items-center justify-center">
                            HOME: Dallas Cowboys
                          </div>
                        </div>
                      </div>

                      {/* X-axis random numbers row - perfectly aligned with columns */}
                      <div className="flex">
                        {/* Empty space above Y-axis numbers - same width as Y-axis column */}
                        <div className="w-32 h-12 bg-gray-200 border-r-2 border-black flex items-center justify-center">
                          <span className="text-xs font-bold text-gray-600">
                            Numbers
                          </span>
                        </div>

                        {/* X-axis numbers - aligned with grid columns */}
                        <div className="flex flex-1">
                          {xAxisNumbers.map((num, index) => (
                            <div
                              key={`x-${index}`}
                              className="bg-blue-600 text-white text-center font-bold text-lg h-12 flex-1 flex items-center justify-center border-r border-black last:border-r-0"
                            >
                              {num}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Main content: Eagles banner + Y-axis numbers + Grid squares */}
                      <div className="flex">
                        {/* Eagles Banner - Vertical on Left */}
                        <div
                          className="w-20 bg-gradient-to-b from-green-600 to-black text-white font-bold text-sm flex items-center justify-center border-r-2 border-black"
                          style={{
                            writingMode: "vertical-rl",
                            textOrientation: "mixed",
                          }}
                        >
                          <span className="transform rotate-180">
                            AWAY: Philadelphia Eagles
                          </span>
                        </div>

                        {/* Y-axis numbers column */}
                        <div className="w-12 bg-green-600 border-r-2 border-black">
                          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((row) => (
                            <div
                              key={`y-${row}`}
                              className="text-white text-center font-bold text-lg h-16 flex items-center justify-center border-b border-black last:border-b-0"
                            >
                              {yAxisNumbers[row]}
                            </div>
                          ))}
                        </div>

                        {/* Grid squares - 10x10 grid */}
                        <div className="flex-1">
                          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((row) => (
                            <div key={`row-${row}`} className="flex">
                              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((col) => {
                                const squareIndex = row * 10 + col;
                                const square = sampleGrid[squareIndex];
                                if (!square) return null;
                                return (
                                  <button
                                    key={`square-${squareIndex}`}
                                    onClick={() =>
                                      setSelectedSquare(squareIndex)
                                    }
                                    className={`relative text-sm font-medium transition-all duration-200 bg-white border-r border-b border-black hover:bg-gray-50 h-16 flex-1 ${
                                      square.isWinning
                                        ? "bg-yellow-400 text-[#002244] animate-pulse"
                                        : square.isSelected
                                          ? "bg-[#ed5925] text-white"
                                          : ""
                                    }`}
                                  >
                                    {/* Square number in background */}
                                    <div
                                      className="absolute top-0 left-0 text-gray-400 text-xs opacity-50 leading-none p-0.5"
                                      style={{ fontSize: "10px" }}
                                    >
                                      {square.id}
                                    </div>
                                    {/* Player name or NFT symbol */}
                                    <div className="flex items-center justify-center h-full text-center leading-tight p-1">
                                      {square.hasNFT ? (
                                        <span className="text-xl">
                                          {square.nftSymbol}
                                        </span>
                                      ) : (
                                        <span
                                          className="text-xs text-[#002244]"
                                          style={{ fontFamily: "cursive" }}
                                        >
                                          {square.player}
                                        </span>
                                      )}
                                    </div>
                                    {/* Winning quarter indicator */}
                                    {square.isWinning && (
                                      <div
                                        className="absolute -top-1 -right-1 bg-[#ed5925] text-white text-xs px-1 rounded-full font-bold"
                                        style={{ fontSize: "10px" }}
                                      >
                                        {square.quarter}
                                      </div>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="text-center text-sm text-[#708090] dark:text-[#96abdc] mt-4 transition-colors duration-300">
                      <p className="mb-2">
                        Click any square to select it. Yellow squares show
                        winning positions for different quarters.
                      </p>
                      <p className="mb-2">
                        The winning squares are determined by matching the
                        horizontal number (X-axis) first, then vertical number
                        (Y-axis).
                      </p>
                      <p className="font-semibold text-[#ed5925]">
                        This is a Forward Only game.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step-by-Step Guide */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {gameSteps.map((step) => (
                  <div
                    key={step.step}
                    className="bg-[#faf9f5] dark:bg-[#1a1a2e] rounded-xl p-6 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-gradient-to-r from-[#ed5925] to-[#96abdc] w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        {step.step}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-[#002244] dark:text-white mb-2 transition-colors duration-300">
                          {step.title}
                        </h3>
                        <p className="text-[#708090] dark:text-[#96abdc] mb-3 transition-colors duration-300">
                          {step.description}
                        </p>
                        <p className="text-sm text-[#708090] dark:text-[#96abdc] leading-relaxed transition-colors duration-300">
                          {step.details}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rules & Scoring Tab */}
          {activeTab === "rules" && (
            <div className="p-8 lg:p-12">
              <h2 className="text-3xl font-bold text-[#002244] dark:text-white mb-8 text-center transition-colors duration-300">
                Rules & Scoring System
              </h2>

              {/* Scoring Examples */}
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-[#002244] dark:text-white mb-6 transition-colors duration-300">
                  How Scoring Works
                </h3>
                <div className="bg-[#faf9f5] dark:bg-[#1a1a2e] rounded-xl p-6 mb-6 transition-colors duration-300">
                  <p className="text-[#708090] dark:text-[#96abdc] text-center mb-6 transition-colors duration-300">
                    Winners are determined by the last digit of each team's
                    score at the end of each quarter.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {scoringExamples.map((example, index) => (
                      <div
                        key={index}
                        className="bg-white dark:bg-[#002244] rounded-lg p-4 border-l-4 border-[#ed5925] transition-colors duration-300"
                      >
                        <h4 className="font-bold text-[#002244] dark:text-white mb-2 transition-colors duration-300">
                          {example.quarter}
                        </h4>
                        <p className="text-sm text-[#708090] dark:text-[#96abdc] mb-2 transition-colors duration-300">
                          Score: {example.score}
                        </p>
                        <p className="text-sm font-semibold text-[#004953] dark:text-[#96abdc] mb-2 transition-colors duration-300">
                          Winner: {example.winner}
                        </p>
                        <div className="bg-[#ed5925] text-white text-xs px-2 py-1 rounded-full inline-block">
                          {example.payout} of pot
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Payout Structure */}
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-[#002244] dark:text-white mb-6 transition-colors duration-300">
                  Standard Payout Structure
                </h3>
                <div className="bg-white dark:bg-[#002244] border border-gray-200 dark:border-[#004953] rounded-xl overflow-hidden transition-colors duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-[#004953]">
                    <div className="p-6 text-center">
                      <div className="text-3xl font-bold text-[#ed5925] mb-2">
                        15%
                      </div>
                      <div className="text-[#002244] dark:text-white font-semibold mb-1 transition-colors duration-300">
                        1st Quarter
                      </div>
                      <div className="text-sm text-[#708090] dark:text-[#96abdc] transition-colors duration-300">
                        First payout
                      </div>
                    </div>
                    <div className="p-6 text-center">
                      <div className="text-3xl font-bold text-[#96abdc] mb-2">
                        25%
                      </div>
                      <div className="text-[#002244] dark:text-white font-semibold mb-1 transition-colors duration-300">
                        2nd Quarter
                      </div>
                      <div className="text-sm text-[#708090] dark:text-[#96abdc] transition-colors duration-300">
                        Halftime payout
                      </div>
                    </div>
                    <div className="p-6 text-center">
                      <div className="text-3xl font-bold text-[#004953] mb-2">
                        15%
                      </div>
                      <div className="text-[#002244] dark:text-white font-semibold mb-1 transition-colors duration-300">
                        3rd Quarter
                      </div>
                      <div className="text-sm text-[#708090] dark:text-[#96abdc] transition-colors duration-300">
                        Third quarter
                      </div>
                    </div>
                    <div className="p-6 text-center">
                      <div className="text-3xl font-bold text-[#002244] dark:text-white mb-2 transition-colors duration-300">
                        45%
                      </div>
                      <div className="text-[#002244] dark:text-white font-semibold mb-1 transition-colors duration-300">
                        Final Score
                      </div>
                      <div className="text-sm text-[#708090] dark:text-[#96abdc] transition-colors duration-300">
                        Biggest payout
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Game Rules */}
              <div>
                <h3 className="text-2xl font-bold text-[#002244] dark:text-white mb-6 transition-colors duration-300">
                  Important Rules
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      title: "Square Ownership",
                      rules: [
                        "Each square can only be owned by one player",
                        "Players can purchase multiple squares",
                        "Squares are sold on a first-come, first-served basis",
                        "No refunds once the game starts",
                      ],
                    },
                    {
                      title: "Number Assignment",
                      rules: [
                        "Numbers are randomly assigned after all squares are sold",
                        "Each row and column gets one number (0-9)",
                        "Assignment is done transparently and fairly",
                        "Numbers cannot be changed once assigned",
                      ],
                    },
                    {
                      title: "Winning Conditions",
                      rules: [
                        "Winners determined by last digit of each team's score",
                        "Payouts happen at the end of each quarter",
                        "Overtime scores count for final score payout only",
                        "Ties are handled according to official NFL rules",
                      ],
                    },
                    {
                      title: "Payout Rules",
                      rules: [
                        "Payouts are automatic and immediate",
                        "Winners receive crypto directly to their wallet",
                        "Platform takes a small fee for hosting",
                        "All transactions are recorded on the blockchain",
                      ],
                    },
                  ].map((section, index) => (
                    <div
                      key={index}
                      className="bg-[#faf9f5] dark:bg-[#1a1a2e] rounded-xl p-6 transition-colors duration-300"
                    >
                      <h4 className="text-lg font-bold text-[#002244] dark:text-white mb-4 transition-colors duration-300">
                        {section.title}
                      </h4>
                      <ul className="space-y-2">
                        {section.rules.map((rule, ruleIndex) => (
                          <li
                            key={ruleIndex}
                            className="flex items-start gap-2 text-[#708090] dark:text-[#96abdc] transition-colors duration-300"
                          >
                            <CheckCircle className="w-4 h-4 text-[#ed5925] mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{rule}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Crypto Payouts Tab */}
          {activeTab === "crypto" && (
            <div className="p-8 lg:p-12">
              <h2 className="text-3xl font-bold text-[#002244] dark:text-white mb-8 text-center transition-colors duration-300">
                Crypto Payouts & Security
              </h2>

              {/* Crypto Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {cryptoFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className="text-center bg-[#faf9f5] dark:bg-[#1a1a2e] rounded-xl p-6 hover:shadow-md transition-all duration-200"
                  >
                    <div className="bg-gradient-to-r from-[#ed5925] to-[#96abdc] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-[#002244] dark:text-white mb-3 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-[#708090] dark:text-[#96abdc] transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Supported Cryptocurrencies */}
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-[#002244] dark:text-white mb-6 text-center transition-colors duration-300">
                  Supported Cryptocurrencies
                </h3>
                <div className="bg-[#004953] rounded-xl p-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div className="text-white">
                      <div className="w-16 h-16 bg-[#f7931a] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                        ₿
                      </div>
                      <h4 className="text-lg font-bold mb-2">Bitcoin</h4>
                      <p className="text-[#96abdc] text-sm">
                        The original cryptocurrency
                      </p>
                    </div>
                    <div className="text-white">
                      <div className="w-16 h-16 bg-[#627eea] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                        Ξ
                      </div>
                      <h4 className="text-lg font-bold mb-2">
                        Ethereum & EVM Stablecoins
                      </h4>
                      <p className="text-[#96abdc] text-sm">
                        USDC, USDT, DAI and more
                      </p>
                    </div>
                    <div className="text-white">
                      <div className="w-16 h-16 bg-[#9945ff] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                        ◎
                      </div>
                      <h4 className="text-lg font-bold mb-2">
                        Solana & SOL Stablecoins
                      </h4>
                      <p className="text-[#96abdc] text-sm">
                        Fast and low-cost transactions
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* How Crypto Payouts Work */}
              <div>
                <h3 className="text-2xl font-bold text-[#002244] dark:text-white mb-6 transition-colors duration-300">
                  How Crypto Payouts Work
                </h3>
                <div className="space-y-6">
                  {[
                    {
                      step: 1,
                      title: "Connect Your Wallet",
                      description:
                        "Link your crypto wallet to participate in games and receive payouts.",
                      icon: Wallet,
                    },
                    {
                      step: 2,
                      title: "Purchase Squares",
                      description:
                        "Buy squares using your preferred cryptocurrency from your connected wallet.",
                      icon: Grid3X3,
                    },
                    {
                      step: 3,
                      title: "Automatic Payouts",
                      description:
                        "Winners receive payouts automatically to their wallet at the end of each quarter.",
                      icon: Zap,
                    },
                    {
                      step: 4,
                      title: "Blockchain Verification",
                      description:
                        "All transactions are recorded on the blockchain for complete transparency.",
                      icon: Shield,
                    },
                  ].map((step) => (
                    <div
                      key={step.step}
                      className="flex items-start gap-4 bg-white dark:bg-[#002244] rounded-xl p-6 border border-gray-200 dark:border-[#004953] transition-colors duration-300"
                    >
                      <div className="bg-gradient-to-r from-[#ed5925] to-[#96abdc] w-12 h-12 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-[#002244] dark:text-white mb-2 transition-colors duration-300">
                          {step.title}
                        </h4>
                        <p className="text-[#708090] dark:text-[#96abdc] transition-colors duration-300">
                          {step.description}
                        </p>
                      </div>
                      <step.icon className="w-8 h-8 text-[#708090] dark:text-[#96abdc] flex-shrink-0 transition-colors duration-300" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tips & Strategy Tab */}
          {activeTab === "strategy" && (
            <div className="p-8 lg:p-12">
              <h2 className="text-3xl font-bold text-[#002244] dark:text-white mb-8 text-center transition-colors duration-300">
                Winning Tips & Strategies
              </h2>

              {/* Strategy Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {strategies.map((strategy, index) => (
                  <div
                    key={index}
                    className="bg-[#faf9f5] dark:bg-[#1a1a2e] rounded-xl p-6 hover:shadow-md transition-all duration-200"
                  >
                    <h3 className="text-xl font-bold text-[#002244] dark:text-white mb-3 transition-colors duration-300">
                      {strategy.title}
                    </h3>
                    <p className="text-[#708090] dark:text-[#96abdc] mb-4 transition-colors duration-300">
                      {strategy.description}
                    </p>
                    <div className="bg-[#ed5925] bg-opacity-10 border-l-4 border-[#ed5925] p-3 rounded">
                      <p className="text-sm text-[#002244] dark:text-white font-medium transition-colors duration-300">
                        💡 Pro Tip: {strategy.tip}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Number Frequency Chart */}
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-[#002244] dark:text-white mb-6 transition-colors duration-300">
                  Historical Number Frequency
                </h3>
                <div className="bg-white dark:bg-[#002244] rounded-xl p-6 border border-gray-200 dark:border-[#004953] transition-colors duration-300">
                  <p className="text-[#708090] dark:text-[#96abdc] text-center mb-6 transition-colors duration-300">
                    Based on NFL scoring patterns, some numbers appear more
                    frequently as winning digits:
                  </p>
                  <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                    {[
                      { num: 0, freq: "High", color: "bg-green-500" },
                      { num: 1, freq: "Medium", color: "bg-yellow-500" },
                      { num: 2, freq: "Low", color: "bg-red-500" },
                      { num: 3, freq: "High", color: "bg-green-500" },
                      { num: 4, freq: "Medium", color: "bg-yellow-500" },
                      { num: 5, freq: "Low", color: "bg-red-500" },
                      { num: 6, freq: "Medium", color: "bg-yellow-500" },
                      { num: 7, freq: "High", color: "bg-green-500" },
                      { num: 8, freq: "Medium", color: "bg-yellow-500" },
                      { num: 9, freq: "Low", color: "bg-red-500" },
                    ].map((item) => (
                      <div key={item.num} className="text-center">
                        <div
                          className={`${item.color} text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-2`}
                        >
                          {item.num}
                        </div>
                        <div className="text-xs text-[#708090] dark:text-[#96abdc] transition-colors duration-300">
                          {item.freq}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center gap-6 mt-6 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-[#708090] dark:text-[#96abdc] transition-colors duration-300">
                        High Frequency
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-[#708090] dark:text-[#96abdc] transition-colors duration-300">
                        Medium Frequency
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-[#708090] dark:text-[#96abdc] transition-colors duration-300">
                        Low Frequency
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Tips */}
              <div>
                <h3 className="text-2xl font-bold text-[#002244] dark:text-white mb-6 transition-colors duration-300">
                  Quick Tips for Beginners
                </h3>
                <div className="bg-gradient-to-r from-[#004953] to-[#002244] rounded-xl p-8 text-white">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-bold mb-3 text-[#96abdc]">
                        Do's
                      </h4>
                      <ul className="space-y-2">
                        {[
                          "Start with smaller games to learn",
                          "Research team scoring patterns",
                          "Consider buying multiple squares",
                          "Set a budget and stick to it",
                          "Have fun and enjoy the game!",
                        ].map((tip, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-[#ed5925] mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold mb-3 text-[#96abdc]">
                        Don'ts
                      </h4>
                      <ul className="space-y-2">
                        {[
                          "Don't spend more than you can afford",
                          "Don't chase losses with bigger bets",
                          "Don't rely solely on luck",
                          "Don't ignore the game rules",
                          "Don't forget to secure your wallet",
                        ].map((tip, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-4 h-4 bg-red-500 rounded-full mt-0.5 flex-shrink-0 flex items-center justify-center">
                              <span className="text-white text-xs">✕</span>
                            </div>
                            <span className="text-sm">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-[#002244] to-[#004953] rounded-2xl p-8 lg:p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Play Your First Game?
            </h2>
            <p className="text-[#96abdc] text-lg mb-8 max-w-2xl mx-auto">
              Now that you understand how Football Squares works, join a game
              and experience the excitement of crypto-powered NFL action.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-[#ed5925] to-[#96abdc] text-white px-8 py-4 rounded-full font-bold text-lg hover:from-[#d14a1f] hover:to-[#7a95d1] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 inline-flex items-center gap-2">
                <Play className="w-6 h-6" />
                Play Your First Game
              </button>
              <button className="bg-white bg-opacity-20 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-opacity-30 transition-all duration-200 border border-white border-opacity-30 inline-flex items-center gap-2">
                <Users className="w-6 h-6" />
                Join Community
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default HowToPlayContent;
