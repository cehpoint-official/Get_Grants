import { collection, addDoc, serverTimestamp } from "firebase/firestore";

import { db } from "@/lib/firebase";

export interface GrantLead {
  id?: string;
  name: string;
  mobile: string;
  email: string;
  grantName: string;
  createdAt: any;
}

const leadsCollection = collection(db, "grantLeads");

export const saveGrantLead = async (leadData: Omit<GrantLead, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(leadsCollection, {
      ...leadData,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving grant lead to Firestore: ", error);
    throw new Error("Could not save lead. Please try again.");
  }
};