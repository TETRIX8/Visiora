// src/components/layout/Header.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Palette } from 'lucide-react';
import ModernThemeToggle from '../ui/ModernThemeToggle';

const Header = ({ isDarkMode, onThemeChange }) => {
  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200/20 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-md"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full overflow-hidden shadow-lg">
                <img 
                  src="/src/assets/logo/logo.jpg" 
                  alt="Visiora Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 blur-md opacity-30 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-white/80 bg-clip-text text-transparent">
                Visiora
              </h1>
              <p className="text-xs text-slate-600 dark:text-white/60">AI Image Generator</p>
            </div>
          </motion.div>

          {/* Theme Toggle */}
          <ModernThemeToggle 
            isDarkMode={isDarkMode} 
            onToggle={onThemeChange} 
          />
        </div>
      </div>
    </motion.header>
  );
};

export default Header;