import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';

// Get all documents from a collection
export const getCollection = async (collectionName) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting collection:", error);
    throw error;
  }
};

// Get a document by ID
export const getDocument = async (collectionName, documentId) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting document:", error);
    throw error;
  }
};

// Add a new document to a collection
export const addDocument = async (collectionName, data) => {
  try {
    const timestamp = serverTimestamp();
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: timestamp,
      updatedAt: timestamp
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding document:", error);
    throw error;
  }
};

// Update a document
export const updateDocument = async (collectionName, documentId, data) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Error updating document:", error);
    throw error;
  }
};

// Delete a document
export const deleteDocument = async (collectionName, documentId) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
};

// Query documents
export const queryDocuments = async (collectionName, conditions = [], sortOptions = [], limitCount = 0) => {
  try {
    let queryRef = collection(db, collectionName);
    
    // Build the query with conditions
    if (conditions.length > 0) {
      const queryConstraints = conditions.map(condition => {
        const [field, operator, value] = condition;
        return where(field, operator, value);
      });
      queryRef = query(queryRef, ...queryConstraints);
    }
    
    // Add sorting if specified
    if (sortOptions.length > 0) {
      const sortConstraints = sortOptions.map(option => {
        const [field, direction = 'asc'] = option;
        return orderBy(field, direction);
      });
      queryRef = query(queryRef, ...sortConstraints);
    }
    
    // Add limit if specified
    if (limitCount > 0) {
      queryRef = query(queryRef, limit(limitCount));
    }
    
    const querySnapshot = await getDocs(queryRef);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error querying documents:", error);
    throw error;
  }
};
