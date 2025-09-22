
import { db } from "@/lib/firebase";
import { Payment } from "@shared/schema";
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";

const paymentsRef = collection(db, "payments");

export const fetchUserPayments = async (userId: string): Promise<Payment[]> => {
    if (!userId) return [];
    
    const q = query(paymentsRef, where("userId", "==", userId));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            date: (data.date as Timestamp).toDate(),
        } as Payment;
    });
};