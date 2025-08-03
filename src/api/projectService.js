import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs,
  getDoc,
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';

import { saveGeneratedImage } from './imageService';

/**
 * Save a project to the user's library and also save image to the flattened structure
 * @param {string} uid - The user's UID
 * @param {object} project - The project to save
 * @returns {Promise<object>} - Object containing project ID and image details
 */
export const saveProject = async (uid, project) => {
  if (!uid) throw new Error('User must be logged in to save projects');
  
  try {
    // First save the project data to the projects collection
    const projectData = {
      ...project,
      userId: uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    // Add to the projects collection
    const docRef = await addDoc(collection(db, 'projects'), projectData);
    const projectId = docRef.id;
    
    // Now save the image to the user's flattened structure
    // Extract the image data from the project
    const imageData = {
      prompt: project.prompt,
      imageURL: project.imageUrl,
      modelUsed: project.model,
      width: project.width,
      height: project.height,
      seed: project.seed || null,
      nologo: project.removeWatermark || false,
      projectId: projectId // Reference to the project
    };
    
    // Save to the flattened structure
    const imageResult = await saveGeneratedImage(uid, imageData);
    
    // Return both IDs for reference
    return { 
      projectId, 
      imageDetails: imageResult
    };
  } catch (error) {
    console.error('Error saving project and image:', error);
    throw error;
  }
};

/**
 * Update an existing project
 * @param {string} projectId - The ID of the project to update
 * @param {object} updates - The updates to apply to the project
 * @returns {Promise<void>}
 */
export const updateProject = async (projectId, userId, updates) => {
  if (!userId) throw new Error('User must be logged in to update projects');
  
  try {
    const projectRef = doc(db, 'projects', projectId);
    
    await updateDoc(projectRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

/**
 * Delete a project from the user's library
 * @param {string} projectId - The ID of the project to delete
 * @returns {Promise<void>}
 */
export const deleteProject = async (projectId, userId) => {
  if (!userId) throw new Error('User must be logged in to delete projects');
  
  try {
    await deleteDoc(doc(db, 'projects', projectId));
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};

/**
 * Get all projects for a user
 * @param {string} userId - The user's ID
 * @returns {Promise<Array>} - Array of the user's projects
 */
export const getUserProjects = async (userId) => {
  if (!userId) return [];
  
  try {
    const projectsQuery = query(
      collection(db, 'projects'),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(projectsQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Convert timestamps to dates for easier handling in UI
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    }));
  } catch (error) {
    console.error('Error getting user projects:', error);
    return [];
  }
};

/**
 * Get a specific project by ID
 * @param {string} projectId - The ID of the project to get
 * @param {string} userId - The user's ID
 * @returns {Promise<object|null>} - The project or null if not found
 */
export const getProjectById = async (projectId, userId) => {
  if (!userId || !projectId) return null;
  
  try {
    const docRef = doc(db, 'projects', projectId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists() && docSnap.data().userId === userId) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate(),
        updatedAt: docSnap.data().updatedAt?.toDate()
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting project by ID:', error);
    return null;
  }
};
