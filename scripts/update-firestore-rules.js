// Update Firestore Security Rules
// This script uses the Firebase Admin SDK to update your security rules
// You need to have a service account key file

// Load environment variables
import 'dotenv/config';
import { resolve } from 'path';
import * as fs from 'fs';

// Import admin SDK
import * as admin from 'firebase-admin';

// Get service account path from env or use default path
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || 
                          resolve(process.cwd(), 'service-account-key.json');

try {
  // Initialize the admin SDK
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountPath)
  });

  console.log('Successfully initialized Firebase Admin SDK');
} catch (error) {
  console.error('Failed to initialize Firebase Admin SDK:', error.message);
  console.log('\nPlease download your service account key from Firebase console.');
  process.exit(1);
}

// Default security rules that allow admin access while keeping regular user restrictions
const defaultRules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Common functions for validation
    function isSignedIn() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    function isAdmin() {
      return request.auth.uid in get(/databases/$(database)/documents/adminRoles/admins).data.adminIds;
    }
    
    // Users collection
    match /users/{userId} {
      // Users can read their own document
      // Admins can read/write all user documents
      allow get, update: if isSignedIn() && (isOwner(userId) || isAdmin());
      allow create: if isSignedIn() && isOwner(userId);
      // Only admins can list all users
      allow list: if isSignedIn() && isAdmin();
    }
    
    // Generated images collection
    match /GeneratedImages/{userId} {
      allow read, write: if isSignedIn() && (isOwner(userId) || isAdmin());
      
      match /images/{imageId} {
        allow read, write: if isSignedIn() && (isOwner(userId) || isAdmin());
      }
    }
    
    // Admin roles collection
    match /adminRoles/{document=**} {
      allow read: if isSignedIn();
      allow write: if isSignedIn() && isAdmin();
    }
  }
}`;

// Function to update security rules
async function updateSecurityRules() {
  try {
    console.log('Preparing to update Firestore security rules...');
    
    // First, let's create a temporary rules file
    const tempRulesFile = resolve(process.cwd(), 'firestore.rules');
    fs.writeFileSync(tempRulesFile, defaultRules);
    console.log('Temporary rules file created');
    
    console.log('\nTo update your security rules:');
    console.log('1. Install Firebase CLI if you haven\'t already:');
    console.log('   npm install -g firebase-tools');
    console.log('\n2. Log in to Firebase:');
    console.log('   firebase login');
    console.log('\n3. Deploy the rules:');
    console.log('   firebase deploy --only firestore:rules');
    console.log('\nThe rules file has been created at:', tempRulesFile);
    
    // Also create a file to initialize admin role
    const adminInitScript = `// Initialize Admin Role
import * as admin from 'firebase-admin';
import { resolve } from 'path';
import 'dotenv/config';

// Get service account path from env or use default path
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || 
                          resolve(process.cwd(), 'service-account-key.json');

// Initialize the admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountPath)
});

// Get Firestore reference
const db = admin.firestore();

async function initializeAdminRole(adminEmail) {
  try {
    // First, find the user by email
    const usersSnapshot = await db.collection('users').where('email', '==', adminEmail).get();
    
    if (usersSnapshot.empty) {
      console.error('No user found with email:', adminEmail);
      return false;
    }
    
    const userDoc = usersSnapshot.docs[0];
    const userId = userDoc.id;
    
    console.log('Found user:', userId, 'with email:', adminEmail);
    
    // Create or update the adminRoles document
    await db.collection('adminRoles').doc('admins').set({
      adminIds: admin.firestore.FieldValue.arrayUnion(userId),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    
    console.log('Successfully added user as admin');
    return true;
  } catch (error) {
    console.error('Error setting admin role:', error);
    return false;
  }
}

// Execute with command line argument for admin email
const adminEmail = process.argv[2];

if (!adminEmail) {
  console.error('Please provide admin email as argument:');
  console.error('node set-admin.js your-admin-email@example.com');
  process.exit(1);
}

initializeAdminRole(adminEmail)
  .then(success => {
    if (success) {
      console.log('Admin role setup complete for:', adminEmail);
    } else {
      console.error('Failed to set up admin role');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(err => {
    console.error('Unexpected error:', err);
    process.exit(1);
  });`;
    
    // Create the admin initialization script
    const adminScriptFile = resolve(process.cwd(), 'scripts', 'set-admin.js');
    fs.writeFileSync(adminScriptFile, adminInitScript);
    console.log('\nCreated admin initialization script at:', adminScriptFile);
    console.log('To set yourself as admin, run:');
    console.log('node scripts/set-admin.js your-email@example.com');
    
  } catch (error) {
    console.error('Error updating security rules:', error);
  }
}

// Execute the update
updateSecurityRules().catch(err => {
  console.error("Top level error:", err);
});
