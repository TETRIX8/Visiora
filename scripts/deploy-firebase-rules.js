// Check Firebase security rules and output deployment instructions
import { initializeApp, cert } from 'firebase-admin/app';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load service account key
console.log('Loading service account from:', resolve(__dirname, '../service-account-key.json'));
try {
  const serviceAccountPath = resolve(__dirname, '../service-account-key.json');
  const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

  // Initialize Firebase Admin SDK
  console.log(`Project ID: ${serviceAccount.project_id}`);
  initializeApp({
    credential: cert(serviceAccount)
  });

  console.log('Firebase Admin SDK initialized successfully');
  
  // Print out rules deployment instructions
  console.log('\n===== DEPLOYMENT INSTRUCTIONS =====');
  console.log('To deploy the new security rules:');
  
  console.log('\n1. Install Firebase CLI if not already installed:');
  console.log('   npm install -g firebase-tools');
  
  console.log('\n2. Login to Firebase (if not already logged in):');
  console.log('   firebase login');
  
  console.log('\n3. Initialize Firebase project (if not already done):');
  console.log('   firebase init firestore');
  console.log('   (Select your project when prompted)');
  
  console.log('\n4. Deploy the new rules:');
  console.log('   firebase deploy --only firestore:rules');
  
  console.log('\nThe rules file has been created at: firestore.rules');
  console.log('\n================================');
  
} catch (error) {
  console.error('Error:', error);
}
