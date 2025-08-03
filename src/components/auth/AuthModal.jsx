import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthContext } from '../../contexts/AuthContextV2';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import Portal from '../ui/Portal';

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const { user } = useAuthContext();
  
  // If user is logged in and modal is open, close it
  React.useEffect(() => {
    if (user && isOpen) {
      onClose();
    }
  }, [user, isOpen, onClose]);
  
  if (!isOpen) return null;
  
  return (
    <Portal>
      <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div 
          className="relative w-full max-w-md"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: "spring", duration: 0.4 }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 bg-white dark:bg-slate-800 rounded-full p-1 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 z-10 shadow-lg"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, x: mode === 'login' ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: mode === 'login' ? 20 : -20 }}
            transition={{ duration: 0.2 }}
          >
            {mode === 'login' ? (
              <LoginForm 
                onRegisterClick={() => setMode('register')} 
                onSuccess={onClose} 
              />
            ) : (
              <RegisterForm 
                onLoginClick={() => setMode('login')} 
                onSuccess={onClose} 
              />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
    </Portal>
  );
}
