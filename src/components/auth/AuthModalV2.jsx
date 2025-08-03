import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthContext } from '../../contexts/AuthContextV2';
import LoginFormV2 from './LoginFormV2';
import RegisterFormV2 from './RegisterFormV2';
import Portal from '../ui/Portal';
import styles from './SliderAuth.module.css';

export default function AuthModalV2({ isOpen, onClose, initialMode = 'login' }) {
  const [isRightPanelActive, setIsRightPanelActive] = useState(initialMode === 'register');
  const { user } = useAuthContext();
  
  // Update the panel state when initialMode changes
  useEffect(() => {
    setIsRightPanelActive(initialMode === 'register');
  }, [initialMode]);
  
  // If user is logged in and modal is open, close it
  useEffect(() => {
    if (user && isOpen) {
      onClose();
    }
  }, [user, isOpen, onClose]);
  
  if (!isOpen) return null;
  
  return (
    <Portal>
      <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black/30 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div 
          className="relative w-full max-w-[768px]"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: "spring", duration: 0.4 }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute -top-2 -right-2 bg-white dark:bg-slate-800 rounded-full p-1 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 z-[10000] shadow-lg"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          
          {/* Slider container */}
          <div className={`${styles.container} ${isRightPanelActive ? styles.rightPanelActive : ''}`}>
            {/* Sign Up Container */}
            <div className={`${styles.formContainer} ${styles.signUpContainer}`}>
              <RegisterFormV2 
                onSignInClick={() => setIsRightPanelActive(false)} 
                onSuccess={onClose} 
              />
            </div>
            
            {/* Sign In Container */}
            <div className={`${styles.formContainer} ${styles.signInContainer}`}>
              <LoginFormV2 
                onSignUpClick={() => setIsRightPanelActive(true)} 
                onSuccess={onClose} 
              />
            </div>
            
            {/* Overlay Container */}
            <div className={styles.overlayContainer}>
              <div className={styles.overlay}>
                <div className={`${styles.overlayPanel} ${styles.overlayLeft}`}>
                  <h1 className="text-2xl font-bold mb-4">Welcome Back!</h1>
                  <p className="mb-6">To keep connected with us please login with your personal info</p>
                  <button 
                    className="px-8 py-2 rounded-full border border-white text-white hover:bg-white hover:text-purple-600 transition-all"
                    onClick={() => setIsRightPanelActive(false)}
                  >
                    Sign In
                  </button>
                </div>
                <div className={`${styles.overlayPanel} ${styles.overlayRight}`}>
                  <h1 className="text-2xl font-bold mb-4">Hello, Friend!</h1>
                  <p className="mb-6">Enter your personal details and start journey with us</p>
                  <button 
                    className="px-8 py-2 rounded-full border border-white text-white hover:bg-white hover:text-purple-600 transition-all"
                    onClick={() => setIsRightPanelActive(true)}
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Portal>
  );
}
