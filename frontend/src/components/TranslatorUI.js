import React, { useState } from "react";
import { motion } from "framer-motion";
import TextInput from "./TextInput";
import VoiceInputButton from "./VoiceInputButton";
import VideoPlayer from "./VideoPlayer";
import BackButton from "./BackButton";
import Breadcrumb from "./Breadcrumb";
import { useTranslationStore } from "../store/translationStore";

const TranslatorUI = () => {
  const {
    inputText,
    translatedWords,
    currentVideoIndex,
    isLoading,
    setInputText,
    translateText,
    setCurrentVideoIndex,
  } = useTranslationStore();

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
      </div>
    </div>
  );
};

export default TranslatorUI;
