import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Mic, Video, Users, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  const features = [
    {
      icon: Mic,
      title: "Voice Recognition",
      description:
        "Speak naturally and watch your words transform into sign language animations",
    },
    {
      icon: Video,
      title: "HD Video Quality",
      description:
        "Crystal clear sign language videos with smooth animations for better learning",
    },
    {
      icon: Users,
      title: "Accessible Design",
      description:
        "Built with accessibility in mind, supporting keyboard navigation and screen readers",
    },
    {
      icon: Heart,
      title: "Inclusive Technology",
      description:
        "Bridging communication gaps and fostering understanding between communities",
    },
  ];

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative px-4 sm:px-6 lg:px-8 pt-20 pb-16"
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-gray-100 mb-6"
          >
            Welcome to{" "}
            <span className="text-blue-600 dark:text-blue-400">SignEase</span>
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

            <Link
              to="/learn"
              className="btn-secondary flex items-center space-x-2 text-lg"
            >
              <span>Learn Sign Language</span>
            </Link>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-4 -right-4 w-72 h-72 bg-blue-600/5 dark:bg-blue-400/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-teal-500/5 dark:bg-teal-300/5 rounded-full blur-3xl"></div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Our cutting-edge technology makes sign language translation
              accessible, accurate, and easy to use for everyone.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="card p-6 text-center hover:shadow-xl transition-all duration-300"
              >
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon
                    className="text-blue-600 dark:text-blue-400"
                    size={32}
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-50 dark:bg-blue-900/10"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6"
          >
            Ready to Bridge the Communication Gap?
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-lg text-gray-600 dark:text-gray-400 mb-8"
          >
            Join thousands of users who are already using SignEase to
            communicate more effectively with the deaf and hard-of-hearing
            community.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/translate" className="btn-primary text-lg">
              Try Translation Now
            </Link>
            <Link to="/about" className="btn-secondary text-lg">
              Learn More About Us
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="py-16 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <motion.div variants={itemVariants}>
              <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                1000+
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Sign Language Videos
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                50+
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Languages Supported
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                24/7
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Available Access
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;
