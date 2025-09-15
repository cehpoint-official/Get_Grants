import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export interface DashboardStats {
  totalUsers: number;
  totalApplications: number;
  totalGrants: number;
}

export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const usersCollection = collection(db, "users");
    const applicationsCollection = collection(db, "grant_applications");
    const grantsCollection = collection(db, "grants");

    const usersSnapshot = await getDocs(usersCollection);
    const applicationsSnapshot = await getDocs(applicationsCollection);
    const grantsSnapshot = await getDocs(grantsCollection);

    return {
      totalUsers: usersSnapshot.size,
      totalApplications: applicationsSnapshot.size,
      totalGrants: grantsSnapshot.size,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      totalUsers: 0,
      totalApplications: 0,
      totalGrants: 0,
    };
  }
};

// --- YAHAN NAYA CODE JODA GAYA HAI ---

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