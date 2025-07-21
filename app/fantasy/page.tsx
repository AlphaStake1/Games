import Footer from '@/components/Footer';
import FantasyFootballContent from '@/components/FantasyFootballContent';

export const metadata = {
  title: 'Fantasy Football Guide | Getting Started with Fantasy Football',
  description:
    "Complete beginner's guide to fantasy football. Learn the basics, scoring, drafting strategies, and platform comparisons for ESPN, Yahoo, Sleeper, and more.",
};

export default function FantasyPage() {
  return (
    <div className="min-h-screen bg-[#faf9f5] dark:bg-[#1a1a2e] transition-colors duration-300">
      <FantasyFootballContent />
      <Footer />
    </div>
  );
}
