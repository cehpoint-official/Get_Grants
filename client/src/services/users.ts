// client/src/services/users.ts
import { db } from "@/lib/firebase";
import { collection, getDocs, Timestamp } from "firebase/firestore";
import { User } from "@shared/schema";

export const fetchAllUsers = async (): Promise<User[]> => {
  try {
    const usersCollection = collection(db, "users");
    const usersSnapshot = await getDocs(usersCollection);
    
    return usersSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            ...data,
            id: doc.id,
            createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
        } as User;
    });
  } catch (error) {
    console.error("Error fetching all users:", error);
    return [];
  }
};