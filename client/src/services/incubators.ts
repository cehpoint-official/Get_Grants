
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type IncubatorFormData = {
  uid: string;
  email: string;
  country: string;
  state: string;
  city: string;
};

export const submitIncubatorRequest = async (data: IncubatorFormData) => {
  await addDoc(collection(db, "incubator_requests"), {
    ...data,
    status: "pending",
    createdAt: serverTimestamp(),
  });
};
