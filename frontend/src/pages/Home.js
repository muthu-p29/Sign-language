import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
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
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex flex-col items-center justify-center">
      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative px-4 sm:px-6 lg:px-8 py-16 w-full"
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-gray-100 mb-6"
          >
            Welcome to{" "}
            <span className="text-blue-600 dark:text-blue-400">Sign Translation</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto"
          >
            Bridging Speech and Sign Language with AI-powered technology.
            Translate your words into beautiful sign language animations
            instantly.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              to="/translate"
              className="btn-primary flex items-center space-x-2 text-lg"
            >
              <span>Start Translation</span>
              <ArrowRight size={20} />
            </Link>

            {/* 
            <Link
              to="/learn"
              className="btn-secondary flex items-center space-x-2 text-lg"
            >
              <span>Learn Sign Language</span>
            </Link>
*/}
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-4 -right-4 w-72 h-72 bg-blue-600/5 dark:bg-blue-400/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-teal-500/5 dark:bg-teal-300/5 rounded-full blur-3xl"></div>
        </div>
      </motion.section>


    </div>
  );
};

export default Home;
