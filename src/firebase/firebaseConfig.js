import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBDUaAmMTKClV0KYeyaaMwA8GXhvuMktys",
  authDomain: "copav-app.firebaseapp.com",
  projectId: "copav-app",
  storageBucket: "copav-app.firebasestorage.app",
  messagingSenderId: "864742702721",
  appId: "1:864742702721:web:344f8fc312673b5c6cd780",
  measurementId: "G-DBPYS1JN3W"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
