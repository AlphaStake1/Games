'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BoardTier, SquareSelection } from '@/lib/boardTypes';
import { formatCurrency } from '@/lib/utils';
import { Calculator, TrendingUp, Award, Info } from 'lucide-react';

interface PricingPanelProps {
  selections: SquareSelection[];
  onPurchaseConfirm: () => void;
  onClearSelections: () => void;
  isProcessing?: boolean;
  className?: string;
}

const PricingPanel: React.FC<PricingPanelProps> = ({
  selections,
  onPurchaseConfirm,
  onClearSelections,
  isProcessing = false,
  className = '',
}) => {
  const totalCost = selections.reduce(
    (sum, selection) => sum + selection.totalCost,
    0,
  );
  const totalSquares = selections.reduce(
    (sum, selection) => sum + selection.squareIndices.length,
    0,
  );
  const hasSelections = selections.length > 0;

  // Calculate potential total winnings across all quarters for all selections
  const calculatePotentialWinnings = () => {
    const winnings = {
      q1: 0,
      q2: 0,
      q3: 0,
      q4: 0,
      overtime: 0,
    };

    selections.forEach((selection) => {
      const squareCount = selection.squareIndices.length;
      winnings.q1 += selection.potentialPayouts.q1Regular * squareCount;
      winnings.q2 += selection.potentialPayouts.q2Regular * squareCount;
      winnings.q3 += selection.potentialPayouts.q3Regular * squareCount;
      winnings.q4 += selection.potentialPayouts.q4Regular * squareCount;

      if (selection.potentialPayouts.finalOvertime) {
        winnings.overtime +=
          selection.potentialPayouts.finalOvertime * squareCount;
      }
    });

    return winnings;
  };

  const potentialWinnings = calculatePotentialWinnings();

  let potentialQ4OvertimeTotal = 0;
  let potentialFinalOvertimeTotal = 0;

  selections.forEach((selection) => {
    const squareCount = selection.squareIndices.length;
    if (selection.potentialPayouts.q4Overtime) {
      potentialQ4OvertimeTotal +=
        selection.potentialPayouts.q4Overtime * squareCount;
    }
    if (selection.potentialPayouts.finalOvertime) {
      potentialFinalOvertimeTotal +=
        selection.potentialPayouts.finalOvertime * squareCount;
    }
  });

  return (
    <Card className={`sticky top-4 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          Purchase Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasSelections ? (
          <div className="text-center py-8 text-gray-500">
            <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">Select squares to see pricing details</p>
          </div>
        ) : (
          <>
            {/* Selection Overview */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Squares:</span>
                <Badge variant="secondary">{totalSquares}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Boards Selected:</span>
                <Badge variant="secondary">{selections.length}</Badge>
              </div>
            </div>

            <Separator />

            {/* Board Breakdown */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Board Breakdown:</h4>
              {selections.map((selection, index) => (
                <div
                  key={selection.boardId}
                  className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-sm font-medium">Board #{index + 1}</p>
                      <p className="text-xs text-gray-500">
                        {selection.squareIndices.length} squares
                      </p>
                    </div>
                    <p className="text-sm font-bold">
                      {formatCurrency(selection.totalCost)}
                    </p>
                  </div>

                  {/* Selected squares preview */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selection.squareIndices.slice(0, 10).map((index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {index}
                      </Badge>
                    ))}
                    {selection.squareIndices.length > 10 && (
                      <Badge variant="outline" className="text-xs">
                        +{selection.squareIndices.length - 10} more
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            {/* Potential Winnings */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <h4 className="font-medium text-sm">
                  Potential Winnings Per Quarter:
                </h4>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-start items-center gap-2">
                  <span>Q1:</span>
                  <span className="font-medium">
                    {formatCurrency(potentialWinnings.q1)}
                  </span>
                </div>
                <div className="flex justify-start items-center gap-2">
                  <span>Q2:</span>
                  <span className="font-medium">
                    {formatCurrency(potentialWinnings.q2)}
                  </span>
                </div>
                <div className="flex justify-start items-center gap-2">
                  <span>Q3:</span>
                  <span className="font-medium">
                    {formatCurrency(potentialWinnings.q3)}
                  </span>
                </div>
                <div className="flex justify-start items-center gap-2">
                  <span>Q4:</span>
                  <span className="font-medium">
                    {formatCurrency(potentialWinnings.q4)}
                  </span>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-950 rounded p-2 mt-4">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">
                    Max Cumulative Win (Regulation End):
                  </span>
                  <span className="text-sm font-bold text-green-600">
                    {formatCurrency(
                      potentialWinnings.q1 +
                        potentialWinnings.q2 +
                        potentialWinnings.q3 +
                        potentialWinnings.q4,
                    )}
                  </span>
                </div>
                {potentialQ4OvertimeTotal > 0 &&
                  potentialFinalOvertimeTotal > 0 && (
                    <div className="text-xs text-gray-500 mt-1 space-y-1">
                      <p className="font-semibold mt-2">
                        If game goes to Overtime:
                      </p>
                      <div className="flex justify-between">
                        <span>Q4 Overtime Scenario Payout:</span>
                        <span>{formatCurrency(potentialQ4OvertimeTotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Overtime Payout:</span>
                        <span>
                          {formatCurrency(potentialFinalOvertimeTotal)}
                        </span>
                      </div>
                      <p className="mt-2 text-blue-800 dark:text-blue-200">
                        Note: In overtime scenarios, the Q4 and Overtime payouts
                        are distinct.
                      </p>
                      <div className="flex justify-between font-bold text-green-700 dark:text-green-300 mt-2">
                        <span>Max Payout with OT split:</span>
                        <span>
                          {formatCurrency(
                            potentialWinnings.q1 +
                              potentialWinnings.q2 +
                              potentialWinnings.q3 +
                              potentialQ4OvertimeTotal,
                          )}
                        </span>
                      </div>
                    </div>
                  )}
              </div>
            </div>

            <Separator />

            {/* Total Cost */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total Cost:</span>
                <span>{formatCurrency(totalCost)}</span>
              </div>

              <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                <div className="text-xs text-blue-800 dark:text-blue-200">
                  <p>
                    Winners are paid automatically via smart contract 5 minutes
                    after official game end
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button
                onClick={onPurchaseConfirm}
                disabled={isProcessing}
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  `Confirm Purchase • ${formatCurrency(totalCost)}`
                )}
              </Button>

              <Button
                onClick={onClearSelections}
                variant="outline"
                className="w-full"
                disabled={isProcessing}
              >
                Clear All Selections
              </Button>
            </div>

            {/* Risk Disclaimer */}
            <div className="text-xs text-gray-500 text-center border-t pt-3">
              <p>Game-play involves risk. Play responsibly.</p>
              <p>Must be 18+ to participate.</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PricingPanel;
