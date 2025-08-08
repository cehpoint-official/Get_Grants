// src/services/firebase.ts
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
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
  await addDoc(postsRef, data);
};

export const updatePost = async (id: string, data: any) => {
  const postRef = doc(db, "posts", id);
  await updateDoc(postRef, data);
};

export const deletePost = async (id: string) => {
  const postRef = doc(db, "posts", id);
  await deleteDoc(postRef);
};
