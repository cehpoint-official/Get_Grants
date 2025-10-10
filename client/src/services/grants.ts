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
  await addDoc(grantsCollection, {
    ...grantData,
    deadline: new Date(grantData.deadline),
    startDate: grantData.startDate ? new Date(grantData.startDate) : null,
    status: grantData.status || "Active",
    createdAt: Timestamp.now(),
  });
};

export const updateGrant = async (id: string, grantData: InsertGrant) => {
  try {
    const grantRef = doc(db, "grants", id);
    await updateDoc(grantRef, {
        ...grantData,
        deadline: new Date(grantData.deadline),
        startDate: grantData.startDate ? new Date(grantData.startDate) : null,
        status: grantData.status || "Active",
    });
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