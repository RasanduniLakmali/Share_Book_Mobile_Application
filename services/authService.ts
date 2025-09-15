import {auth} from "@/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { app } from "@/firebase";

const db = getFirestore(app);

export const Register = async (email: string, password: string, name: string, location: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Save extra user details in Firestore
  await setDoc(doc(db, "users", user.uid), {
    name,
    email,
    location,
    
  });

  return user;
};

export const login = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const Logout = () => {
  return signOut(auth);
};