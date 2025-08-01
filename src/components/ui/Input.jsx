// src/components/ui/Input.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const Input = ({ 
  type = 'text',
  placeholder,
  value,
  onChange,
  className = '',
  icon: Icon,
  error,
  label,
  ...props 
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-white/90">
          {label}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">
            <Icon size={18} />
          </div>
        )}
        
        <motion.input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={cn(
            'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/50 backdrop-blur-md transition-all duration-200',
            'focus:border-purple-500/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/20',
            'hover:border-white/20 hover:bg-white/10',
            Icon && 'pl-10',
            error && 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20',
            className
          )}
          whileFocus={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          {...props}
        />
      </div>
      
      {error && (
        <motion.p
          className="text-sm text-red-400"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default Input;