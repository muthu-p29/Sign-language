import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  Target,
  Heart,
  Award,
  Github,
  Linkedin,
  Mail,
} from "lucide-react";
import BackButton from "../components/BackButton";
import Breadcrumb from "../components/Breadcrumb";

const About = () => {
  const teamMembers = [
    {
      name: "Aditya Khetawat",
      role: "Full Stack Development",
      description: "Building accessible technology solutions",
      icon: Github,
    },
    {
      name: "Gotham Kothari",
      role: "Machine Learning & NLP",
      description: "Developing intelligent translation algorithms",
      icon: Award,
    },
    {
      name: "Vikash Kumar",
      role: "Animations & Accessibility",
      description: "Ensuring inclusive design for all users",
      icon: Heart,
    },
  ];

  const values = [
    {
      icon: Users,
      title: "Inclusivity",
      description:
        "Making technology accessible to everyone, regardless of hearing ability",
    },
    {
      icon: Target,
      title: "Innovation",
      description: "Using cutting-edge AI to bridge communication gaps",
    },
    {
      icon: Heart,
      title: "Empathy",
      description: "Understanding and addressing real community needs",
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
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            About SignEase
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            We're on a mission to break down communication barriers and create a
            more inclusive world through innovative AI-powered technology.
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="mb-20"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={itemVariants}>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                SignEase was created to bridge the communication gap between the
                hearing and deaf communities. Our AI-driven platform transforms
                spoken words and text into clear, accurate sign language
                animations, making communication more accessible for everyone.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                We believe that technology should empower human connection, not
                hinder it. By leveraging artificial intelligence and natural
                language processing, we're making sign language translation
                instant, accurate, and available 24/7.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="card p-8">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <Users
                      className="text-blue-600 dark:text-blue-400"
                      size={24}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      Community First
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Built for and with the deaf community
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <Target
                      className="text-blue-600 dark:text-blue-400"
                      size={24}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      Accuracy Focused
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Precise translations powered by AI
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <Heart
                      className="text-blue-600 dark:text-blue-400"
                      size={24}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      Accessible Always
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Free, open, and available to all
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Values Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="mb-20"
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-12"
          >
            Our Values
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="card p-6 text-center"
              >
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon
                    className="text-blue-600 dark:text-blue-400"
                    size={32}
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Team Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="mb-20"
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-12"
          >
            Our Team
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="card p-6 text-center"
              >
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <member.icon
                    className="text-blue-600 dark:text-blue-400"
                    size={36}
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  {member.name}
                </h3>
                <p className="text-blue-600 dark:text-blue-400 font-medium mb-2">
                  {member.role}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {member.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Technology Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="mb-20"
        >
          <div className="card p-8">
            <motion.h2
              variants={itemVariants}
              className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-8"
            >
              Technology Behind SignEase
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div variants={itemVariants}>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Natural Language Processing
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Our NLP engine, powered by NLTK, processes your input text to
                  understand context, tense, and meaning. This ensures that the
                  sign language translation maintains the original intent of
                  your message.
                </p>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Tokenization and part-of-speech tagging</li>
                  <li>• Tense detection and adjustment</li>
                  <li>• Stop word filtering and lemmatization</li>
                </ul>
              </motion.div>

              <motion.div variants={itemVariants}>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  AI-Powered Translation
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Advanced algorithms convert processed text into sign language
                  sequences, ensuring grammatically correct and culturally
                  appropriate translations that respect deaf community
                  standards.
                </p>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Real-time speech recognition</li>
                  <li>• Context-aware word mapping</li>
                  <li>• High-quality video animations</li>
                </ul>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="text-center"
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6"
          >
            Get in Touch
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto"
          >
            Have questions, suggestions, or want to contribute to making
            communication more accessible? We'd love to hear from you.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex justify-center space-x-6"
          >
            <motion.a
              href="mailto:contact@signease.com"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
            >
              <Mail size={20} />
              <span>Email Us</span>
            </motion.a>

            <motion.a
              href="https://github.com/Aditya-Khetawat/SignEase---Audio-to-Sign-Language?tab=readme-ov-file"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center space-x-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Github size={20} />
              <span>GitHub</span>
            </motion.a>
          </motion.div>
        </motion.section>
      </div>
    </div>
  );
};

export default About;
