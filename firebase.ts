import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, initializeAuth, indexedDBLocalPersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB8Gn5yx9dgHZSpiz5h8QtErGC53d1oOk4",
  authDomain: "share-book-854e3.firebaseapp.com",
  projectId: "share-book-854e3",
  storageBucket: "share-book-854e3.appspot.com",
  messagingSenderId: "138943174387",
  appId: "1:138943174387:web:015f1c2c027ccd41b7c986",
  measurementId: "G-0VRR67SKLP",
};

// Initialize Firebase app
export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// **Initialize Auth for React Native**
export const auth =
  typeof window === "undefined"
    ? initializeAuth(app, { persistence: indexedDBLocalPersistence }) // works in Expo + Node
    : getAuth(app);

export const db = getFirestore(app);
export const storage = getStorage(app);








