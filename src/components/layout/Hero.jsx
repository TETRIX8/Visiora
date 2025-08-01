// src/components/layout/Hero.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Wand2, Zap } from 'lucide-react';
import TypewriterEffect from '../TypewriterEffect';
import { DotPattern } from '../ui/shadcn-io/dot-pattern';
import { cn } from '../../lib/utils';

const Hero = () => {
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: "easeOut"
      }
    })
  };

  const floatingWords = [
    "Generate", "Enhance", "Transform", "Create", "Inspire", "Design", "Imagine", "Visualize",
    "Dream", "Craft", "Build", "Invent", "Paint", "Sketch", "Art", "Magic"
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden -translate-y-[20vh]">
      {/* Dot Pattern Background */}
      <DotPattern
        className={cn(
          "[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]",
          "opacity-40 dark:opacity-20"
        )}
      />
      
      <div className="container mx-auto px-6 text-center relative z-10">
        {/* Main Title */}
        <motion.div
          className="space-y-6"
          initial="hidden"
          animate="visible"
        >
          <motion.div
            custom={0}
            variants={textVariants}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-200/50 dark:bg-white/10 border border-slate-300/50 dark:border-white/20 backdrop-blur-md text-sm text-slate-700 dark:text-white/80">
              <Sparkles className="w-4 h-4" />
              <span>Where imagination meets AI</span>
            </div>
          </motion.div>

          <motion.h1
            custom={1}
            variants={textVariants}
            className="text-4xl md:text-6xl lg:text-7xl font-bold"
          >
            <span className="bg-gradient-to-r from-slate-800 via-slate-600 to-slate-700 dark:from-white dark:via-purple-200 dark:to-pink-200 bg-clip-text text-transparent">
              Create Stunning
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 dark:from-purple-400 dark:via-pink-400 dark:to-cyan-400 bg-clip-text text-transparent">
              Images with AI
            </span>
          </motion.h1>

          <motion.p
            custom={2}
            variants={textVariants}
            className="text-lg md:text-xl text-slate-600 dark:text-white/70 max-w-2xl mx-auto leading-relaxed"
          >
            Built for{" "}
            <TypewriterEffect 
              texts={[
                "creators",
                "dreamers", 
                "visionaries",
                "you.."
              ]}
              speed={150}
              delay={1500}
            />
          </motion.p>

          {/* Feature Pills */}
          <motion.div
            custom={3}
            variants={textVariants}
            className="flex flex-wrap gap-3 justify-center mt-8"
          >
            {[
              { icon: Wand2, text: "AI Generation" },
              { icon: Sparkles, text: "Smart Enhancement" },
              { icon: Zap, text: "Lightning Fast" }
            ].map(({ icon: Icon, text }, index) => (
              <div
                key={text}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-200/30 dark:bg-white/5 border border-slate-300/30 dark:border-white/10 backdrop-blur-md text-slate-700 dark:text-white/80 hover:bg-slate-300/40 dark:hover:bg-white/10 transition-all duration-300"
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{text}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Floating Words Animation - Optimized for Mobile */}
        <div className="fixed inset-0 pointer-events-none z-5">
          {floatingWords.map((word, index) => {
            // Create varied positioning patterns
            const patterns = [
              // Left side scattered
              { left: Math.random() * 25, top: Math.random() * 100 },
              // Right side scattered  
              { left: 75 + Math.random() * 25, top: Math.random() * 100 },
              // Top scattered
              { left: Math.random() * 100, top: Math.random() * 25 },
              // Bottom scattered
              { left: Math.random() * 100, top: 75 + Math.random() * 25 },
              // Center scattered
              { left: 25 + Math.random() * 50, top: 25 + Math.random() * 50 },
            ];
            
            const pattern = patterns[index % patterns.length];
            const randomOffset = {
              left: pattern.left + (Math.random() - 0.5) * 20,
              top: pattern.top + (Math.random() - 0.5) * 20
            };
            
            return (
              <motion.div
                key={word}
                className="absolute text-slate-300/15 dark:text-white/10 font-bold text-4xl md:text-6xl lg:text-8xl select-none will-change-transform"
                style={{
                  left: `${Math.max(0, Math.min(95, randomOffset.left))}%`,
                  top: `${Math.max(-5, Math.min(105, randomOffset.top))}%`,
                }}
                animate={{
                  y: [-20, 20, -20],
                  rotate: [-8, 8, -8],
                  scale: [0.9, 1.1, 0.9],
                  x: [-15, 15, -15],
                }}
                transition={{
                  duration: 20 + index * 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 1,
                }}
              >
                {word}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Hero;