import CreateNFTNav from '@/components/CreateNFTNav';

export default function CustomHandDrawnSymbolNFTPage() {
  return (
    <main className="min-h-screen bg-[#faf9f5] dark:bg-[#1a1a2e] transition-colors duration-300 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <CreateNFTNav active="/create-nft/custom-hand-drawn-symbol" />
        <h1 className="text-4xl font-bold text-[#96abdc] mb-6 text-center">
          Create Custom Hand-Drawn Symbol NFT
        </h1>
        <p className="text-lg text-[#002244] dark:text-white mb-8 text-center">
          Draw your own symbol or doodle directly on the website using our
          whiteboard tool. This NFT will appear on your purchased squares.
        </p>
        {/* NFT creation form goes here */}
        <div className="bg-white dark:bg-[#002244] rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-[#004953] max-w-xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4 text-[#96abdc] text-center">
            Hand-Drawn Symbol Creator
          </h2>
          {/* Example: drawing canvas, preview, and create button */}
          {/* You can expand this with actual logic as needed */}
          <div className="text-center text-[#708090] dark:text-[#96abdc]">
            <p>Hand-drawn symbol creation UI coming soon...</p>
          </div>
        </div>
      </div>
    </main>
  );
}
