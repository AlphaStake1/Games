'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Connection, PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

interface Square {
  index: number;
  owner: string;
  available: boolean;
}

interface BoardState {
  gameId: number;
  authority: string;
  finalized: boolean;
  randomized: boolean;
  gameStarted: boolean;
  gameEnded: boolean;
  winner: string;
  payoutAmount: number;
  totalPot: number;
  homeScore: number;
  awayScore: number;
  quarter: number;
  squares: string[];
  homeHeaders: number[];
  awayHeaders: number[];
  lastUpdated: number;
}

interface SquaresGridProps {
  gameId: number;
  initialBoardState?: BoardState;
  onSquarePurchase?: (squareIndex: number) => void;
}

const SquaresGrid: React.FC<SquaresGridProps> = ({ 
  gameId, 
  initialBoardState, 
  onSquarePurchase 
}) => {
  const [boardState, setBoardState] = useState<BoardState | null>(initialBoardState || null);
  const [selectedSquare, setSelectedSquare] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const { publicKey, connected } = useWallet();

  const connectWebSocket = useCallback(() => {
    const wsUrl = `ws://${process.env.NEXT_PUBLIC_WS_HOST || 'localhost'}:${process.env.NEXT_PUBLIC_WS_PORT || '8080'}`;
    
    try {
      wsRef.current = new WebSocket(wsUrl);
      
      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setConnectionStatus('connected');
        
        // Subscribe to game updates
        wsRef.current?.send(JSON.stringify({
          type: 'subscribe',
          data: {
            gameId,
            events: ['board_update', 'score_update', 'winner_announced', 'square_purchased']
          }
        }));
        
        // Request initial board state
        wsRef.current?.send(JSON.stringify({
          type: 'get_board_state',
          data: { gameId }
        }));
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          handleWebSocketMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        setConnectionStatus('disconnected');
        
        // Reconnect after 5 seconds
        setTimeout(() => {
          if (wsRef.current?.readyState === WebSocket.CLOSED) {
            connectWebSocket();
          }
        }, 5000);
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionStatus('disconnected');
      };
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
      setConnectionStatus('disconnected');
    }
  }, [gameId]);

  const handleWebSocketMessage = useCallback((message: any) => {
    switch (message.type) {
      case 'board_state':
        setBoardState(message.data);
        break;
      case 'board_update':
        setBoardState(prev => prev ? { ...prev, ...message.data } : null);
        toast.info('Board updated!');
        break;
      case 'score_update':
        setBoardState(prev => prev ? {
          ...prev,
          homeScore: message.data.homeScore,
          awayScore: message.data.awayScore,
          quarter: message.data.quarter,
          lastUpdated: message.timestamp
        } : null);
        toast.info(`Score update: ${message.data.homeScore}-${message.data.awayScore} Q${message.data.quarter}`);
        break;
      case 'winner_announced':
        setBoardState(prev => prev ? {
          ...prev,
          winner: message.data.winner,
          gameEnded: true,
          lastUpdated: message.timestamp
        } : null);
        toast.success('🏆 Winner announced!');
        break;
      case 'square_purchased':
        setBoardState(prev => {
          if (!prev) return null;
          const newSquares = [...prev.squares];
          newSquares[message.data.squareIndex] = message.data.buyer;
          return {
            ...prev,
            squares: newSquares,
            totalPot: prev.totalPot + message.data.amount,
            lastUpdated: message.timestamp
          };
        });
        toast.info(`Square #${message.data.squareIndex} purchased!`);
        break;
      case 'connected':
        console.log('WebSocket connection confirmed');
        break;
      case 'heartbeat':
        // Send pong response
        wsRef.current?.send(JSON.stringify({ type: 'ping' }));
        break;
      case 'error':
        console.error('WebSocket error:', message.data);
        toast.error(message.data.message || 'An error occurred');
        break;
      default:
        console.log('Unknown message type:', message.type);
    }
  }, []);

  useEffect(() => {
    connectWebSocket();
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connectWebSocket]);

  const handleSquareClick = (squareIndex: number) => {
    if (!boardState || !connected || !publicKey) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (boardState.squares[squareIndex] !== '11111111111111111111111111111111') {
      toast.error('This square is already taken');
      return;
    }

    if (boardState.gameStarted) {
      toast.error('Game has already started');
      return;
    }

    setSelectedSquare(squareIndex);
    onSquarePurchase?.(squareIndex);
  };

  const purchaseSquare = async (squareIndex: number) => {
    if (!connected || !publicKey || !boardState) return;

    setPurchaseLoading(true);
    try {
      // In real implementation, this would call the Anchor program
      // For now, we'll simulate the purchase
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(`Square #${squareIndex} purchased successfully!`);
      setSelectedSquare(null);
    } catch (error) {
      console.error('Error purchasing square:', error);
      toast.error('Failed to purchase square');
    } finally {
      setPurchaseLoading(false);
    }
  };

  const getSquareColor = (squareIndex: number): string => {
    if (!boardState) return 'bg-gray-100';
    
    const isOwned = boardState.squares[squareIndex] !== '11111111111111111111111111111111';
    const isUserSquare = boardState.squares[squareIndex] === publicKey?.toString();
    const isWinningSquare = boardState.winner && boardState.squares[squareIndex] === boardState.winner;
    
    if (isWinningSquare) return 'bg-yellow-300 border-yellow-500';
    if (isUserSquare) return 'bg-blue-200 border-blue-500';
    if (isOwned) return 'bg-gray-200 border-gray-400';
    return 'bg-white border-gray-300 hover:bg-gray-50';
  };

  const getSquareLabel = (squareIndex: number): string => {
    if (!boardState) return `${squareIndex}`;
    
    const isOwned = boardState.squares[squareIndex] !== '11111111111111111111111111111111';
    if (isOwned) {
      const owner = boardState.squares[squareIndex];
      return owner.slice(0, 4) + '...';
    }
    return `${squareIndex}`;
  };

  const renderConnectionStatus = () => {
    const statusColors = {
      connecting: 'bg-yellow-500',
      connected: 'bg-green-500',
      disconnected: 'bg-red-500'
    };

    const statusText = {
      connecting: 'Connecting...',
      connected: 'Live',
      disconnected: 'Disconnected'
    };

    return (
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-3 h-3 rounded-full ${statusColors[connectionStatus]}`}></div>
        <span className="text-sm text-gray-600">{statusText[connectionStatus]}</span>
      </div>
    );
  };

  const renderGameInfo = () => {
    if (!boardState) return null;

    const soldSquares = boardState.squares.filter(s => s !== '11111111111111111111111111111111').length;
    const availableSquares = 100 - soldSquares;

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-center">{boardState.homeScore}</div>
            <div className="text-sm text-gray-600 text-center">Home</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-center">{boardState.awayScore}</div>
            <div className="text-sm text-gray-600 text-center">Away</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-center">Q{boardState.quarter}</div>
            <div className="text-sm text-gray-600 text-center">Quarter</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-center">{availableSquares}</div>
            <div className="text-sm text-gray-600 text-center">Available</div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderGrid = () => {
    if (!boardState) {
      return <div className="text-center py-8">Loading board...</div>;
    }

    return (
      <div className="overflow-x-auto">
        {/* Headers */}
        <div className="grid grid-cols-11 gap-1 mb-2">
          <div className="w-12 h-12"></div>
          {boardState.homeHeaders.map((header, index) => (
            <div key={index} className="w-12 h-12 flex items-center justify-center bg-blue-100 border border-blue-300 rounded font-bold">
              {header}
            </div>
          ))}
        </div>
        
        {/* Grid rows */}
        {Array.from({ length: 10 }, (_, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-11 gap-1 mb-1">
            {/* Away header */}
            <div className="w-12 h-12 flex items-center justify-center bg-red-100 border border-red-300 rounded font-bold">
              {boardState.awayHeaders[rowIndex]}
            </div>
            
            {/* Squares */}
            {Array.from({ length: 10 }, (_, colIndex) => {
              const squareIndex = rowIndex * 10 + colIndex;
              return (
                <button
                  key={squareIndex}
                  onClick={() => handleSquareClick(squareIndex)}
                  className={`w-12 h-12 flex items-center justify-center border-2 rounded text-xs font-medium transition-colors ${getSquareColor(squareIndex)}`}
                  disabled={purchaseLoading}
                >
                  {getSquareLabel(squareIndex)}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Football Squares - Game {gameId}</CardTitle>
            <WalletMultiButton />
          </div>
          {renderConnectionStatus()}
        </CardHeader>
        <CardContent>
          {renderGameInfo()}
          {renderGrid()}
          
          {boardState?.gameEnded && boardState.winner && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-bold text-lg mb-2">🏆 Game Complete!</h3>
              <p>Winner: {boardState.winner}</p>
              <p>Final Score: {boardState.homeScore}-{boardState.awayScore}</p>
              <p>Payout: {(boardState.payoutAmount / 1_000_000_000).toFixed(2)} SOL</p>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedSquare !== null && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Purchase Square #{selectedSquare}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>Price: 0.01 SOL</p>
              <div className="flex gap-2">
                <Button 
                  onClick={() => purchaseSquare(selectedSquare)}
                  disabled={purchaseLoading}
                  className="flex-1"
                >
                  {purchaseLoading ? 'Purchasing...' : 'Purchase Square'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedSquare(null)}
                  disabled={purchaseLoading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SquaresGrid;