// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCJCSZNbkiCDwwM3Q7xr_CIKWjRazjaHrk",
  authDomain: "taskmangementapp-136a5.firebaseapp.com",
  projectId: "taskmangementapp-136a5",
  storageBucket: "taskmangementapp-136a5.firebasestorage.app",
  messagingSenderId: "457245747806",
  appId: "1:457245747806:web:4893c40a8b540cd881e2cf",
  measurementId: "G-CFJJB3D5SK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
