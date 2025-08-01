// src/hooks/useTheme.js

import { useState, useEffect, useCallback } from 'react';

const THEME_KEY = 'visiora-theme';

// Optimized theme management hook
export const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Only check localStorage once on initialization
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(THEME_KEY);
      return saved ? JSON.parse(saved) : true;
    }
    return true;
  });

  // Memoized theme application function
  const applyTheme = useCallback((isDark) => {
    const root = document.documentElement;
    
    // Batch DOM updates for better performance
    root.style.setProperty('--theme-transition', 'none');
    
    // Apply theme attribute
    root.setAttribute('data-theme', isDark ? 'dark' : 'light');
    
    // Apply classes
    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    
    // Re-enable transitions after a frame
    requestAnimationFrame(() => {
      root.style.removeProperty('--theme-transition');
    });
    
    // Save to localStorage
    localStorage.setItem(THEME_KEY, JSON.stringify(isDark));
  }, []);

  // Apply theme on mount and when changed
  useEffect(() => {
    applyTheme(isDarkMode);
  }, [isDarkMode, applyTheme]);

  // Optimized theme toggle function
  const toggleTheme = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  const setTheme = useCallback((newIsDark) => {
    setIsDarkMode(newIsDark);
  }, []);

  return {
    isDarkMode,
    toggleTheme,
    setTheme
  };
};

export default useTheme;
