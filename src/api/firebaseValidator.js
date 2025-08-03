// Import Firebase functions
import { 
  collection, 
  addDoc, 
  doc, 
  getDoc, 
  setDoc, 
  getDocs, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

/**
 * Utility function to validate that we can write to Firestore
 * This will help diagnose permission issues or database connectivity problems
 */
export const validateFirebaseAccess = async () => {
  try {
    console.log('Validating Firebase database access...');
    
    // Check if user is authenticated
    const currentUser = auth.currentUser;
    console.log('Current authenticated user:', currentUser ? currentUser.uid : 'None');
    
    // Create a test user document directly using the same structure as userService.js
    if (currentUser) {
      console.log('Attempting to create test user document directly with UID:', currentUser.uid);
      
      // Create user document with correct structure
      const userRef = doc(db, 'users', currentUser.uid);
      
      // Attempt to create or update user document
      await setDoc(userRef, {
        email: currentUser.email || 'test@example.com',
        name: currentUser.displayName || 'Test User',
        photoURL: currentUser.photoURL || null,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        lastCreditRefresh: serverTimestamp(),
        credits: 10,
        test_created_by: 'firebaseValidator',
        preferences: {
          defaultModel: 'flux',
          defaultShape: 'landscape',
          notifications: true
        }
      }, { merge: true });
      
      console.log('Test user document created or updated successfully');
      
      // Verify user document was created
      const userSnapshot = await getDoc(userRef);
      console.log('User document exists after creation:', userSnapshot.exists());
      console.log('User document data:', userSnapshot.data());
    }
    
    // DISABLED: We no longer want to create test documents
    console.log('Skipping test document creation to avoid database pollution');
    
    /* Original code commented out to prevent test data creation
    const testCollectionRef = collection(db, '_visiora_test');
    
    // Try to write a document
    const testDoc = await addDoc(testCollectionRef, {
      test: true,
      timestamp: serverTimestamp()
    });
    console.log('Successfully wrote test document:', testDoc.id);
    */
    
    // Try nested collection write
    if (currentUser) {
      // Test user document exists
      const userRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userRef);
      console.log('User document exists:', userDoc.exists());
      
      if (!userDoc.exists()) {
        // Create user document if needed
        await setDoc(userRef, {
          test: true,
          timestamp: serverTimestamp()
        });
        console.log('Created test user document');
      }
      
      // DISABLED: We no longer want to create test documents
      console.log('Skipping test GeneratedImages creation to avoid database pollution');
      
      /* Original code commented out to prevent test data creation
      console.log('Creating test GeneratedImages collection...');
      const generatedImagesRef = collection(db, 'users', currentUser.uid, 'GeneratedImages');
      
      // Create a container document
      const containerDocRef = await addDoc(generatedImagesRef, {
        createdAt: serverTimestamp(),
        test_created_by: 'firebaseValidator'
      });
      const containerId = containerDocRef.id;
      console.log(`Created test container document with ID: ${containerId}`);
      
      // Create img1 subcollection with test image
      console.log(`Creating img1 subcollection in container ${containerId}...`);
      const img1CollectionRef = collection(db, 'users', currentUser.uid, 'GeneratedImages', containerId, 'img1');
      
      // Create a test image document
      const imageDocRef = await addDoc(img1CollectionRef, {
        prompt: "Test prompt created by validator",
        imageURL: "https://visiora-app.web.app/assets/welcome-image.jpg",
        width: 1080,
        height: 720,
        modelUsed: "visiora-test",
        createdAt: serverTimestamp(),
        test: true
      });
      
      console.log(`Created test image document with ID: ${imageDocRef.id}`);
      */
      console.log(`Full path: users/${currentUser.uid}/GeneratedImages/${containerId}/img1/${imageDocRef.id}`);
      
      // DISABLED: We no longer want to create test documents
      console.log('Skipping _test_nested collection creation to avoid database pollution');
      
      /* Original code commented out to prevent test data creation
      const testNestedRef = collection(db, 'users', currentUser.uid, '_test_nested');
      await addDoc(testNestedRef, {
        test: true,
        timestamp: serverTimestamp()
      });
      console.log('Successfully wrote to nested collection');
      
      // Test deeply nested collection (level 3)
      const nestedDocsSnapshot = await getDocs(testNestedRef);
      if (nestedDocsSnapshot.docs.length > 0) {
        const nestedDocId = nestedDocsSnapshot.docs[0].id;
        const deeplyNestedRef = collection(db, 'users', currentUser.uid, '_test_nested', nestedDocId, '_deeply_nested');
        
        await addDoc(deeplyNestedRef, {
          test: true,
          timestamp: serverTimestamp()
        });
        
        console.log('Successfully wrote to deeply nested collection (level 3)');
      }
      */
    }
    
    return {
      success: true,
      userId: currentUser?.uid,
      message: 'Firebase access validated successfully'
    };
  } catch (error) {
    console.error('Firebase access validation failed:', error);
    return {
      success: false,
      error: error.message,
      code: error.code,
      userId: auth.currentUser?.uid
    };
  }
};
