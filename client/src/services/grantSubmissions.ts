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
    
 
    if (error instanceof Error && error.message.includes('network')) {
      throw new Error("Unable to save your details. Please check your internet connection and try again.");
    }
    
   
    if (error instanceof Error && error.message.includes('permission')) {
      throw new Error("You don't have permission to perform this action. Please contact support.");
    }
    
   
    throw new Error("Unable to save your details at the moment. Please try again in a few minutes.");
  }
};