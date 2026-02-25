import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Home } from "lucide-react";

const BackButton = ({
  to = null,
  text = "Back",
  className = "",
  showHomeOption = true,
  variant = "default", // "default", "minimal", "floating"
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const handleBack = () => {
    if (to) {
      navigate(to);
    } else {
      // Smart back navigation
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate("/");
      }
    }
  };

  const handleHome = () => {
    navigate("/");
  };

  // Don't show back button on home page unless explicitly specified
  if (isHomePage && !to) {
    return null;
  }

  const baseClasses = "flex items-center space-x-2 transition-all duration-300";

  const variants = {
    default:
      "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20",
    minimal:
      "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400",
    floating:
      "bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-4 py-3 rounded-full border border-gray-200 dark:border-gray-700",
  };

  return (
    <div className="flex items-center space-x-2">
      <motion.button
        onClick={handleBack}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`${baseClasses} ${variants[variant]} ${className}`}
      >
        <ArrowLeft size={16} />
        <span className="text-sm font-medium">{text}</span>
      </motion.button>

      {showHomeOption && !isHomePage && (
        <motion.button
          onClick={handleHome}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`${baseClasses} ${variants[variant]} ${className}`}
          title="Go to Home"
        >
          <Home size={16} />
          <span className="text-sm font-medium">Home</span>
        </motion.button>
      )}
    </div>
  );
};

export default BackButton;
