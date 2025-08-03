import { useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '../lib/firebase';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (newUser) => {
      setUser(prevUser => {
        // Only update if user actually changed
        if (!prevUser || !newUser || prevUser.uid !== newUser.uid) {
          return newUser;
        }
        return prevUser;
      });
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Sign up with email/password
  const signup = async (email, password) => {
    setError(null);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Send email verification (DISABLED, using OTP modal instead)
      // if (result.user) {
      //   await sendEmailVerificationToUser(result.user);
      // }
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };
  

  // Sign in with email/password
  const login = async (email, password) => {
    setError(null);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // Check if email is verified (DISABLED, using OTP modal instead)
      // if (result.user && !result.user.emailVerified) {
      //   console.warn('Email not verified for user:', result.user.email);
      //   // Re-send verification email if needed
      //   await sendEmailVerificationToUser(result.user);
      //   throw new Error('Please verify your email address. A new verification email has been sent.');
      // }
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Sign in with Google
  const loginWithGoogle = async () => {
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      // Add scopes to get more user info from Google
      provider.addScope('profile');
      provider.addScope('email');
      
      console.log('Starting Google sign-in process');
      const result = await signInWithPopup(auth, provider);
      console.log('Google sign-in successful, user:', result.user.uid);
      return result;
    } catch (err) {
      console.error('Google sign-in error:', err);
      setError(err.message);
      throw err;
    }
  };

  // Sign out
  const logout = async () => {
    try {
      // Check for previously stored credits
      const previousCredits = localStorage.getItem('visiora_previous_credits');
      
      await signOut(auth);
      
      // Restore previous anonymous credits if they existed
      if (previousCredits !== null) {
        localStorage.setItem('visiora_anonymous_credits', previousCredits);
        console.log('Restored previous anonymous credits:', previousCredits);
      } else {
        // If no previous credits found, initialize with default
        localStorage.setItem('visiora_anonymous_credits', '10');
        console.log('No previous credits found, initializing with default');
      }
      
      // Clean up the previous credits storage
      localStorage.removeItem('visiora_previous_credits');
    } catch (error) {
      console.error('Error during logout:', error);
    }
    
    return;
  };

  // Reset password
  const resetPassword = async (email) => {
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    user,
    loading,
    error,
    signup,
    login,
    loginWithGoogle,
    logout,
    resetPassword
  };
}
