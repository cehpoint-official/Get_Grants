import { db } from "@/lib/firebase";
import type { Application } from "@shared/schema";
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

export const submitApplication = async (data: Omit<Application, "id" | "submittedAt">) => {
  await addDoc(applicationsRef, {
    ...data,
    submittedAt: Timestamp.now(),
  });
};

export const fetchApplications = async (): Promise<Application[]> => {
  const snapshot = await getDocs(applicationsRef);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Application[];
};

export const fetchUserApplications = async (userId: string): Promise<Application[]> => {
    if (!userId) return [];
    const q = query(applicationsRef, where("userId", "==", userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as Application[];
};

export const updateApplicationStatus = async (id: string, status: string) => {
    const applicationRef = doc(db, "grant_applications", id);
    await updateDoc(applicationRef, { status });
};