import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, getDocs, doc, updateDoc, where, onSnapshot, Unsubscribe, DocumentData, limit } from 'firebase/firestore';
import { InquiryMessage, PremiumInquiry } from '@shared/schema';

// This is your original function for creating an inquiry via the old form.
export async function createPremiumInquiry(data: any): Promise<string> {
  const docRef = await addDoc(collection(db, 'premiumInquiries'), {
    ...data,
    status: 'new',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  // You might want to remove the notifyAdminNewInquiry call if it's handled by cloud functions
  // await notifyAdminNewInquiry(docRef.id, data); 
  return docRef.id;
}

// This function is used by the new direct chat feature from the FAQ page
export async function startChatSession(params: {
  userId: string;
  name: string;
  email: string;
  firstMessage: string;
}): Promise<string> {
  try {
    const inquiryData = {
      name: params.name,
      email: params.email,
      userId: params.userId,
      specificNeeds: params.firstMessage, // The first message acts as the title/topic
      status: 'new' as const,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      phone: '',
      companyName: '',
      currentPlan: 'Chat Inquiry',
      budget: 'N/A',
      timeline: 'N/A',
    };
    const docRef = await addDoc(collection(db, 'premiumInquiries'), inquiryData);
    const messagesRef = collection(db, 'premiumInquiries', docRef.id, 'messages');
    await addDoc(messagesRef, {
        text: params.firstMessage,
        sender: 'user',
        senderId: params.userId,
        createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error starting chat session:', error);
    throw new Error('Failed to start a new chat session');
  }
}

// Updated to sort by recent activity for the admin panel
export async function fetchPremiumInquiries(): Promise<PremiumInquiry[]> {
    try {
        const q = query(
            collection(db, 'premiumInquiries'),
            orderBy('updatedAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
            updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        } as PremiumInquiry));
    } catch (error) {
        console.error('Error fetching premium inquiries:', error);
        throw new Error('Failed to fetch premium inquiries');
    }
}

// This function is for the user's dashboard
export async function fetchUserPremiumInquiriesByUserIdOrEmail(params: { userId?: string; email?: string }): Promise<PremiumInquiry[]> {
    const results: PremiumInquiry[] = [];
    if (params.userId) {
        const q = query(collection(db, 'premiumInquiries'), where('userId', '==', params.userId));
        const snap = await getDocs(q);
        snap.forEach(doc => {
            const data = doc.data();
            results.push({ id: doc.id, ...data, createdAt: data.createdAt?.toDate(), updatedAt: data.updatedAt?.toDate() } as PremiumInquiry);
        });
    }
    return results.sort((a,b) => b.updatedAt.getTime() - a.updatedAt.getTime());
}

export async function sendInquiryMessage(params: { inquiryId: string; text: string; sender: 'user' | 'admin'; senderId?: string; }): Promise<string> {
    const { inquiryId, text, sender, senderId } = params;
    const messagesRef = collection(db, 'premiumInquiries', inquiryId, 'messages');
    const docRef = await addDoc(messagesRef, {
        text,
        sender,
        senderId: senderId || null,
        createdAt: serverTimestamp(),
    });
    const inquiryRef = doc(db, 'premiumInquiries', inquiryId);
    await updateDoc(inquiryRef, { 
        updatedAt: serverTimestamp(),
        status: sender === 'admin' ? 'responded' : 'in_progress' 
    });
    return docRef.id;
}

export function subscribeToInquiryMessages(inquiryId: string, onChange: (messages: InquiryMessage[]) => void): Unsubscribe {
    const messagesRef = collection(db, 'premiumInquiries', inquiryId, 'messages');
    const qMessages = query(messagesRef, orderBy('createdAt', 'asc'));
    return onSnapshot(qMessages, (snapshot) => {
        const msgs: InquiryMessage[] = snapshot.docs.map((d) => {
            const data = d.data() as DocumentData;
            return {
                id: d.id,
                inquiryId,
                sender: data.sender,
                senderId: data.senderId || undefined,
                text: data.text,
                createdAt: data.createdAt?.toDate?.() || new Date(),
            } as InquiryMessage;
        });
        onChange(msgs);
    });
}

/**
 * NEW FUNCTION
 * Subscribes to the most recent message in a conversation.
 */
export function subscribeToLastMessage(inquiryId: string, callback: (message: InquiryMessage | null) => void): () => void {
    const messagesRef = collection(db, 'premiumInquiries', inquiryId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'desc'), limit(1));

    return onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
            const lastDoc = snapshot.docs[0];
            const data = lastDoc.data() as DocumentData;
            callback({
                id: lastDoc.id,
                ...data,
                createdAt: data.createdAt?.toDate() || new Date(),
            } as InquiryMessage);
        } else {
            callback(null);
        }
    });
}