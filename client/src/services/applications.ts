// src/services/applications.ts
import { db } from "@/lib/firebase";
import type { Application } from "@shared/schema";
import {
  collection,
  getDocs,
  addDoc,
  Timestamp,
  DocumentData,
} from "firebase/firestore";

const applicationsRef = collection(db, "grant_applications");

// Updated form structure
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
