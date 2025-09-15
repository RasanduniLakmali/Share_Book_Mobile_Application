import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, initializeAuth, indexedDBLocalPersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase config
const firebaseConfig = {
  // Your web app's Firebase configuration
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








