'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NFL_TEAMS, NFLTeam, getTeamsByConference } from '@/lib/nflTeams';
import { cn } from '@/lib/utils';

interface TeamSelectionModalProps {
  isOpen: boolean;
  onTeamSelect: (team: NFLTeam) => void;
  onClose?: () => void;
}

const TeamSelectionModal: React.FC<TeamSelectionModalProps> = ({
  isOpen,
  onTeamSelect,
  onClose
}) => {
  const [selectedTeam, setSelectedTeam] = useState<NFLTeam | null>(null);
  const [selectedConference, setSelectedConference] = useState<'AFC' | 'NFC' | 'ALL'>('ALL');

  const afcTeams = getTeamsByConference('AFC');
  const nfcTeams = getTeamsByConference('NFC');
  
  const displayTeams = selectedConference === 'ALL' 
    ? NFL_TEAMS 
    : selectedConference === 'AFC' 
      ? afcTeams 
      : nfcTeams;

  const handleTeamClick = (team: NFLTeam) => {
    setSelectedTeam(team);
  };

  const handleConfirmSelection = () => {
    if (selectedTeam) {
      onTeamSelect(selectedTeam);
    }
  };

  const TeamCard = ({ team }: { team: NFLTeam }) => (
    <button
      onClick={() => handleTeamClick(team)}
      className={cn(
        "relative group flex flex-col items-center p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105",
        selectedTeam?.id === team.id
          ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
      )}
    >
      {/* Team Helmet/Logo Placeholder */}
      <div 
        className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-2 shadow-lg"
        style={{ backgroundColor: team.primaryColor }}
      >
        {team.abbreviation}
      </div>
      
      {/* Team Info */}
      <div className="text-center">
        <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
          {team.city}
        </h3>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          {team.name}
        </p>
        <Badge 
          variant="outline" 
          className="mt-1 text-xs"
          style={{ 
            borderColor: team.primaryColor,
            color: team.primaryColor 
          }}
        >
          {team.conference}
        </Badge>
      </div>

      {/* Selection Indicator */}
      {selectedTeam?.id === team.id && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs">✓</span>
        </div>
      )}
    </button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Choose Your Favorite NFL Team
          </DialogTitle>
          <DialogDescription className="text-center text-lg">
            This will be your home team and you'll see their schedule and regional games.
            <br />
            <span className="text-sm text-gray-500">
              You can change this later in your profile settings.
            </span>
          </DialogDescription>
        </DialogHeader>

        {/* Conference Filter */}
        <div className="flex justify-center gap-2 mb-6">
          <Button
            variant={selectedConference === 'ALL' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedConference('ALL')}
          >
            All Teams
          </Button>
          <Button
            variant={selectedConference === 'AFC' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedConference('AFC')}
          >
            AFC ({afcTeams.length})
          </Button>
          <Button
            variant={selectedConference === 'NFC' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedConference('NFC')}
          >
            NFC ({nfcTeams.length})
          </Button>
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 mb-6">
          {displayTeams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>

        {/* Selection Summary */}
        {selectedTeam && (
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-center gap-4">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: selectedTeam.primaryColor }}
              >
                {selectedTeam.abbreviation}
              </div>
              <div>
                <h4 className="font-semibold text-lg">
                  {selectedTeam.city} {selectedTeam.name}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedTeam.conference} {selectedTeam.division}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          )}
          <Button
            onClick={handleConfirmSelection}
            disabled={!selectedTeam}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {selectedTeam 
              ? `Confirm ${selectedTeam.city} ${selectedTeam.name}` 
              : 'Select a Team'
            }
          </Button>
        </div>

        {/* Helper Text */}
        <div className="text-center text-sm text-gray-500 mt-4">
          <p>
            Your selected team will determine which regional games and boards you see.
          </p>
          <p>
            Upgrade to VIP to access all teams and premium board tiers.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TeamSelectionModal;