import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  increment,
  serverTimestamp 
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

export const ANONYMOUS_CREDITS = 10;     // Credits for non-logged in users
export const LOGIN_BONUS_CREDITS = 10;   // Bonus credits when logging in
export const DAILY_CREDITS = 5;          // Daily credits for returning users

// Get or initialize credits for anonymous user from localStorage
export const getAnonymousCredits = () => {
  const storedCredits = localStorage.getItem('visiora_anonymous_credits');
  
  if (storedCredits === null) {
    // First time user, initialize with ANONYMOUS_CREDITS
    localStorage.setItem('visiora_anonymous_credits', ANONYMOUS_CREDITS.toString());
    return ANONYMOUS_CREDITS;
  }
  
  // Ensure we're returning a valid number
  const parsedCredits = parseInt(storedCredits, 10);
  return isNaN(parsedCredits) ? ANONYMOUS_CREDITS : parsedCredits;
};

// Decrease anonymous credits by 1
export const decreaseAnonymousCredits = () => {
  try {
    // Force get from localStorage directly
    let storedCredits = localStorage.getItem('visiora_anonymous_credits');
    
    // If null or not a number, reset to default
    if (storedCredits === null || isNaN(parseInt(storedCredits, 10))) {
      localStorage.setItem('visiora_anonymous_credits', ANONYMOUS_CREDITS.toString());
      storedCredits = ANONYMOUS_CREDITS.toString();
    }
    
    const currentCredits = parseInt(storedCredits, 10);
    console.log('Anonymous credits before decrease (direct):', currentCredits);
    
    if (currentCredits <= 0) {
      console.log('No anonymous credits left');
      localStorage.setItem('visiora_anonymous_credits', '0');
      return 0; // No credits left
    }
    
    const newCredits = currentCredits - 1;
    console.log('Anonymous credits after decrease:', newCredits);
    
    // Set the new value
    localStorage.setItem('visiora_anonymous_credits', newCredits.toString());
    
    // Verify the credits were actually saved
    const verifiedCredits = parseInt(localStorage.getItem('visiora_anonymous_credits'), 10);
    console.log('Verified anonymous credits after saving:', verifiedCredits);
    
    return verifiedCredits;
  } catch (error) {
    console.error('Error decreasing anonymous credits:', error);
    return 0;
  }
};

// Get credits for authenticated user from Firestore
export const getUserCredits = async (userId) => {
  if (!userId) {
    return getAnonymousCredits();
  }
  
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    console.log('Fetching credits for user:', userId);
    console.log('User document exists:', userDoc.exists());
    
    if (!userDoc.exists() || userDoc.data().credits === undefined) {
      console.log('User credits not found, initializing with bonus credits');
      
      // Initialize credits for new user
      const userData = {
        credits: LOGIN_BONUS_CREDITS,
        lastCreditRefresh: serverTimestamp(),
        lastLogin: serverTimestamp()
      };
      
      // If user doesn't exist at all, add more required fields
      if (!userDoc.exists()) {
        userData.email = auth.currentUser?.email || 'unknown@user.com';
        userData.name = auth.currentUser?.displayName || 'User'; // Use "name" to match Firestore schema
        userData.createdAt = serverTimestamp();
      }
      
      // Use setDoc with merge to ensure we don't overwrite existing data
      await setDoc(userRef, userData, { merge: true });
      
      console.log('Credits initialized for user:', LOGIN_BONUS_CREDITS);
      return LOGIN_BONUS_CREDITS;
    }
    
    // Check if daily credits should be added
    const userData = userDoc.data();
    const credits = userData.credits || 0;
    const lastRefresh = userData.lastCreditRefresh?.toDate() || new Date(0);
    const now = new Date();
    const isNewDay = lastRefresh.getDate() !== now.getDate() || 
                     lastRefresh.getMonth() !== now.getMonth() || 
                     lastRefresh.getFullYear() !== now.getFullYear();
    
    if (isNewDay) {
      // Check if this is a manually assigned high value that we should preserve
      const isManuallyAssignedHighValue = credits > 50; // Assume values above 50 are manually set
      
      // Add daily credits, but preserve manually assigned high values
      let updatedCredits;
      if (isManuallyAssignedHighValue) {
        console.log('Preserving manually assigned high credit value:', credits);
        updatedCredits = credits; // Don't add daily credits, preserve high value
      } else {
        updatedCredits = credits + DAILY_CREDITS;
      }
      
      await updateDoc(userRef, {
        credits: updatedCredits,  // Set explicit value instead of using increment
        lastCreditRefresh: serverTimestamp()
      });
      
      return updatedCredits;
    }
    
    // Return current credits, ensuring it's a number
    return typeof credits === 'number' ? credits : 0;
  } catch (error) {
    console.error("Error fetching user credits:", error);
    return 0;
  }
};

