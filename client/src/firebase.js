// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-4d73f.firebaseapp.com",
  projectId: "mern-estate-4d73f",
  storageBucket: "mern-estate-4d73f.firebasestorage.app",
  messagingSenderId: "440066725989",
  appId: "1:440066725989:web:33aeeecc8b1b0503298e8c"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);