import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export const LiquidButton = ({ 
  children, 
  className, 
  onClick, 
  variant = 'primary',
  size = 'md',
  ...props 
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:from-purple-700 hover:via-pink-700 hover:to-cyan-700',
    secondary: 'bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 hover:from-slate-700 hover:via-slate-800 hover:to-slate-900',
    accent: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <motion.button
      className={cn(
        'relative overflow-hidden rounded-full font-semibold text-white transition-all duration-300 transform-gpu',
        'shadow-lg hover:shadow-xl',
        'before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent',
        'before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700',
        variants[variant],
        sizes[size],
        className
      )}
      whileHover={{ 
        scale: 1.05,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}
      whileTap={{ scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 17
      }}
      onClick={onClick}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};
