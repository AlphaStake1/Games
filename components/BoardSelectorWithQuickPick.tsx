'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import BoardSelector from '@/components/BoardSelector';
import QuickPickModal from '@/components/QuickPickModal';
import { BoardConfiguration, GameSchedule } from '@/lib/boardTypes';
import { NFLTeam } from '@/lib/nflTeams';
import { Sparkles, Grid, HelpCircle } from '@/lib/icons';

interface BoardSelectorWithQuickPickProps {
  userTeam: NFLTeam;
  isVIP: boolean;
  availableGames: GameSchedule[];
  onBoardSelect: (board: BoardConfiguration) => void;
  onVIPUpgrade: () => void;
  selectedBoards?: string[];
  className?: string;
}

/**
 * Enhanced BoardSelector component that includes Quick Pick functionality
 * for improved UX, especially for new users who might be overwhelmed
 * by the full range of board options.
 */
const BoardSelectorWithQuickPick: React.FC<BoardSelectorWithQuickPickProps> = ({
  userTeam,
  isVIP,
  availableGames,
  onBoardSelect,
  onVIPUpgrade,
  selectedBoards = [],
  className = '',
}) => {
  const [viewMode, setViewMode] = useState<'quick-pick' | 'full-selector'>(
    'quick-pick',
  );
  const [hasUsedQuickPick, setHasUsedQuickPick] = useState(false);

  const handleQuickPickBoardSelect = (board: BoardConfiguration) => {
    setHasUsedQuickPick(true);
    onBoardSelect(board);
    // Optionally switch to full view after successful quick pick
    // setViewMode('full-selector');
  };

  const renderQuickPickIntro = () => (
    <Card className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="w-5 h-5 text-blue-600" />
          New to Football Squares?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Let our Quick Pick Assistant recommend the perfect board based on your
          favorite team, budget, and playing style. It&apos;s the easiest way to
          get started!
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <QuickPickModal
            userTeam={userTeam}
            isVIP={isVIP}
            availableGames={availableGames}
            onBoardSelect={handleQuickPickBoardSelect}
            onVIPUpgrade={onVIPUpgrade}
            className="flex-1"
          >
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <Sparkles className="w-4 h-4 mr-2" />
              Get My Perfect Board
            </Button>
          </QuickPickModal>

          <Button
            variant="outline"
            onClick={() => setViewMode('full-selector')}
            className="flex-1"
          >
            <Grid className="w-4 h-4 mr-2" />
            View All Boards
          </Button>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <HelpCircle className="w-3 h-3" />
          <span>
            Quick Pick uses your preferences to suggest 2-3 boards. You can
            always browse all options later.
          </span>
        </div>
      </CardContent>
    </Card>
  );

  const renderModeToggle = () => (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <Badge variant={viewMode === 'quick-pick' ? 'default' : 'outline'}>
          Quick Pick
        </Badge>
        <Badge variant={viewMode === 'full-selector' ? 'default' : 'outline'}>
          All Boards
        </Badge>
      </div>

      <div className="flex gap-2">
        {viewMode === 'full-selector' && (
          <QuickPickModal
            userTeam={userTeam}
            isVIP={isVIP}
            availableGames={availableGames}
            onBoardSelect={handleQuickPickBoardSelect}
            onVIPUpgrade={onVIPUpgrade}
          >
            <Button variant="outline" size="sm">
              <Sparkles className="w-4 h-4 mr-2" />
              Quick Pick
            </Button>
          </QuickPickModal>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setViewMode(
              viewMode === 'quick-pick' ? 'full-selector' : 'quick-pick',
            )
          }
        >
          {viewMode === 'quick-pick' ? (
            <>
              <Grid className="w-4 h-4 mr-2" />
              View All
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Quick Pick
            </>
          )}
        </Button>
      </div>
    </div>
  );

  const renderSuccessBanner = () => {
    if (!hasUsedQuickPick || selectedBoards.length === 0) return null;

    return (
      <Card className="mb-6 border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-green-800 dark:text-green-200">
                Great choice! You&apos;ve selected {selectedBoards.length} board
                {selectedBoards.length !== 1 ? 's' : ''}.
              </h4>
              <p className="text-sm text-green-700 dark:text-green-300">
                Ready to pick your squares, or would you like to add more
                boards?
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className={className}>
      {/* Success Banner */}
      {renderSuccessBanner()}

      {/* Quick Pick Introduction for new users */}
      {viewMode === 'quick-pick' && !hasUsedQuickPick && renderQuickPickIntro()}

      {/* Mode Toggle */}
      {(hasUsedQuickPick || viewMode === 'full-selector') && renderModeToggle()}

      {/* Content based on mode */}
      {viewMode === 'full-selector' ? (
        <BoardSelector
          userTeam={userTeam}
          isVIP={isVIP}
          onBoardSelect={onBoardSelect}
          onVIPUpgrade={onVIPUpgrade}
          selectedBoards={selectedBoards}
        />
      ) : (
        /* Empty state for quick-pick mode when already used */
        hasUsedQuickPick && (
          <Card className="text-center p-8">
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-medium">Want another recommendation?</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Use Quick Pick again to find more boards that match your
                  style, or browse all available options.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <QuickPickModal
                  userTeam={userTeam}
                  isVIP={isVIP}
                  availableGames={availableGames}
                  onBoardSelect={handleQuickPickBoardSelect}
                  onVIPUpgrade={onVIPUpgrade}
                >
                  <Button>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Get Another Recommendation
                  </Button>
                </QuickPickModal>

                <Button
                  variant="outline"
                  onClick={() => setViewMode('full-selector')}
                >
                  <Grid className="w-4 h-4 mr-2" />
                  Browse All Boards
                </Button>
              </div>
            </div>
          </Card>
        )
      )}
    </div>
  );
};

export default BoardSelectorWithQuickPick;
