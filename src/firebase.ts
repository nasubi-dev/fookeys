// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "VITE_API_KEY",
  authDomain: "VITE_AUTH_DOMAIN",
  projectId: "VITE_PROJECT_ID",
  storageBucket: "VITE_STORAGE_BUCKET",
  messagingSenderId: "VITE_MESSAGING_SENDER_ID",
  appId: "VITE_APP_ID"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);