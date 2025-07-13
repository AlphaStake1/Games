const VideoSection = () => {
  return (
    <section className="py-20 bg-white dark:bg-black transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white transition-colors duration-300">
            <a
              href="https://www.youtube.com/@Blondentertainmentmk"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Fantasy Football Show
            </a>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 transition-colors duration-300">
            Watch expert fantasy football analysis and insights
          </p>
        </div>
        <div className="relative w-full group" style={{ paddingBottom: '56.25%' }}>
          <iframe
            className="absolute top-0 left-0 w-full h-full rounded-xl shadow-2xl border-4 border-gray-200 dark:border-gray-700 transition-all duration-300 group-hover:shadow-3xl group-hover:scale-[1.02]"
            src="https://www.youtube.com/embed/lGv6YRlZUv4?si=T4jltJLO-Z5KgrKw&amp;clip=Ugkxj8cFVerEPTbvWsrAAqwgjZtD1UsYdZ2o&amp;clipt=EAAY6Wg&amp;autoplay=1&amp;mute=1&amp;loop=1&amp;playlist=lGv6YRlZUv4"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Video plays automatically when in view • Click to unmute and control
          </p>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
