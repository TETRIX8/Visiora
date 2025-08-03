// Detailed Firestore Query Tool with Subcollections Support
import admin from 'firebase-admin';
import fs from 'fs';
import { resolve } from 'path';
import chalk from 'chalk';

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

// Helper function to format timestamps
function formatTimestamp(timestamp) {
  if (!timestamp) return 'N/A';
  
  try {
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleString();
    } else if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleString();
    } else if (timestamp instanceof Date) {
      return timestamp.toLocaleString();
    } else {
      return String(timestamp);
    }
  } catch (error) {
    return `[Invalid timestamp: ${error.message}]`;
  }
}

// Get Firestore instance
const db = admin.firestore();

// Function to recursively list all collections and subcollections
async function listAllCollections(db, path = '') {
  const collections = [];
  
  try {
    // Get collections from current path
    let collectionsRef;
    if (path === '') {
      collectionsRef = await db.listCollections();
    } else {
      collectionsRef = await db.doc(path).listCollections();
    }
    
    for (const collection of collectionsRef) {
      const collectionPath = path === '' ? collection.id : `${path}/${collection.id}`;
      collections.push(collectionPath);
      
      // Get documents in this collection
      const docsSnap = await collection.get();
      
      // Recursively check each document for subcollections
      for (const doc of docsSnap.docs) {
        const docPath = path === '' 
          ? `${collection.id}/${doc.id}`
          : `${path}/${collection.id}/${doc.id}`;
        
        const subCollections = await listAllCollections(db, docPath);
        collections.push(...subCollections);
      }
    }
  } catch (error) {
    console.error(`Error listing collections at ${path}: ${error.message}`);
  }
  
  return collections;
}

