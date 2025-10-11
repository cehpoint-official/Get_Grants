import { db } from "@/lib/firebase";
import { Grant, InsertGrant } from "@shared/schema";
import {
  collection,
  getDocs,
  addDoc,
  Timestamp,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";

const grantsCollection = collection(db, "grants");

const mapDocToGrant = (doc: any): Grant => {
  const data = doc.data();
  return {
    ...data,
    id: doc.id,
    deadline: data.deadline instanceof Timestamp ? data.deadline.toDate() : new Date(data.deadline),
    startDate: data.startDate && (data.startDate instanceof Timestamp ? data.startDate.toDate() : new Date(data.startDate)),
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
  } as Grant;
};

export const fetchGrants = async (): Promise<Grant[]> => {
  const querySnapshot = await getDocs(grantsCollection);
  return querySnapshot.docs.map(mapDocToGrant);
};

export const fetchGrantById = async (id: string): Promise<Grant | null> => {
  const grantRef = doc(db, "grants", id);
  const docSnap = await getDoc(grantRef);

  if (docSnap.exists()) {
    return mapDocToGrant(docSnap);
  } else {
    console.warn(`No grant found with id: ${id}`);
    return null;
  }
};

export const createGrant = async (grantData: InsertGrant) => {
  try {
    console.log("Creating grant with data:", grantData);
    
    // Handle date conversion safely
    const deadlineDate = grantData.deadline ? new Date(grantData.deadline) : null;
    const startDate = grantData.startDate ? new Date(grantData.startDate) : null;
    
    console.log("Deadline date:", deadlineDate);
    console.log("Start date:", startDate);
    
    const grantDoc = {
      ...grantData,
      deadline: deadlineDate,
      startDate: startDate,
      status: grantData.status || "Active",
      createdAt: Timestamp.now(),
    };
    
    console.log("Grant document to save:", grantDoc);
    
    const docRef = await addDoc(grantsCollection, grantDoc);
    console.log("Grant created with ID:", docRef.id);
    
    return docRef.id;
  } catch (error) {
    console.error("Error creating grant:", error);
    throw error;
  }
};

export const updateGrant = async (id: string, grantData: InsertGrant) => {
  try {
    console.log("Updating grant with ID:", id);
    console.log("Update data:", grantData);
    
    if (!id) {
      throw new Error("Grant ID is required for update");
    }
    
    const grantRef = doc(db, "grants", id);
    
    // Handle date conversion safely
    const deadlineDate = grantData.deadline ? new Date(grantData.deadline) : null;
    const startDate = grantData.startDate ? new Date(grantData.startDate) : null;
    
    console.log("Deadline date:", deadlineDate);
    console.log("Start date:", startDate);
    
    const updateData = {
      ...grantData,
      deadline: deadlineDate,
      startDate: startDate,
      status: grantData.status || "Active",
    };
    
    console.log("Update data to save:", updateData);
    
    await updateDoc(grantRef, updateData);
    console.log("Grant updated successfully");
  } catch (error) {
    console.error("Error updating grant:", error);
    throw error;
  }
};

export const deleteGrant = async (id: string) => {
  try {
    const grantRef = doc(db, "grants", id);
    await deleteDoc(grantRef);
  } catch (error) {
    console.error("Error deleting grant:", error);
    throw error;
  }
};