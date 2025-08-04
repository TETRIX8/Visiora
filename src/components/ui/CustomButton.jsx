// src/components/ui/CustomButton.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const CustomButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false,
  className = '',
  icon: Icon,
  ...props 
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-purple-500/25',
    secondary: 'bg-slate-200/50 dark:bg-white/10 hover:bg-slate-200/70 dark:hover:bg-white/20 border border-slate-300/50 dark:border-white/20 hover:border-slate-400/60 dark:hover:border-white/30 text-slate-700 dark:text-white backdrop-blur-md',
    ghost: 'hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-white/80 hover:text-slate-800 dark:hover:text-white',
    outline: 'border-2 border-purple-500/50 hover:border-purple-500 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-purple-500/10'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg',
    xl: 'px-10 py-4 text-xl'
  };

  return (
    <motion.button
      className={cn(
        'relative inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-transparent',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
        variants[variant],
        sizes[size],
        className
      )}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      disabled={disabled || loading}
      style={{
        touchAction: 'manipulation', // Prevents double-tap zoom on mobile
        WebkitTapHighlightColor: 'transparent' // Removes tap highlight on iOS
      }}
      {...props}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {Icon && !loading && <Icon size={18} />}
      {children && <span>{children}</span>}
      
      {/* Shimmer effect */}
      {variant === 'primary' && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 animate-shimmer" />
      )}
    </motion.button>
  );
};

export default CustomButton;
