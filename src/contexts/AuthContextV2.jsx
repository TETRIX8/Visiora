import React, { createContext, useContext, useEffect, useState } from 'react';
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
        localStorage.setItem('visiora_anonymous_credits', ANONYMOUS_CREDITS.toString());
      }
      const anonymousCredits = getAnonymousCredits();
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
          setIsLoadingCredits(true);
          // Add retry mechanism for profile creation
          let userProfile = null;
          let retryCount = 0;
          const maxRetries = 3;
          while (retryCount < maxRetries && !userProfile) {
            try {
              // First ensure user exists in Firestore and create/update profile
              userProfile = await createUserProfile(auth.user);
            } catch (profileError) {
              retryCount++;
              if (retryCount < maxRetries) {
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
          } else {
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
            }
          }
        } catch (error) {
          if (import.meta.env.DEV) {
            console.error("Error during user login process:", error);
          }
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
      return credits; // Return current credits without refreshing
    }
    setLastRefreshTime(currentTime);
    setIsLoadingCredits(true);
    try {
      // For anonymous users, use localStorage directly
      if (!auth.user) {
        const anonymousCredits = getAnonymousCredits();
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
      setCredits(updatedCredits);
      return updatedCredits;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Error refreshing credits:", error);
      }
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
        try {
          currentCredits = await getUserCredits(auth.user.uid);
        } catch (refreshError) {
          if (import.meta.env.DEV) {
            console.error('Error refreshing credits before spending:', refreshError);
          }
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
      if (import.meta.env.DEV) {
        console.log('Current credits before spending (refreshed):', currentCredits);
      }
      if (currentCredits.total <= 0) {
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
      const remainingCredits = await useCredit(auth.user?.uid);
      if (import.meta.env.DEV) {
        console.log('Credits after spending (from database):', remainingCredits);
      }
      if (remainingCredits) {
        // In case the database value is different, sync it
        setCredits(remainingCredits);
        return true;
      }
      if (remainingCredits === false) {
        if (import.meta.env.DEV) {
          console.error('Credit spending failed - database operation error');
        }
        // Rollback optimistic update
        setCredits(currentCredits);
        return false;
      }
      return false;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Error spending credit:", error);
      }
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
      if (import.meta.env.DEV) {
        console.error("Error adding paid credits:", error);
      }
      return false;
    }
  };
  // Normalize credits to ensure backwards compatibility
  const normalizedCredits = React.useMemo(() => {
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
