"use client";

// Function to sanitize HTML content
const sanitizeHTML = (html: string) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || "";
};

import { Clock, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import RssParser from "rss-parser";

interface RSSItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  guid: string;
}

const SidebarAds = ({ refreshTrigger }: { refreshTrigger: number }) => {
  const [rssItems, setRssItems] = useState<RSSItem[]>([]);
  const [razzballRssItems, setRazzballRssItems] = useState<RSSItem[]>([]);
  const [fftodayRssItems, setFftodayRssItems] = useState<RSSItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pffError, setPffError] = useState<string | null>(null);
  const [razzballError, setRazzballError] = useState<string | null>(null);
  const [fftodayError, setFftodayError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRSSFeed = async (
      rssUrl: string,
      feedName: string,
      setErrorState: (error: string | null) => void,
    ): Promise<RSSItem[]> => {
      try {
        console.log(`Attempting to fetch ${feedName} RSS feed from: ${rssUrl}`);

        // Use RSS2JSON service which is more reliable for RSS parsing
        const rss2jsonUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

        console.log(`Fetching from RSS2JSON: ${rss2jsonUrl}`);
        const response = await fetch(rss2jsonUrl);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(`RSS2JSON response for ${feedName}:`, data);

        if (data.status !== "ok") {
          throw new Error(`RSS2JSON error: ${data.message || "Unknown error"}`);
        }

        if (!data.items || data.items.length === 0) {
          throw new Error("No items found in RSS feed");
        }

        const parsedItems: RSSItem[] = data.items
          .slice(0, 5)
          .map((item: any, index: number) => ({
            title: item.title || "",
            description: item.description || item.content || "",
            link: item.link || "",
            pubDate: item.pubDate || "",
            guid: item.guid || item.link || `item-${index}`,
          }));

        console.log(
          `Successfully parsed ${parsedItems.length} items from ${feedName}`,
        );
        return parsedItems;
      } catch (error) {
        console.error(`Error fetching ${feedName} RSS feed:`, error);
        setErrorState(
          `${feedName}: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
        return [];
      }
    };

    const fetchAllFeeds = async () => {
      setLoading(true);
      setPffError(null);
      setRazzballError(null);
      setFftodayError(null);

      console.log("Starting to fetch all RSS feeds...");

      const [pffFeed, razzballFeed, fftodayFeed] = await Promise.all([
        fetchRSSFeed("https://www.pff.com/feed", "PFF", setPffError),
        fetchRSSFeed(
          "https://football.razzball.com/feed",
          "Razzball",
          setRazzballError,
        ),
        fetchRSSFeed(
          "https://www.fftoday.com/rss/news.xml",
          "FFToday",
          setFftodayError,
        ),
      ]);

      console.log(
        "All feeds fetched. PFF items:",
        pffFeed.length,
        "Razzball items:",
        razzballFeed.length,
        "FFToday items:",
        fftodayFeed.length,
      );

      setRssItems(pffFeed);
      setRazzballRssItems(razzballFeed);
      setFftodayRssItems(fftodayFeed);
      setLoading(false);
    };

    fetchAllFeeds();
    const intervalId = setInterval(fetchAllFeeds, 24 * 60 * 60 * 1000); // Refresh every 24 hours

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [refreshTrigger]);

  const formatTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60 * 60),
      );

      if (diffInHours < 1) return "Just now";
      if (diffInHours < 24) return `${diffInHours} hours ago`;

      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays === 1) return "1 day ago";
      if (diffInDays < 7) return `${diffInDays} days ago`;

      return date.toLocaleDateString();
    } catch {
      return "Recently";
    }
  };

  const adSlots = [
    {
      id: "ad-1",
      title: "Premium Ad Slot",
      size: "300x250",
      description: "Banner Advertisement",
    },
    {
      id: "ad-2",
      title: "Sponsored Content",
      size: "300x600",
      description: "Skyscraper Advertisement",
    },
  ];

  return (
    <aside className="w-80 bg-white border-l border-gray-200 min-h-screen sticky top-16 overflow-y-auto sidebar-ads lg:block hidden">
      <div className="p-6">
        {/* News Section */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-[#002244] mb-4 text-center flex items-center justify-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#ed5925]" />
            Latest News
          </h3>

          <div className="space-y-4">
            {rssItems.length > 0 ? (
              rssItems.slice(0, 2).map((item) => (
                <article
                  key={item.guid}
                  className="bg-[#faf9f5] rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer border border-gray-100"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs bg-[#004953] text-white px-2 py-1 rounded-full">
                      Fantasy
                    </span>
                    <div className="flex items-center gap-1 text-xs text-[#708090]">
                      <Clock className="w-3 h-3" />
                      {formatTimeAgo(item.pubDate)}
                    </div>
                  </div>

                  <h4 className="font-semibold text-[#002244] mb-2 text-sm leading-tight">
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#ed5925] transition-colors"
                    >
                      {item.title}
                    </a>
                  </h4>

                  <p className="text-xs text-[#708090] leading-relaxed">
                    {sanitizeHTML(item.description).length > 100
                      ? `${sanitizeHTML(item.description).substring(0, 100)}...`
                      : sanitizeHTML(item.description)}
                  </p>

                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#ed5925] hover:text-[#d14a1f] font-medium mt-2 hover:underline"
                  >
                    Read More →
                  </a>
                </article>
              ))
            ) : (
              <div className="text-center p-4">Loading news...</div>
            )}
          </div>
        </div>

        {/* Sponsored Content Section */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-bold text-[#002244] mb-6 text-center">
            Sponsored Content
          </h3>

          <div className="space-y-6">
            {adSlots.map((ad, index) => (
              <div
                key={ad.id}
                className="border-2 border-dashed border-[#708090] rounded-lg p-6 text-center bg-[#faf9f5] hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="text-[#708090] mb-3">
                  <div className="w-12 h-12 bg-[#ed5925] bg-opacity-20 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <span className="text-[#ed5925] font-bold text-lg">
                      {index + 1}
                    </span>
                  </div>
                  <h4 className="font-semibold text-[#002244] mb-2">
                    {ad.title}
                  </h4>
                  <p className="text-sm text-[#708090] mb-2">
                    {ad.description}
                  </p>
                  <span className="text-xs bg-[#004953] text-white px-2 py-1 rounded">
                    {ad.size}
                  </span>
                </div>

                <div className="mt-4 p-4 bg-white border border-gray-200 rounded">
                  <div className="text-xs text-[#708090] mb-2">
                    Advertisement Space
                  </div>
                  <div
                    className={`w-full bg-gradient-to-br from-[#ed5925] to-[#96abdc] opacity-20 rounded flex items-center justify-center ${
                      ad.size === "300x600" ? "h-48" : "h-24"
                    }`}
                  >
                    <span className="text-[#002244] font-semibold text-sm">
                      Your Ad Here
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Additional News Streams */}
          <div className="border-t border-gray-200 pt-6 space-y-6">
            <h3 className="text-lg font-bold text-[#002244] mb-6 text-center">
              More News Streams
            </h3>
            {[1, 2, 3].map((num) => (
              <div
                key={`news-stream-${num}`}
                className="border-2 border-dashed border-[#708090] rounded-lg p-6 text-center bg-[#faf9f5] hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="text-[#708090] mb-3">
                  <div className="w-12 h-12 bg-[#ed5925] bg-opacity-20 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <span className="text-[#ed5925] font-bold text-lg">
                      {num}
                    </span>
                  </div>
                  <h4 className="font-semibold text-[#002244] mb-2">
                    {num === 1 && "PFF News Feed"}
                    {num === 2 && "Razzball News Feed"}
                    {num === 3 && "FFToday News Feed"}
                    {num > 3 && `News Stream ${num}`}
                  </h4>
                  <p className="text-sm text-[#708090] mb-2">
                    {num <= 3
                      ? "Latest fantasy football news"
                      : "Live news feed placeholder"}
                  </p>
                </div>
                <div className="mt-4 p-4 bg-white border border-gray-200 rounded">
                  <div className="text-xs text-[#708090] mb-2">
                    {num === 1 && "PFF RSS Feed"}
                    {num === 2 && "Razzball RSS Feed"}
                    {num === 3 && "FFToday RSS Feed"}
                    {num > 3 && "News Stream Content"}
                  </div>
                  {num === 1 || num === 2 || num === 3 ? (
                    <div className="text-left space-y-3">
                      {loading ? (
                        <div className="flex items-center justify-center h-24">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#ed5925]"></div>
                          <span className="ml-2 text-sm text-[#708090]">
                            Loading news...
                          </span>
                        </div>
                      ) : (num === 1 && pffError) ||
                        (num === 2 && razzballError) ||
                        (num === 3 && fftodayError) ? (
                        <div className="text-center h-24 flex items-center justify-center">
                          <div className="text-red-500 text-sm">
                            <p>Failed to load news feed</p>
                            <p className="text-xs text-[#708090] mt-1">
                              {num === 1
                                ? pffError
                                : num === 2
                                  ? razzballError
                                  : fftodayError}
                            </p>
                          </div>
                        </div>
                      ) : (num === 1
                          ? rssItems
                          : num === 2
                            ? razzballRssItems
                            : fftodayRssItems
                        ).length > 0 ? (
                        (num === 1
                          ? rssItems
                          : num === 2
                            ? razzballRssItems
                            : fftodayRssItems
                        ).map((item) => (
                          <article
                            key={item.guid}
                            className="border-b border-gray-100 pb-2 mb-2 last:border-b-0"
                          >
                            <div className="flex items-start justify-between mb-1">
                              <span className="text-xs bg-[#004953] text-white px-2 py-1 rounded-full">
                                Fantasy
                              </span>
                              <div className="flex items-center gap-1 text-xs text-[#708090]">
                                <Clock className="w-3 h-3" />
                                {formatTimeAgo(item.pubDate)}
                              </div>
                            </div>
                            <h5 className="font-semibold text-[#002244] text-xs leading-tight mb-1">
                              <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-[#ed5925] transition-colors"
                              >
                                {item.title}
                              </a>
                            </h5>
                            <p className="text-xs text-[#708090] leading-relaxed">
                              {sanitizeHTML(item.description).length > 80
                                ? `${sanitizeHTML(item.description).substring(0, 80)}...`
                                : sanitizeHTML(item.description)}
                            </p>
                          </article>
                        ))
                      ) : (
                        <div className="text-center h-24 flex items-center justify-center">
                          <span className="text-[#708090] text-sm">
                            No news items found
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full bg-gradient-to-br from-[#ed5925] to-[#96abdc] opacity-20 rounded h-24 flex items-center justify-center">
                      <span className="text-[#002244] font-semibold text-sm">
                        Your News Here
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SidebarAds;
