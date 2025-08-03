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
 * Generate a consistent ID prefix for images
 * @param {string} uid - User ID
 * @returns {string} - Generated container prefix
 */
const generateContainerPrefix = (uid) => {
  // Use user ID and current date to ensure unique but deterministic IDs per day
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  // Don't include timestamp for container IDs - they should be fully deterministic per day
  return generateHashId(`${uid}-container-${today}`, 16, false);
};

/**
 * Generate a timestamp-based ID for image documents
 * @returns {string} - Timestamp-based ID
 */
const generateTimestampId = () => {
  const now = new Date();
  // Format: YYYYMMDD_HHmmss_SSS (year, month, day, hour, minute, second, millisecond)
  const timestamp = now.toISOString()
    .replace(/[-T:Z.]/g, (match) => match === '.' ? '_' : '')
    .replace(/\D/g, '_');
  
  // Add some random characters to ensure uniqueness
  const random = Math.random().toString(36).substring(2, 6);
  
  return `${timestamp}_${random}`;
};

/**
 * Save a generated image to the user's document in Firestore using the new structure:
 * users/{uid}/generatedImages/{timestampId}
 * 
 * @param {string} uid - The UID of the user who generated the image
 * @param {object} imageData - The generated image data
 * @returns {Promise<object>} - Object containing image ID and path
 */
export const saveGeneratedImage = async (uid, imageData) => {
  if (!uid) return null; // Don't save for non-logged-in users
  
  try {
    // 1. Get the user's metadata to determine the next image number
    const userMetaRef = doc(db, 'users', uid, 'meta', 'images');
    const userMetaSnapshot = await getDoc(userMetaRef);
    
    let nextImgNumber = 1;
    
    if (userMetaSnapshot.exists()) {
      const metaData = userMetaSnapshot.data();
      
      // If total count exists, use it
      if (metaData.totalCount) {
        nextImgNumber = metaData.totalCount + 1;
      }
    }
    
    // 2. Generate a timestamp-based ID for the image
    const imageId = generateTimestampId();
    const prompt = imageData.prompt || 'no-prompt';
    
    // 3. Create the image document with the specified fields only
    const imageDoc = {
      createdAt: serverTimestamp(),
      height: imageData.height || 512,
      width: imageData.width || 512,
      imageURL: imageData.imageURL || '',
      imgNumber: `img${nextImgNumber}`,
      modelUsed: imageData.modelUsed || imageData.model || '',
      nologo: imageData.nologo || false,
      prompt: prompt,
      seed: imageData.seed || 0
    };
    
    // 4. Save to the generatedImages collection
    const imageDocRef = doc(db, 'users', uid, 'generatedImages', imageId);
    await setDoc(imageDocRef, imageDoc);
    
    // 5. Update the user's metadata document
    await setDoc(userMetaRef, {
      totalCount: nextImgNumber,
      lastUpdated: serverTimestamp()
    }, { merge: true });
    
    return { 
      imageId,
      path: `users/${uid}/generatedImages/${imageId}`,
      ...imageDoc
    };
  } catch (error) {
    console.error('Error saving generated image:', error);
    return null;
  }
};

/**
 * Get all generated images for a user from the generatedImages collection
 * @param {string} uid - The UID of the user
 * @param {number} limit - Maximum number of images to retrieve (optional)
 * @returns {Promise<Array>} - Array of generated images
 */
export const getUserGeneratedImages = async (uid, limit = 50) => {
  if (!uid) return [];
  
  try {
    // Query the generatedImages collection
    const imagesRef = collection(db, 'users', uid, 'generatedImages');
    const imagesQuery = query(
      imagesRef,
      orderBy('createdAt', 'desc'),
      firestoreLimit(limit)
    );
    
    const imagesSnapshot = await getDocs(imagesQuery);
    const results = [];
    
    // Process all images
    for (const imageDoc of imagesSnapshot.docs) {
      const imageId = imageDoc.id;
      const imageData = imageDoc.data();
      
      results.push({
        imageId,
        path: `users/${uid}/generatedImages/${imageId}`,
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
    // Delete the image document from the generatedImages collection
    const imageDocRef = doc(db, 'users', uid, 'generatedImages', imageId);
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
    // Get the image directly from the generatedImages collection
    const imageDocRef = doc(db, 'users', uid, 'generatedImages', imageId);
    const imageSnapshot = await getDoc(imageDocRef);
    
    if (imageSnapshot.exists()) {
      const imageData = imageSnapshot.data();
      
      return {
        imageId,
        path: `users/${uid}/generatedImages/${imageId}`,
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
