// Helper functions to validate user structure from browser console

/**
 * Validate user structure for the currently authenticated user
 * Use this in the browser console after signing in to check if the user document exists
 * and has the correct structure with nested collections
 * 
 * Usage:
 * 1. Sign in to the application
 * 2. Open browser console
 * 3. Run: validateCurrentUserStructure()
 */

import { 
  doc, 
  getDoc, 
  collection, 
  getDocs,
  query,
  limit
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

// Export for use in browser console
window.validateCurrentUserStructure = async () => {
  try {
    // Get current user
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.error('❌ No user is signed in. Please sign in first.');
      return false;
    }
    
    console.log(`Validating structure for user: ${currentUser.uid} (${currentUser.email})`);
    
    // Check user document
    const userRef = doc(db, 'users', currentUser.uid);
    const userSnapshot = await getDoc(userRef);
    
    if (!userSnapshot.exists()) {
      console.error(`❌ User document doesn't exist: users/${currentUser.uid}`);
      console.log('Creating user document...');
      
      // Try to create user document
      await window.createUserDocument();
      return false;
    }
    
    console.log(`✅ User document exists: users/${currentUser.uid}`);
    console.log('User data:', userSnapshot.data());
    
    // Check GeneratedImages collection
    const imagesCollectionRef = collection(db, 'users', currentUser.uid, 'GeneratedImages');
    const imagesQuery = query(imagesCollectionRef, limit(5));
    const imagesSnapshot = await getDocs(imagesQuery);
    
    console.log(`Found ${imagesSnapshot.docs.length} container documents in GeneratedImages collection`);
    
    // Check containers and nested collections
    for (const containerDoc of imagesSnapshot.docs) {
      const containerId = containerDoc.id;
      console.log(`Container: ${containerId}`);
      console.log('Container data:', containerDoc.data());
      
      // Check for img collections (img1, img2, etc.)
      const imgCollections = ['img1', 'img2', 'img3'];
      
      for (const imgCollection of imgCollections) {
        try {
          const imgCollectionRef = collection(db, 'users', currentUser.uid, 'GeneratedImages', containerId, imgCollection);
          const imgQuery = query(imgCollectionRef, limit(1));
          const imgSnapshot = await getDocs(imgQuery);
          
          if (imgSnapshot.docs.length > 0) {
            console.log(`✅ ${imgCollection} collection exists with ${imgSnapshot.docs.length} documents`);
            console.log(`First image:`, imgSnapshot.docs[0].data());
          } else {
            console.log(`⚠️ ${imgCollection} collection exists but is empty`);
          }
        } catch (error) {
          console.log(`⚠️ ${imgCollection} collection not found or error:`, error.message);
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error validating user structure:', error);
    return false;
  }
};

// Create user document helper
window.createUserDocument = async () => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.error('❌ No user is signed in');
      return false;
    }
    
    // Import createUserProfile function
    const userService = await import('./userService');
    
    console.log('Creating user profile...');
    const result = await userService.createUserProfile(currentUser);
    
    console.log('User profile created:', result);
    return true;
  } catch (error) {
    console.error('Error creating user profile:', error);
    return false;
  }
};

// Helper to fix auth issues
window.fixAuthIssues = async () => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.error('❌ No user is signed in');
      return false;
    }
    
    // Import validateFirebaseAccess function
    const { validateFirebaseAccess } = await import('./firebaseValidator');
    
    console.log('Running Firebase validation...');
    const result = await validateFirebaseAccess();
    
    console.log('Validation result:', result);
    
    if (result.success) {
      // Now create user profile to ensure it exists
      return window.createUserDocument();
    }
    
    return false;
  } catch (error) {
    console.error('Error fixing auth issues:', error);
    return false;
  }
};

// Initialize the validators
(function initConsoleHelpers() {
  console.log('User structure validation helpers initialized!');
  console.log('Available commands:');
  console.log('- validateCurrentUserStructure() - Check if user document and collections exist');
  console.log('- createUserDocument() - Create user document for current user');
  console.log('- fixAuthIssues() - Run validation and fix issues');
})();

export default {
  validateCurrentUserStructure: window.validateCurrentUserStructure,
  createUserDocument: window.createUserDocument,
  fixAuthIssues: window.fixAuthIssues
};
