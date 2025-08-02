// src/components/ui/ModernThemeToggle.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { cn } from '../../utils/cn';

const ModernThemeToggle = ({ isDarkMode, onToggle, className = '' }) => {
  return (
    <motion.button
      onClick={onToggle}
      className={cn(
        "relative w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/20 backdrop-blur-md overflow-hidden flex-shrink-0",
        "bg-gradient-to-br from-white/10 to-white/5",
        "hover:from-white/20 hover:to-white/10 hover:border-white/30",
        "focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-transparent",
        "transition-colors duration-150 ease-out",
        "touch-manipulation", // Better touch handling on mobile
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 25, duration: 0.1 }}
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
    >
      {/* Background glow effect - simplified for mobile */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/15 to-pink-500/15"
        animate={{ 
          opacity: isDarkMode ? 0.2 : 0.4,
        }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      />
      
      {/* Icon container */}
      <div className="relative w-full h-full flex items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          {isDarkMode ? (
            <motion.div
              key="sun"
              initial={{ opacity: 0, rotate: -30, scale: 0.9 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 30, scale: 0.9 }}
              transition={{ duration: 0.12, ease: "easeOut" }}
            >
              <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ opacity: 0, rotate: 30, scale: 0.9 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -30, scale: 0.9 }}
              transition={{ duration: 0.12, ease: "easeOut" }}
            >
              <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.button>
  );
};

export default ModernThemeToggle;
