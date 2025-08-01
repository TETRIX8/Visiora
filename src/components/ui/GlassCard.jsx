// src/components/ui/GlassCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const GlassCard = ({ 
  children, 
  className = '', 
  hover = true, 
  blur = 'md', 
  ...props 
}) => {
  const blurClasses = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl'
  };

  return (
    <motion.div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-slate-300/30 dark:border-white/10 bg-slate-100/30 dark:bg-white/5 p-6 shadow-2xl',
        blurClasses[blur],
        'before:absolute before:inset-0 before:rounded-2xl before:border before:border-slate-200/40 dark:before:border-white/20 before:bg-gradient-to-br before:from-slate-200/20 dark:before:from-white/10 before:to-transparent before:opacity-50',
        hover && 'transition-all duration-300 hover:border-slate-400/40 dark:hover:border-white/20 hover:bg-slate-200/40 dark:hover:bg-white/10 hover:shadow-2xl hover:shadow-purple-500/10',
        className
      )}
      whileHover={hover ? { y: -2, scale: 1.02 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      {...props}
    >
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

export default GlassCard;