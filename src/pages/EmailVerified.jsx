import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContextV2';
import { motion } from 'framer-motion';

export default function EmailVerified() {
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('Verifying your email...');
  const navigate = useNavigate();
  const { user, refreshUser } = useAuthContext();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Refresh the user to get updated emailVerified status
        if (refreshUser) {
          await refreshUser();
        }

        // Check if user is logged in and email is verified
        if (user && user.emailVerified) {
          setStatus('success');
          setMessage('Email verified successfully! You can now use your account.');
          
          // Redirect to dashboard after 3 seconds
          setTimeout(() => {
            navigate('/dashboard');
          }, 3000);
        } else if (user && !user.emailVerified) {
          setStatus('error');
          setMessage('Email not yet verified. Please check your email and click the verification link.');
        } else {
          setStatus('error');
          setMessage('No user found. Please sign up or log in first.');
        }
      } catch (error) {
        console.error('Error verifying email:', error);
        setStatus('error');
        setMessage('Error verifying email. Please try again.');
      }
    };

    // Wait a moment for auth state to settle
    const timer = setTimeout(verifyEmail, 1000);
    return () => clearTimeout(timer);
  }, [user, refreshUser, navigate]);

  const handleGoToLogin = () => {
    navigate('/login');
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-slate-800 rounded-2xl p-8 w-full max-w-md shadow-2xl text-center"
      >
        {status === 'verifying' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-6"></div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
              Verifying Email
            </h1>
            <p className="text-slate-600 dark:text-slate-300">
              {message}
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-green-500 mb-6">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
              Email Verified!
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              {message}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Redirecting to dashboard in 3 seconds...
            </p>
            <button
              onClick={handleGoToDashboard}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold shadow-lg transition-all hover:scale-105"
            >
              Go to Dashboard Now
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-red-500 mb-6">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
              Verification Issue
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              {message}
            </p>
            <div className="space-y-3">
              <button
                onClick={handleGoToLogin}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold shadow-lg transition-all hover:scale-105"
              >
                Go to Login
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full py-3 rounded-xl border-2 border-purple-600 text-purple-600 font-bold transition-all hover:bg-purple-50 dark:hover:bg-purple-900/20"
              >
                Try Again
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
