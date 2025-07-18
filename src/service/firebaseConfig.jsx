// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDIl6QNEKfg0343rr-9MmCBL22e-cQJ2iw",
  authDomain: "aitravelplanapp-ff8eb.firebaseapp.com",
  projectId: "aitravelplanapp-ff8eb",
  storageBucket: "aitravelplanapp-ff8eb.firebasestorage.app",
  messagingSenderId: "1054149890826",
  appId: "1:1054149890826:web:2068820f2676cdc31b20f3",
  measurementId: "G-Q6Q4Y3DSM6"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
//const analytics = getAnalytics(app);