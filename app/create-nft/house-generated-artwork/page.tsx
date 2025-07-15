import CreateNFTNav from "@/components/CreateNFTNav";

export default function HouseGeneratedArtworkNFTPage() {
  return (
    <main className="min-h-screen bg-[#faf9f5] dark:bg-[#1a1a2e] transition-colors duration-300 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <CreateNFTNav active="/create-nft/house-generated-artwork" />
        <h1 className="text-4xl font-bold text-[#004953] mb-6 text-center">Create House-Generated Artwork NFT</h1>
        <p className="text-lg text-[#002244] dark:text-white mb-8 text-center">
          Choose from static full-color art produced by the Football Squares design team. This NFT will appear on your purchased squares.
        </p>
        {/* NFT selection UI goes here */}
        <div className="bg-white dark:bg-[#002244] rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-[#004953] max-w-xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4 text-[#004953] text-center">House Artwork Selection</h2>
          {/* Example: artwork selection grid, preview, and create button */}
          {/* You can expand this with actual logic as needed */}
          <div className="text-center text-[#708090] dark:text-[#96abdc]">
            <p>House artwork selection UI coming soon...</p>
          </div>
        </div>
      </div>
    </main>
  );
}