import FaqContent from '@/components/FaqContent';

export const metadata = {
  title: 'FAQ | Football Squares - Frequently Asked Questions',
  description:
    'Find answers about Football Squares NFTs, gameplay, payouts, Community Board Leaders, VIP membership, and more.',
};

const FaqPage = () => {
  return (
    <div className="min-h-screen bg-[#faf9f5] dark:bg-[#444341] transition-colors duration-300">
      <FaqContent />
    </div>
  );
};

export default FaqPage;
