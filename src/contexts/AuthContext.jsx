import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { createUserProfile } from '../api/userService';
import { 
  getUserCredits, 
  initializeCreditsOnLogin,
  getAnonymousCredits,
  useCredit,
  ANONYMOUS_CREDITS
} from '../api/creditsService';

// Create auth context
const AuthContext = createContext();

// Auth provider component
export function AuthProvider({ children }) {
  const auth = useAuth();
  const [credits, setCredits] = useState(0);
  const [isLoadingCredits, setIsLoadingCredits] = useState(true);
  
  // Handle anonymous credits when user is not logged in
  useEffect(() => {
    if (!auth.user && !auth.loading) {
      // ONLY initialize if credits don't exist yet, don't reset on every page refresh
      if (localStorage.getItem('visiora_anonymous_credits') === null) {
        console.log('First time anonymous user - initializing credits');
        localStorage.setItem('visiora_anonymous_credits', ANONYMOUS_CREDITS.toString());
      }
      const anonymousCredits = getAnonymousCredits();
      console.log('Anonymous credits loaded:', anonymousCredits);
      setCredits(anonymousCredits);
      setIsLoadingCredits(false);
    }
  }, [auth.user, auth.loading]);
  
  // Create user profile and handle credits when auth state changes
  useEffect(() => {
    const handleUserLogin = async () => {
      if (auth.user) {
        try {
          console.log('User logged in:', auth.user.email);
          setIsLoadingCredits(true);
          
          // IMPORTANT: Add more logging to debug user profile creation
          console.log('Auth user object:', {
            uid: auth.user.uid,
            email: auth.user.email,
            displayName: auth.user.displayName,
            isAnonymous: auth.user.isAnonymous
          });
          
          // Add retry mechanism for profile creation
          let userProfile = null;
          let retryCount = 0;
          const maxRetries = 3;
          
          while (retryCount < maxRetries && !userProfile) {
            try {
              // IMPORTANT: First ensure user exists in Firestore and create/update profile
              // This needs to happen BEFORE we access credits
              userProfile = await createUserProfile(auth.user);
              console.log('User profile retrieved/created:', userProfile);
            } catch (profileError) {
              console.error(`Attempt ${retryCount + 1} failed:`, profileError);
              retryCount++;
              
              if (retryCount < maxRetries) {
                console.log(`Retrying in 1 second... (Attempt ${retryCount + 1}/${maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, 1000));
              }
            }
          }
          
          if (!userProfile) {
            throw new Error(`Failed to create user profile after ${maxRetries} attempts`);
          }
          
          // Force a small delay to ensure Firestore operations complete
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Initialize credits for logged in user
          const updatedCredits = await initializeCreditsOnLogin(auth.user.uid);
          
          if (typeof updatedCredits === 'number') {
            setCredits(updatedCredits);
            console.log('User credits initialized:', updatedCredits);
          } else {
            console.error('Failed to get credits value:', updatedCredits);
            // Fallback to profile credits if available
            if (userProfile && typeof userProfile.credits === 'number') {
              setCredits(userProfile.credits);
              console.log('Using profile credits as fallback:', userProfile.credits);
            }
          }
        } catch (error) {
          console.error("Error during user login process:", error);
        } finally {
          setIsLoadingCredits(false);
        }
      }
    };
    
    handleUserLogin();
  }, [auth.user]);
  
  // Function to refresh credits
  const refreshCredits = async () => {
    setIsLoadingCredits(true);
    try {
      // Wait a short time to avoid immediate UI updates
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // For anonymous users, use localStorage directly
      if (!auth.user) {
        const anonymousCredits = getAnonymousCredits();
        console.log('Refreshed anonymous credits:', anonymousCredits);
        setCredits(anonymousCredits);
        return anonymousCredits;
      }
      
      // Get current credits first so we can compare
      const currentCreditsInState = credits;
      
      // For logged-in users, get from Firestore
      const updatedCredits = await getUserCredits(auth.user?.uid);
      console.log('Refreshed user credits:', updatedCredits);
      
      // Preserve manually assigned high credit values
      if (currentCreditsInState > updatedCredits + 20) {
        console.log('Preserving manually assigned high credit value:', currentCreditsInState);
        return currentCreditsInState; // Don't update state, preserve high value
      }
      
      setCredits(updatedCredits);
      return updatedCredits;
    } catch (error) {
      console.error("Error refreshing credits:", error);
      return credits; // Return current credits on error
    } finally {
      setIsLoadingCredits(false);
    }
  };
  
  // Function to use a credit
  const spendCredit = async () => {
    try {
      // Force refresh credits from database instead of using local value
      // This ensures we have the latest value before spending
      let currentCredits;
      if (auth.user) {
        console.log('Refreshing credits from Firestore before spending');
        try {
          currentCredits = await getUserCredits(auth.user.uid);
        } catch (refreshError) {
          console.error('Error refreshing credits before spending:', refreshError);
          // Use local credits as fallback
          currentCredits = credits;
        }
      } else {
        currentCredits = getAnonymousCredits();
      }
      
      console.log('Current credits before spending (refreshed):', currentCredits);
      
      if (currentCredits <= 0) {
        console.log('Not enough credits to spend');
        setCredits(0); // Force update UI to show correct state
        return false;
      }
      
      // Optimistically update credits locally
      const newCredits = currentCredits - 1;
      setCredits(newCredits);
      
      // Then update in database
      console.log('Updating credits in database for user:', auth.user?.uid);
      const remainingCredits = await useCredit(auth.user?.uid);
      console.log('Credits after spending (from database):', remainingCredits);
      
      if (typeof remainingCredits === 'number' && remainingCredits >= 0) {
        // In case the database value is different, sync it
        if (remainingCredits !== newCredits) {
          console.log('Syncing local credits with database value:', remainingCredits);
          setCredits(remainingCredits);
        }
        return true;
      }
      
      if (remainingCredits === false) {
        console.error('Credit spending failed - database operation error');
        // Rollback optimistic update
        setCredits(currentCredits);
        return false;
      }
      
      console.log('Credit spending result:', remainingCredits);
      return false;
    } catch (error) {
      console.error("Error spending credit:", error);
      // Try to refresh credits to recover
      refreshCredits();
      return false;
    }
  };
  
  return (
    <AuthContext.Provider value={{
      ...auth,
      credits,
      isLoadingCredits,
      refreshCredits,
      spendCredit
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuthContext() {
  return useContext(AuthContext);
}
