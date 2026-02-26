import { useEffect, useRef, useState } from "react";
import { formatVideoUrl } from "../utils";

const VideoPlayer = ({
  words = [],
  currentIndex = 0,
  onVideoEnd = () => { },
  onIndexChange = () => { },
  autoPlay = true,
}) => {
  const videoRefs = [useRef(null), useRef(null)];
  const activePlayerRef = useRef(0);
  const loadedIndexRef = useRef([null, null]);
  const [activePlayer, setActivePlayer] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (words.length === 0) return;

    const active = activePlayerRef.current;
    const inactive = active === 0 ? 1 : 0;

    const activeEl = videoRefs[active].current;
    const inactiveEl = videoRefs[inactive].current;

    if (activeEl) {
      const activeUrl = formatVideoUrl(words[currentIndex]);
      const alreadyLoaded = loadedIndexRef.current[active] === currentIndex;
      if (!alreadyLoaded || activeEl.src !== activeUrl) {
        activeEl.src = activeUrl;
        loadedIndexRef.current[active] = currentIndex;
        activeEl.load();
      }

      activeEl.muted = isMuted;
      activeEl.defaultPlaybackRate = 0.75;
      activeEl.playbackRate = 0.75;

      if (autoPlay) {
        const playPromise = activeEl.play();
        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(() => { });
        }
        setIsPlaying(true);
      }
    }

    const nextIndex = currentIndex < words.length - 1 ? currentIndex + 1 : null;
    if (inactiveEl) {
      if (nextIndex === null) {
        inactiveEl.removeAttribute("src");
        loadedIndexRef.current[inactive] = null;
      } else {
        const nextUrl = formatVideoUrl(words[nextIndex]);
        const alreadyLoadedNext = loadedIndexRef.current[inactive] === nextIndex;
        if (!alreadyLoadedNext || inactiveEl.src !== nextUrl) {
          inactiveEl.src = nextUrl;
          loadedIndexRef.current[inactive] = nextIndex;
          inactiveEl.load();
        }
        inactiveEl.muted = isMuted;
        inactiveEl.defaultPlaybackRate = 0.75;
        inactiveEl.playbackRate = 0.75;
      }
    }
  }, [words, currentIndex, autoPlay, isMuted]);

  const handlePlay = () => {
    const activeEl = videoRefs[activePlayerRef.current].current;
    if (activeEl) {
      activeEl.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    const activeEl = videoRefs[activePlayerRef.current].current;
    if (activeEl) {
      activeEl.pause();
      setIsPlaying(false);
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      onIndexChange(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      onIndexChange(currentIndex + 1);
    } else {
      // Reset to beginning
      onIndexChange(0);
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    if (currentIndex < words.length - 1) {
      // Instant swap to preloaded next video (double-buffer) to avoid blank glitch
      const nextIndex = currentIndex + 1;
      const active = activePlayerRef.current;
      const inactive = active === 0 ? 1 : 0;

      const activeEl = videoRefs[active].current;
      const inactiveEl = videoRefs[inactive].current;
      if (activeEl) {
        activeEl.pause();
      }

      if (inactiveEl && loadedIndexRef.current[inactive] === nextIndex) {
        try {
          inactiveEl.currentTime = 0;
        } catch { }
        activePlayerRef.current = inactive;
        setActivePlayer(inactive);
        inactiveEl.playbackRate = 0.75;

        const playPromise = inactiveEl.play();
        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(() => { });
        }
        setIsPlaying(true);
      } else if (inactiveEl) {
        const nextUrl = formatVideoUrl(words[nextIndex]);
        inactiveEl.src = nextUrl;
        loadedIndexRef.current[inactive] = nextIndex;
        inactiveEl.load();

        activePlayerRef.current = inactive;
        setActivePlayer(inactive);

        const tryPlay = () => {
          try {
            inactiveEl.currentTime = 0;
          } catch { }
          inactiveEl.playbackRate = 0.75;
          const playPromise = inactiveEl.play();
          if (playPromise && typeof playPromise.catch === "function") {
            playPromise.catch(() => { });
          }
          setIsPlaying(true);
        };

        inactiveEl.oncanplay = () => {
          inactiveEl.oncanplay = null;
          tryPlay();
        };
      }

      onIndexChange(nextIndex);
    } else {
      onVideoEnd();
    }
  };

  const handleTimeUpdate = () => {
    const activeEl = videoRefs[activePlayerRef.current].current;
    if (activeEl) {
      setCurrentTime(activeEl.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    const activeEl = videoRefs[activePlayerRef.current].current;
    if (activeEl) {
      setDuration(activeEl.duration);
    }
  };

  const handleSeek = (e) => {
    const activeEl = videoRefs[activePlayerRef.current].current;
    if (activeEl && duration) {
      const rect = e.target.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      const newTime = pos * duration;
      activeEl.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    const activeEl = videoRefs[activePlayerRef.current].current;
    const inactiveEl = videoRefs[activePlayerRef.current === 0 ? 1 : 0].current;
    if (activeEl) activeEl.muted = nextMuted;
    if (inactiveEl) inactiveEl.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
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
      <div className="relative bg-black rounded-lg overflow-hidden aspect-video">

        <div className="absolute inset-0">
          <video
            ref={videoRefs[0]}
            className={`absolute inset-0 w-full h-full object-cover ${activePlayer === 0 ? "opacity-100" : "opacity-0"
              }`}
            onTimeUpdate={activePlayer === 0 ? handleTimeUpdate : undefined}
            onLoadedMetadata={activePlayer === 0 ? handleLoadedMetadata : undefined}
            onEnded={activePlayer === 0 ? handleVideoEnd : undefined}
            onPlay={activePlayer === 0 ? () => setIsPlaying(true) : undefined}
            onPause={activePlayer === 0 ? () => setIsPlaying(false) : undefined}
            preload="auto"
            playsInline
          />
          <video
            ref={videoRefs[1]}
            className={`absolute inset-0 w-full h-full object-cover ${activePlayer === 1 ? "opacity-100" : "opacity-0"
              }`}
            onTimeUpdate={activePlayer === 1 ? handleTimeUpdate : undefined}
            onLoadedMetadata={activePlayer === 1 ? handleLoadedMetadata : undefined}
            onEnded={activePlayer === 1 ? handleVideoEnd : undefined}
            onPlay={activePlayer === 1 ? () => setIsPlaying(true) : undefined}
            onPause={activePlayer === 1 ? () => setIsPlaying(false) : undefined}
            preload="auto"
            playsInline
          />
        </div>

        {/* Loading Overlay */}
        {!videoRefs[activePlayer]?.current?.src && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-white">Loading video...</div>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {/*
      <div className="space-y-2">
        <div
          className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full cursor-pointer"
          onClick={handleSeek}
        >
          <div
            className="bg-blue-600 dark:bg-blue-400 h-full rounded-full transition-all duration-100"
            style={{
              width: `${duration ? (currentTime / duration) * 100 : 0}%`,
            }}
          />
        </div>

        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      */}

      {/* Controls */}
      {/*
      <div className="flex items-center justify-center space-x-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-700 dark:text-gray-300"
        >
          <SkipBack size={20} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePlayPause}
          className="p-3 rounded-full bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white transition-colors"
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNext}
          disabled={currentIndex === words.length - 1}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-700 dark:text-gray-300"
        >
          <SkipForward size={20} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleMute}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </motion.button>
      </div>
      */}

      {/* Word List */}
      {/*
      {words.length > 1 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Translation Sequence:
          </h4>
          <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
            {words.map((word, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onIndexChange(index)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  index === currentIndex
                    ? "bg-blue-600 dark:bg-blue-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
                }`}
              >
                {word}
              </motion.button>
            ))}
          </div>
        </div>
      )}
      */}
    </div>
  );
};

export default VideoPlayer;
