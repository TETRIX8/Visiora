// src/components/layout/Header.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Sun, Moon } from 'lucide-react';
import { cn } from '../../utils/cn';
import Button from '../ui/Button';

const Header = ({ isDarkMode, onThemeChange }) => {
  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-white/5 backdrop-blur-md"
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
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <Palette className="w-5 h-5 text-white" />
              </div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 blur-md opacity-50 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Visiora
              </h1>
              <p className="text-xs text-white/60">AI Image Generator</p>
            </div>
          </motion.div>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onThemeChange(!isDarkMode)}
            className={cn(
              "relative overflow-hidden rounded-full p-2",
              "hover:bg-white/10 active:scale-95"
            )}
            icon={isDarkMode ? Sun : Moon}
          />
        </div>
      </div>
    </motion.header>
  );
};

export default Header;