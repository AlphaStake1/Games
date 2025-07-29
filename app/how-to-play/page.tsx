import dynamic from 'next/dynamic';

const HowToPlayContent = dynamic(
  () => import('@/components/HowToPlayContent'),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-[#faf9f5] dark:bg-[#444341] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg">Loading How To Play...</p>
        </div>
      </div>
    ),
  },
);

export const metadata = {
  title: 'How To Play Football Squares | Complete Guide',
  description:
    'Learn how to play Football Squares with our comprehensive guide. Understand the rules, scoring, and strategies for winning.',
};

export default function HowToPlayPage() {
  return (
    <div className="min-h-screen bg-[#faf9f5] dark:bg-[#444341] transition-colors duration-300">
      <HowToPlayContent />
    </div>
  );
}
