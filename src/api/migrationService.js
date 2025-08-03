// Utility to migrate and fix the Firestore structure

import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc,
  deleteDoc,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

/**
 * Generate a deterministic hash-based ID using the input string
 * This must match the function in imageService.js
 */
const generateHashId = (input, length = 20, includeTimestamp = false) => {
  let hash = 0;
  if (input.length === 0) return hash.toString(36);
  
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  // Make a fully deterministic hash
  let hashStr = Math.abs(hash).toString(36);
  
  // Add timestamp only if requested
  if (includeTimestamp) {
    hashStr += Date.now().toString(36);
  }
  
  // Ensure we have enough characters by repeating the hash if necessary
  while (hashStr.length < length) {
    hashStr += Math.abs(hash).toString(36);
  }
  
  return hashStr.slice(0, length);
};

/**
 * Generate a consistent ID for GeneratedImages container
 * This must match the function in imageService.js
 */
const generateContainerId = (uid) => {
  const today = new Date().toISOString().split('T')[0];
  return generateHashId(`${uid}-container-${today}`, 16, false);
};

/**
 * Migrate existing images to the new structure with hashed IDs
 * This will create a new container with a hashed ID and move all images there
 */
export const migrateUserImages = async (uid) => {
  if (!uid) {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.error('No user is signed in');
      return { success: false, error: 'No user is signed in' };
    }
    uid = currentUser.uid;
  }
  
  console.log(`Starting migration for user: ${uid}`);
  
  try {
    // Get all existing containers
    const generatedImagesRef = collection(db, 'users', uid, 'GeneratedImages');
    const containerSnapshot = await getDocs(generatedImagesRef);
    
    if (containerSnapshot.empty) {
      console.log('No images to migrate');
      return { success: true, message: 'No images to migrate' };
    }
    
    console.log(`Found ${containerSnapshot.size} containers to migrate`);
    
    // Create a new container with hashed ID
    const newContainerId = generateContainerId(uid);
    const newContainerRef = doc(db, 'users', uid, 'GeneratedImages', newContainerId);
    
    await setDoc(newContainerRef, {
      createdAt: serverTimestamp(),
      lastUpdated: serverTimestamp(),
      migratedAt: serverTimestamp(),
      isMigrated: true
    });
    
    console.log(`Created new container with ID: ${newContainerId}`);
    
    // Track which images go to which subcollections
    let imgCount = 0;
    let currentSubcollection = 'img1';
    const migratedImages = [];
    
    // For each old container
    for (const containerDoc of containerSnapshot.docs) {
      const oldContainerId = containerDoc.id;
      
      if (oldContainerId === newContainerId) {
        console.log('Skipping new container');
        continue;
      }
      
      console.log(`Migrating container: ${oldContainerId}`);
      
      // Get all img1 images from this container
      const imgCollectionRef = collection(db, 'users', uid, 'GeneratedImages', oldContainerId, 'img1');
      const imagesSnapshot = await getDocs(imgCollectionRef);
      
      for (const imageDoc of imagesSnapshot.docs) {
        const imageData = imageDoc.data();
        const oldImageId = imageDoc.id;
        
        // Switch to next subcollection if needed
        if (imgCount >= 5 && currentSubcollection === 'img1') {
          currentSubcollection = 'img2';
          imgCount = 0;
        } else if (imgCount >= 5 && currentSubcollection === 'img2') {
          currentSubcollection = 'img3';
          imgCount = 0;
        }
        
        // Generate new image ID
        const prompt = imageData.prompt || 'migrated';
        const newImageId = generateHashId(`${uid}-${newContainerId}-${prompt}-${Date.now()}-${oldImageId}`, 20);
        
        // Copy image to new location
        const newImageRef = doc(db, 'users', uid, 'GeneratedImages', newContainerId, currentSubcollection, newImageId);
        await setDoc(newImageRef, {
          ...imageData,
          migratedFrom: `${oldContainerId}/${oldImageId}`,
          migratedAt: serverTimestamp()
        });
        
        console.log(`Migrated image from ${oldContainerId}/${oldImageId} to ${newContainerId}/${currentSubcollection}/${newImageId}`);
        
        migratedImages.push({
          oldContainerId,
          oldImageId,
          newContainerId,
          newImageId,
          subcollection: currentSubcollection
        });
        
        imgCount++;
      }
    }
    
    return {
      success: true,
      message: `Successfully migrated ${migratedImages.length} images`,
      newContainerId,
      migratedImages
    };
  } catch (error) {
    console.error('Error migrating images:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Clean up old containers after successful migration
 * Only call this after verifying the migration was successful
 */
export const cleanupMigratedContainers = async (uid, skipContainerId) => {
  if (!uid) {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.error('No user is signed in');
      return { success: false, error: 'No user is signed in' };
    }
    uid = currentUser.uid;
  }
  
  try {
    // Get all containers
    const generatedImagesRef = collection(db, 'users', uid, 'GeneratedImages');
    const containerSnapshot = await getDocs(generatedImagesRef);
    
    let deletedContainers = 0;
    
    // Delete all containers except the one we want to skip
    for (const containerDoc of containerSnapshot.docs) {
      const containerId = containerDoc.id;
      
      if (containerId === skipContainerId) {
        console.log(`Skipping container: ${containerId}`);
        continue;
      }
      
      // Delete the container and all subcollections
      const containerRef = doc(db, 'users', uid, 'GeneratedImages', containerId);
      
      // First delete all img1 images
      const imgCollectionRef = collection(containerRef, 'img1');
      const imagesSnapshot = await getDocs(imgCollectionRef);
      
      const batch = writeBatch(db);
      for (const imageDoc of imagesSnapshot.docs) {
        const imageRef = doc(imgCollectionRef, imageDoc.id);
        batch.delete(imageRef);
      }
      
      // Commit the batch delete
      await batch.commit();
      
      // Now delete the container
      await deleteDoc(containerRef);
      deletedContainers++;
    }
    
    return {
      success: true,
      message: `Deleted ${deletedContainers} old containers`
    };
  } catch (error) {
    console.error('Error cleaning up containers:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Migrate a user's images to the new structure with numbered img subcollections
 * @param {string} uid - User ID to migrate
 */
export const migrateToNumberedSubcollections = async (uid) => {
  if (!uid) {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.error('No user is signed in');
      return { success: false, error: 'No user is signed in' };
    }
    uid = currentUser.uid;
  }
  
  console.log(`Starting migration for user: ${uid}`);
  
  try {
    // Get all containers
    const generatedImagesRef = collection(db, 'users', uid, 'GeneratedImages');
    const containersSnapshot = await getDocs(generatedImagesRef);
    
    if (containersSnapshot.empty) {
      console.log('No images to migrate');
      return { success: true, message: 'No images to migrate' };
    }
    
    // Process each container
    for (const containerDoc of containersSnapshot.docs) {
      const containerId = containerDoc.id;
      console.log(`Processing container: ${containerId}`);
      
      // Check if this container already has the new structure
      const containerData = containerDoc.data();
      if (containerData.nextImgNumber) {
        console.log(`Container ${containerId} already migrated, skipping`);
        continue;
      }
      
      // Get all images from the img1 collection
      const img1CollectionRef = collection(db, 'users', uid, 'GeneratedImages', containerId, 'img1');
      const img1Snapshot = await getDocs(img1CollectionRef);
      
      if (img1Snapshot.empty) {
        console.log(`No images in container ${containerId}`);
        continue;
      }
      
      let imgCounter = 1;
      const containerRef = doc(db, 'users', uid, 'GeneratedImages', containerId);
      
      // Update container with nextImgNumber field
      await setDoc(containerRef, {
        nextImgNumber: img1Snapshot.size + 1,
        lastUpdated: serverTimestamp(),
        migratedAt: serverTimestamp()
      }, { merge: true });
      
      // Process each image - create a new collection for each image
      for (const imageDoc of img1Snapshot.docs) {
        const imageId = imageDoc.id;
        const imageData = imageDoc.data();
        const imgCollection = `img${imgCounter}`;
        
        try {
          // Create the new image document with the new ID format
          const newImageId = `${containerId}_${imgCollection}`;
          const newImageDocRef = doc(db, 'users', uid, 'GeneratedImages', containerId, imgCollection, newImageId);
          
          // Add imgNumber field to the data
          await setDoc(newImageDocRef, {
            ...imageData,
            imgNumber: imgCounter,
            migratedFrom: imageId,
            migratedAt: serverTimestamp()
          });
          
          console.log(`Migrated image ${imageId} to ${imgCollection}/${newImageId}`);
          
          // Increment counter for next image
          imgCounter++;
        } catch (error) {
          console.error(`Error migrating image ${imageId}:`, error);
        }
      }
      
      // Option to delete original images after migration
      // Uncomment this if you want to delete the original img1 collection after migration
      /*
      console.log(`Deleting original images in img1 collection`);
      const batch = writeBatch(db);
      
      for (const imageDoc of img1Snapshot.docs) {
        const imageRef = doc(img1CollectionRef, imageDoc.id);
        batch.delete(imageRef);
      }
      
      await batch.commit();
      */
    }
    
    return { success: true, message: 'Migration completed' };
  } catch (error) {
    console.error('Error during migration:', error);
    return { success: false, error: error.message };
  }
};

// Add to window for console access
window.migrateUserImages = migrateUserImages;
window.cleanupMigratedContainers = cleanupMigratedContainers;
window.migrateToNumberedSubcollections = migrateToNumberedSubcollections;

export default {
  migrateUserImages,
  cleanupMigratedContainers,
  migrateToNumberedSubcollections
};
