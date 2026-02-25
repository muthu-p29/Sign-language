import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useTranslationStore } from "../store/translationStore";
import BackButton from "./BackButton";
import Breadcrumb from "./Breadcrumb";
import TextInput from "./TextInput";
import VideoPlayer from "./VideoPlayer";
import VoiceInputButton from "./VoiceInputButton";

const TranslatorUI = () => {
  const {
    inputText,
    translatedWords,
    currentVideoIndex,
    isLoading,
    setInputText,
    translateText,
    setCurrentVideoIndex,
    clearTranslation,
  } = useTranslationStore();

  const [localInputText, setLocalInputText] = useState("");
  const [signToTextRunning, setSignToTextRunning] = useState(false);
  const [signToTextResult, setSignToTextResult] = useState(null);
  const [signToTextError, setSignToTextError] = useState(null);
  const pollTimerRef = useRef(null);
  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);

  const handleTextSubmit = async (text) => {
    setInputText(text);
    const result = await translateText(text);
    if (!result.success) {
      alert(result.error || "Translation failed. Please try again.");
    }
  };

  const startCameraPreview = async () => {
    setSignToTextError(null);
    try {
      if (mediaStreamRef.current) return;
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (e) {
      setSignToTextError(e?.message || "Camera permission denied or not available");
    }
  };

  const stopCameraPreview = () => {
    if (mediaStreamRef.current) {
      try {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      } catch {}
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      try {
        videoRef.current.srcObject = null;
      } catch {}
    }
  };

  const handleVoiceInput = (transcript) => {
    setLocalInputText(transcript);
    setInputText(transcript);
    // Auto-submit voice input
    handleTextSubmit(transcript);
  };

  const handleVideoIndexChange = (index) => {
    setCurrentVideoIndex(index);
  };

  const handleVideoEnd = () => {
    // Reset to first video when sequence ends
    setCurrentVideoIndex(0);
  };

  const parseJsonOrTextError = async (resp) => {
    const contentType = resp.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return await resp.json();
    }
    const text = await resp.text();
    throw new Error(
      `Expected JSON from Sign API but got: ${text.slice(0, 120)}`
    );
  };

  const fetchSignToTextStatus = async () => {
    try {
      const resp = await fetch("/signapi/status", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await parseJsonOrTextError(resp);
      if (!resp.ok || !data.success) {
        setSignToTextError(data?.error || "Failed to fetch status");
        return;
      }
      setSignToTextRunning(Boolean(data.running));
      if (data.error) setSignToTextError(data.error);
      if (data.predicted) {
        setSignToTextResult({
          predicted: data.predicted,
          confidence: data.confidence,
          updatedAt: data.updated_at,
        });
      }
    } catch (e) {
      setSignToTextError(
        e.message ||
          "Failed to fetch status (is sign_api_server.py running on :5005 and did you restart Vite?)"
      );
    }
  };

  const startSignToText = async () => {
    setSignToTextError(null);
    setSignToTextResult(null);
    try {
      await startCameraPreview();

      const resp = await fetch("/signapi/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      const data = await parseJsonOrTextError(resp);
      if (!resp.ok || !data.success) {
        setSignToTextError(data?.error || "Failed to start");
        return;
      }
      setSignToTextRunning(true);
      await fetchSignToTextStatus();
    } catch (e) {
      setSignToTextError(
        e.message ||
          "Failed to start (is sign_api_server.py running on :5005 and did you restart Vite?)"
      );
    }
  };

  const stopSignToText = async () => {
    setSignToTextError(null);
    try {
      const resp = await fetch("/signapi/stop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      const data = await parseJsonOrTextError(resp);
      if (!resp.ok || !data.success) {
        setSignToTextError(data?.error || "Failed to stop");
        return;
      }
      setSignToTextRunning(false);
      stopCameraPreview();
    } catch (e) {
      setSignToTextError(
        e.message ||
          "Failed to stop (is sign_api_server.py running on :5005 and did you restart Vite?)"
      );
    }
  };

  useEffect(() => {
    return () => {
      stopCameraPreview();
    };
  }, []);

  useEffect(() => {
    fetchSignToTextStatus();
  }, []);

  useEffect(() => {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }

    if (signToTextRunning) {
      pollTimerRef.current = setInterval(() => {
        fetchSignToTextStatus();
      }, 750);
    }

    return () => {
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
        pollTimerRef.current = null;
      }
    };
  }, [signToTextRunning]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-6">
          <BackButton text="Back to Home" showHomeOption={false} />
          <Breadcrumb />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Speech to Sign Language
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Convert your speech or text into sign language animations. Use the
            text input below or click the microphone for voice input.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="card p-4 mb-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
            <div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Sign to Text
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Click start, then show a hand sign in front of your camera.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {!signToTextRunning ? (
                    <button
                      type="button"
                      onClick={startSignToText}
                      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                    >
                      Start
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={stopSignToText}
                      className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium"
                    >
                      Stop
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={fetchSignToTextStatus}
                    className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 font-medium"
                  >
                    Refresh
                  </button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Status</div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {signToTextRunning ? "Running" : "Stopped"}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Last Result</div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {signToTextResult?.predicted || "-"}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Confidence</div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {typeof signToTextResult?.confidence === "number"
                      ? `${signToTextResult.confidence.toFixed(2)}%`
                      : "-"}
                  </div>
                </div>
              </div>

              {signToTextError && (
                <div className="mt-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm">
                  {signToTextError}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Camera Preview
                </div>

                {!mediaStreamRef.current ? (
                  <button
                    type="button"
                    onClick={startCameraPreview}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
                  >
                    Start Camera
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopCameraPreview}
                    className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium"
                  >
                    Stop Camera
                  </button>
                )}
              </div>
              <div className="w-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-72 lg:h-64 object-cover"
                />
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            <div className="card p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4 text-center">
                Enter Text or Use Voice
              </h2>

              {translatedWords.length > 0 && (
                <div className="flex justify-end mb-3">
                  <button
                    type="button"
                    onClick={clearTranslation}
                    className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium"
                  >
                    Stop Translation
                  </button>
                </div>
              )}

              <div className="space-y-6">
                {/* Text Input */}
                <TextInput
                  value={localInputText}
                  onChange={setLocalInputText}
                  onSubmit={handleTextSubmit}
                  isLoading={isLoading}
                  placeholder="Type your message here to convert to sign language..."
                />

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200 dark:border-gray-700" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                      OR
                    </span>
                  </div>
                </div>

                {/* Voice Input */}
                <VoiceInputButton
                  onTranscript={handleVoiceInput}
                  isDisabled={isLoading}
                />
              </div>
            </div>

            {/* Current Input Display */}
            {(inputText || localInputText) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-4"
              >
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Current Input:
                </h3>
                <p className="text-gray-600 dark:text-gray-400 italic">
                  "{inputText || localInputText}"
                </p>
              </motion.div>
            )}

            {/* Translation Status */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="card p-4 text-center"
              >
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 dark:border-blue-400"></div>
                  <span className="text-gray-600 dark:text-gray-400">
                    Processing your input...
                  </span>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Video Player Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <VideoPlayer
              words={translatedWords.filter((w) => /[a-z0-9]/i.test(w))}
              currentIndex={currentVideoIndex}
              onVideoEnd={handleVideoEnd}
              onIndexChange={handleVideoIndexChange}
              autoPlay={true}
            />
          </motion.div>
        </div>

        {/* Instructions */}
        {/*
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12"
        >
          <div className="card p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 text-center">
              How to Use
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-white font-bold">1</span>
                </div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                  Input Your Message
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Type your message in the text area or use the microphone for
                  voice input
                </p>
              </div>

              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-white font-bold">2</span>
                </div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                  AI Processing
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Our AI processes your text and converts it into sign language
                  sequence
                </p>
              </div>

              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-white font-bold">3</span>
                </div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                  Watch & Learn
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  View the sign language animation and control playback as
                  needed
                </p>
              </div>
            </div>
          </div>
        </motion.div>
        */}
      </div>
    </div>
  );
};

export default TranslatorUI;
