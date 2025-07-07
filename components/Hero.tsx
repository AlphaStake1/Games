'use client';

import { useState } from 'react';
import { PlayCircle } from 'lucide-react';

const Hero = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="bg-gradient-to-br from-[#002244] via-[#004953] to-[#002244] text-white py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Game Day Just Got{' '}
              <span className="text-[#ed5925]">More Rewarding</span>
            </h1>
            <p className="text-xl sm:text-2xl text-[#96abdc] mb-8 leading-relaxed">
              Claim your squares for potential crypto winnings every quarter.
            </p>
            <button
              className="bg-gradient-to-r from-[#ed5925] to-[#96abdc] text-white px-8 py-4 rounded-full text-lg font-bold hover:from-[#d14a1f] hover:to-[#7a95d1] hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center gap-3"
              aria-label="Start playing Football Squares now"
            >
              <PlayCircle className="w-6 h-6" />
              Play Squares Board Now
            </button>
          </div>

          {/* Trophy Illustration */}
          <div className="flex justify-center lg:justify-end">
            <div
              className={`relative transition-transform duration-500 ${
                isHovered ? 'scale-110 rotate-3' : 'scale-100 rotate-0'
              }`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Football Field Background */}
              <div className="w-80 h-80 bg-[#004953] rounded-full relative overflow-hidden border-4 border-white shadow-2xl">
                {/* Field Lines */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-1 bg-white opacity-50"></div>
                </div>
                <div className="absolute inset-0 flex flex-col justify-center items-center">
                  <div className="h-full w-1 bg-white opacity-50"></div>
                </div>

                {/* Large Bouncing Trophy */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-[7rem] animate-bounce">🏆</div>
                </div>

                {/* Footballs in each quadrant */}
                <div className="absolute top-8 left-8 text-4xl">🏈</div>
                <div className="absolute top-8 right-8 text-4xl">🏈</div>
                <div className="absolute bottom-8 left-8 text-4xl">🏈</div>
                <div className="absolute bottom-8 right-8 text-4xl">🏈</div>

                {/* Floating Elements */}
                <div className="absolute top-4 right-4 text-2xl animate-pulse text-[#ed5925]">⭐</div>
                <div className="absolute bottom-4 left-4 text-2xl animate-pulse delay-1000 text-[#96abdc]">🎯</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;