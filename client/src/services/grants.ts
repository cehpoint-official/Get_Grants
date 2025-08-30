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

// Helper function to calculate the status of a grant
const getGrantStatus = (grant: Grant): Grant['status'] => {
    const now = new Date();
    const deadline = new Date(grant.deadline);
    const startDate = grant.startDate ? new Date(grant.startDate) : new Date(grant.createdAt);
    
    // Set time to 0 to compare dates only
    now.setHours(0, 0, 0, 0);
    deadline.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);

    if (now > deadline) {
        return "Expired";
    }

    if (now < startDate) {
        return "Upcoming";
    }

    // Closing soon if deadline is within 7 days
    const sevenDaysFromNow = new Date(now);
    sevenDaysFromNow.setDate(now.getDate() + 3);
    if (deadline <= sevenDaysFromNow) {
        return "Closing Soon";
    }

    return "Active";
};


// Function to fetch all grants from Firestore, ordered by deadline
export const fetchGrants = async (): Promise<Grant[]> => {
  const q = query(grantsCollection, orderBy("deadline", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    const grantData = {
      id: doc.id,
      ...data,
      // Convert Firestore Timestamp to JS Date object
      startDate: data.startDate ? (data.startDate as Timestamp).toDate() : undefined,
      deadline: (data.deadline as Timestamp).toDate(), 
      createdAt: data.createdAt ? (data.createdAt as Timestamp).toDate() : new Date()
    } as Grant;

    // Calculate and override the status
    grantData.status = getGrantStatus(grantData);

    return grantData;
  });
};

// Function to create a new grant in Firestore
export const createGrant = async (data: InsertGrant) => {
  const now = new Date();
  const deadline = new Date(data.deadline);
  const startDate = data.startDate ? new Date(data.startDate) : now;

  let status: Grant['status'] = "Active";

  if (now > deadline) {
      status = "Expired";
  } else if (now < startDate) {
      status = "Upcoming";
  } else {
      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(now.getDate() + 7);
      if (deadline <= sevenDaysFromNow) {
          status = "Closing Soon";
      }
  }

  await addDoc(grantsCollection, {
    ...data,
    status: status,
    startDate: data.startDate ? new Date(data.startDate) : null,
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
  
  // If startDate is a string, convert it to a Date object for Firestore
  if (data.startDate && typeof data.startDate === 'string') {
    dataToUpdate.startDate = new Date(data.startDate);
  }

  await updateDoc(grantRef, dataToUpdate);
};

// Function to delete a grant from Firestore
export const deleteGrant = async (id: string) => {
  const grantRef = doc(db, "grants", id);
  await deleteDoc(grantRef);
};