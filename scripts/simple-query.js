// Simple Firestore Admin Query
import admin from 'firebase-admin';
import fs from 'fs';
import { resolve } from 'path';

// Path to service account file
const serviceAccountPath = resolve(process.cwd(), 'service-account-key.json');

console.log('Loading service account from:', serviceAccountPath);
let serviceAccount;

try {
  // Read and parse service account file
  const serviceAccountJson = fs.readFileSync(serviceAccountPath, 'utf8');
  serviceAccount = JSON.parse(serviceAccountJson);
  
  console.log('Service account loaded successfully');
  console.log(`Project ID: ${serviceAccount.project_id}`);
} catch (error) {
  console.error('Failed to load service account:', error.message);
  process.exit(1);
}

// Initialize the Firebase Admin SDK
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log('Firebase Admin SDK initialized successfully');
} catch (error) {
  console.error('Failed to initialize Firebase Admin SDK:', error);
  process.exit(1);
}

// Get Firestore instance
const db = admin.firestore();

// Query Firestore
async function queryFirestore() {
  try {
    console.log('\n--- USERS COLLECTION ---');
    const usersRef = db.collection('users');
    const usersSnapshot = await usersRef.get();
    
    if (usersSnapshot.empty) {
      console.log('No users found');
    } else {
      console.log(`Found ${usersSnapshot.size} users:`);
      usersSnapshot.forEach(doc => {
        const data = doc.data();
        console.log(`\nUser ID: ${doc.id}`);
        console.log(`Email: ${data.email || 'N/A'}`);
        console.log(`Display Name: ${data.displayName || 'N/A'}`);
        console.log(`Credits: ${data.credits !== undefined ? data.credits : 'N/A'}`);
      });
    }
    
    console.log('\n--- GENERATED IMAGES ---');
    const imagesRef = db.collection('GeneratedImages');
    const imagesSnapshot = await imagesRef.get();
    
    if (imagesSnapshot.empty) {
      console.log('No generated images collections found');
    } else {
      console.log(`Found ${imagesSnapshot.size} image collections`);
      
      for (const doc of imagesSnapshot.docs) {
        console.log(`\nUser images collection: ${doc.id}`);
        
        const userImagesRef = imagesRef.doc(doc.id).collection('images');
        const userImagesSnapshot = await userImagesRef.get();
        
        if (userImagesSnapshot.empty) {
          console.log('  No images in this collection');
        } else {
          console.log(`  Found ${userImagesSnapshot.size} images`);
        }
      }
    }
    
  } catch (error) {
    console.error('Error querying Firestore:', error);
  }
}

// Run the query and exit
queryFirestore()
  .then(() => console.log('\nQuery completed successfully'))
  .catch(error => console.error('Error:', error))
  .finally(() => setTimeout(() => process.exit(0), 1000));
