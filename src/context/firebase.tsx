// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAKJpw-Ja8QF-INTqCUFq74fSRItz_WFho",
  authDomain: "twiller-b57e3.firebaseapp.com",
  projectId: "twiller-b57e3",
  storageBucket: "twiller-b57e3.firebasestorage.app",
  messagingSenderId: "346264478216",
  appId: "1:346264478216:web:a1d4d1e6cd8106c1efa7bd",
  measurementId: "G-PP2SKTJKQF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;