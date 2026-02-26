import { motion } from "framer-motion";
import { useState } from "react";
import { useTranslationStore } from "../store/translationStore";
import BackButton from "./BackButton";
import Breadcrumb from "./Breadcrumb";
import SignLanguageDetector from "./SignLanguageDetector";
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

  const [mode, setMode] = useState("text-to-sign"); // 'text-to-sign' or 'sign-to-text'
  const [localInputText, setLocalInputText] = useState("");

  const handleTextSubmit = async (text) => {
    setInputText(text);
    const result = await translateText(text);
    if (!result.success) {
      alert(result.error || "Translation failed. Please try again.");
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
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {mode === "text-to-sign" ? "Text to Sign Language" : "Sign Language to Text"}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {mode === "text-to-sign"
              ? "Convert your speech or text into sign language animations. Use the text input below or click the microphone for voice input."
              : "Use your camera to detect sign language letters in real-time. Our AI will identify the signs and speak them back to you."
            }
          </p>
        </motion.div>

        {/* Mode Selector Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-gray-200 dark:bg-gray-800 p-1 rounded-2xl shadow-inner">
            <button
              onClick={() => setMode("text-to-sign")}
              className={`px-8 py-3 rounded-xl font-bold transition-all duration-300 ${mode === "text-to-sign"
                  ? "bg-blue-600 dark:bg-blue-500 text-white shadow-lg scale-105"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
            >
              Text to Sign
            </button>
            <button
              onClick={() => setMode("sign-to-text")}
              className={`px-8 py-3 rounded-xl font-bold transition-all duration-300 ${mode === "sign-to-text"
                  ? "bg-blue-600 dark:bg-blue-500 text-white shadow-lg scale-105"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
            >
              Sign to Text
            </button>
          </div>
        </div>

        {mode === "text-to-sign" ? (
          <motion.div
            key="text-to-sign"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start"
          >
            {/* Input Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-6"
            >
              <div className="card p-6 border-2 border-blue-100 dark:border-blue-900/30">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4 text-center">
                  Enter Text or Use Voice
                </h2>

                {translatedWords.length > 0 && (
                  <div className="flex justify-end mb-3">
                    <button
                      type="button"
                      onClick={clearTranslation}
                      className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium shadow-md"
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
                  className="card p-4 border-l-4 border-blue-500"
                >
                  <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-2 uppercase tracking-wide">
                    Current Input:
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 italic text-lg">
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
              className="sticky top-24"
            >
              <VideoPlayer
                words={translatedWords.filter((w) => /[a-z0-9]/i.test(w))}
                currentIndex={currentVideoIndex}
                onVideoEnd={handleVideoEnd}
                onIndexChange={handleVideoIndexChange}
                autoPlay={true}
              />
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="sign-to-text"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <SignLanguageDetector />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TranslatorUI;
