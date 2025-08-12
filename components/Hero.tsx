'use client';

import { useRouter } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletConnection } from '@/contexts/WalletConnectionProvider';
import { Trophy, ArrowRight, Play } from 'lucide-react';
import { useMemo, useEffect, useState, useRef } from 'react';

const HERO_MEDIA_URL = process.env.NEXT_PUBLIC_HERO_MEDIA_URL;
const HERO_MEDIA_ALT = process.env.NEXT_PUBLIC_HERO_MEDIA_ALT;
const TENOR_POST_ID = process.env.NEXT_PUBLIC_TENOR_POSTID || '15397062';
const HERO_OBJECT_POSITION =
  (process.env.NEXT_PUBLIC_HERO_OBJECT_POSITION as string) || '50% 30%'; // focus headroom
const HERO_ROTATE_MS = parseInt(
  (process.env.NEXT_PUBLIC_HERO_ROTATE_MS as string) || '12000',
  10,
);

const Hero = () => {
  const router = useRouter();
  const { connected } = useWallet();
  const { showPopup } = useWalletConnection();

  const seasonStartsSoon = useMemo(() => true, []);
  const isVideo =
    typeof HERO_MEDIA_URL === 'string' &&
    /\.(mp4|webm|ogg)(\?.*)?$/i.test(HERO_MEDIA_URL);

  // Build media lists and rotate if multiple videos are provided
  const mediaList = useMemo(
    () => [HERO_MEDIA_URL, HERO_MEDIA_ALT].filter(Boolean) as string[],
    [HERO_MEDIA_URL, HERO_MEDIA_ALT],
  );
  const [activeIdx, setActiveIdx] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  useEffect(() => {
    if (mediaList.length < 2) return;
    const id = setInterval(() => {
      setActiveIdx((i) => (i + 1) % mediaList.length);
    }, HERO_ROTATE_MS);
    return () => clearInterval(id);
  }, [mediaList.length, HERO_ROTATE_MS]);

  useEffect(() => {
    const video = videoRefs.current[activeIdx];
    if (video) {
      video.play().catch((error) => {
        console.error('Video play failed:', error);
      });
    }
  }, [activeIdx]);

  const handleGetSeasonPass = () => {
    // Drive users straight into the Season Pass funnel
    router.push('/season-pass');
  };

  const handleSeeWeekly = () => {
    // Preserve existing wallet-gated weekly flow
    if (connected) {
      router.push('/boards?mode=weekly');
    } else {
      showPopup('play-game', { redirectPath: '/boards?mode=weekly' });
    }
  };

  return (
    <section className="relative overflow-hidden text-white min-h-[58vh] md:min-h-[64vh] lg:min-h-[72vh] xl:min-h-[80vh] flex items-center">
      {/* Local/Hosted Background Media with optional rotation */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {mediaList.length > 0 ? (
          <div key={activeIdx} className="absolute inset-0">
            {mediaList.map((src, i) => {
              const isVideo = /\.(mp4|webm|ogg)(\?.*)?$/i.test(src);
              return isVideo ? (
                <video
                  ref={(el) => (videoRefs.current[i] = el)}
                  key={i}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${activeIdx === i ? 'opacity-100' : 'opacity-0'}`}
                  src={src}
                  autoPlay
                  muted
                  loop
                  playsInline
                  style={{ objectPosition: HERO_OBJECT_POSITION as any }}
                />
              ) : (
                <img
                  key={i}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${activeIdx === i ? 'opacity-100' : 'opacity-0'}`}
                  src={src}
                  alt="Hero background"
                  style={{ objectPosition: HERO_OBJECT_POSITION as any }}
                />
              );
            })}
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0b1220] via-[#0b162c] to-[#0b1220]" />
        )}
        {/* Readability overlay */}
        <div className="absolute inset-0 bg-black/30" />
        {/* Vignette overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(ellipse at center, rgba(0,0,0,0) 50%, rgba(0,0,0,0.7) 100%)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid grid-cols-1 gap-12 items-center">
          {/* Copy */}
          <div className="text-center lg:text-left">
            {seasonStartsSoon && (
              <div className="mb-4 flex items-center justify-center lg:justify-start gap-2">
                <span className="inline-flex items-center rounded-full bg-yellow-400/20 text-yellow-300 px-3 py-1 text-xs font-semibold ring-1 ring-yellow-300/30">
                  Season starts soon
                </span>
                <span className="hidden sm:inline-flex items-center rounded-full bg-emerald-400/15 text-emerald-300 px-3 py-1 text-xs font-semibold ring-1 ring-emerald-300/30">
                  Limited passes available
                </span>
              </div>
            )}

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              Climb the{' '}
              <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-amber-300 bg-clip-text text-transparent">
                Leaderboards
              </span>
            </h1>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-3 justify-center lg:justify-start">
              <button
                onClick={handleGetSeasonPass}
                className="group inline-flex items-center gap-3 rounded-lg px-7 py-4 text-lg font-bold text-black bg-gradient-to-r from-yellow-400 to-orange-500 shadow-[0_8px_30px_rgb(255,200,0,0.25)] hover:from-yellow-300 hover:to-orange-400 transition-all focus:outline-none focus-visible:ring-2 ring-black/70"
                aria-label="Get Season Pass"
              >
                <Trophy className="w-6 h-6" />
                Get Season Pass
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
              </button>

              <button
                onClick={handleSeeWeekly}
                className="inline-flex items-center gap-2 rounded-lg px-6 py-4 text-lg font-semibold border border-white/20 text-white/90 bg-black/20 hover:bg-black/30 transition-all"
                aria-label="See Weekly Games"
              >
                <Play className="w-5 h-5" />
                See Weekly Games
              </button>
            </div>

            {/* Reduced copy */}
          </div>

          {/* Visual intentionally removed: GIF background covers entire hero */}
        </div>
      </div>

      {/* Component-scoped styles (intentionally minimal) */}
      <style jsx>{``}</style>
    </section>
  );
};

export default Hero;
