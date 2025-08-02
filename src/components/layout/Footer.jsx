// src/components/layout/Footer.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Github, Twitter, Palette, Sparkles } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import TechStackScroll from '../ui/TechStackScroll';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative py-20 mt-20">
      <div className="container mx-auto px-6">
        {/* Main Footer Content */}
        <GlassCard className="text-center">
          <div className="space-y-8">
            {/* Logo and Branding */}
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                  <Palette className="w-6 h-6 text-slate-600 dark:text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
                    Visiora
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-white/60">AI Image Generator</p>
                </div>
              </div>
              
              <p className="text-slate-700 dark:text-white/80 max-w-md mx-auto leading-relaxed">
                Where Every Image Radiates an Aura of Imagination
              </p>
              
              <div className="flex items-center justify-center gap-2 text-sm text-slate-600 dark:text-white/60">
                <Sparkles className="w-4 h-4" />
                <span>Transform your ideas into stunning visuals with AI</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 py-8 border-y border-slate-300/30 dark:border-white/10">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-800 dark:text-white mb-1">3</div>
                <div className="text-sm text-slate-600 dark:text-white/60">AI Models</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-800 dark:text-white mb-1">25+</div>
                <div className="text-sm text-slate-600 dark:text-white/60">Style Presets</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-800 dark:text-white mb-1">∞</div>
                <div className="text-sm text-slate-600 dark:text-white/60">Possibilities</div>
              </div>
            </div>

            {/* Tech Stack - Scrolling Animation */}
            <div className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-white/60">Powered by</p>
              <div className="w-full max-w-4xl mx-auto py-4">
                <TechStackScroll />
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Copyright */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-4 text-sm text-slate-600 dark:text-white/50">
            <div className="flex items-center gap-1">
              <span>© {currentYear} Visiora</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <span>Made with</span>
              <Heart className="w-3 h-3 text-red-400" />
              <span>by Arjun</span>
            </div>
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>
    </footer>
  );
};

export default Footer;