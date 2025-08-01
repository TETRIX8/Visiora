// src/components/ui/Slider.jsx
import React, { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';

const Slider = ({ 
  min = 0, 
  max = 100, 
  value, 
  onChange, 
  step = 1,
  label,
  className = "",
  disabled = false 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef(null);
  
  // Calculate percentage
  const percentage = ((value - min) / (max - min)) * 100;

  const handlePointerEvent = useCallback((event) => {
    if (disabled) return;
    
    const bounds = sliderRef.current.getBoundingClientRect();
    const percent = Math.max(0, Math.min(100, ((event.clientX - bounds.left) / bounds.width) * 100));
    const newValue = Math.round((percent / 100) * (max - min) + min);
    
    // Snap to step
    const steppedValue = Math.round(newValue / step) * step;
    onChange(Math.max(min, Math.min(max, steppedValue)));
  }, [min, max, step, onChange, disabled]);

  const handleMouseDown = (event) => {
    if (disabled) return;
    setIsDragging(true);
    handlePointerEvent(event);
    
    const handleMouseMove = (e) => handlePointerEvent(e);
    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-slate-700 dark:text-white/90">
            {label}
          </label>
          <span className="text-sm text-slate-600 dark:text-white/60 font-mono bg-slate-200/50 dark:bg-white/10 px-2 py-1 rounded-md">
            {value}
          </span>
        </div>
      )}
      
      <div 
        ref={sliderRef}
        className="relative h-6 flex items-center cursor-pointer"
        onMouseDown={handleMouseDown}
        onClick={handlePointerEvent}
      >
        {/* Track */}
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            {/* Progress fill */}
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
              initial={false}
              animate={{ width: `${percentage}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </div>
        </div>
        
        {/* Handle */}
        <motion.div
          className="absolute z-10 pointer-events-none"
          style={{ left: `${percentage}%`, x: '-50%' }}
          whileHover={{ scale: 1.1 }}
          animate={{ scale: isDragging ? 1.1 : 1 }}
        >
          <div
            className={`w-5 h-5 bg-white border-2 border-purple-500 rounded-full shadow-lg transition-all duration-200 ${
              isDragging ? 'shadow-xl border-purple-600 scale-110' : ''
            } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
          />
        </motion.div>
        
        {/* Hover indicators */}
        <div className="absolute inset-0 flex items-center pointer-events-none">
          {Array.from({ length: Math.floor((max - min) / step) + 1 }, (_, i) => {
            const stepValue = min + (i * step);
            const stepPercentage = ((stepValue - min) / (max - min)) * 100;
            return (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white/30 rounded-full transition-opacity duration-200 opacity-0 hover:opacity-100"
                style={{ left: `${stepPercentage}%`, transform: 'translateX(-50%)' }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Slider;