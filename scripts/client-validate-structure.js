// Firebase client-side validation script to check user creation with proper structure

import { initializeApp } from 'firebase/app';
import { 
  getFirestore,
  doc, 
  getDoc, 
  setDoc, 
  collection,
  addDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  getAuth, 
  signInWithEmailAndPassword,
  onAuthStateChanged 
} from 'firebase/auth';

// Your Firebase configuration
const firebaseConfig = {
  // This will use the config from your local firebase.js file
  // We'll import it at runtime
};

// Initialize Firebase
let app, auth, db;

try {
  // Import firebase config dynamically
  const configModule = await import('../src/lib/firebase.js');
  app = configModule.app;
  db = configModule.db;
  auth = configModule.auth;
  
  console.log('Firebase initialized using existing app instance');
} catch (error) {
  console.error('Error importing Firebase config:', error);
  process.exit(1);
}

// Wait for auth state to be ready
function waitForAuth() {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
}

// Create user document with UID as document ID
async function createUserDocument(uid) {
  console.log(`Creating user document with UID: ${uid}`);
  
  try {
    const userRef = doc(db, 'users', uid);
    const userData = {
      name: 'Test Client User',
      email: 'test-client@example.com',
      credits: 10,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      lastCreditRefresh: serverTimestamp(),
      preferences: {
        defaultModel: 'flux',
        defaultShape: 'landscape',
        notifications: true
      }
    };
    
    await setDoc(userRef, userData);
    console.log(`✅ User document created: users/${uid}`);
    
    return true;
  } catch (error) {
    console.error('Error creating user document:', error);
    return false;
  }
}

// Create nested image structure
async function createNestedImageStructure(uid) {
  console.log(`Creating nested image structure for user: ${uid}`);
  
  try {
    // Create GeneratedImages collection
    const generatedImagesRef = collection(db, 'users', uid, 'GeneratedImages');
    
    // Create container document
    const containerRef = await addDoc(generatedImagesRef, {
      createdAt: serverTimestamp()
    });
    const containerId = containerRef.id;
    
    console.log(`✅ Container document created: users/${uid}/GeneratedImages/${containerId}`);
    
    // Create img1 subcollection
    const img1CollectionRef = collection(db, 'users', uid, 'GeneratedImages', containerId, 'img1');
    
    // Add test image document
    const imageRef = await addDoc(img1CollectionRef, {
      prompt: "Test client prompt",
      imageURL: "https://visiora-app.web.app/assets/welcome-image.jpg",
      width: 1080,
      height: 720,
      modelUsed: "visiora-test",
      createdAt: serverTimestamp()
    });
    
    console.log(`✅ Test image document created: users/${uid}/GeneratedImages/${containerId}/img1/${imageRef.id}`);
    
    return true;
  } catch (error) {
    console.error('Error creating nested image structure:', error);
    return false;
  }
}

// Validate user structure
async function validateUserStructure(uid) {
  console.log(`Validating user structure for: ${uid}`);
  
  try {
    // Check user document
    const userRef = doc(db, 'users', uid);
    const userSnapshot = await getDoc(userRef);
    
    if (!userSnapshot.exists()) {
      console.error(`❌ User document doesn't exist: users/${uid}`);
      return false;
    }
    
    console.log(`✅ User document exists: users/${uid}`);
    console.log('User data:', userSnapshot.data());
    
    return true;
  } catch (error) {
    console.error('Error validating user structure:', error);
    return false;
  }
}

// Main function
async function main() {
  try {
    // Wait for auth state
    const currentUser = await waitForAuth();
    
    if (!currentUser) {
      console.error('No user is signed in. Please sign in first.');
      process.exit(1);
    }
    
    console.log(`Current user: ${currentUser.uid} (${currentUser.email})`);
    
    // Validate existing user structure
    const isValid = await validateUserStructure(currentUser.uid);
    
    if (!isValid) {
      console.log('Creating user document...');
      await createUserDocument(currentUser.uid);
      
      console.log('Creating nested image structure...');
      await createNestedImageStructure(currentUser.uid);
      
      console.log('Validating again after creation...');
      await validateUserStructure(currentUser.uid);
    }
    
    console.log('Validation complete!');
  } catch (error) {
    console.error('Error in main function:', error);
  }
}

// Run the main function
main().catch(console.error);
