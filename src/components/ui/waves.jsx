// src/components/ui/waves.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const Waves = ({ className, ...props }) => {
  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)} {...props}>
      {/* Multiple wave layers for realistic ocean effect */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1200 600"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background wave (slowest, largest) */}
        <motion.path
          d="M0,350 C300,280 600,330 900,300 C1050,285 1150,295 1200,290 L1200,600 L0,600 Z"
          fill="rgba(59, 130, 246, 0.08)"
          animate={{
            d: [
              "M0,350 C300,280 600,330 900,300 C1050,285 1150,295 1200,290 L1200,600 L0,600 Z",
              "M0,370 C300,300 600,350 900,320 C1050,305 1150,315 1200,310 L1200,600 L0,600 Z",
              "M0,350 C300,280 600,330 900,300 C1050,285 1150,295 1200,290 L1200,600 L0,600 Z"
            ]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Middle wave */}
        <motion.path
          d="M0,400 C250,330 500,380 750,350 C900,335 1000,345 1200,340 L1200,600 L0,600 Z"
          fill="rgba(59, 130, 246, 0.12)"
          animate={{
            d: [
              "M0,400 C250,330 500,380 750,350 C900,335 1000,345 1200,340 L1200,600 L0,600 Z",
              "M0,420 C250,350 500,400 750,370 C900,355 1000,365 1200,360 L1200,600 L0,600 Z",
              "M0,400 C250,330 500,380 750,350 C900,335 1000,345 1200,340 L1200,600 L0,600 Z"
            ]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        
        {/* Front wave (fastest, most visible) */}
        <motion.path
          d="M0,450 C200,380 400,430 600,400 C750,385 850,395 1200,390 L1200,600 L0,600 Z"
          fill="rgba(59, 130, 246, 0.15)"
          animate={{
            d: [
              "M0,450 C200,380 400,430 600,400 C750,385 850,395 1200,390 L1200,600 L0,600 Z",
              "M0,470 C200,400 400,450 600,420 C750,405 850,415 1200,410 L1200,600 L0,600 Z",
              "M0,450 C200,380 400,430 600,400 C750,385 850,395 1200,390 L1200,600 L0,600 Z"
            ]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        />
        
        {/* Top accent wave for center focus */}
        <motion.path
          d="M0,250 C400,180 800,230 1200,200 L1200,270 C800,250 400,200 0,270 Z"
          fill="rgba(59, 130, 246, 0.06)"
          animate={{
            d: [
              "M0,250 C400,180 800,230 1200,200 L1200,270 C800,250 400,200 0,270 Z",
              "M0,230 C400,160 800,210 1200,180 L1200,250 C800,230 400,180 0,250 Z",
              "M0,250 C400,180 800,230 1200,200 L1200,270 C800,250 400,200 0,270 Z"
            ]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </svg>
      
      {/* Subtle gradient overlay for depth and center focus */}
      <div className="absolute inset-0 bg-gradient-radial from-blue-50/10 via-transparent to-transparent dark:from-blue-900/5 dark:via-transparent dark:to-transparent pointer-events-none" />
    </div>
  );
};

export default Waves;

