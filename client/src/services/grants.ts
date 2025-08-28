import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
  Timestamp
} from "firebase/firestore";
import { InsertGrant, Grant } from "@shared/schema";

const grantsCollection = collection(db, "grants");

// Function to fetch all grants from Firestore, ordered by deadline
export const fetchGrants = async (): Promise<Grant[]> => {
  const q = query(grantsCollection, orderBy("deadline", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      // Convert Firestore Timestamp to JS Date object
      deadline: (data.deadline as Timestamp).toDate(), 
      createdAt: data.createdAt ? (data.createdAt as Timestamp).toDate() : new Date()
    } as Grant;
  });
};

// Function to create a new grant in Firestore
export const createGrant = async (data: InsertGrant) => {
  await addDoc(grantsCollection, {
    ...data,
    deadline: new Date(data.deadline),
    createdAt: serverTimestamp(),
  });
};

// Function to update an existing grant in Firestore
export const updateGrant = async (id: string, data: Partial<InsertGrant>) => {
  const grantRef = doc(db, "grants", id);
  
  // Create a new object for the update payload 
  const dataToUpdate: { [key: string]: any } = { ...data };

  // If deadline is a string, convert it to a Date object for Firestore
  if (data.deadline && typeof data.deadline === 'string') {
    dataToUpdate.deadline = new Date(data.deadline);
  }

  await updateDoc(grantRef, dataToUpdate);
};

// Function to delete a grant from Firestore
export const deleteGrant = async (id: string) => {
  const grantRef = doc(db, "grants", id);
  await deleteDoc(grantRef);
};