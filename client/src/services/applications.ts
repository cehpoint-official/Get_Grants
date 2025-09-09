import { db } from "@/lib/firebase";
import type { Application, InsertApplication } from "@shared/schema";
import {
  collection,
  getDocs,
  addDoc,
  Timestamp,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";

const applicationsRef = collection(db, "grant_applications");

export const submitApplication = async (data: InsertApplication) => {
  await addDoc(applicationsRef, {
    ...data,
    submittedAt: Timestamp.now(),
  });
};

export const fetchApplications = async (): Promise<Application[]> => {
  const snapshot = await getDocs(applicationsRef);
  const applications = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      // Firestore timestamp ko JavaScript Date object mein convert karein
      submittedAt: data.submittedAt instanceof Timestamp ? data.submittedAt.toDate() : new Date(),
    } as Application;
  });
  return applications;
};

export const fetchUserApplications = async (userId: string): Promise<Application[]> => {
    if (!userId) return [];
    const q = query(applicationsRef, where("userId", "==", userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            submittedAt: data.submittedAt instanceof Timestamp ? data.submittedAt.toDate() : new Date(),
        } as Application;
    }) as Application[];
};

export const updateApplicationStatus = async (id: string, status: string) => {
    const applicationRef = doc(db, "grant_applications", id);
    await updateDoc(applicationRef, { status });
};