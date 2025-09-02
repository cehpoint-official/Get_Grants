import { db } from "@/lib/firebase";
import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc } from "firebase/firestore";
import { CalendarEvent, InsertEvent } from "@shared/schema";

const eventsRef = collection(db, "events");

export const fetchEvents = async (): Promise<CalendarEvent[]> => {
  const q = query(eventsRef, orderBy("start", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => {
    const data = d.data() as any;
    const toDate = (v: any) => (v?.toDate ? v.toDate() : v instanceof Date ? v : new Date(v));
    return {
      id: d.id,
      ...data,
      start: toDate(data.start),
      end: toDate(data.end),
      createdAt: toDate(data.createdAt),
    } as CalendarEvent;
  });
};

export const createEvent = async (data: InsertEvent) => {
  const payload: any = {
    ...data,
    start: data.start instanceof Date ? data.start : new Date(data.start),
    end: data.end instanceof Date ? data.end : new Date(data.end),
    allDay: data.allDay ?? false,
    createdAt: new Date(),
  };
  await addDoc(eventsRef, payload);
};

export const updateEvent = async (id: string, data: Partial<InsertEvent>) => {
  const ref = doc(db, "events", id);
  const payload: any = { ...data };
  if (payload.start && !(payload.start instanceof Date)) payload.start = new Date(payload.start);
  if (payload.end && !(payload.end instanceof Date)) payload.end = new Date(payload.end);
  await updateDoc(ref, payload);
};

export const deleteEvent = async (id: string) => {
  const ref = doc(db, "events", id);
  await deleteDoc(ref);
};


