import { motion } from "framer-motion";
import { Loader2, Mic, MicOff } from "lucide-react";
import React, { useRef, useState } from "react";
import { cn } from "../utils";

const VoiceInputButton = ({
  onTranscript = () => {},
  isDisabled = false,
  className = "",
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef(null);

  React.useEffect(() => {
    // Check if Web Speech API is supported
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      setIsSupported(false);
    }
  }, []);

  const startListening = () => {
    if (!isSupported) {
      alert(
        "Speech recognition is not supported in your browser. Please use Chrome or Edge."
      );
      return;
    }

    try {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onTranscript(transcript);
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);

        let errorMessage = "Speech recognition failed. ";
        switch (event.error) {
          case "no-speech":
            errorMessage += "No speech detected. Please try again.";
            break;
          case "audio-capture":
            errorMessage += "Microphone access denied or not available.";
            break;
          case "not-allowed":
            errorMessage += "Microphone permission denied.";
            break;
          case "network":
            errorMessage += "Network error occurred.";
            break;
          default:
            errorMessage += "Please try again.";
        }
        alert(errorMessage);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (error) {
      console.error("Error starting speech recognition:", error);
      setIsListening(false);
      alert("Failed to start speech recognition. Please try again.");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const handleClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (!isSupported) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg"
      >
        <MicOff
          className="mx-auto mb-2 text-gray-500 dark:text-gray-400"
          size={24}
        />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Voice input not supported in this browser
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          Please use Chrome or Edge for voice input
        </p>
      </motion.div>
    );
  }

  return (
    <div className="text-center space-y-3">
      <motion.button
        onClick={handleClick}
        disabled={isDisabled}
        whileHover={{ scale: isDisabled ? 1 : 1.05 }}
        whileTap={{ scale: isDisabled ? 1 : 0.95 }}
        className={cn(
          "relative p-4 rounded-full transition-all duration-200",
          "focus:outline-none focus:ring-4 focus:ring-blue-500/20 dark:focus:ring-blue-400/20",
          isListening
            ? "bg-red-500 hover:bg-red-600 text-white shadow-lg"
            : "bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700",
          isDisabled && "opacity-50 cursor-not-allowed",
          className
        )}
      >
        {/* Pulsing effect when listening */}
        {isListening && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="absolute inset-0 rounded-full bg-red-400 opacity-30"
          />
        )}

        {isListening ? (
          <motion.div animate={{ rotate: 180 }} transition={{ duration: 0.3 }}>
            <Loader2 size={24} className="animate-spin" />
          </motion.div>
        ) : (
          <Mic size={24} />
        )}
      </motion.button>

      <div className="space-y-1">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {isListening ? "Listening..." : "Voice Input"}
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          {isListening
            ? "Speak now or click to stop"
            : "Click the microphone to start speaking"}
        </p>
      </div>

      {/* Visual feedback */}
      {isListening && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center space-x-1"
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ scaleY: [0.5, 1, 0.5] }}
              transition={{
                repeat: Infinity,
                duration: 1,
                delay: i * 0.2,
              }}
              className="w-1 h-6 bg-red-500 rounded-full"
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default VoiceInputButton;
