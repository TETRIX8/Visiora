// Query Firestore Database using Admin SDK
// This script uses the Firebase Admin SDK to access Firestore with elevated privileges
// You need to download your service account key from Firebase console

// Using ES modules as required by the project
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import * as admin from 'firebase-admin';

// For ES modules __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Try to load dotenv if available
try {
  import('dotenv').then(dotenv => dotenv.config());
} catch (err) {
  console.log('dotenv not available, continuing without it');
}

// Get service account path from env or use default path
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || 
                          resolve(process.cwd(), 'service-account-key.json');

try {
  // Load the service account key directly from the file
  const serviceAccount = JSON.parse(await import('fs').then(fs => 
    fs.promises.readFile(serviceAccountPath, 'utf8')
  ));
  
  // Initialize the admin SDK
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  console.log('Successfully initialized Firebase Admin SDK');
} catch (error) {
  console.error('Failed to initialize Firebase Admin SDK:', error.message);
  console.log('\nPlease download your service account key from Firebase console:');
  console.log('1. Go to Project settings > Service accounts');
  console.log('2. Click "Generate new private key"');
  console.log('3. Save the file as "service-account-key.json" in your project root');
  console.log('\nAlternatively, set the GOOGLE_APPLICATION_CREDENTIALS environment variable to the path of your key file.');
  process.exit(1);
}

// Get Firestore reference
const db = admin.firestore();

async function queryFirestore() {
  try {
    // Get all collections we're interested in
    console.log('--- QUERYING FIRESTORE DATABASE (ADMIN MODE) ---');
    
    // Query Users Collection
    console.log('\n--- USERS COLLECTION ---');
    const usersSnapshot = await db.collection('users').get();
    if (usersSnapshot.empty) {
      console.log('No users found in the database');
    } else {
      console.log(`Found ${usersSnapshot.size} users:`);
      usersSnapshot.forEach(doc => {
        const userData = doc.data();
        // Format output for better readability
        console.log(`\nUser ID: ${doc.id}`);
        console.log(`  Email: ${userData.email || 'N/A'}`);
        console.log(`  Display Name: ${userData.displayName || 'N/A'}`);
        console.log(`  Credits: ${userData.credits !== undefined ? userData.credits : 'N/A'}`);
        // Handle timestamp objects safely
        let createdDate = 'N/A';
        let loginDate = 'N/A';
        
        try {
          if (userData.createdAt && typeof userData.createdAt.toDate === 'function') {
            createdDate = new Date(userData.createdAt.toDate()).toLocaleString();
          } else if (userData.createdAt && userData.createdAt.seconds) {
            createdDate = new Date(userData.createdAt.seconds * 1000).toLocaleString();
          }
        } catch (e) {
          console.log('  Error formatting createdAt date:', e.message);
        }
        
        try {
          if (userData.lastLogin && typeof userData.lastLogin.toDate === 'function') {
            loginDate = new Date(userData.lastLogin.toDate()).toLocaleString();
          } else if (userData.lastLogin && userData.lastLogin.seconds) {
            loginDate = new Date(userData.lastLogin.seconds * 1000).toLocaleString();
          }
        } catch (e) {
          console.log('  Error formatting lastLogin date:', e.message);
        }
        
        console.log(`  Created: ${createdDate}`);
        console.log(`  Last Login: ${loginDate}`);
      });
    }
    
    // Query Generated Images Collection
    console.log('\n--- GENERATED IMAGES COLLECTION ---');
    const imagesSnapshot = await db.collection('GeneratedImages').get();
    if (imagesSnapshot.empty) {
      console.log('No generated images found in the database');
    } else {
      console.log(`Found ${imagesSnapshot.size} image collections`);
      
      // Loop through image collections by user
      for (const collectionDoc of imagesSnapshot.docs) {
        const userId = collectionDoc.id;
        console.log(`\nImages for User: ${userId}`);
        
        // Get user's images subcollection
        const userImagesSnapshot = await db.collection('GeneratedImages').doc(userId).collection('images').get();
        
        if (userImagesSnapshot.empty) {
          console.log('  No images found for this user');
        } else {
          console.log(`  Found ${userImagesSnapshot.size} images:`);
          userImagesSnapshot.forEach(imageDoc => {
            const imageData = imageDoc.data();
            console.log(`\n  Image ID: ${imageDoc.id}`);
            console.log(`    Prompt: ${imageData.prompt ? (imageData.prompt.length > 50 ? imageData.prompt.substring(0, 50) + '...' : imageData.prompt) : 'N/A'}`);
            console.log(`    Model: ${imageData.modelUsed || 'N/A'}`);
            console.log(`    Dimensions: ${imageData.width || 'N/A'} x ${imageData.height || 'N/A'}`);
            // Handle timestamp objects safely
            let timestampStr = 'N/A';
            try {
              if (imageData.timestamp && typeof imageData.timestamp.toDate === 'function') {
                timestampStr = new Date(imageData.timestamp.toDate()).toLocaleString();
              } else if (imageData.timestamp && imageData.timestamp.seconds) {
                timestampStr = new Date(imageData.timestamp.seconds * 1000).toLocaleString();
              }
            } catch (e) {
              console.log('    Error formatting timestamp:', e.message);
            }
            console.log(`    Created: ${timestampStr}`);
          });
        }
      }
    }
  } catch (error) {
    console.error('Error querying Firestore:', error);
  }
}

// Execute the query
queryFirestore().catch(err => {
  console.error("Top level error:", err);
}).finally(() => {
  // Ensure the script exits when done
  setTimeout(() => process.exit(0), 1000);
});
