import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  collection,
  addDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

/**
 * Create or update a user profile when they sign up
 * This ensures we have a document with UID as the document ID in the users collection
 * This function also sets up the nested collection structure for GeneratedImages
 */
export const createUserProfile = async (user, additionalData = {}) => {
  if (!user) return;
  
  try {

    
    const userRef = doc(db, 'users', user.uid);
    const snapshot = await getDoc(userRef);
    
    // If the user document doesn't exist, create it
    if (!snapshot.exists()) {

      
      const { email, displayName, photoURL } = user;
      const username = displayName || additionalData.displayName || (email ? email.split('@')[0] : 'User');
      
      // Always set credits to LOGIN_BONUS_CREDITS (10) for new users
      const newUserData = {
        email: email || 'anonymous@user.com',
        name: username,  // Use "name" field to match your existing Firestore schema
        photoURL: photoURL || null,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        lastCreditRefresh: serverTimestamp(),
        credits: 10, // Initial credits for new users
        preferences: {
          defaultModel: 'flux',
          defaultShape: 'landscape',
          notifications: true
        },
        ...additionalData
      };
      
      // Force write to ensure user is created with UID as document ID
      try {
        // Use setDoc with explicit document reference to ensure we use UID as the document ID
        await setDoc(doc(db, 'users', user.uid), newUserData);

      } catch (writeError) {
        console.error('Initial write attempt failed:', writeError);
        console.error('Error details:', writeError.code, writeError.message);
        
        // Wait and try again
        await new Promise(resolve => setTimeout(resolve, 800));
        await setDoc(doc(db, 'users', user.uid), newUserData);

      }
      
      // Verify the user was actually created
      let verifySnapshot;
      try {
        // Wait a bit before verifying to ensure database consistency
        await new Promise(resolve => setTimeout(resolve, 500));
        verifySnapshot = await getDoc(userRef);
      } catch (verifyError) {
        console.error('Error verifying user creation:', verifyError);
        // One more try after delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        verifySnapshot = await getDoc(userRef);
      }
      
      if (verifySnapshot && verifySnapshot.exists()) {

        

      } else {
        console.error('Failed to verify user creation - unexpected database behavior');
        // One last desperate attempt
        await setDoc(userRef, newUserData, { merge: true });
      }
      
      return { id: user.uid, ...newUserData };
    } else {
      // User exists, update the lastLogin and ensure we have credits field
      const userData = snapshot.data();
      
      // Update with minimal fields to avoid overwriting existing data
      const updates = {
        lastLogin: serverTimestamp()
      };
      
      // Ensure credits field exists
      if (userData.credits === undefined) {
        updates.credits = 10;
        updates.lastCreditRefresh = serverTimestamp();
      }
      
      await updateDoc(userRef, updates);

      
      return { id: user.uid, ...userData, ...updates };
    }
  } catch (error) {
    console.error('Error creating/updating user profile', error);
    console.error('Error details:', error.code, error.message);
    
    // Try one more time with a timeout if it fails
    try {

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create basic user profile with minimum required fields
      const userRef = doc(db, 'users', user.uid);
      const basicUserData = {
        email: user.email || 'anonymous@user.com',
        name: user.displayName || 'User', // Use "name" field to match your existing Firestore schema
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        credits: 10
      };
      

      await setDoc(userRef, basicUserData, { merge: true });
      
      // Verify the document was created
      const verifySnapshot = await getDoc(userRef);

      
      if (verifySnapshot.exists()) {

        

        
        return getUserProfile(user.uid);
      } else {
        throw new Error('Failed to verify document creation after retry');
      }
    } catch (retryError) {
      console.error('Retry also failed:', retryError);
      console.error('Retry error details:', retryError.code, retryError.message);
      throw error;
    }
  }
};

// Get a user profile by ID
export const getUserProfile = async (userId) => {
  if (!userId) return null;
  
  try {
    const userRef = doc(db, 'users', userId);
    const snapshot = await getDoc(userRef);
    
    if (snapshot.exists()) {

      return { id: userId, ...snapshot.data() };
    } else {

      
      // If current user is authenticated but profile not found, create it
      const currentUser = auth.currentUser;
      if (currentUser && currentUser.uid === userId) {

        return createUserProfile(currentUser);
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user profile', error);
    throw error;
  }
};

// Get the current user's profile
export const getCurrentUserProfile = async () => {
  const currentUser = auth.currentUser;
  if (!currentUser) return null;
  
  return getUserProfile(currentUser.uid);
};

// Update a user profile
export const updateUserProfile = async (userId, data) => {
  if (!userId) return false;
  
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error updating user profile', error);
    throw error;
  }
};

// Update the current user's profile
export const updateCurrentUserProfile = async (data) => {
  const currentUser = auth.currentUser;
  if (!currentUser) return false;
  
  return updateUserProfile(currentUser.uid, data);
};


