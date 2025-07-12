const VideoSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="aspect-w-16 aspect-h-9">
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/lGv6YRlZUv4?si=T4jltJLO-Z5KgrKw&amp;clip=Ugkxj8cFVerEPTbvWsrAAqwgjZtD1UsYdZ2o&amp;clipt=EAAY6Wg"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="rounded-xl shadow-lg w-full h-full"
          />
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
