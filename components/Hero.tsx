'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Play } from 'lucide-react';
import WalletConnectionPopup from '@/components/WalletConnectionPopup';
import useWalletConnectionPopup from '@/hooks/useWalletConnectionPopup';
import { useWallet } from '@solana/wallet-adapter-react';

const Hero = () => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const { connected, connect } = useWallet();
  const {
    isPopupOpen,
    currentIntent,
    intentData,
    hidePopup,
    showPlayGamePopup,
  } = useWalletConnectionPopup();

  const handleJoinGames = () => {
    if (connected) {
      // User has wallet connected, go directly to boards
      router.push('/boards?mode=weekly');
    } else {
      // Show wallet connection popup with intent
      showPlayGamePopup(undefined, '/boards?mode=weekly');
    }
  };

  // Handle wallet connection with actual Solana adapter
  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Wallet connection failed:', error);
      throw error;
    }
  };

  return (
    <section className="bg-black text-white py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Weekly Cash Games{' '}
              <span className="text-blue-500">Start Here</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-400 mb-8 leading-relaxed">
              Join Football Board Games with payouts for every quarter!
            </p>
            <button
              onClick={handleJoinGames}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center gap-3"
              aria-label="Join weekly cash games"
            >
              <Play className="w-6 h-6" />
              Join Weekly Cash Games
            </button>
          </div>

          {/* Minimalist Illustration */}
          <div className="flex justify-center lg:justify-end">
            <div
              className={`relative transition-transform duration-500 ${
                isHovered ? 'scale-110' : 'scale-100'
              }`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Grid Background */}
              <div className="w-80 h-80 bg-gray-900 rounded-lg relative overflow-hidden border border-gray-700 shadow-2xl">
                {/* Grid Lines */}
                <div className="absolute inset-0">
                  {/* Vertical lines */}
                  {[...Array(9)].map((_, i) => (
                    <div
                      key={`v-${i}`}
                      className="absolute h-full w-px bg-gray-600 opacity-30"
                      style={{ left: `${(i + 1) * 10}%` }}
                    />
                  ))}
                  {/* Horizontal lines */}
                  {[...Array(9)].map((_, i) => (
                    <div
                      key={`h-${i}`}
                      className="absolute w-full h-px bg-gray-600 opacity-30"
                      style={{ top: `${(i + 1) * 10}%` }}
                    />
                  ))}
                </div>

                {/* Center Trophy */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-6xl">🏆</div>
                </div>

                {/* Corner Accents */}
                <div className="absolute top-4 left-4 w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="absolute top-4 right-4 w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="absolute bottom-4 left-4 w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="absolute bottom-4 right-4 w-2 h-2 bg-blue-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wallet Connection Popup */}
      <WalletConnectionPopup
        isOpen={isPopupOpen}
        onClose={hidePopup}
        onConnect={handleConnect}
        intent={currentIntent}
        intentData={intentData}
      />
    </section>
  );
};

export default Hero;
