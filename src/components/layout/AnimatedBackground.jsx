// src/components/layout/AnimatedBackground.jsx
import React, { useRef, memo } from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground = memo(() => {
  console.log('AnimatedBackground rendered'); // DEBUG: See if this logs on every button click
  // Persist particles globally so they survive remounts
  const getPersistentParticles = () => {
    if (!window.__visiora_particles) {
      window.__visiora_particles = [...Array(20)].map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: 10 + Math.random() * 10,
        delay: Math.random() * 10,
      }));
    }
    return window.__visiora_particles;
  };
  const particles = getPersistentParticles();

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden w-full h-full">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 dark:from-slate-950 dark:via-purple-950/30 dark:to-slate-950 w-full h-full" />
      
      {/* Animated Gradient Orbs - Mobile Optimized */}
      <motion.div
        initial={false}
        className="absolute top-0 left-0 w-48 sm:w-72 h-48 sm:h-72 bg-purple-400/20 sm:bg-purple-400/30 rounded-full mix-blend-multiply filter blur-xl transform -translate-x-1/4 -translate-y-1/4"
        animate={{
          x: [0, 50, 0],
          y: [0, -25, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      <motion.div
        initial={false}
        className="absolute top-0 right-0 w-48 sm:w-72 h-48 sm:h-72 bg-cyan-400/20 sm:bg-cyan-400/30 rounded-full mix-blend-multiply filter blur-xl transform translate-x-1/4 -translate-y-1/4"
        animate={{
          x: [0, -50, 0],
          y: [0, 25, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      <motion.div
        initial={false}
        className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-400/30 rounded-full mix-blend-multiply filter blur-xl"
        animate={{
          x: [0, -50, 0],
          y: [0, -100, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={false}
            className="absolute w-2 h-2 bg-white/10 rounded-full"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.01)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
    </div>
  );
});

AnimatedBackground.displayName = 'AnimatedBackground';

export default AnimatedBackground;