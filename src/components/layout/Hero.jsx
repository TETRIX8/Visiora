// src/components/layout/Hero.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Wand2, Zap } from 'lucide-react';

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
    "Generate", "Enhance", "Transform", "Create", "Inspire", "Design", "Imagine", "Visualize"
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20">
      <div className="container mx-auto px-6 text-center">
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-sm text-white/80">
              <Sparkles className="w-4 h-4" />
              <span>Where imagination meets AI</span>
            </div>
          </motion.div>

          <motion.h1
            custom={1}
            variants={textVariants}
            className="text-4xl md:text-6xl lg:text-7xl font-bold"
          >
            <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Create Stunning
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Images with AI
            </span>
          </motion.h1>

          <motion.p
            custom={2}
            variants={textVariants}
            className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed"
          >
            Transform your ideas into stunning visuals with the power of artificial intelligence. 
            Generate, enhance, and perfect your images in seconds.
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
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-white/80 hover:bg-white/10 transition-all duration-300"
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{text}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Floating Words Animation */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {floatingWords.map((word, index) => (
            <motion.div
              key={word}
              className="absolute text-white/5 font-bold text-6xl md:text-8xl select-none"
              style={{
                left: `${10 + (index * 12) % 80}%`,
                top: `${20 + (index * 15) % 60}%`,
              }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 8 + index * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.5,
              }}
            >
              {word}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;