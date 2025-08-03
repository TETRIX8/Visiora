// Script to delete all data from Firebase Firestore
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load service account key
console.log('Loading service account...');
const serviceAccountPath = resolve(__dirname, '../service-account-key.json');
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

// Initialize Firebase Admin SDK
console.log(`Initializing Firebase Admin SDK for project: ${serviceAccount.project_id}`);
const app = initializeApp({
  credential: cert(serviceAccount)
});

// Get Firestore instance
const db = getFirestore(app);

// Function to delete all data in a collection and its subcollections
async function deleteCollection(collectionPath) {
  const collectionRef = db.collection(collectionPath);
  const snapshot = await collectionRef.get();
  
  if (snapshot.empty) {
    console.log(`Collection ${collectionPath} is already empty.`);
    return;
  }
  
  console.log(`Found ${snapshot.size} documents in ${collectionPath}`);
  
  // Get all documents including subcollections
  const fetchedDocs = snapshot.docs;
  const deleteBatch = db.batch();
  
  // Process each document
  for (const doc of fetchedDocs) {
    // Check for subcollections
    const subcollections = await doc.ref.listCollections();
    
    for (const subcollection of subcollections) {
      const subcollectionPath = `${collectionPath}/${doc.id}/${subcollection.id}`;
      console.log(`Found subcollection: ${subcollectionPath}`);
      await deleteCollection(subcollectionPath);
    }
    
    // Delete the document
    deleteBatch.delete(doc.ref);
  }
  
  // Commit the batch delete
  await deleteBatch.commit();
  console.log(`Deleted ${snapshot.size} documents from ${collectionPath}`);
}

// Function to delete all data from the database
async function deleteAllData() {
  try {
    console.log('Starting database cleanup...');
    
    // Get all top-level collections
    const collections = await db.listCollections();
    
    if (collections.length === 0) {
      console.log('Database is already empty.');
      return;
    }
    
    console.log(`Found ${collections.length} top-level collections`);
    
    // Delete each collection
    for (const collection of collections) {
      const collectionPath = collection.path;
      console.log(`Deleting collection: ${collectionPath}`);
      await deleteCollection(collectionPath);
    }
    
    console.log('All data deleted successfully!');
    
    return true;
  } catch (error) {
    console.error('Error deleting data:', error);
    return false;
  }
}

// Ask for confirmation before proceeding
console.log('\n⚠️  WARNING: This will delete ALL data in your Firestore database! ⚠️');
console.log('Type "DELETE" (all caps) to confirm:');

// Read input from command line
import * as readline from 'readline';
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('> ', async (answer) => {
  if (answer === 'DELETE') {
    console.log('\nProceeding with database deletion...');
    const success = await deleteAllData();
    console.log(success ? '\nDatabase cleanup completed successfully!' : '\nDatabase cleanup failed!');
  } else {
    console.log('\nDatabase deletion cancelled.');
  }
  
  rl.close();
  process.exit(0);
});