// Query Firestore with detailed subcollection support
async function queryFirestore() {
  console.log('\n===============================================');
  console.log('          FIREBASE DATABASE QUERY              ');
  console.log('===============================================\n');
  
  // First get a list of all collections to understand the database structure
  console.log(chalk.cyan.bold('Mapping database structure...'));
  const allCollections = await listAllCollections(db);
  console.log(chalk.yellow.bold('\nDatabase collections structure:'));
  
  // Group collections by parent path for better visualization
  const collectionTree = {};
  
  allCollections.forEach(path => {
    const parts = path.split('/');
    
    if (parts.length === 1) {
      // Top-level collection
      if (!collectionTree[path]) {
        collectionTree[path] = [];
      }
    } else {
      // Nested collection
      const parentPath = parts.slice(0, parts.length - 1).join('/');
      const collName = parts[parts.length - 1];
      
      if (!collectionTree[parentPath]) {
        collectionTree[parentPath] = [];
      }
      collectionTree[parentPath].push(collName);
    }
  });
  
  // Display the tree structure
  Object.keys(collectionTree).sort().forEach(path => {
    const indent = '  '.repeat(path.split('/').length - 1);
    
    if (path.includes('/')) {
      console.log(chalk.cyan(`${indent}└── ${path}`));
    } else {
      console.log(chalk.green.bold(`${path}`));
    }
    
    // Show children
    collectionTree[path].forEach(child => {
      if (child.includes('/')) {
        const childPath = `${path}/${child}`;
        console.log(chalk.blue(`${indent}  └── ${childPath}`));
      }
    });
  });
  
  try {
    // 1. Query Users Collection
    console.log('\n' + chalk.bgBlue.white.bold('-----------------------------------------------'));
    console.log(chalk.bgBlue.white.bold('               USERS COLLECTION                '));
    console.log(chalk.bgBlue.white.bold('-----------------------------------------------'));
    
    const usersRef = db.collection('users');
    const usersSnapshot = await usersRef.get();
    
    if (usersSnapshot.empty) {
      console.log(chalk.red('No users found in the database'));
    } else {
      console.log(chalk.green(`Found ${chalk.yellow.bold(usersSnapshot.size)} users:`));
      
      // Display user data
      for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data();
        const userId = userDoc.id;
        
        console.log(`\n${chalk.cyan.bold('User ID:')} ${chalk.yellow(userId)}`);
        console.log(`  ${chalk.dim('Email:')} ${userData.email || chalk.gray('N/A')}`);
        console.log(`  ${chalk.dim('Display Name:')} ${userData.displayName || chalk.gray('N/A')}`);
        console.log(`  ${chalk.dim('Credits:')} ${userData.credits !== undefined ? chalk.green(userData.credits) : chalk.gray('N/A')}`);
        console.log(`  ${chalk.dim('Created:')} ${chalk.blue(formatTimestamp(userData.createdAt))}`);
        console.log(`  ${chalk.dim('Last Login:')} ${chalk.blue(formatTimestamp(userData.lastLogin))}`);
        
        // Additional user data
        const additionalFields = Object.keys(userData).filter(key => 
          !['email', 'displayName', 'credits', 'createdAt', 'lastLogin'].includes(key)
        );
        
        if (additionalFields.length > 0) {
          console.log(`  ${chalk.dim.underline('Additional Data:')}`);
          for (const key of additionalFields) {
            const value = userData[key];
            if (typeof value === 'object' && value !== null && !value.toDate) {
              console.log(`    ${chalk.dim(key)}: ${chalk.italic(JSON.stringify(value))}`);
            } else {
              console.log(`    ${chalk.dim(key)}: ${value}`);
            }
          }
        }
      }
    }
    
    // 2. Direct query for GeneratedImages collection - CORRECTED FOR NESTED STRUCTURE
    console.log('\n' + chalk.bgMagenta.white.bold('-----------------------------------------------'));
    console.log(chalk.bgMagenta.white.bold('          GENERATED IMAGES COLLECTION           '));
    console.log(chalk.bgMagenta.white.bold('-----------------------------------------------'));
    
    // Use the users collection we already have
    const usersSnap = usersSnapshot; // reuse from earlier query
    
    let imagesFound = false;
    
    for (const userDoc of usersSnap.docs) {
      const userId = userDoc.id;
      console.log(`\nChecking images for user: ${userId}`);
      
      // Step 1: Check user's GeneratedImages collection (subcollection of user)
      const userGenImagesRef = db.collection('users').doc(userId).collection('GeneratedImages');
      let userGenImagesSnap = await userGenImagesRef.get();
      
      // Step 2: Also check top-level GeneratedImages/{userId} path
      const topLevelGenImagesRef = db.collection('GeneratedImages').doc(userId);
      const topLevelGenImagesDoc = await topLevelGenImagesRef.get();
      
      if (topLevelGenImagesDoc.exists) {
        console.log(`  Found top-level GeneratedImages/${userId} document`);
        
        // List all subcollections of this document
        const subcollections = await topLevelGenImagesRef.listCollections();
        console.log(`  Found ${subcollections.length} subcollections in GeneratedImages/${userId}`);
        
        // Check each subcollection (one should be 'images' or might be a specific document ID)
        for (const subcoll of subcollections) {
          const subcollName = subcoll.id;
          console.log(`    Subcollection: ${subcollName}`);
          
          const imagesSnap = await subcoll.get();
          if (!imagesSnap.empty) {
            imagesFound = true;
            console.log(`    Found ${imagesSnap.size} images in ${subcollName}:`);
            
            for (const imageDoc of imagesSnap.docs) {
              const imageData = imageDoc.data();
              console.log(`\n      Image ID: ${imageDoc.id}`);
              
              // Display image data
              if (imageData.prompt) {
                console.log(`        Prompt: ${imageData.prompt}`);
              } else {
                console.log(`        Prompt: N/A`);
              }
              
              console.log(`        Model: ${imageData.modelUsed || imageData.model || 'N/A'}`);
              console.log(`        Dimensions: ${imageData.width || 'N/A'} x ${imageData.height || 'N/A'}`);
              console.log(`        Created: ${formatTimestamp(imageData.timestamp || imageData.createdAt)}`);
              
              if (imageData.imageURL) {
                console.log(`        Image URL: ${imageData.imageURL.substring(0, 75)}...`);
              }
              
              // Additional image data
              const additionalFields = Object.keys(imageData).filter(key => 
                !['prompt', 'modelUsed', 'model', 'width', 'height', 'timestamp', 'createdAt', 'imageURL'].includes(key)
              );
              
              if (additionalFields.length > 0) {
                console.log('        Additional Data:');
                for (const key of additionalFields) {
                  const value = imageData[key];
                  if (typeof value === 'object' && value !== null && !value.toDate) {
                    console.log(`          ${key}: ${JSON.stringify(value)}`);
                  } else {
                    console.log(`          ${key}: ${value}`);
                  }
                }
              }
            }
          } else {
            console.log(`    No images found in subcollection ${subcollName}`);
          }
        }
      }
    }
    
    if (!imagesFound) {
      console.log(chalk.yellow('\nNo images found for any users using standard paths.'));
      console.log(chalk.yellow('Checking alternative structure based on database mapping...'));
      
      // Check the specific structure we found in the database mapping
      for (const userDoc of usersSnap.docs) {
        const userId = userDoc.id;
        console.log(chalk.cyan(`\nChecking direct GeneratedImages subcollection for user: ${chalk.yellow(userId)}`));
        
        // Try to access the GeneratedImages subcollection directly
        const imagesRef = db.collection('users').doc(userId).collection('GeneratedImages');
        const imagesSnapshot = await imagesRef.get();
        
        if (imagesSnapshot.empty) {
          console.log(chalk.red(`  No images found in users/${userId}/GeneratedImages`));
        } else {
          console.log(chalk.green(`  Found ${chalk.yellow.bold(imagesSnapshot.size)} documents in users/${userId}/GeneratedImages`));
          imagesFound = true;
          
          // Process each document in the GeneratedImages collection
          for (const imageDoc of imagesSnapshot.docs) {
            const imageId = imageDoc.id;
            const imageData = imageDoc.data();
            
            console.log(`\n  ${chalk.cyan('▶')} ${chalk.green(`Image Document: ${chalk.yellow(imageId)}`)}`);
            
            // Display known fields
            if (Object.keys(imageData).length > 0) {
              Object.entries(imageData).forEach(([key, value]) => {
                if (key === 'imageURL' && typeof value === 'string') {
                  console.log(`    ${chalk.dim(key)}: ${chalk.blue.underline(value.substring(0, 50) + '...')}`);
                } else if (value && typeof value === 'object' && value.toDate) {
                  console.log(`    ${chalk.dim(key)}: ${chalk.blue(formatTimestamp(value))}`);
                } else if (typeof value === 'object') {
                  console.log(`    ${chalk.dim(key)}: ${chalk.italic(JSON.stringify(value))}`);
                } else {
                  console.log(`    ${chalk.dim(key)}: ${value}`);
                }
              });
            } else {
              console.log(chalk.yellow(`    Document exists but contains no data`));
            }
            
            // Check if this document has subcollections
            const subCollections = await imageDoc.ref.listCollections();
            if (subCollections.length > 0) {
              console.log(chalk.green(`    This image document has ${chalk.yellow.bold(subCollections.length)} subcollections`));
              
              for (const subColl of subCollections) {
                const subCollName = subColl.id;
                console.log(`    ${chalk.cyan('Subcollection:')} ${chalk.magenta(subCollName)}`);
                
                const subCollDocs = await subColl.get();
                if (!subCollDocs.empty) {
                  console.log(chalk.green(`      Contains ${chalk.yellow.bold(subCollDocs.size)} documents`));
                  
                  // Display detailed data from each document in subcollection
                  console.log(chalk.green(`      Displaying full details of all ${chalk.yellow.bold(subCollDocs.size)} documents:`));
                  
                  let count = 0;
                  for (const subDoc of subCollDocs.docs) {
                    count++;
                    const subDocData = subDoc.data();
                    const isLast = count === subCollDocs.size;
                    
                    console.log(`\n      ${chalk.cyan(isLast ? '└──' : '├──') + ' Document'} ${chalk.yellow(count)}: ${chalk.green(subDoc.id)}`);
                    
                    // Display all fields with proper formatting
                    if (Object.keys(subDocData).length > 0) {
                      const prefix = isLast ? '        ' : '│       ';
                      
                      Object.entries(subDocData).forEach(([key, value], i, arr) => {
                        const isLastProp = i === arr.length - 1;
                        const propPrefix = isLastProp ? `${prefix}└──` : `${prefix}├──`;
                        
                        if (key === 'imageURL' && typeof value === 'string') {
                          console.log(`${propPrefix} ${chalk.dim(key)}: ${chalk.blue.underline(value)}`);
                        } else if (key === 'prompt' && typeof value === 'string') {
                          console.log(`${propPrefix} ${chalk.dim(key)}: ${chalk.yellow('"' + value + '"')}`);
                        } else if (value && typeof value === 'object' && value.toDate) {
                          console.log(`${propPrefix} ${chalk.dim(key)}: ${chalk.blue(formatTimestamp(value))}`);
                        } else if (typeof value === 'object' && value !== null) {
                          console.log(`${propPrefix} ${chalk.dim(key)}: ${chalk.italic(JSON.stringify(value))}`);
                        } else {
                          console.log(`${propPrefix} ${chalk.dim(key)}: ${value}`);
                        }
                      });
                    } else {
                      console.log(`      ${chalk.yellow('Document exists but contains no data')}`);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    
    if (!imagesFound) {
      console.log(chalk.red('\nNo images found in any structure after exhaustive search.'));
    }
    
    // 3. Special check for nested document structure as seen in screenshots
    console.log('\n' + chalk.bgGreen.black.bold('-----------------------------------------------'));
    console.log(chalk.bgGreen.black.bold('          DEEPLY NESTED IMAGE DOCUMENTS          '));
    console.log(chalk.bgGreen.black.bold('-----------------------------------------------'));
    
    // This section specifically looks for the structure seen in your screenshots
    // GeneratedImages/{userId} -> {documentId} -> {imageCollectionId} -> {imageDocumentId}
    
    const topGenImagesRef = db.collection('GeneratedImages');
    const topGenSnapshot = await topGenImagesRef.get();
    
    if (topGenSnapshot.empty) {
      console.log('No GeneratedImages collection documents found');
    } else {
      console.log(`Found ${topGenSnapshot.size} documents in GeneratedImages collection`);
      
      for (const userDoc of topGenSnapshot.docs) {
        const userId = userDoc.id;
        console.log(`\n${chalk.cyan.bold('Checking special nested structure for user:')} ${chalk.yellow(userId)}`);
        
        try {
          // Get all subcollections of the GeneratedImages/{userId} document
          const collections = await topGenImagesRef.doc(userId).listCollections();
          
          if (collections.length === 0) {
            console.log(chalk.red(`  No subcollections found for this user in GeneratedImages`));
          } else {
            console.log(chalk.green(`  Found ${chalk.yellow.bold(collections.length)} subcollections for this user`));
            
            // Check each subcollection (like H2mOSgElLqzsreG86mCo in your screenshot)
            for (const collection of collections) {
              const collName = collection.id;
              console.log(`  ${chalk.cyan('Processing subcollection:')} ${chalk.magenta(collName)}`);
              
              // Get documents in this collection 
              const docsSnap = await collection.get();
              
              if (docsSnap.empty) {
                console.log(chalk.red(`    No documents in subcollection ${collName}`));
              } else {
                console.log(chalk.green(`    Found ${chalk.yellow.bold(docsSnap.size)} documents in subcollection ${collName}`));
                
                // Try to get subcollections of each document (like img1 in your screenshot)
                for (const doc of docsSnap.docs) {
                  const docId = doc.id;
                  const docRef = collection.doc(docId);
                  
                  const subSubCollections = await docRef.listCollections();
                  
                  if (subSubCollections.length > 0) {
                    console.log(`    ${chalk.blue('▶')} ${chalk.cyan(`Document ${chalk.yellow(docId)} has ${chalk.yellow.bold(subSubCollections.length)} subcollections`)}`);
                    
                    for (const subSubColl of subSubCollections) {
                      const subSubName = subSubColl.id;
                      const imagesSnap = await subSubColl.get();
                      
                      if (!imagesSnap.empty) {
                        console.log(chalk.green(`      Found ${chalk.yellow.bold(imagesSnap.size)} images in subcollection ${chalk.magenta(subSubName)}:`));
                        
                        let imageCount = 0;
                        for (const imageDoc of imagesSnap.docs) {
                          imageCount++;
                          const imageData = imageDoc.data();
                          const isLastImage = imageCount === imagesSnap.size;
                          const prefix = isLastImage ? '└── ' : '├── ';
                          
                          console.log(`\n        ${chalk.cyan(prefix + 'Image')} ${chalk.yellow(imageCount)}: ${chalk.green(imageDoc.id)}`);
                          console.log(`        ${isLastImage ? '    ' : '│   '}${chalk.dim('Prompt:')} ${imageData.prompt || chalk.gray('N/A')}`);
                          console.log(`        ${isLastImage ? '    ' : '│   '}${chalk.dim('Model:')} ${imageData.modelUsed || imageData.model || chalk.gray('N/A')}`);
                          console.log(`        ${isLastImage ? '    ' : '│   '}${chalk.dim('Dimensions:')} ${imageData.width || chalk.gray('N/A')} x ${imageData.height || chalk.gray('N/A')}`);
                          
                          if (imageData.imageURL) {
                            const urlPreview = imageData.imageURL.length > 50 
                              ? imageData.imageURL.substring(0, 50) + '...' 
                              : imageData.imageURL;
                            console.log(`        ${isLastImage ? '    ' : '│   '}${chalk.dim('URL:')} ${chalk.blue.underline(urlPreview)}`);
                          }
                        }
                      } else {
                        console.log(chalk.red(`      No image documents in subcollection ${chalk.magenta(subSubName)}`));
                      }
                    }
                  } else {
                    console.log(`    ${chalk.blue('▶')} ${chalk.cyan(`Document ${chalk.yellow(docId)} has no subcollections`)}`);
                    // Maybe it's a direct image document?
                    const imageData = doc.data();
                    if (imageData.prompt || imageData.imageURL) {
                      console.log(chalk.green(`      Document ${chalk.yellow(docId)} appears to be an image document itself:`));
                      console.log(`        ${chalk.dim('Prompt:')} ${imageData.prompt || chalk.gray('N/A')}`);
                      
                      if (imageData.imageURL) {
                        const urlPreview = imageData.imageURL.length > 50 
                          ? imageData.imageURL.substring(0, 50) + '...' 
                          : imageData.imageURL;
                        console.log(`        ${chalk.dim('URL:')} ${chalk.blue.underline(urlPreview)}`);
                      }
                    }
                  }
                }
              }
            }
          }
        } catch (error) {
          console.error(`  Error checking nested structure: ${error.message}`);
        }
      }
    }
    
    console.log('\n' + chalk.bgCyan.black.bold('==============================================='));
    console.log(chalk.bgCyan.black.bold('          FIREBASE QUERY COMPLETE               '));
    console.log(chalk.bgCyan.black.bold('===============================================') + '\n');
    
  } catch (error) {
    console.error(chalk.red('Error querying Firestore:'), error);
  }
}

// Run query
queryFirestore()
  .then(() => console.log(chalk.green.bold('✓ Query completed successfully')))
  .catch(error => console.error(chalk.red('✗ Error during query:'), error))
  .finally(() => setTimeout(() => process.exit(0), 1000));
