// cleanup-for-deploy.js
// Script to remove all non-essential files before deployment to Netlify

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Files to keep (relative paths)
const filesToKeep = [
  'README.md', // Keep the main README
  'firebase.json',
  'firestore.rules',
  'firestore.indexes.json',
  'service-account-key.json',
  'netlify.toml'
];

// List of files/directories to remove
const toRemove = [
  // All markdown files except README.md
  'UPDATE-GUIDE.md',
  'STRUCTURE-UPDATE.md',
  'MIGRATION-UPDATE.md',
  'MIGRATION-GUIDE.md',
  'IMAGE-DISTRIBUTION-UPDATE.md',
  'DATABASE-MIGRATION-GUIDE.md',
  
  // Batch files
  'query-firebase.bat',
  'scripts/query-firebase.bat',
  
  // Test and utility scripts
  'scripts/test-user-creation.js',
  'scripts/query-firestore.js',
  'scripts/create-test-user.js',
  'scripts/create-sample-structure.js',
  'scripts/check-service-account.js',
  'scripts/check-firebase.js',
  'scripts/check-current-user.js',
  'scripts/validate-structure.js',
  'scripts/migrate-users.js',
  'scripts/migrate-users-esm.js',
  'scripts/migrate-users-cjs.js',
  'scripts/migrate-data.js',
  'scripts/redistribute-images.js',
  'scripts/redistribute-images-esm.js',
  'scripts/cleanup-test-data.js',
  
  // Script directory markdown files
  'scripts/README-FIREBASE-ACCESS.md',
  'scripts/MIGRATION-README.md'
];

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('Starting cleanup for deployment...');

// Process each file to remove
let removedCount = 0;
let errorCount = 0;

toRemove.forEach(filePath => {
  try {
    const fullPath = path.join(rootDir, filePath);
    
    // Check if file exists before attempting to remove
    if (fs.existsSync(fullPath)) {
      // Check if it's in the keep list
      const relativePath = path.relative(rootDir, fullPath);
      const fileName = path.basename(fullPath);
      
      if (filesToKeep.includes(fileName)) {
        console.log(`Keeping ${relativePath}`);
        return;
      }
      
      if (fs.statSync(fullPath).isDirectory()) {
        // We won't remove directories for safety
        console.log(`Skipping directory: ${relativePath}`);
      } else {
        // Remove the file
        fs.unlinkSync(fullPath);
        console.log(`Removed: ${relativePath}`);
        removedCount++;
      }
    } else {
      console.log(`File not found: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    errorCount++;
  }
});

console.log(`
Cleanup complete!
Files removed: ${removedCount}
Errors: ${errorCount}

Your project is now ready for deployment to Netlify!
`);
