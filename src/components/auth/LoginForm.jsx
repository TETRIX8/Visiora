import React, { useState } from 'react';
import { useAuthContext } from '../../contexts/AuthContextV2';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { validateFirebaseAccess } from '../../api/firebaseValidator';

export default function LoginForm({ onRegisterClick, onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, loginWithGoogle } = useAuthContext();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      console.log('Attempting to login with email:', email);
      
      // Store current anonymous credits before login
      const currentCredits = localStorage.getItem('visiora_anonymous_credits');
      if (currentCredits !== null) {
        // Save them with a different key so they're not affected by login
        localStorage.setItem('visiora_previous_credits', currentCredits);
        console.log('Stored anonymous credits before login:', currentCredits);
      }
      
      await login(email, password);
      
      // Show loading for at least 1 second to give time for Firestore operations
      setTimeout(() => {
        if (onSuccess) onSuccess();
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      console.error("Login error:", err);
      // Handle common Firebase auth errors
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many failed login attempts. Please try again later or reset your password');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address format');
      } else {
        setError(err.message || 'Failed to sign in');
      }
      setIsLoading(false);
    }
  };
  
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      console.log('Attempting to login with Google');
      
      // Store current anonymous credits before login
      const currentCredits = localStorage.getItem('visiora_anonymous_credits');
      if (currentCredits !== null) {
        // Save them with a different key so they're not affected by login
        localStorage.setItem('visiora_previous_credits', currentCredits);
        console.log('Stored anonymous credits before login:', currentCredits);
      }
      
      const result = await loginWithGoogle();
      
      console.log('Google login successful, validating Firebase access...');
      
      // Validate we have proper Firestore access after login
      setTimeout(async () => {
        try {
          // Validate Firebase access to ensure we can create nested collections
          const validationResult = await validateFirebaseAccess();
          console.log('Firebase validation result:', validationResult);
          
          if (!validationResult.success) {
            console.error('Firebase access validation failed:', validationResult.error);
            setError('Error setting up your account. Please try again.');
            setIsLoading(false);
            return;
          }
          
          if (onSuccess) onSuccess();
        } catch (validationErr) {
          console.error('Error during Firebase validation:', validationErr);
        } finally {
          setIsLoading(false);
        }
      }, 1500); // Give more time for Firebase operations to complete
    } catch (err) {
      console.error("Google login error:", err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in cancelled. Please try again.');
      } else {
        setError(err.message || 'Failed to sign in with Google');
      }
      setIsLoading(false);
    }
  };
  
  return (
    <div className="w-full max-w-md p-6 bg-white dark:bg-slate-900 rounded-xl shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-center text-slate-900 dark:text-white">Sign In</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Password
              </label>
              <button 
                type="button"
                onClick={() => alert('Password reset functionality to be implemented')}
                className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300"
              >
                Forgot password?
              </button>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          
          <Button
            type="submit"
            className="w-full flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                <span>Setting up your account...</span>
              </>
            ) : 'Sign in'}
          </Button>
        </div>
      </form>
      
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-300 dark:border-slate-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400">
              Or continue with
            </span>
          </div>
        </div>
        
        <div className="mt-4">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex justify-center items-center gap-3 py-2 px-4 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors relative"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mr-2"></div>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.79 15.71 17.57V20.34H19.28C21.36 18.42 22.56 15.58 22.56 12.25Z" fill="#4285F4"/>
                <path d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.71 17.57C14.74 18.21 13.48 18.59 12 18.59C9.16 18.59 6.76 16.64 5.86 14H2.19V16.84C3.99 20.43 7.7 23 12 23Z" fill="#34A853"/>
                <path d="M5.86 14C5.63 13.34 5.5 12.63 5.5 11.9C5.5 11.17 5.63 10.47 5.86 9.8V6.96H2.19C1.43 8.7 1 10.6 1 12.6C1 14.6 1.43 16.5 2.19 18.24L5.86 14Z" fill="#FBBC05"/>
                <path d="M12 5.21C13.67 5.21 15.16 5.81 16.33 6.92L19.45 3.8C17.46 1.95 14.97 0.85 12 0.85C7.7 0.85 3.99 3.42 2.19 7.01L5.86 9.85C6.76 7.21 9.16 5.21 12 5.21Z" fill="#EA4335"/>
              </svg>
            )}
            <span>{isLoading ? 'Signing in...' : 'Continue with Google'}</span>
          </button>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onRegisterClick}
            className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
