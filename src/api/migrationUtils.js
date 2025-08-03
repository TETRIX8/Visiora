import { 
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  deleteDoc,
  serverTimestamp,
  writeBatch,
  query,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from '../lib/firebase';

/**
 * Migration utility to convert from nested to flattened structure
 * @param {string} uid - User ID to migrate
 * @returns {Promise<object>} - Migration results
 */
export const migrateToFlatStructure = async (uid) => {
  if (!uid) return { success: false, error: 'No user ID provided' };
  
  try {
    console.log(`Starting migration for user: ${uid}`);
    
    // Get all container documents
    const generatedImagesRef = collection(db, 'users', uid, 'GeneratedImages');
    const containerSnapshot = await getDocs(generatedImagesRef);
    
    let totalMigrated = 0;
    let totalContainers = containerSnapshot.size;
    let errors = [];
    
    // Create metadata document
    const userMetaRef = doc(db, 'users', uid, 'meta', 'images');
    const containers = {};
    
    console.log(`Found ${totalContainers} containers to migrate`);
    
    // For each container, get images from all img collections
    for (const containerDoc of containerSnapshot.docs) {
      const containerId = containerDoc.id;
      const containerData = containerDoc.data();
      
      console.log(`Processing container: ${containerId}`);
      
      // Determine how many img subcollections to check
      const maxImgNumber = containerData.nextImgNumber ? containerData.nextImgNumber : 20;
      let containerImgCount = 0;
      
      // Process each img collection
      for (let imgNum = 1; imgNum < maxImgNumber; imgNum++) {
        const imgCollection = `img${imgNum}`;
        
        try {
          const imgCollectionRef = collection(db, 'users', uid, 'GeneratedImages', containerId, imgCollection);
          const imagesSnapshot = await getDocs(imgCollectionRef);
          
          if (!imagesSnapshot.empty) {
            console.log(`Found ${imagesSnapshot.size} images in ${imgCollection}`);
            
            for (const imageDoc of imagesSnapshot.docs) {
              const imageData = imageDoc.data();
              const newImageId = `${containerId}_${imgCollection}`;
              containerImgCount++;
              
              // Create the image in flattened structure
              try {
                await setDoc(doc(db, 'users', uid, 'images', newImageId), {
                  ...imageData,
                  containerId,
                  imgCollection,
                  originalImageId: imageDoc.id,
                  migratedAt: serverTimestamp(),
                  fromPath: `users/${uid}/GeneratedImages/${containerId}/${imgCollection}/${imageDoc.id}`
                });
                
                totalMigrated++;
                console.log(`Migrated image ${totalMigrated}: ${newImageId}`);
              } catch (migrationError) {
                console.error(`Error migrating image: ${newImageId}`, migrationError);
                errors.push({
                  containerId,
                  imgCollection,
                  imageId: imageDoc.id,
                  error: migrationError.message
                });
              }
            }
          }
        } catch (error) {
          // Collection might not exist, continue to next
        }
      }
      
      // Track count per container
      if (containerImgCount > 0) {
        containers[containerId] = containerImgCount;
        console.log(`Container ${containerId} had ${containerImgCount} images`);
      }
    }
    
    // Update metadata with container counts
    await setDoc(userMetaRef, {
      totalCount: totalMigrated,
      lastMigrated: serverTimestamp(),
      containers
    }, { merge: true });
    
    console.log(`Migration completed: ${totalMigrated} images migrated`);
    
    return {
      success: true,
      totalContainers,
      totalMigrated,
      errors: errors.length > 0 ? errors : null
    };
  } catch (error) {
    console.error('Migration failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Delete all data in the original nested structure after successful migration
 * Use this only after verifying the migration was successful
 * @param {string} uid - User ID
 * @returns {Promise<object>} - Results of the deletion
 */
export const deleteOriginalStructureAfterMigration = async (uid) => {
  if (!uid) return { success: false, error: 'No user ID provided' };
  
  try {
    console.log(`Starting deletion of original structure for user: ${uid}`);
    
    // Get all container documents
    const generatedImagesRef = collection(db, 'users', uid, 'GeneratedImages');
    const containerSnapshot = await getDocs(generatedImagesRef);
    
    let totalDeleted = 0;
    let containersDeleted = 0;
    
    for (const containerDoc of containerSnapshot.docs) {
      const containerId = containerDoc.id;
      console.log(`Deleting container: ${containerId}`);
      
      try {
        // Due to nested structure, we need to delete all subcollections first
        // Using a batch for efficiency
        const batch = writeBatch(db);
        let batchCount = 0;
        
        // First get all the subcollections (img1, img2, etc.)
        const subCollectionsQuery = query(
          collection(db, 'users', uid, 'GeneratedImages', containerId),
          orderBy('__name__'),
          limit(100)
        );
        
        const subCollectionsSnapshot = await getDocs(subCollectionsQuery);
        
        for (const subDoc of subCollectionsSnapshot.docs) {
          // Delete each document in the batch
          batch.delete(subDoc.ref);
          batchCount++;
          totalDeleted++;
          
          // Firebase batches are limited to 500 operations
          if (batchCount >= 400) {
            await batch.commit();
            console.log(`Committed batch of ${batchCount} deletions`);
            batchCount = 0;
          }
        }
        
        // Commit any remaining operations
        if (batchCount > 0) {
          await batch.commit();
          console.log(`Committed final batch of ${batchCount} deletions`);
        }
        
        // Now delete the container document itself
        await deleteDoc(doc(db, 'users', uid, 'GeneratedImages', containerId));
        containersDeleted++;
      } catch (error) {
        console.error(`Error deleting container ${containerId}:`, error);
      }
    }
    
    console.log(`Deletion completed: ${containersDeleted} containers and ${totalDeleted} subcollections/documents deleted`);
    
    return {
      success: true,
      containersDeleted,
      totalDeleted
    };
  } catch (error) {
    console.error('Deletion failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Expose the migration functions to the global window object for easy console access
 */
if (typeof window !== 'undefined') {
  window.migrateToFlatStructure = migrateToFlatStructure;
  window.deleteOriginalStructureAfterMigration = deleteOriginalStructureAfterMigration;
}
