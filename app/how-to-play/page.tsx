import dynamic from 'next/dynamic';

const HowToPlayContent = dynamic(
  () => import('@/components/HowToPlayContent'),
  {
    ssr: false,
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
