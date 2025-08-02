// src/components/TypewriterEffect.jsx
import React, { useState, useEffect } from 'react';

const TypewriterEffect = ({ texts, speed = 150, delay = 1500 }) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const text = texts[currentTextIndex];
    
    const timeout = setTimeout(() => {
      if (isDeleting) {
        setCurrentText(text.substring(0, currentText.length - 1));
        if (currentText === '') {
          setIsDeleting(false);
          setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
        }
      } else {
        setCurrentText(text.substring(0, currentText.length + 1));
        if (currentText === text) {
          setTimeout(() => setIsDeleting(true), delay);
        }
      }
    }, isDeleting ? speed / 2 : speed);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentTextIndex, texts, speed, delay]);

  return (
    <span className="font-semibold text-purple-600 dark:text-purple-400">
      {currentText}
      <span className="animate-pulse">|</span>
    </span>
  );
};

export default TypewriterEffect;