// Decrease user credits by 1 when generating an image
export const useCredit = async (userId) => {
  if (!userId) {
    return decreaseAnonymousCredits();
  }
  
  try {
    console.log('Using credit for user:', userId);
    const userRef = doc(db, 'users', userId);
    let userDoc;
    
    try {
      userDoc = await getDoc(userRef);
    } catch (fetchError) {
      console.error('Error fetching user document:', fetchError);
      // Retry once
      await new Promise(resolve => setTimeout(resolve, 800));
      userDoc = await getDoc(userRef);
    }
    
    if (!userDoc.exists()) {
      console.error('User document not found when spending credit');
      
      // Try to create user document as last resort
      const currentUser = auth.currentUser;
      if (currentUser && currentUser.uid === userId) {
        console.log('Attempting to create missing user during credit spend');
        await setDoc(userRef, {
          email: currentUser.email || 'unknown@user.com',
          name: currentUser.displayName || 'User', // Use "name" to match Firestore schema
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          credits: 9, // Start with 9 since we're using 1 now
          lastCreditRefresh: serverTimestamp()
        });
        return 9;
      }
      
      return false; // User doesn't exist and couldn't create
    }
    
    const userData = userDoc.data();
    const currentCredits = userData.credits || 0;
    console.log('Current credits in database:', currentCredits);
    
    if (currentCredits <= 0) {
      console.log('User has no credits left:', currentCredits);
      return 0; // No credits left
    }
    
    // Calculate new credits
    const newCredits = currentCredits - 1;
    
    // Explicitly set new value instead of using increment to avoid race conditions
    try {
      await updateDoc(userRef, {
        credits: newCredits
      });
    } catch (updateError) {
      console.error('Error updating credits:', updateError);
      // Retry with merge option
      await setDoc(userRef, { credits: newCredits }, { merge: true });
    }
    
    // Verify the update was successful
    try {
      const verifyDoc = await getDoc(userRef);
      const verifiedCredits = verifyDoc.data().credits;
      console.log('Verified credits after update:', verifiedCredits);
      
      if (verifiedCredits !== newCredits) {
        console.warn('Credit update verification failed, expected:', newCredits, 'got:', verifiedCredits);
      }
      
      return verifiedCredits;
    } catch (verifyError) {
      console.error('Error verifying credit update:', verifyError);
      return newCredits; // Return what should have been set
    }
  } catch (error) {
    console.error("Error using credit:", error);
    return false;
  }
};

// Ensure credits are properly initialized when user logs in
export const initializeCreditsOnLogin = async (userId) => {
  if (!userId) return;
  
  try {
    console.log('Initializing credits for user:', userId);
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    const anonymousCredits = getAnonymousCredits();
    console.log('Anonymous credits before login:', anonymousCredits);
    
    if (!userDoc.exists()) {
      console.log('User document not found in Firestore, creating new user with credits');
      // New user login - grant login bonus credits
      await setDoc(userRef, {
        credits: LOGIN_BONUS_CREDITS,
        lastCreditRefresh: serverTimestamp(),
        lastLogin: serverTimestamp(),
        createdAt: serverTimestamp()
      }, { merge: true });
      
      // Store anonymous credits for later instead of removing them
      // This way they'll be available when the user logs out
      
      console.log('New user initialized with credits:', LOGIN_BONUS_CREDITS);
      return LOGIN_BONUS_CREDITS;
    } else {
      console.log('Existing user found, updating credits');
      const userData = userDoc.data();
      let updatedCredits = userData.credits || 0;
      const lastLogin = userData.lastLogin?.toDate() || new Date(0);
      const now = new Date();
      
      // Store original credits for logging
      const originalCredits = updatedCredits;
      
      // Check if this is first login of the day (for daily credits)
      const isNewDay = lastLogin.getDate() !== now.getDate() || 
                       lastLogin.getMonth() !== now.getMonth() || 
                       lastLogin.getFullYear() !== now.getFullYear();
      
      if (isNewDay) {
        updatedCredits += DAILY_CREDITS;
        console.log(`Daily credits (${DAILY_CREDITS}) added, new total:`, updatedCredits);
      }
      
      // Make sure the user has a minimum of credits
      if (updatedCredits < 0) {
        updatedCredits = 0;
      }
      
      // Don't update credits if the current value is significantly higher than what we calculated
      // This preserves manually assigned high credit values
      // Consider any value over 50 to be manually assigned, or if original is more than double what we calculated
      if (originalCredits > 50 || originalCredits > updatedCredits * 2) {
        console.log(`Detected manually assigned credits (${originalCredits}), preserving this value`);
        updatedCredits = originalCredits;
      }
      
      // Update user document
      await updateDoc(userRef, {
        lastLogin: serverTimestamp(),
        credits: updatedCredits,
        ...(isNewDay && { lastCreditRefresh: serverTimestamp() })
      });
      
      // Store anonymous credits for later instead of removing them
      // This way they'll be available when the user logs out
      
      console.log('User credits after initialization:', updatedCredits);
      return updatedCredits;
    }
  } catch (error) {
    console.error("Error initializing credits on login:", error);
    return false;
  }
};
