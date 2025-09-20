import { auth } from "@/firebase";
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc, updateDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { app } from "@/firebase";



const db = getFirestore(app);


export const Register = async (email: string, password: string, name: string, location: string, phone: string, date: string, uid?: string, profilePicture?: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  await setDoc(doc(db, "users", user.uid), {
    name,
    email,
    location,
    phone,
    createdAt: serverTimestamp(),
  }, { merge: true });

  return user;
};

export const login = (email: string, password: string) => signInWithEmailAndPassword(auth, email, password);

export const logout = () => signOut(auth);

export const updateUserProfile = async (uid: string, data: any) => {
  return updateDoc(doc(db, "users", uid), data);
};

export const getUserById = async (userId: string) => {
  const userSnap = await getDoc(doc(db, "users", userId));
  if (userSnap.exists()) return { id: userSnap.id, ...userSnap.data() };
  return null;
};

export const resetPassword = (email: string) => {
  return sendPasswordResetEmail(auth, email);
};

export const getIdToken = async () => {
  if (auth.currentUser) {
    const idToken = await auth.currentUser.getIdToken(/* forceRefresh */ true);
    console.log("Firebase ID Token:", idToken);
    return idToken;
  } else {
    console.log("No user logged in");
  }
};

export const uploadToCloudinary = async (uri: string) => { 
  const data = new FormData(); 
  data.append("file", { uri, type: "image/jpeg", name: "profile.jpg", } as any); 
  data.append("upload_preset", "image_upload"); // from Cloudinary
}