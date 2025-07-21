'use client';

import { Play } from 'lucide-react';

const AdBanner = () => {
  return (
    <section className="bg-[#002244] overflow-hidden">
      <div className="h-80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-center h-full">
            {/* Video Section */}
            <div className="flex-1 flex items-center justify-center">
              <div className="bg-[#004953] rounded-lg p-6 text-center text-white w-full max-w-4xl">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-[#ed5925] rounded-full flex items-center justify-center">
                    <Play className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">
                      Football Squares Explained
                    </h3>
                    <p className="text-[#96abdc]">
                      Watch how Football Squares works
                    </p>
                  </div>
                </div>

                <div className="bg-black bg-opacity-30 rounded-lg pt-1 pb-24">
                  <div className="flex justify-center">
                    <div className="w-80 h-80 bg-black rounded-lg overflow-hidden">
                      <iframe
                        width="100%"
                        height="100%"
                        src="https://www.youtube.com/embed/lGv6YRlZUv4?si=T4jltJLO-Z5KgrKw&amp;clip=Ugkxj8cFVerEPTbvWsrAAqwgjZtD1UsYdZ2o&amp;clipt=EAAY6Wg&autoplay=1&mute=1&loop=1&playlist=lGv6YRlZUv4"
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdBanner;
