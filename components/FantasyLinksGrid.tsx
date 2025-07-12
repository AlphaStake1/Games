"use client";

import { ExternalLink } from "lucide-react";

const FantasyLinksGrid = () => {
  const fantasyLinks = [
    {
      name: "ESPN Fantasy",
      url: "https://www.espn.com/fantasy/football/",
      description:
        "The most popular fantasy platform with comprehensive stats, expert analysis, and social features.",
      color: "bg-[#ed5925]",
      logo: "ESPN",
    },
    {
      name: "NFL Fantasy",
      url: "https://fantasy.nfl.com/",
      description:
        "Official NFL fantasy football with real-time scoring and exclusive NFL content and insights.",
      color: "bg-[#002244]",
      logo: "NFL",
    },
    {
      name: "Yahoo Fantasy",
      url: "https://football.fantasysports.yahoo.com/",
      description:
        "User-friendly interface with great mobile app and innovative features for fantasy football.",
      color: "bg-[#96abdc]",
      logo: "YAHOO",
    },
    {
      name: "Sleeper",
      url: "https://sleeper.com/",
      description:
        "Modern fantasy platform with social features, custom scoring, and dynasty league support.",
      color: "bg-[#004953]",
      logo: "SLEEPER",
    },
    {
      name: "CBS Sports Fantasy",
      url: "https://www.cbssports.com/fantasy/football/",
      description:
        "Comprehensive fantasy platform with expert advice, rankings, and detailed player analysis.",
      color: "bg-[#8d594d]",
      logo: "CBS",
    },
    {
      name: "DraftSharks",
      url: "https://www.draftsharks.com/",
      description:
        "Advanced fantasy tools with draft kits, rankings, and expert analysis for serious players.",
      color: "bg-[#708090]",
      logo: "SHARKS",
    },
  ];

  return (
    <section id="fantasy" className="py-20 bg-[#faf9f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* External Fantasy Sites Section */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-[#002244] mb-4">
            Check Out Other Fantasy Football Sites
          </h3>
          <p className="text-lg text-[#708090] max-w-2xl mx-auto">
            Explore these popular fantasy platforms for additional leagues and
            features
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {fantasyLinks.map((link, index) => (
            <div
              key={link.name}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden group"
            >
              {/* Header with Platform Name */}
              <div
                className={`${link.color} h-20 flex items-center justify-center`}
              >
                <div className="text-center">
                  <div className="text-white font-bold text-lg mb-1">
                    {link.name}
                  </div>
                  <div className="text-white text-xs opacity-75 font-semibold tracking-wider">
                    {link.logo}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-[#708090] mb-6 leading-relaxed">
                  {link.description}
                </p>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[#ed5925] to-[#96abdc] text-white px-6 py-3 rounded-lg font-semibold hover:from-[#d14a1f] hover:to-[#7a95d1] transition-all duration-200 group-hover:scale-105 transform"
                  aria-label={`Open ${link.name} in new tab`}
                >
                  Play Now
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FantasyLinksGrid;
