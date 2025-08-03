// Full Firestore Admin Query Tool
import admin from 'firebase-admin';
import fs from 'fs';
import { resolve } from 'path';

// Path to service account file
const serviceAccountPath = resolve(process.cwd(), 'service-account-key.json');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',
  
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  
  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m'
};

// Helper function for pretty timestamps
function formatTimestamp(timestamp) {
  if (!timestamp) return 'N/A';
  
  try {
    if (timestamp.toDate) {
      // Firestore Timestamp
      return timestamp.toDate().toLocaleString();
    } else if (timestamp.seconds) {
      // Firestore Timestamp as raw object
      return new Date(timestamp.seconds * 1000).toLocaleString();
    } else if (timestamp instanceof Date) {
      return timestamp.toLocaleString();
    } else {
      return timestamp.toString();
    }
  } catch (error) {
    return `[Invalid date: ${error.message}]`;
  }
}

// Initialize Firebase Admin
console.log(`${colors.cyan}Loading service account...${colors.reset}`);
let serviceAccount;

try {
  // Read and parse service account file
  const serviceAccountJson = fs.readFileSync(serviceAccountPath, 'utf8');
  serviceAccount = JSON.parse(serviceAccountJson);
  
  console.log(`${colors.green}Service account loaded successfully${colors.reset}`);
  console.log(`Project ID: ${colors.yellow}${serviceAccount.project_id}${colors.reset}`);
} catch (error) {
  console.error(`${colors.red}Failed to load service account: ${error.message}${colors.reset}`);
  process.exit(1);
}

// Initialize the Firebase Admin SDK
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log(`${colors.green}Firebase Admin SDK initialized successfully${colors.reset}`);
} catch (error) {
  console.error(`${colors.red}Failed to initialize Firebase Admin SDK: ${error}${colors.reset}`);
  process.exit(1);
}

// Get Firestore instance
const db = admin.firestore();

// Query Firestore
async function queryFirestore() {
  try {
    // Print header
    console.log(`\n${colors.bgBlue}${colors.white}${colors.bright} FIREBASE DATABASE QUERY RESULTS ${colors.reset}`);
    
    // Get collection references
    const usersRef = db.collection('users');
    const imagesRef = db.collection('GeneratedImages');
    
    // Query Users Collection
    console.log(`\n${colors.bgCyan}${colors.black}${colors.bright} USERS COLLECTION ${colors.reset}`);
    const usersSnapshot = await usersRef.get();
    
    if (usersSnapshot.empty) {
      console.log(`${colors.yellow}No users found${colors.reset}`);
    } else {
      console.log(`${colors.green}Found ${usersSnapshot.size} users:${colors.reset}`);
      usersSnapshot.forEach(doc => {
        const data = doc.data();
        console.log(`\n${colors.bright}${colors.cyan}User ID: ${doc.id}${colors.reset}`);
        console.log(`  ${colors.bright}Email:${colors.reset} ${data.email || 'N/A'}`);
        console.log(`  ${colors.bright}Display Name:${colors.reset} ${data.displayName || 'N/A'}`);
        console.log(`  ${colors.bright}Credits:${colors.reset} ${data.credits !== undefined ? data.credits : 'N/A'}`);
        console.log(`  ${colors.bright}Created:${colors.reset} ${formatTimestamp(data.createdAt)}`);
        console.log(`  ${colors.bright}Last Login:${colors.reset} ${formatTimestamp(data.lastLogin)}`);
        
        // Show other data
        const otherData = { ...data };
        delete otherData.email;
        delete otherData.displayName;
        delete otherData.credits;
        delete otherData.createdAt;
        delete otherData.lastLogin;
        
        if (Object.keys(otherData).length > 0) {
          console.log(`  ${colors.bright}Other Data:${colors.reset}`);
          for (const [key, value] of Object.entries(otherData)) {
            if (typeof value === 'object' && value !== null) {
              console.log(`    ${colors.bright}${key}:${colors.reset} ${JSON.stringify(value)}`);
            } else {
              console.log(`    ${colors.bright}${key}:${colors.reset} ${value}`);
            }
          }
        }
      });
    }
    
    // Query Generated Images Collection
    console.log(`\n${colors.bgMagenta}${colors.white}${colors.bright} GENERATED IMAGES COLLECTION ${colors.reset}`);
    const imagesSnapshot = await imagesRef.get();
    
    if (imagesSnapshot.empty) {
      console.log(`${colors.yellow}No generated images collections found${colors.reset}`);
    } else {
      console.log(`${colors.green}Found ${imagesSnapshot.size} image collections${colors.reset}`);
      
      for (const doc of imagesSnapshot.docs) {
        console.log(`\n${colors.bright}${colors.magenta}User images collection: ${doc.id}${colors.reset}`);
        
        const userImagesRef = imagesRef.doc(doc.id).collection('images');
        const userImagesSnapshot = await userImagesRef.get();
        
        if (userImagesSnapshot.empty) {
          console.log(`  ${colors.yellow}No images in this collection${colors.reset}`);
        } else {
          console.log(`  ${colors.green}Found ${userImagesSnapshot.size} images:${colors.reset}`);
          
          userImagesSnapshot.forEach(imageDoc => {
            const imageData = imageDoc.data();
            console.log(`\n  ${colors.bright}${colors.cyan}Image ID: ${imageDoc.id}${colors.reset}`);
            console.log(`    ${colors.bright}Prompt:${colors.reset} ${imageData.prompt ? 
              (imageData.prompt.length > 100 ? imageData.prompt.substring(0, 100) + '...' : imageData.prompt) : 'N/A'}`);
            console.log(`    ${colors.bright}Model:${colors.reset} ${imageData.modelUsed || 'N/A'}`);
            console.log(`    ${colors.bright}Dimensions:${colors.reset} ${imageData.width || 'N/A'} x ${imageData.height || 'N/A'}`);
            console.log(`    ${colors.bright}Created:${colors.reset} ${formatTimestamp(imageData.timestamp)}`);
            
            if (imageData.imageURL) {
              console.log(`    ${colors.bright}Image URL:${colors.reset} ${imageData.imageURL}`);
            }
          });
        }
      }
    }
    
    // Add other collections as needed
    // For example, you might want to check for specific configurations or settings
    
  } catch (error) {
    console.error(`${colors.red}Error querying Firestore: ${error}${colors.reset}`);
  }
}

// Run the query and exit
queryFirestore()
  .then(() => console.log(`\n${colors.green}Query completed successfully${colors.reset}`))
  .catch(error => console.error(`${colors.red}Error: ${error}${colors.reset}`))
  .finally(() => setTimeout(() => process.exit(0), 1000));
