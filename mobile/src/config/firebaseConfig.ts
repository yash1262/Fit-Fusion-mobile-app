// Firebase Configuration for Mobile
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD2TlY6TcNKnjlJWOq1yi4dLN8mOQSPogc",
  authDomain: "fit-fusion-85e53.firebaseapp.com",
  projectId: "fit-fusion-85e53",
  storageBucket: "fit-fusion-85e53.firebasestorage.app",
  messagingSenderId: "352614383685",
  appId: "1:352614383685:web:f838cdce106ae50e65e32c",
  measurementId: "G-053JGLKWBK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
