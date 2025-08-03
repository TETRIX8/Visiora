import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { createUserProfile } from '../api/userServiceV2';
import { 
  getUserCredits, 
  initializeCreditsOnLogin,
  getAnonymousCredits,
  useCredit,
  addPaidCredits,
  ANONYMOUS_CREDITS
} from '../api/creditsServiceV2';

// Create auth context
const AuthContext = createContext();

// Auth provider component
export function AuthProvider({ children }) {
  const auth = useAuth();
  const [credits, setCredits] = useState({
    freeCredits: 0,
    paidCredits: 0,
    total: 0
  });
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
      setCredits({
        freeCredits: anonymousCredits,
        paidCredits: 0,
        total: anonymousCredits
      });
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
          
          if (updatedCredits) {
            setCredits(updatedCredits);
            console.log('User credits initialized:', updatedCredits);
          } else {
            console.error('Failed to get credits value:', updatedCredits);
            // Fallback to profile credits if available
            if (userProfile && userProfile.credits) {
              if (typeof userProfile.credits === 'number') {
                // Handle old format
                setCredits({
                  freeCredits: 0,
                  paidCredits: userProfile.credits,
                  total: userProfile.credits
                });
              } else {
                // Handle new format
                setCredits({
                  freeCredits: userProfile.credits.free || 0,
                  paidCredits: userProfile.credits.paid || 0,
                  total: (userProfile.credits.free || 0) + (userProfile.credits.paid || 0)
                });
              }
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
  
  // Debounce mechanism for credit refreshes
  const [lastRefreshTime, setLastRefreshTime] = useState(0);
  const REFRESH_COOLDOWN = 5000; // 5 seconds between refreshes
  
  // Function to refresh credits with debounce
  const refreshCredits = async () => {
    const currentTime = Date.now();
    
    // Only allow refreshes every REFRESH_COOLDOWN milliseconds
    if (currentTime - lastRefreshTime < REFRESH_COOLDOWN) {
      console.log('Credits refresh on cooldown, skipping');
      return credits; // Return current credits without refreshing
    }
    
    console.log('Credits refresh cooldown passed, refreshing');
    setLastRefreshTime(currentTime);
    setIsLoadingCredits(true);
    
    try {
      // For anonymous users, use localStorage directly
      if (!auth.user) {
        const anonymousCredits = getAnonymousCredits();
        console.log('Refreshed anonymous credits:', anonymousCredits);
        const anonymousCreditsObj = {
          freeCredits: anonymousCredits,
          paidCredits: 0,
          total: anonymousCredits
        };
        setCredits(anonymousCreditsObj);
        return anonymousCreditsObj;
      }
      
      // For logged-in users, get from Firestore
      const updatedCredits = await getUserCredits(auth.user?.uid);
      console.log('Refreshed user credits:', updatedCredits);
      
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
        const anonymousCredits = getAnonymousCredits();
        currentCredits = {
          freeCredits: anonymousCredits,
          paidCredits: 0,
          total: anonymousCredits
        };
      }
      
      console.log('Current credits before spending (refreshed):', currentCredits);
      
      if (currentCredits.total <= 0) {
        console.log('Not enough credits to spend');
        setCredits({
          freeCredits: 0,
          paidCredits: 0,
          total: 0
        });
        return false;
      }
      
      // Optimistically update credits locally (use free credits first, then paid)
      const newCredits = { ...currentCredits };
      
      if (newCredits.freeCredits > 0) {
        newCredits.freeCredits -= 1;
      } else {
        newCredits.paidCredits -= 1;
      }
      newCredits.total = newCredits.freeCredits + newCredits.paidCredits;
      
      setCredits(newCredits);
      
      // Then update in database
      console.log('Updating credits in database for user:', auth.user?.uid);
      const remainingCredits = await useCredit(auth.user?.uid);
      console.log('Credits after spending (from database):', remainingCredits);
      
      if (remainingCredits) {
        // In case the database value is different, sync it
        setCredits(remainingCredits);
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
  
  // Function to add paid credits
  const addCredits = async (amount) => {
    if (!auth.user) return false;
    
    try {
      const result = await addPaidCredits(auth.user.uid, amount);
      if (result) {
        setCredits(result);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error adding paid credits:", error);
      return false;
    }
  };
  
  // Normalize credits to ensure backwards compatibility
  const normalizedCredits = React.useMemo(() => {
    console.log('Normalizing credits in AuthContext:', credits);
    
    // If credits is already an object with free/paid properties
    if (typeof credits === 'object' && credits !== null) {
      // Make sure we have all properties in consistent format
      const result = {
        free: credits.free || credits.freeCredits || 0,
        paid: credits.paid || credits.paidCredits || 0,
        total: credits.total || (credits.free || credits.freeCredits || 0) + (credits.paid || credits.paidCredits || 0),
        // Keep original properties too
        ...credits
      };
      
      // Add toString method to handle direct rendering
      result.toString = function() { return String(this.total); };
      console.log('Normalized credits object:', result);
      return result;
    }
    
    // If credits is a number (old format), convert to object
    if (typeof credits === 'number') {
      const result = {
        free: credits,
        paid: 0,
        total: credits
      };
      
      // Add toString method for backwards compatibility
      result.toString = function() { return String(this.total); };
      console.log('Converted number credits to object:', result);
      return result;
    }
    
    // Default empty state
    const defaultResult = {
      free: 0,
      paid: 0,
      total: 0
    };
    
    // Add toString method
    defaultResult.toString = function() { return '0'; };
    console.log('Using default credits object:', defaultResult);
    return defaultResult;
  }, [credits]);

  return (
    <AuthContext.Provider value={{
      ...auth,
      credits: normalizedCredits,
      isLoadingCredits,
      refreshCredits,
      spendCredit,
      addCredits
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuthContext() {
  return useContext(AuthContext);
}
