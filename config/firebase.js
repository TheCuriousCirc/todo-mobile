// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAthQXm_iz0AKS9SoigQ3QRryJ9N3Taa0E",
  authDomain: "todo-cc-v1.firebaseapp.com",
  projectId: "todo-cc-v1",
  storageBucket: "todo-cc-v1.appspot.com",
  messagingSenderId: "35336662568",
  appId: "1:35336662568:web:1d0fa523d160c225cfcf1d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
