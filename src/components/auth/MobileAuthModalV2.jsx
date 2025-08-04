import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthContext } from '../../contexts/AuthContextV2';
import LoginFormV2 from './LoginFormV2';
import RegisterFormV2 from './RegisterFormV2';
import Portal from '../ui/Portal';

export default function MobileAuthModalV2({ isOpen, onClose, initialMode = 'login' }) {
  const [currentMode, setCurrentMode] = useState(initialMode);
  const { user } = useAuthContext();
  
  // Update the mode when initialMode changes
  useEffect(() => {
    setCurrentMode(initialMode);
  }, [initialMode]);
  
  // If user is logged in and modal is open, close it
  useEffect(() => {
    if (user && isOpen) {
      onClose();
    }
  }, [user, isOpen, onClose]);
  
  if (!isOpen) return null;

  const switchToLogin = () => setCurrentMode('login');
  const switchToRegister = () => setCurrentMode('register');

  return (
    <Portal>
      <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black/30 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div 
          className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl"
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
          
          {/* Header with mode toggle */}
          <div className="flex border-b border-slate-200 dark:border-slate-700">
            <button
              onClick={switchToLogin}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                currentMode === 'login'
                  ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Log In
            </button>
            <button
              onClick={switchToRegister}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                currentMode === 'register'
                  ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {currentMode === 'login' ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <LoginFormV2 onSuccess={onClose} />
                  
                  {/* Toggle text */}
                  <div className="mt-6 text-center">
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      New user?{' '}
                      <button
                        onClick={switchToRegister}
                        className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold transition-colors"
                      >
                        Sign up
                      </button>
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="register"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <RegisterFormV2 onSuccess={onClose} />
                  
                  {/* Toggle text */}
                  <div className="mt-6 text-center">
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Already a user?{' '}
                      <button
                        onClick={switchToLogin}
                        className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold transition-colors"
                      >
                        Log in
                      </button>
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </Portal>
  );
}
