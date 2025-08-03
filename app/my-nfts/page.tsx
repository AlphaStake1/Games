'use client';

import dynamic from 'next/dynamic';

const MyNFTsContent = dynamic(() => import('@/components/MyNFTsContent'), {
  ssr: false,
});

// Note: metadata moved to layout or will be handled by next/head in client component

export default function MyNFTsPage() {
  return (
    <div className="min-h-screen bg-[#faf9f5] dark:bg-[#1a1a2e] transition-colors duration-300">
      <MyNFTsContent />
    </div>
  );
}
