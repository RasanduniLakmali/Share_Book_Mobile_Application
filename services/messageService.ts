import { 
  addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, where, updateDoc, doc 
} from "firebase/firestore";
import { db } from "@/firebase";

// Send a message
export const sendMessage = async (text: string, senderId: string, receiverId: string) => {
  await addDoc(collection(db, "messages"), {
    text,
    senderId,
    receiverId,
    participants: [senderId, receiverId],
    timestamp: serverTimestamp(),
    read: false, // mark as unread initially
  });
};

// Subscribe to chat between two users
export const subscribeMessages = (currentUserId: string, otherUserId: string, setMessages: Function) => {
  const messagesRef = collection(db, "messages");
  const q = query(
    messagesRef,
    where("participants", "array-contains", currentUserId),
    orderBy("timestamp", "asc")
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const allMessages: any[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      // Include only messages between these two users
      if (data.participants.includes(currentUserId) && data.participants.includes(otherUserId)) {
        allMessages.push({ id: doc.id, ...data });
      }
    });
    setMessages(allMessages);
  });

  return unsubscribe;
};

// Subscribe to unread messages for Home page badge
export const subscribeUnreadMessages = (currentUserId: string, callback: (data: any[]) => void) => {
  const messagesRef = collection(db, "messages");
  const q = query(messagesRef, where("receiverId", "==", currentUserId), where("read", "==", false));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const unread: any[] = [];
    snapshot.forEach((doc) => unread.push({ id: doc.id, ...doc.data() }));
    callback(unread);
  });

  return unsubscribe;
};

// Mark messages as read
export const markMessagesAsRead = async (currentUserId: string, otherUserId: string) => {
  const messagesRef = collection(db, "messages");
  const q = query(
    messagesRef,
    where("receiverId", "==", currentUserId),
    where("senderId", "==", otherUserId),
    where("read", "==", false)
  );

  const unsubscribe = onSnapshot(q, async (snapshot) => {
    snapshot.forEach(async (docSnap) => {
      const docRef = doc(db, "messages", docSnap.id);
      await updateDoc(docRef, { read: true });
    });
  });

  return unsubscribe;
};
