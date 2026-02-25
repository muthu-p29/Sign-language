import { useEffect, useRef, useState } from "react";
import { formatVideoUrl } from "../utils";

const VideoPlayer = ({
  words = [],
  currentIndex = 0,
  onVideoEnd = () => {},
  onIndexChange = () => {},
  autoPlay = true,
}) => {
  const videoRef = useRef(null);
  const preloadRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const ensurePlayback = async () => {
    if (!videoRef.current) return;
    try {
      await videoRef.current.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    if (words.length > 0 && videoRef.current) {
      const videoUrl = formatVideoUrl(words[currentIndex]);
      videoRef.current.src = videoUrl;
      videoRef.current.load();

      if (autoPlay) {
        const playPromise = videoRef.current.play();
        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(() => {
            setIsPlaying(false);
          });
        }
        setIsPlaying(true);
      }
    }
  }, [words, currentIndex, autoPlay]);

  useEffect(() => {
    if (!preloadRef.current) return;
    if (!words.length) return;

    const nextIndex = currentIndex + 1;
    if (nextIndex >= words.length) {
      preloadRef.current.removeAttribute("src");
      return;
    }

    preloadRef.current.src = formatVideoUrl(words[nextIndex]);
    preloadRef.current.load();
  }, [words, currentIndex]);

  const handleVideoEnd = () => {
    setIsPlaying(false);
    if (currentIndex < words.length - 1) {
      // Auto-advance to next video
      setTimeout(() => onIndexChange(currentIndex + 1), 60);
    } else {
      onVideoEnd();
    }
  };

  if (words.length === 0) {
    return (
      <div className="card p-8">
        <div className="text-center text-gray-600 dark:text-gray-400">
          <p>No words to display</p>
          <p className="text-sm mt-2">
            Enter text or use voice input to see sign language translation
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6 space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Sign Language Animation
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Currently showing:{" "}
          <span className="text-blue-600 dark:text-blue-400 font-medium">
            {words[currentIndex]}
          </span>
        </p>
      </div>

      {/* Video Container */}
      <div className="relative bg-black rounded-lg overflow-hidden aspect-video ring-1 ring-white/10">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          onEnded={handleVideoEnd}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          autoPlay={autoPlay}
          muted
          playsInline
          preload="auto"
          controls={false}
          onClick={ensurePlayback}
        />

        <video ref={preloadRef} className="hidden" preload="auto" />

        <div className="absolute top-3 left-3 flex items-center gap-2">
          <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-black/60 backdrop-blur text-white text-xs font-semibold tracking-wide">
            <span className="inline-block w-2 h-2 rounded-full bg-red-500" />
            LIVE
          </div>
          {!isPlaying && (
            <div className="px-2 py-1 rounded-md bg-black/60 backdrop-blur text-white text-xs">
              Tap to start
            </div>
          )}
        </div>

        {/* Loading Overlay */}
        {!videoRef.current?.src && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-white">Loading video...</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
