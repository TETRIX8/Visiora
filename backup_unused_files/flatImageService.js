import { 
  collection,
  addDoc,
  doc,
  setDoc,
  query,
  where,
  orderBy,
  getDocs,
  serverTimestamp,
  deleteDoc,
  getDoc,
  limit as firestoreLimit
} from 'firebase/firestore';
import { db } from '../lib/firebase';

/**
 * Generate a deterministic hash-based ID using the input string
 * @param {string} input - String to hash
 * @param {number} length - Desired length of the hash (default: 20)
 * @param {boolean} includeTimestamp - Whether to include timestamp for uniqueness (default: false)
 * @returns {string} - Hash string
 */
const generateHashId = (input, length = 20, includeTimestamp = false) => {
  // Simple hash function that creates a deterministic ID based on input
  let hash = 0;
  if (input.length === 0) return hash.toString(36);
  
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Make a fully deterministic hash
  let hashStr = Math.abs(hash).toString(36);
  
  // Add timestamp only if requested (for cases where we need guaranteed uniqueness)
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
 * Generate a consistent ID for daily container prefix
 * @param {string} uid - User ID
 * @returns {string} - Generated container prefix
 */
const generateContainerPrefix = (uid) => {
  // Use user ID and current date to ensure unique but deterministic IDs per day
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  return generateHashId(`${uid}-container-${today}`, 16, false);
};

/**
 * Save a generated image to the user's document in Firestore using the flattened structure:
 * users/{uid}/images/{imageId}
 * 
 * @param {string} uid - The UID of the user who generated the image
 * @param {object} imageData - The generated image data
 * @returns {Promise<object>} - Object containing image ID and path
 */
export const saveGeneratedImage = async (uid, imageData) => {
  if (!uid) return null; // Don't save for non-logged-in users
  
  try {
    // Generate a container prefix based on user and date
    const containerPrefix = generateContainerPrefix(uid);
    
    // 1. Get the user's metadata to determine the next image number
    const userMetaRef = doc(db, 'users', uid, 'meta', 'images');
    const userMetaSnapshot = await getDoc(userMetaRef);
    
    let nextImgNumber = 1;
    let dailyCount = 1;
    
    if (userMetaSnapshot.exists()) {
      const metaData = userMetaSnapshot.data();
      
      // Check if we have counts for today's container
      if (metaData.containers && metaData.containers[containerPrefix]) {
        dailyCount = metaData.containers[containerPrefix] + 1;
      }
      
      // If total count exists, use it
      if (metaData.totalCount) {
        nextImgNumber = metaData.totalCount + 1;
      }
    }
    
    // 2. Create an image ID that follows the pattern: containerPrefix_imgN
    const imageId = `${containerPrefix}_img${dailyCount}`;
    const prompt = imageData.prompt || 'no-prompt';
    
    // 3. Create the image document with the flattened structure
    const imageDoc = {
      ...imageData,
      promptHash: generateHashId(prompt, 8, false),
      imgNumber: dailyCount,
      totalNumber: nextImgNumber,
      containerId: containerPrefix, // Store containerId for filtering/grouping
      createdAt: serverTimestamp()
    };
    
    const imageDocRef = doc(db, 'users', uid, 'images', imageId);
    await setDoc(imageDocRef, imageDoc);
    
    // 4. Update the user's metadata document
    await setDoc(userMetaRef, {
      totalCount: nextImgNumber,
      lastUpdated: serverTimestamp(),
      containers: {
        [containerPrefix]: dailyCount
      }
    }, { merge: true });
    
    return { 
      imageId,
      path: `users/${uid}/images/${imageId}`
    };
  } catch (error) {
    console.error('Error saving generated image:', error);
    return null;
  }
};

/**
 * Get all generated images for a user with the flattened structure
 * @param {string} uid - The UID of the user
 * @param {number} limit - Maximum number of images to retrieve (optional)
 * @returns {Promise<Array>} - Array of generated images with IDs
 */
export const getUserGeneratedImages = async (uid, limit = 50) => {
  if (!uid) return [];
  
  try {
    // Query the flattened images collection
    const imagesRef = collection(db, 'users', uid, 'images');
    const imagesQuery = query(
      imagesRef,
      orderBy('createdAt', 'desc'),
      firestoreLimit(limit)
    );
    
    const imagesSnapshot = await getDocs(imagesQuery);
    const results = [];
    
    for (const imageDoc of imagesSnapshot.docs) {
      const imageId = imageDoc.id;
      const imageData = imageDoc.data();
      
      results.push({
        imageId,
        path: `users/${uid}/images/${imageId}`,
        ...imageData,
        createdAt: imageData.createdAt?.toDate() // Convert timestamp to date
      });
    }
    
    return results;
  } catch (error) {
    console.error('Error fetching user generated images:', error);
    return [];
  }
};

/**
 * Delete a specific generated image
 * @param {string} uid - The user ID
 * @param {string} imageId - The ID of the image document
 * @returns {Promise<boolean>} - True if deletion was successful
 */
export const deleteGeneratedImage = async (uid, imageId) => {
  if (!uid || !imageId) return false;
  
  try {
    // Delete the image document directly
    const imageDocRef = doc(db, 'users', uid, 'images', imageId);
    await deleteDoc(imageDocRef);
    
    return true;
  } catch (error) {
    console.error('Error deleting generated image:', error);
    return false;
  }
};

/**
 * Get a single generated image by its ID
 * @param {string} uid - The user ID
 * @param {string} imageId - The ID of the image document
 * @returns {Promise<object|null>} - The image data or null if not found
 */
export const getGeneratedImageById = async (uid, imageId) => {
  if (!uid || !imageId) return null;
  
  try {
    const imageDocRef = doc(db, 'users', uid, 'images', imageId);
    const imageSnapshot = await getDoc(imageDocRef);
    
    if (imageSnapshot.exists()) {
      const imageData = imageSnapshot.data();
      return {
        imageId,
        path: `users/${uid}/images/${imageId}`,
        ...imageData,
        createdAt: imageData.createdAt?.toDate() // Convert timestamp to date
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching generated image by ID:', error);
    return null;
  }
};

/**
 * Migration utility to convert from nested to flattened structure
 * @param {string} uid - User ID to migrate
 * @returns {Promise<object>} - Migration results
 */
export const migrateToFlatStructure = async (uid) => {
  if (!uid) return { success: false, error: 'No user ID provided' };
  
  try {
    // Get all container documents
    const generatedImagesRef = collection(db, 'users', uid, 'GeneratedImages');
    const containerSnapshot = await getDocs(generatedImagesRef);
    
    let totalMigrated = 0;
    let totalContainers = containerSnapshot.size;
    let errors = [];
    
    // Create metadata document
    const userMetaRef = doc(db, 'users', uid, 'meta', 'images');
    const containers = {};
    
    // For each container, get images from all img collections
    for (const containerDoc of containerSnapshot.docs) {
      const containerId = containerDoc.id;
      const containerData = containerDoc.data();
      
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
            for (const imageDoc of imagesSnapshot.docs) {
              const imageData = imageDoc.data();
              const newImageId = `${containerId}_${imgCollection}`;
              containerImgCount++;
              
              // Create the image in flattened structure
              try {
                await setDoc(doc(db, 'users', uid, 'images', newImageId), {
                  ...imageData,
                  containerId,
                  migratedAt: serverTimestamp(),
                  fromPath: `users/${uid}/GeneratedImages/${containerId}/${imgCollection}/${imageDoc.id}`
                });
                
                totalMigrated++;
              } catch (migrationError) {
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
      }
    }
    
    // Update metadata with container counts
    await setDoc(userMetaRef, {
      totalCount: totalMigrated,
      lastMigrated: serverTimestamp(),
      containers
    }, { merge: true });
    
    return {
      success: true,
      totalContainers,
      totalMigrated,
      errors: errors.length > 0 ? errors : null
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};
