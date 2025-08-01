// src/components/ui/LocomotiveScrollProvider.jsx

import React, { useEffect, useRef } from 'react';
import LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';

const LocomotiveScrollProvider = ({ children, options = {} }) => {
  const scrollRef = useRef(null);
  const locomotiveScrollRef = useRef(null);

  useEffect(() => {
    if (!scrollRef.current) return;

    // Default options optimized for your glassmorphic UI
    const defaultOptions = {
      el: scrollRef.current,
      smooth: true,
      smoothMobile: true,
      inertia: 0.8,
      multiplier: 1,
      touchMultiplier: 2,
      class: 'is-reveal',
      initClass: 'has-scroll-init',
      getDirection: true,
      getSpeed: true,
      scrollbarContainer: false,
      scrollFromAnywhere: true,
      tablet: {
        smooth: true,
        breakpoint: 1024
      },
      smartphone: {
        smooth: true,
        breakpoint: 568
      },
      ...options
    };

    // Initialize Locomotive Scroll
    locomotiveScrollRef.current = new LocomotiveScroll(defaultOptions);

    // Handle scroll events for theme animations
    locomotiveScrollRef.current.on('scroll', (args) => {
      // You can add custom scroll event handlers here
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('locomotive-scroll', { detail: args }));
      }
    });

    // Update on window resize
    const handleResize = () => {
      if (locomotiveScrollRef.current) {
        locomotiveScrollRef.current.update();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (locomotiveScrollRef.current) {
        locomotiveScrollRef.current.destroy();
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [options]);

  // Public method to update scroll
  const updateScroll = () => {
    if (locomotiveScrollRef.current) {
      locomotiveScrollRef.current.update();
    }
  };

  // Public method to scroll to element
  const scrollTo = (target, options = {}) => {
    if (locomotiveScrollRef.current) {
      locomotiveScrollRef.current.scrollTo(target, options);
    }
  };

  // Provide scroll instance to children
  const contextValue = {
    locomotive: locomotiveScrollRef.current,
    updateScroll,
    scrollTo
  };

  return (
    <div 
      ref={scrollRef} 
      data-scroll-container
      className="locomotive-scroll-container"
    >
      <div data-scroll-section>
        {typeof children === 'function' ? children(contextValue) : children}
      </div>
    </div>
  );
};

export default LocomotiveScrollProvider;
