// Firebase database viewer script
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, getDoc } = require('firebase/firestore');

// Your Firebase configuration (same as in src/lib/firebase.js)
const firebaseConfig = {
  apiKey: "AIzaSyBUI4TCLHF52tNtONRGewB6waoiuE649UI",
  authDomain: "visiora-img.firebaseapp.com",
  projectId: "visiora-img",
  storageBucket: "visiora-img.firebasestorage.app",
  messagingSenderId: "265993694120",
  appId: "1:265993694120:web:58c767ee82e7d686670b9d",
  measurementId: "G-G79442HTMX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Helper function to view all documents in a collection
async function viewCollection(collectionName) {
  console.log(`\n===== Viewing all documents in collection: ${collectionName} =====`);
  
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    
    if (querySnapshot.empty) {
      console.log(`No documents found in collection: ${collectionName}`);
      return;
    }
    
    console.log(`Found ${querySnapshot.size} documents:\n`);
    
    querySnapshot.forEach(doc => {
      console.log(`Document ID: ${doc.id}`);
      console.log('Data:', JSON.stringify(doc.data(), null, 2));
      console.log('-'.repeat(50));
    });
  } catch (error) {
    console.error(`Error viewing collection ${collectionName}:`, error);
  }
}

// Helper function to view a specific document
async function viewDocument(collectionName, documentId) {
  console.log(`\n===== Viewing document: ${collectionName}/${documentId} =====`);
  
  try {
    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      console.log('Document data:', JSON.stringify(docSnap.data(), null, 2));
    } else {
      console.log(`Document ${collectionName}/${documentId} does not exist`);
    }
  } catch (error) {
    console.error(`Error viewing document ${collectionName}/${documentId}:`, error);
  }
}

// Main function
async function main() {
  // View the "users" collection
  await viewCollection('users');
  
  // View the "GeneratedImages" collection
  await viewCollection('GeneratedImages');
  
  // If you know a specific user ID, you can view their details:
  // Uncomment and replace USER_ID with actual ID
  // await viewDocument('users', 'USER_ID');
  
  console.log('\nDatabase viewing complete');
  process.exit(0);
}

// Run the script
main().catch(error => {
  console.error('Error running script:', error);
  process.exit(1);
});
