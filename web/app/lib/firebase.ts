import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCU30rG5J6a1b-Rzxrj0tSR0LjphuZuQpw",
  authDomain: "crowed-ft4bhi.firebaseapp.com",
  projectId: "crowed-ft4bhi",
  storageBucket: "crowed-ft4bhi.firebasestorage.app",
  messagingSenderId: "121844752123",
  appId: "1:121844752123:web:bb98b8be50ad9d9f281a5e",
  measurementId: "G-G9PPLNWWN4"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
