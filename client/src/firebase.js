// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'condopulse-11f12.firebaseapp.com',
  projectId: 'condopulse-11f12',
  storageBucket: 'condopulse-11f12.appspot.com',
  messagingSenderId: '278728293741',
  appId: '1:278728293741:web:c73f75ecb4fbd864e7ee64',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
