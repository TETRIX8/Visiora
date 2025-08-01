// src/hooks/useTheme.js

import { useState, useEffect, useCallback } from 'react';

const THEME_KEY = 'visiora-theme';

export const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === 'undefined') return true;
    
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) return JSON.parse(saved);
    
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply theme instantly without flicker
  const applyTheme = useCallback((isDark) => {
    const html = document.documentElement;
    
    // Remove transition during theme change to prevent flicker
    html.style.transition = 'none';
    
    if (isDark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    
    // Re-enable transitions after a frame
    requestAnimationFrame(() => {
      html.style.transition = 'background-color 0.2s ease, color 0.2s ease';
    });
    
    localStorage.setItem(THEME_KEY, JSON.stringify(isDark));
  }, []);

  // Initialize theme on mount
  useEffect(() => {
    applyTheme(isDarkMode);
  }, [isDarkMode, applyTheme]);

  const toggleTheme = useCallback(() => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    applyTheme(newTheme);
  }, [isDarkMode, applyTheme]);

  const setTheme = useCallback((newIsDark) => {
    setIsDarkMode(newIsDark);
    applyTheme(newIsDark);
  }, [applyTheme]);

  return { isDarkMode, toggleTheme, setTheme };
};
