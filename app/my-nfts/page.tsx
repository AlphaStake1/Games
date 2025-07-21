import dynamic from 'next/dynamic';
import Footer from '@/components/Footer';

const MyNFTsContent = dynamic(() => import('@/components/MyNFTsContent'), {
  ssr: false,
});

export const metadata = {
  title: 'My NFTs | Football Squares Collection',
  description:
    'View your Football Squares NFT collection and learn about creating unique digital assets for your game squares.',
};

export default function MyNFTsPage() {
  return (
    <div className="min-h-screen bg-[#faf9f5] dark:bg-[#1a1a2e] transition-colors duration-300">
      <MyNFTsContent />
      <Footer />
    </div>
  );
}
