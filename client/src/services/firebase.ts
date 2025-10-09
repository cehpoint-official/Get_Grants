
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";

const postsRef = collection(db, "posts");

export const fetchPosts = async () => {
  const snapshot = await getDocs(postsRef);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as any[];
};

export const createPost = async (data: any) => {
  await addDoc(postsRef, { ...data, status: data.status || "pending", createdAt: serverTimestamp() });
};

export const updatePost = async (id: string, data: any) => {
  const postRef = doc(db, "posts", id);
  await updateDoc(postRef, data);
};

export const deletePost = async (id: string) => {
  const postRef = doc(db, "posts", id);
  await deleteDoc(postRef);
};

export const fetchPendingPosts = async () => {
  const q = query(postsRef, where("status", "==", "pending"));
  const snapshot = await getDocs(q);
  const pendingPosts = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  console.log("Fetched pending posts from Firebase:", pendingPosts); 
  return pendingPosts;
};

export const approvePost = async (id: string) => {
  const ref = doc(db, "posts", id);
  await updateDoc(ref, { status: "published", published: true });
};

export const rejectPost = async (id: string) => {
  const ref = doc(db, "posts", id);
  await updateDoc(ref, { status: "rejected", published: false });
};

export const fetchPublishedPosts = async () => {
  const q = query(postsRef, where("status", "==", "published"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};
