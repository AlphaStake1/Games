'use client';

import { useState } from 'react';
import FantasyFootballContent from '@/components/FantasyFootballContent';
import SidebarAds from '@/components/SidebarAds';
import VideoSection from '@/components/VideoSection';
import { Button } from '@/components/ui/button';

export default function FantasyPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefreshClick = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#faf9f5] dark:bg-[#1a1a2e] transition-colors duration-300 flex">
      <div className="flex-1">
        <Button onClick={handleRefreshClick} className="m-4">
          Refresh RSS Feeds
        </Button>
        <FantasyFootballContent />
      </div>
      <SidebarAds refreshTrigger={refreshTrigger} />
    </div>
  );
}
