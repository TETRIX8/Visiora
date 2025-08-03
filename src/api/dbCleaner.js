import { db } from '../lib/firebase';
import { 
  collection,
  doc,
  deleteDoc,
  getDocs,
  writeBatch,
  query,
  limit
} from 'firebase/firestore';

/**
 * Recursively delete all subcollections and documents under a path
 * @param {string} path - The path to delete from
 * @returns {Promise<object>} - Deletion statistics
 */
export const clearFirestoreData = async (path = 'users') => {
  try {
    console.log(`Starting deletion of all data from: ${path}`);
    
    let stats = {
      documentsDeleted: 0,
      collectionsProcessed: 0,
      errors: []
    };
    
    // Get all documents in the collection
    const collectionRef = collection(db, path);
    const snapshot = await getDocs(collectionRef);
    
    if (snapshot.empty) {
      console.log(`No documents found in ${path}`);
      return stats;
    }
    
    console.log(`Found ${snapshot.size} documents in ${path}`);
    stats.collectionsProcessed++;
    
    // Process each document
    for (const docSnapshot of snapshot.docs) {
      try {
        // First, recursively delete all subcollections
        const docPath = `${path}/${docSnapshot.id}`;
        console.log(`Processing document: ${docPath}`);
        
        // Get all subcollections for this document
        const collections = await docSnapshot.ref.listCollections();
        
        for (const subcollection of collections) {
          const subcollectionPath = `${docPath}/${subcollection.id}`;
          console.log(`Found subcollection: ${subcollectionPath}`);
          
          // Recursively delete the subcollection
          const subStats = await clearFirestoreData(subcollectionPath);
          
          // Update stats
          stats.documentsDeleted += subStats.documentsDeleted;
          stats.collectionsProcessed += subStats.collectionsProcessed;
          stats.errors = [...stats.errors, ...subStats.errors];
        }
        
        // Now delete the document itself
        await deleteDoc(docSnapshot.ref);
        stats.documentsDeleted++;
        console.log(`Deleted document: ${docPath}`);
      } catch (error) {
        console.error(`Error processing document ${docSnapshot.id}:`, error);
        stats.errors.push({
          path: `${path}/${docSnapshot.id}`,
          error: error.message
        });
      }
    }
    
    return stats;
  } catch (error) {
    console.error(`Error clearing data from ${path}:`, error);
    return {
      documentsDeleted: 0,
      collectionsProcessed: 0,
      errors: [{
        path,
        error: error.message
      }]
    };
  }
};

/**
 * Clear all data for a specific user
 * @param {string} uid - The user ID to clear data for
 * @returns {Promise<object>} - Deletion statistics
 */
export const clearUserData = async (uid) => {
  if (!uid) {
    console.error('No user ID provided');
    return { success: false, error: 'No user ID provided' };
  }
  
  try {
    console.log(`Clearing all data for user: ${uid}`);
    const stats = await clearFirestoreData(`users/${uid}`);
    
    console.log(`Cleared user data. Stats:`, stats);
    return {
      success: true,
      stats
    };
  } catch (error) {
    console.error('Error clearing user data:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Clear the entire database (all users and their data)
 * @returns {Promise<object>} - Deletion statistics
 */
export const clearEntireDatabase = async () => {
  try {
    console.log('Clearing entire database...');
    const stats = await clearFirestoreData();
    
    console.log(`Database cleared. Stats:`, stats);
    return {
      success: true,
      stats
    };
  } catch (error) {
    console.error('Error clearing database:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Expose these functions to the window object for easy console access
if (typeof window !== 'undefined') {
  window.clearFirestoreData = clearFirestoreData;
  window.clearUserData = clearUserData;
  window.clearEntireDatabase = clearEntireDatabase;
}
