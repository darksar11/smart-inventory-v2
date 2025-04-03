import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const LandingPage = () => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-black text-white overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 bg-gradient-to-r from-blue-900 to-black opacity-30"
        ></motion.div>
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 text-center"
      >
        <h1 className="text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 animate-pulse">
          Smart Inventory with AI
        </h1>
        <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
          Optimize your inventory with AI-driven demand prediction and analytics.
        </p>

        <div className="flex space-x-6">
          <motion.div whileHover={{ scale: 1.1 }}>
            <Link
              to="/login"
              className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-lg transition"
            >
              Login
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }}>
            <Link
              to="/login"
              className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-lg transition"
            >
              Get Started
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating Particles */}
      <motion.div
        className="absolute w-40 h-40 bg-blue-500 rounded-full opacity-20 blur-xl"
        animate={{ x: [0, 100, -100, 0], y: [0, -100, 100, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      ></motion.div>
      <motion.div
        className="absolute w-24 h-24 bg-purple-500 rounded-full opacity-20 blur-xl"
        animate={{ x: [-50, 50, -50], y: [-50, 50, -50] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      ></motion.div>
    </div>
  );
};

export default LandingPage;
