import { collection, addDoc, serverTimestamp, doc, setDoc, getDoc, query, where, limit, getDocs } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";

export interface UserLead {
  id?: string;
  name: string;
  mobile: string;
  email: string;
  uid?: string; // anonymous or authenticated uid
  createdAt: any;
}

const userLeadsCollection = collection(db, "userLeads");

export const saveUserLead = async (
  leadData: Omit<UserLead, "id" | "createdAt">
): Promise<string> => {
  try {
    const docRef = await addDoc(userLeadsCollection, {
      ...leadData,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving user lead to Firestore: ", error);
    if (error instanceof Error && error.message.includes("network")) {
      throw new Error(
        "Unable to save your details. Please check your internet connection and try again."
      );
    }
    if (error instanceof Error && error.message.includes("permission")) {
      throw new Error(
        "You don't have permission to perform this action. Please contact support."
      );
    }
    throw new Error(
      "Unable to save your details at the moment. Please try again in a few minutes."
    );
  }
};

// Ensure an anonymous Firebase Auth user exists; returns uid
export const ensureAnonymousUid = async (): Promise<string> => {
  if (auth.currentUser) return auth.currentUser.uid;
  try {
    const cred = await signInAnonymously(auth);
    return cred.user.uid;
  } catch (e) {
    // Fallback to waiting for auth state (in case of race)
    const uid = await new Promise<string>((resolve, reject) => {
      const unsub = onAuthStateChanged(auth, (u) => {
        if (u) {
          unsub();
          resolve(u.uid);
        }
      }, reject);
      setTimeout(() => reject(new Error("Auth timeout")), 8000);
    });
    return uid;
  }
};

// Check if a user lead already exists for this uid
export const hasUserLeadForUid = async (uid: string): Promise<boolean> => {
  // We can store by uid as document id for O(1) lookups
  const leadDoc = await getDoc(doc(db, "userLeads", uid));
  if (leadDoc.exists()) return true;
  // Backward compatibility: check any doc with uid field
  const q = query(userLeadsCollection, where("uid", "==", uid), limit(1));
  const snap = await getDocs(q);
  return !snap.empty;
};

// Upsert a user lead using uid as the document id
export const upsertUserLeadForUid = async (
  uid: string,
  details: { name: string; mobile: string; email: string }
): Promise<void> => {
  await setDoc(doc(db, "userLeads", uid), {
    ...details,
    uid,
    createdAt: serverTimestamp(),
  }, { merge: true });
};


