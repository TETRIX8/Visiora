// Firebase configuration and initialization
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// Replace with your actual Firebase config from Firebase console
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

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
