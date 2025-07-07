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
      <SidebarAds />
    </div>
  );
}