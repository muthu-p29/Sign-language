import { motion } from "framer-motion";
import { Loader2, Send } from "lucide-react";
import { useState } from "react";
import { cn } from "../utils";

const TextInput = ({
  onSubmit = () => {},
  placeholder = "Enter text to translate to sign language...",
  isLoading = false,
  value = "",
  onChange = () => {},
}) => {
  const [localValue, setLocalValue] = useState(value);

  const handleSubmit = (e) => {
    e.preventDefault();
    const textToSubmit = value || localValue;
    if (textToSubmit.trim()) {
      onSubmit(textToSubmit.trim());
    }
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange(newValue);
  };

  const inputValue = value !== undefined ? value : localValue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={inputValue}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={isLoading}
            rows={4}
            className={cn(
              "w-full px-4 py-3 pr-12 border border-gray-200 dark:border-gray-700 rounded-lg",
              "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400",
              "resize-none transition-all duration-200",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              isLoading && "bg-gray-50 dark:bg-gray-900"
            )}
          />

          {/* Character count */}
          <div className="absolute bottom-2 right-2 text-xs text-gray-500 dark:text-gray-400">
            {inputValue.length}/500
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Type your message or use the voice input button
          </p>

          <motion.button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "flex items-center space-x-2 px-6 py-2 rounded-lg",
              "bg-blue-600 text-white",
              "hover:bg-blue-700 transition-colors duration-200",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
              "font-medium"
            )}
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Translating...</span>
              </>
            ) : (
              <>
                <Send size={16} />
                <span>Translate</span>
              </>
            )}
          </motion.button>
        </div>
      </form>

      {/* Help text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg"
      >
        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
          Tips:
        </h4>
        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <li>• Use simple, clear sentences for better translation</li>
          <li>
            • The system will break down complex words into letters if needed
          </li>
          <li>• Voice input is also available for hands-free operation</li>
        </ul>
      </motion.div>
    </motion.div>
  );
};

export default TextInput;
