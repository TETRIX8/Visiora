import React, { useState } from 'react';
import { useAuthContext } from '../../contexts/AuthContextV2';
import { motion } from 'framer-motion';
import styles from './SliderAuth.module.css';

export default function RegisterFormV2({ onSignInClick, onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signup, loginWithGoogle } = useAuthContext();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Password confirmation check
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      console.log('Creating new account for:', email);
      await signup(email, password);
      
      // Show loading for at least 1.5 seconds to give time for Firestore operations
      setTimeout(() => {
        if (onSuccess) onSuccess();
        setIsLoading(false);
        
        // Show verification message
        alert("Registration successful! Please check your email to verify your account before logging in.");
      }, 1500);
    } catch (err) {
      console.error("Registration error:", err);
      // Handle common Firebase auth errors
      if (err.code === 'auth/email-already-in-use') {
        setError('Email is already in use. Try logging in instead');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak. Please use at least 6 characters');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else {
        setError(err.message || 'Failed to create an account');
      }
      setIsLoading(false);
    }
  };
  
  const handleGoogleSignup = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      console.log('Signing up with Google');
      await loginWithGoogle();
      
      // Extend loading time to ensure Firebase operations complete
      setTimeout(() => {
        if (onSuccess) {
          console.log('Google signup successful, completing onSuccess');
          onSuccess();
        }
        setIsLoading(false);
      }, 3000);
    } catch (err) {
      console.error("Google signup error:", err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-up cancelled. Please try again.');
      } else {
        setError(err.message || 'Failed to sign up with Google');
      }
      setIsLoading(false);
    }
  };

  return (
    <form className="bg-[rgba(30,41,59,0.75)] dark:bg-[rgba(15,23,42,0.75)] backdrop-blur-md h-full flex flex-col justify-center items-center p-8 pb-12 text-center border-r border-white/5" onSubmit={handleSubmit}>
      <h1 className="text-2xl font-bold text-white mb-1">Create Account</h1>
      
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-1 p-2 bg-red-500/20 text-red-200 rounded-lg text-sm w-full"
        >
          {error}
        </motion.div>
      )}
      
      <div className={`${styles.socialContainer} my-1`}>
        <button 
          type="button"
          onClick={handleGoogleSignup}
          className={`${styles.socialIcon} mx-2 text-white hover:bg-purple-600/30 transition-colors`}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" style={{fill: 'white'}}>
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
        </button>
      </div>
      
      <span className="text-sm text-white my-1">or use your email for registration</span>
      
      <div className="w-full space-y-2 mt-2">
        <div className="relative">
          <input 
            type="text"
            placeholder="Name"
            className={`${styles.input} w-full`}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        
        <div className="relative">
          <input 
            type="email"
            placeholder="Email"
            className={`${styles.input} w-full`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="relative">
          <input 
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className={`${styles.input} w-full`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button 
            type="button"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/80 hover:text-white"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
              </svg>
            )}
          </button>
        </div>
        
        <div className="relative">
          <input 
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            className={`${styles.input} w-full`}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button 
            type="button"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/80 hover:text-white"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      <button
        type="submit"
        disabled={isLoading}
        className="mt-5 mb-3 px-8 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold uppercase tracking-wider hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 shadow-lg shadow-purple-500/20 w-40"
      >
        {isLoading ? 'Signing up...' : 'Sign Up'}
      </button>
    </form>
  );
}
