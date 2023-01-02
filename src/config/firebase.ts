// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getAuth, GoogleAuthProvider } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAZnQg2k5DuYuy82E93crd5IC5RUgvMQ44",
  authDomain: "chat-app-f23d4.firebaseapp.com",
  projectId: "chat-app-f23d4",
  storageBucket: "chat-app-f23d4.appspot.com",
  messagingSenderId: "369098916160",
  appId: "1:369098916160:web:99d095c80e033f2237baa5"
};

// Initialize Firebase

// If already have an app, will return it, if don't have app, create an app
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app)
const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export { db, auth, provider }
