'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import AdBanner from '@/components/AdBanner';
import HowItWorks from '@/components/HowItWorks';
import CryptoPayments from '@/components/CryptoPayments';
import FantasyLinksGrid from '@/components/FantasyLinksGrid';
import EmailCapture from '@/components/EmailCapture';
import Footer from '@/components/Footer';
import SidebarAds from '@/components/SidebarAds';

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefreshFeeds = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="flex min-h-screen bg-[#faf9f5] dark:bg-[#1a1a2e] transition-colors duration-300">
      {/* Main Content */}
      <main className="flex-1">
        <Header />
        <Hero />
        <AdBanner />
        <HowItWorks />
        <CryptoPayments />
        <FantasyLinksGrid />
        <EmailCapture />
        <Footer />
      </main>

      {/* Right Sidebar Ads */}
      <aside className="w-80 lg:block hidden">
        <div className="p-6 sticky top-16">
          <Button
            onClick={handleRefreshFeeds}
            className="w-full mb-6 bg-[#ed5925] hover:bg-[#ed5925]/90 text-white font-bold"
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            Refresh Feeds
          </Button>
        </div>
        <SidebarAds refreshTrigger={refreshTrigger} />
      </aside>
    </div>
  );
}