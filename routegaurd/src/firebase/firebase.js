// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDemYVH6VQI-Vw6fZ7ptHIxPg9R7tn3NGQ",
  authDomain: "routegaurd-c25b7.firebaseapp.com",
  projectId: "routegaurd-c25b7",
  storageBucket: "routegaurd-c25b7.firebasestorage.app",
  messagingSenderId: "712578660109",
  appId: "1:712578660109:web:b1d29498d74fef5d6a6244",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
