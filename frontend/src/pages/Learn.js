import { motion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import BackButton from "../components/BackButton";
import Breadcrumb from "../components/Breadcrumb";
import { useAuthStore } from "../store/authStore";
import { formatVideoUrl } from "../utils";

const Learn = () => {
  const [selectedCategory, setSelectedCategory] = useState("alphabet");
  const { isAuthenticated } = useAuthStore();
  const MotionLink = motion(Link);
  const [playingVideo, setPlayingVideo] = useState(null);

  const categories = {
    alphabet: {
      title: "Sign Language Alphabet",
      description: "Learn the basics of sign language with the alphabet",
      items: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
    },
    // numbers: {
    //   title: "Numbers",
    //   description: "Learn how to sign numbers from 0 to 9",
    //   items: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    // },
    // common: {
    //   title: "Common Words",
    //   description: "Essential words for everyday communication",
    //   items: [
    //     "Hello",
    //     "Thank You",
    //     "Please",
    //     "Yes",
    //     "No",
    //     "Good",
    //     "Bad",
    //     "Help",
    //     "Stop",
    //     "Go",
    //     "Come",
    //     "Welcome",
    //   ],
    // },
    // greetings: {
    //   title: "Greetings & Courtesy",
    //   description: "Polite expressions and greetings",
    //   items: [
    //     "Hello",
    //     "Goodbye",
    //     "Thank You",
    //     "Please",
    //     "Sorry",
    //     "Welcome",
    //     "Good Morning",
    //     "Good Night",
    //   ],
    // },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  const handleVideoToggle = (item) => {
    if (playingVideo === item) {
      setPlayingVideo(null);
    } else {
      setPlayingVideo(item);
    }
  };

  const currentCategory = categories[selectedCategory];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-6">
          <BackButton text="Back to Home" showHomeOption={false} />
          <Breadcrumb />
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Learn Sign Language
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Master the basics of sign language with our interactive video
            lessons. Practice at your own pace and build your vocabulary.
          </p>
        </motion.div>

        {/* Category Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-wrap justify-center gap-4">
            {Object.entries(categories).map(([key, category]) => (
              <motion.button
                key={key}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(key)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  selectedCategory === key
                    ? "bg-blue-600 dark:bg-blue-500 text-white shadow-lg"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                }`}
              >
                {category.title}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Category Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {currentCategory.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {currentCategory.description}
          </p>
        </motion.div>

        {/* Learning Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
        >
          {currentCategory.items.map((item, index) => (
            <motion.div
              key={item}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className="card p-4 text-center relative overflow-hidden"
            >
              <div className="aspect-square bg-black rounded-lg mb-3 relative overflow-hidden">
                {playingVideo === item ? (
                  <video
                    src={formatVideoUrl(item)}
                    autoPlay
                    loop
                    muted
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback for missing videos
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                    <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {item}
                    </span>
                  </div>
                )}

                {/* Fallback display */}
                <div className="w-full h-full flex-col items-center justify-center bg-gray-200 dark:bg-gray-700 hidden">
                  <span className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {item}
                  </span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Video not available
                  </span>
                </div>

                {/* Play/Pause Overlay */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleVideoToggle(item)}
                  className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200"
                >
                  {playingVideo === item ? (
                    <Pause className="text-white" size={24} />
                  ) : (
                    <Play className="text-white" size={24} />
                  )}
                </motion.button>
              </div>

              <h3 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                {item}
              </h3>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleVideoToggle(item)}
                className="w-full mt-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded text-xs font-medium transition-colors duration-300"
              >
                {playingVideo === item ? "Stop" : "Play"}
              </motion.button>
            </motion.div>
          ))}
        </motion.div>

        {/* Practice Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 card p-8 text-center"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Ready to Practice?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Use our translation tool to practice with your own sentences and see
            how the signs you've learned come together in real communication.
          </p>
          {/** Route directly to translate if logged in; otherwise to login */}
          <MotionLink
            to={isAuthenticated ? "/translate" : "/login"}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary inline-flex items-center space-x-2"
          >
            <span>Start Practicing</span>
          </MotionLink>
        </motion.section>

        {/* Tips Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card p-6 text-center">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Practice Regularly
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Consistent practice is key to mastering sign language. Spend a
                few minutes daily.
              </p>
            </div>

            <div className="card p-6 text-center">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Use Both Hands
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Pay attention to hand shapes, movements, and positioning for
                accurate signing.
              </p>
            </div>

            <div className="card p-6 text-center">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Learn Context
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Understanding when and how to use signs is as important as the
                signs themselves.
              </p>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default Learn;
