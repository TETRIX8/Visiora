// src/components/layout/AnimatedBackground.jsx
import React, { memo, useEffect, useRef } from 'react';

// Global state to ensure only one background exists
let backgroundElement = null;
let isInitialized = false;

// Create the background element once and reuse it
const createBackgroundElement = () => {
  if (backgroundElement) return backgroundElement;

  const div = document.createElement('div');
  div.id = 'visiora-background';
  div.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -10;
    overflow: hidden;
    pointer-events: none;
  `;

  // Add gradient background
  const gradientBg = document.createElement('div');
  gradientBg.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #0f172a 0%, rgba(88, 28, 135, 0.2) 50%, #0f172a 100%);
  `;
  div.appendChild(gradientBg);

  // Add animated orbs
  const orb1 = document.createElement('div');
  orb1.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 18rem;
    height: 18rem;
    background: rgba(168, 85, 247, 0.3);
    border-radius: 50%;
    mix-blend-mode: multiply;
    filter: blur(40px);
    transform: translate(-25%, -25%);
    animation: float1 20s ease-in-out infinite;
  `;

  const orb2 = document.createElement('div');
  orb2.style.cssText = `
    position: absolute;
    top: 0;
    right: 0;
    width: 18rem;
    height: 18rem;
    background: rgba(34, 197, 94, 0.3);
    border-radius: 50%;
    mix-blend-mode: multiply;
    filter: blur(40px);
    transform: translate(25%, -25%);
    animation: float2 25s ease-in-out infinite;
  `;

  const orb3 = document.createElement('div');
  orb3.style.cssText = `
    position: absolute;
    bottom: -2rem;
    left: 5rem;
    width: 18rem;
    height: 18rem;
    background: rgba(236, 72, 153, 0.3);
    border-radius: 50%;
    mix-blend-mode: multiply;
    filter: blur(40px);
    animation: float3 30s ease-in-out infinite;
  `;

  div.appendChild(orb1);
  div.appendChild(orb2);
  div.appendChild(orb3);

  // Add particles
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    const duration = 10 + Math.random() * 10;
    const delay = Math.random() * 10;

    particle.style.cssText = `
      position: absolute;
      left: ${left}%;
      top: ${top}%;
      width: 0.5rem;
      height: 0.5rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      animation: particle${i} ${duration}s ease-in-out infinite;
      animation-delay: ${delay}s;
    `;

    div.appendChild(particle);
  }

  backgroundElement = div;
  return div;
};

// Add CSS animations
const addAnimationStyles = () => {
  if (document.getElementById('visiora-bg-styles')) return;

  const style = document.createElement('style');
  style.id = 'visiora-bg-styles';
  style.textContent = `
    @keyframes float1 {
      0%, 100% { transform: translate(-25%, -25%) translate(0, 0); }
      50% { transform: translate(-25%, -25%) translate(50px, -25px); }
    }
    @keyframes float2 {
      0%, 100% { transform: translate(25%, -25%) translate(0, 0); }
      50% { transform: translate(25%, -25%) translate(-50px, 25px); }
    }
    @keyframes float3 {
      0%, 100% { transform: translate(0, 0); }
      50% { transform: translate(-50px, -100px); }
    }
    ${Array.from({ length: 20 }, (_, i) => `
      @keyframes particle${i} {
        0%, 100% { transform: translateY(0); opacity: 0; }
        50% { transform: translateY(-100px); opacity: 1; }
      }
    `).join('')}
  `;
  document.head.appendChild(style);
};

const AnimatedBackground = memo(() => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (isInitialized) {
      if (import.meta.env.DEV) {
        console.log('🚫 Background already initialized, skipping');
      }
      return;
    }

    isInitialized = true;

    if (import.meta.env.DEV) {
      console.log('🎨 Initializing persistent background');
    }

    // Add animation styles
    addAnimationStyles();

    // Create and mount background
    const bgElement = createBackgroundElement();

    // Insert at the beginning of body to ensure it's behind everything
    if (document.body.firstChild) {
      document.body.insertBefore(bgElement, document.body.firstChild);
    } else {
      document.body.appendChild(bgElement);
    }

    return () => {
      // Don't remove on unmount to prevent re-creation
      if (import.meta.env.DEV) {
        console.log('🎨 Background component unmounting (keeping DOM element)');
      }
    };
  }, []);

  // Return empty div as placeholder
  return <div ref={mountRef} style={{ display: 'none' }} />;
});

AnimatedBackground.displayName = 'AnimatedBackground';

// Export with aggressive memoization - never re-render this component
export default React.memo(AnimatedBackground, () => {
  // Always return true to prevent re-renders
  if (import.meta.env.DEV) {
    console.log('🚫 AnimatedBackground re-render blocked by memo');
  }
  return true;
});