'use client';

import { Wallet, Shield, Zap } from 'lucide-react';

const CryptoPayments = () => {
  const features = [
    {
      icon: Shield,
      title: 'Secure & Transparent',
      description: 'All transactions are recorded on the blockchain for complete transparency and security.',
    },
    {
      icon: Zap,
      title: 'Instant Payouts',
      description: 'Winners receive their crypto payouts instantly when the game concludes.',
    },
    {
      icon: Wallet,
      title: 'Easy Setup',
      description: 'Connect your wallet in seconds and start playing with your favorite cryptocurrency.',
    },
  ];

  return (
    <section className="py-20 bg-[#004953]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-6">
            100% Crypto Payins & Payouts
          </h2>
          <p className="text-xl text-[#96abdc] max-w-3xl mx-auto mb-8">
            All games are powered by cryptocurrency for secure, instant, and transparent transactions. 
            Experience the future of gaming with blockchain technology.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <span className="text-lg text-white font-medium">Need a wallet?</span>
            <button className="bg-gradient-to-r from-[#ed5925] to-[#96abdc] text-white px-8 py-3 rounded-full font-bold hover:from-[#d14a1f] hover:to-[#7a95d1] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 inline-flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Learn More
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-8 text-center hover:bg-opacity-20 transition-all duration-300 transform hover:scale-105"
            >
              <div className="bg-[#ed5925] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-4">
                {feature.title}
              </h3>
              
              <p className="text-[#96abdc] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Supported Cryptocurrencies */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-white mb-8">Supported Cryptocurrencies</h3>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-80">
            <div className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 bg-[#f7931a] rounded-full flex items-center justify-center text-sm font-bold">₿</div>
              <span>Bitcoin</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 bg-[#627eea] rounded-full flex items-center justify-center text-sm font-bold">Ξ</div>
              <span>Ethereum & EVM-based stablecoins</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 bg-[#9945ff] rounded-full flex items-center justify-center text-sm font-bold">◎</div>
              <span>Solana & Solana-based stablecoins</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CryptoPayments;