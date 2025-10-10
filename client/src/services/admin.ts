import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export interface DashboardStats {
  totalUsers: number;
  totalApplications: number;
  totalGrants: number;
}

export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  try {
    console.log("Fetching dashboard stats...");
    const usersCollection = collection(db, "users");
    const applicationsCollection = collection(db, "applications");
    const grantsCollection = collection(db, "grants");

    console.log("Getting users snapshot...");
    const usersSnapshot = await getDocs(usersCollection);
    console.log("Getting applications snapshot...");
    const applicationsSnapshot = await getDocs(applicationsCollection);
    console.log("Getting grants snapshot...");
    const grantsSnapshot = await getDocs(grantsCollection);

    const stats = {
      totalUsers: usersSnapshot.size,
      totalApplications: applicationsSnapshot.size,
      totalGrants: grantsSnapshot.size,
    };
    
    console.log("Dashboard stats:", stats);
    return stats;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    console.error("Error details:", error);
    return {
      totalUsers: 0,
      totalApplications: 0,
      totalGrants: 0,
    };
  }
};

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: Date;
}

export const fetchContactMessages = async (): Promise<ContactMessage[]> => {
  const q = query(collection(db, "contactMessages"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate(),
  } as ContactMessage));
};