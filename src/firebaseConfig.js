// src/firebaseConfig.js
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD2TlY6TcNKnjlJWOq1yi4dLN8mOQSPogc",
  authDomain: "fit-fusion-85e53.firebaseapp.com",
  projectId: "fit-fusion-85e53",
  storageBucket: "fit-fusion-85e53.firebasestorage.app",
  messagingSenderId: "352614383685",
  appId: "1:352614383685:web:f838cdce106ae50e65e32c",
  measurementId: "G-053JGLKWBK"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

