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
    
    // Disable all transitions temporarily
    html.style.setProperty('transition', 'none', 'important');
    
    // Apply theme classes
    if (isDark) {
      html.classList.add('dark');
      html.setAttribute('data-theme', 'dark');
    } else {
      html.classList.remove('dark');
      html.setAttribute('data-theme', 'light');
    }
    
    // Force reflow
    html.offsetHeight;
    
    // Re-enable transitions after theme is applied
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        html.style.removeProperty('transition');
      });
    });
    
    localStorage.setItem(THEME_KEY, JSON.stringify(isDark));
  }, []);

  // Initialize theme on mount with immediate application
  useEffect(() => {
    applyTheme(isDarkMode);
  }, []); // Only run once on mount

  const toggleTheme = useCallback(() => {
    setIsDarkMode(prevMode => {
      const newTheme = !prevMode;
      applyTheme(newTheme);
      return newTheme;
    });
  }, [applyTheme]);

  const setTheme = useCallback((newIsDark) => {
    setIsDarkMode(newIsDark);
    applyTheme(newIsDark);
  }, [applyTheme]);

  return { isDarkMode, toggleTheme, setTheme };
};
