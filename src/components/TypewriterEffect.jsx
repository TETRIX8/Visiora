// src/components/TypewriterEffect.jsx

import React, { useState, useEffect } from "react";
import "./TypewriterEffect.css";

const TypewriterEffect = ({
  texts = [
    "Turn imagination into vivid AI visuals.",
    "Where AI meets imagination.",
    "Unique prompts crafted for every idea.",
    "Minimal effort. Infinite possibilities.",
  ],
  speed = 100,
  delay = 100,
}) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const handleTyping = () => {
      const fullText = texts[currentTextIndex];

      if (!isDeleting) {
        // Typing
        if (charIndex < fullText.length) {
          setCurrentText(fullText.substring(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        } else {
          // Pause at end of text
          setTimeout(() => setIsDeleting(true), delay);
        }
      } else {
        // Deleting
        if (charIndex > 0) {
          setCurrentText(fullText.substring(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        } else {
          // Move to next text
          setIsDeleting(false);
          setCurrentTextIndex((prevIndex) =>
            prevIndex === texts.length - 1 ? 0 : prevIndex + 1
          );
        }
      }
    };

    const typingSpeed = isDeleting ? speed / 2 : speed;
    const timer = setTimeout(handleTyping, typingSpeed);

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, currentTextIndex, texts, speed, delay]);

  return (
    <span className="typewriter-container">
      <span className="typewriter-text">{currentText}</span>
      <span className="typewriter-cursor">|</span>
    </span>
  );
};

export default TypewriterEffect;
