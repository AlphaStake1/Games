"use client";

import React from "react";

interface FinalVideoPlayerProps {
  videoId: string;
  title: string;
}

const FinalVideoPlayer: React.FC<FinalVideoPlayerProps> = ({
  videoId,
  title,
}) => {
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  // Use youtu.be short link to prevent YouTube from rewriting the URL to /embed/
  const videoUrl = `https://youtu.be/${videoId}`;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => {
        // Navigate in the same tab to preserve full cookie context,
        // avoiding restricted-mode fallback that can trigger the overlay.
        window.location.href = videoUrl;
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          window.open(videoUrl, "_blank", "noopener");
        }
      }}
      className="relative block aspect-video rounded-lg overflow-hidden group bg-slate-800 cursor-pointer"
    >
      <img
        src={thumbnailUrl}
        alt={title}
        className="object-cover w-full h-full transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:opacity-90"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 group-hover:bg-white/30 transition-colors duration-300 scale-90 group-hover:scale-100">
          <svg
            role="img"
            aria-label="Play video"
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-white drop-shadow-lg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-white font-bold text-lg truncate drop-shadow-md">
          {title}
        </h3>
      </div>
    </div>
  );
};

export default FinalVideoPlayer;
