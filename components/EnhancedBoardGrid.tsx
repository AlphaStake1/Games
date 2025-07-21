'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BoardConfiguration, SquareSelection } from '@/lib/boardTypes';
import { formatCurrency, cn } from '@/lib/utils';
import {
  Grid,
  MousePointer,
  Users,
  Trophy,
  AlertCircle,
  CheckCircle,
  Clock,
  Target,
} from 'lucide-react';

interface EnhancedBoardGridProps {
  board: BoardConfiguration;
  userWalletAddress: string | null;
  isVIP: boolean;
  onSquareSelectionChange: (selection: SquareSelection) => void;
  currentSelection?: SquareSelection;
  className?: string;
}

interface SquareState {
  index: number;
  isOwned: boolean;
  owner?: string;
  ownerNFT?: string;
  isSelected: boolean;
  isWinning: boolean;
  homeNumber?: string;
  awayNumber?: string;
  isAnimating?: boolean;
}

const NFT_SYMBOLS = [
  '🏆',
  '⭐',
  '🎯',
  '💎',
  '🔥',
  '⚡',
  '🎨',
  '🌟',
  '🎭',
  '🎪',
  '🎲',
  '🎸',
  '🎺',
  '🎻',
  '🎨',
  '🎮',
];

const EnhancedBoardGrid: React.FC<EnhancedBoardGridProps> = ({
  board,
  userWalletAddress,
  isVIP,
  onSquareSelectionChange,
  currentSelection,
  className = '',
}) => {
  const [squares, setSquares] = useState<SquareState[]>([]);
  const [selectedSquares, setSelectedSquares] = useState<number[]>([]);
  const [homeNumbers] = useState<string[]>([
    'R',
    'A',
    'N',
    'D',
    'O',
    'M',
    'I',
    'Z',
    'E',
    'D',
  ]);
  const [awayNumbers] = useState<string[]>([
    'R',
    'A',
    'N',
    'D',
    'O',
    'M',
    'I',
    'Z',
    'E',
    'D',
  ]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [lastAnimationTime, setLastAnimationTime] = useState<number>(0);
  const [boardNumber] = useState<string>(() => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString().slice(-6);
    return `${timestamp}${random}`;
  });

  const maxSquares = board.maxSquaresPerUser;

  useEffect(() => {
    if (squares.length === 0) return;

    const interval = setInterval(() => {
      const now = Date.now();
      if (now - lastAnimationTime < 15000) return;

      setSquares((currentSquares) => {
        const availableSquares = currentSquares.filter(
          (s) => !s.isOwned && !s.isAnimating,
        );
        if (availableSquares.length > 20 && Math.random() < 0.1) {
          const randomIndex = Math.floor(
            Math.random() * availableSquares.length,
          );
          const targetSquare = availableSquares[randomIndex];
          const squareIndex = targetSquare.index;

          const newSquares = [...currentSquares];
          newSquares[squareIndex] = { ...targetSquare, isAnimating: true };

          setLastAnimationTime(now);

          setTimeout(() => {
            setSquares((prevSquares) => {
              const updatedSquares = [...prevSquares];
              if (updatedSquares[squareIndex]?.isAnimating) {
                updatedSquares[squareIndex] = {
                  ...updatedSquares[squareIndex],
                  isOwned: true,
                  owner: 'other-user',
                  ownerNFT:
                    NFT_SYMBOLS[Math.floor(Math.random() * NFT_SYMBOLS.length)],
                  isAnimating: false,
                };
              }
              return updatedSquares;
            });
          }, 2000);

          return newSquares;
        }
        return currentSquares;
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [lastAnimationTime, squares.length]);

  useEffect(() => {
    const initialSquares: SquareState[] = Array.from(
      { length: 100 },
      (_, index) => {
        const isOwned = Math.random() < board.totalSquaresSold / 100;
        return {
          index,
          isOwned,
          owner: isOwned
            ? Math.random() < 0.3
              ? userWalletAddress || undefined
              : 'other-user'
            : undefined,
          ownerNFT: isOwned
            ? NFT_SYMBOLS[Math.floor(Math.random() * NFT_SYMBOLS.length)]
            : undefined,
          isSelected: false,
          isWinning: false,
          homeNumber: homeNumbers[index % 10],
          awayNumber: awayNumbers[Math.floor(index / 10)],
          isAnimating: false,
        };
      },
    );
    setSquares(initialSquares);
  }, [board.totalSquaresSold, userWalletAddress, homeNumbers, awayNumbers]);

  useEffect(() => {
    if (currentSelection && currentSelection.boardId === board.boardId) {
      setSelectedSquares(currentSelection.squareIndices);
      setIsSelectionMode(currentSelection.squareIndices.length > 0);
    } else {
      setSelectedSquares([]);
      setIsSelectionMode(false);
    }
  }, [currentSelection, board.boardId]);

  const handleSquareClick = useCallback(
    (squareIndex: number) => {
      if (
        !userWalletAddress ||
        squares[squareIndex]?.isOwned ||
        squares[squareIndex]?.isAnimating
      )
        return;

      const isCurrentlySelected = selectedSquares.includes(squareIndex);
      let newSelection: number[];

      if (isCurrentlySelected) {
        newSelection = selectedSquares.filter((idx) => idx !== squareIndex);
      } else {
        if (selectedSquares.length >= maxSquares && !isVIP) {
          alert(`You can only select up to ${maxSquares} squares.`);
          return;
        }
        newSelection = [...selectedSquares, squareIndex];
        if (newSelection.length > maxSquares && isVIP) {
          newSelection.shift();
        }
      }

      setSelectedSquares(newSelection);
      setIsSelectionMode(newSelection.length > 0);

      onSquareSelectionChange({
        boardId: board.boardId,
        squareIndices: newSelection,
        totalCost: newSelection.length * board.tier.pricePerSquare,
        potentialPayouts: board.tier.payouts,
        selectionTimestamp: Date.now(),
      });
    },
    [
      squares,
      selectedSquares,
      maxSquares,
      userWalletAddress,
      board,
      onSquareSelectionChange,
      isVIP,
    ],
  );

  const getSquareBackgroundColor = (square: SquareState): string => {
    if (!square) return 'bg-gray-200 cursor-not-allowed';
    if (square.isWinning) return 'bg-yellow-400 animate-pulse';
    if (square.isOwned) return 'bg-gray-700 text-white cursor-not-allowed';
    if (square.isAnimating)
      return 'bg-yellow-200 animate-pulse cursor-not-allowed';
    if (selectedSquares.includes(square.index)) return 'bg-green-400';
    return 'bg-white hover:bg-gray-100';
  };

  const getSquareContent = (square: SquareState): JSX.Element => {
    if (!square) return <span>-</span>;
    if (square.isOwned)
      return <span className="text-lg">{square.ownerNFT}</span>;
    if (selectedSquares.includes(square.index))
      return <CheckCircle className="w-6 h-6 text-white" />;
    return <span className="text-gray-300 text-xs">{square.index}</span>;
  };

  const clearSelection = () => {
    setSelectedSquares([]);
    setIsSelectionMode(false);
    onSquareSelectionChange({
      boardId: board.boardId,
      squareIndices: [],
      totalCost: 0,
      potentialPayouts: board.tier.payouts,
      selectionTimestamp: Date.now(),
    });
  };

  const availableSquares = squares.filter((s) => !s.isOwned).length;

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Grid className="w-5 h-5" />
              {board.tier.displayName} Board
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {board.game.homeTeam.city} vs {board.game.awayTeam.city} • Week{' '}
              {board.game.week}
            </p>
            <p className="text-xs text-gray-500 mt-1">Board #{boardNumber}</p>
          </div>
          <div className="text-right">
            <Badge variant="outline" className="mb-2">
              {formatCurrency(board.tier.pricePerSquare)} per square
            </Badge>
            <p className="text-xs text-gray-500">
              Max {maxSquares === 100 ? 'Unlimited' : maxSquares} squares
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Board Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Target className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">Available</span>
            </div>
            <p className="text-lg font-bold text-blue-600">
              {availableSquares}
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Users className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium">Sold</span>
            </div>
            <p className="text-lg font-bold text-gray-600">
              {100 - availableSquares}
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <MousePointer className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium">Your Selection</span>
            </div>
            <p className="text-lg font-bold text-purple-600">
              {selectedSquares.length}
            </p>
          </div>
        </div>

        <Separator />

        {/* Board Grid */}
        <div className="w-full">
          {/* Top Banners */}
          <div className="flex">
            <div className="w-24 shrink-0 h-16 flex flex-col items-center justify-center bg-white text-black text-sm font-bold border-r border-b border-gray-400">
              <div className="text-xs">
                {board.gameStartTime.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </div>
              <div className="text-xs">VS</div>
            </div>
            <div className="flex-1 h-16 flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-400 text-white font-bold text-lg border-b border-gray-400">
              {board.game.homeTeam.city} {board.game.homeTeam.name}
            </div>
          </div>

          {/* Main Grid Body */}
          <div className="flex">
            {/* Vertical Away Team Banner */}
            <div className="w-24 shrink-0 flex items-center justify-center bg-gradient-to-b from-red-600 to-red-400 text-white font-bold text-lg border-r border-gray-400">
              <div className="transform -rotate-90 whitespace-nowrap">
                {board.game.awayTeam.city} {board.game.awayTeam.name}
              </div>
            </div>

            {/* Grid and Numbers Container */}
            <div className="flex-1 flex flex-col">
              {/* Home Numbers Row */}
              <div className="flex">
                {/* This empty div is crucial for alignment */}
                <div className="w-12 shrink-0 aspect-square"></div>
                {homeNumbers.map((num) => (
                  <div
                    key={`home-${num}`}
                    className="flex-1 aspect-square flex items-center justify-center bg-blue-200 text-black font-bold border-b border-r border-gray-400"
                  >
                    {num}
                  </div>
                ))}
              </div>

              {/* Away Numbers and Squares Grid */}
              {awayNumbers.map((awayNum, rowIndex) => (
                <div key={`row-${rowIndex}`} className="flex">
                  {/* Y-Axis Number Cell */}
                  <div className="w-12 shrink-0 aspect-square flex items-center justify-center bg-red-200 text-black font-bold border-b border-r border-gray-400">
                    {awayNum}
                  </div>
                  {/* Square Cells */}
                  {homeNumbers.map((homeNum, colIndex) => {
                    const squareIndex = rowIndex * 10 + colIndex;
                    const square = squares[squareIndex];
                    return (
                      <button
                        key={squareIndex}
                        onClick={() => handleSquareClick(squareIndex)}
                        className={cn(
                          'flex-1 aspect-square flex items-center justify-center relative text-sm font-medium border-b border-r border-gray-400 cursor-pointer',
                          getSquareBackgroundColor(square),
                        )}
                        disabled={
                          !square ||
                          square.isOwned ||
                          square.isAnimating ||
                          !board.isActive
                        }
                        title={`Square ${homeNum}-${awayNum}`}
                      >
                        {getSquareContent(square)}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedBoardGrid;
