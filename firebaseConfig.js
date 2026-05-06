import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDx5M_GTzoTRSWa2KOEsfZ9LmIZRGaKHDI",
  authDomain: "espashho-progress.firebaseapp.com",
  projectId: "espashho-progress",
  storageBucket: "espashho-progress.firebasestorage.app",
  messagingSenderId: "387679560114",
  appId: "1:387679560114:web:3ef694e2144602ea2784ab",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
