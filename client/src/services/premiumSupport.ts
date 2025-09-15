import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, getDocs, doc, updateDoc, where, onSnapshot, Unsubscribe, DocumentData } from 'firebase/firestore';

export interface PremiumInquiry {
    id?: string;
    name: string;
    email: string;
    phone: string;
    companyName?: string;
    currentPlan: string;
    budget: string;
    timeline: string;
    specificNeeds: string;
    message?: string;
    status: 'new' | 'in_progress' | 'meeting_scheduled' | 'meeting_done' | 'responded' | 'closed';
    adminResponse?: string;
    userId?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface InquiryMessage {
    id?: string;
    inquiryId: string;
    sender: 'user' | 'admin';
    senderId?: string;
    text: string;
    createdAt: Date;
}

export interface CreatePremiumInquiryData {
    name: string;
    email: string;
    phone: string;
    companyName?: string;
    currentPlan: string;
    budget: string;
    timeline: string;
    specificNeeds: string;
    message?: string;
    userId?: string;
}

export async function createPremiumInquiry(data: CreatePremiumInquiryData): Promise<string> {
    try {
        const inquiryData: any = {
            ...data,
            status: 'new' as const,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        if (data.userId) {
            inquiryData.userId = data.userId;
        }

        const docRef = await addDoc(collection(db, 'premiumInquiries'), inquiryData);
        await notifyAdminNewInquiry(docRef.id, data);
        return docRef.id;
    } catch (error) {
        console.error('Error creating premium inquiry:', error);
        throw new Error('Failed to submit premium support inquiry');
    }
}

export async function fetchPremiumInquiries(): Promise<PremiumInquiry[]> {
    try {
        const q = query(
            collection(db, 'premiumInquiries'),
            orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const inquiries: PremiumInquiry[] = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            inquiries.push({
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
            } as PremiumInquiry);
        });

        return inquiries;
    } catch (error) {
        console.error('Error fetching premium inquiries:', error);
        throw new Error('Failed to fetch premium inquiries');
    }
}

export async function fetchUserPremiumInquiries(userId: string): Promise<PremiumInquiry[]> {
    try {
        const q = query(
            collection(db, 'premiumInquiries'),
            where('userId', '==', userId)
        );

        const querySnapshot = await getDocs(q);
        const inquiries: PremiumInquiry[] = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            inquiries.push({
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
            } as PremiumInquiry);
        });

        // Sort client-side by createdAt desc to avoid composite index requirement
        return inquiries.sort((a, b) => (b.createdAt?.getTime?.() || 0) - (a.createdAt?.getTime?.() || 0));
    } catch (error) {
        console.error('Error fetching user premium inquiries:', error);
        throw new Error('Failed to fetch user premium inquiries');
    }
}

// New helper: fetch user inquiries by userId or email fallback
export async function fetchUserPremiumInquiriesByUserIdOrEmail(params: { userId?: string; email?: string }): Promise<PremiumInquiry[]> {
    try {
        const results: PremiumInquiry[] = [];

        if (params.userId) {
            const q1 = query(
                collection(db, 'premiumInquiries'),
                where('userId', '==', params.userId)
            );
            const snap1 = await getDocs(q1);
            snap1.forEach((docSnap) => {
                const data = docSnap.data();
                results.push({
                    id: docSnap.id,
                    ...data,
                    createdAt: data.createdAt?.toDate() || new Date(),
                    updatedAt: data.updatedAt?.toDate() || new Date(),
                } as PremiumInquiry);
            });
        }

        if (results.length === 0 && params.email) {
            const q2 = query(
                collection(db, 'premiumInquiries'),
                where('email', '==', params.email)
            );
            const snap2 = await getDocs(q2);
            snap2.forEach((docSnap) => {
                const data = docSnap.data();
                results.push({
                    id: docSnap.id,
                    ...data,
                    createdAt: data.createdAt?.toDate() || new Date(),
                    updatedAt: data.updatedAt?.toDate() || new Date(),
                } as PremiumInquiry);
            });
        }

        // Sort client-side by createdAt desc to avoid composite index requirement
        return results.sort((a, b) => (b.createdAt?.getTime?.() || 0) - (a.createdAt?.getTime?.() || 0));
    } catch (error) {
        console.error('Error fetching user premium inquiries (by userId/email):', error);
        throw new Error('Failed to fetch user premium inquiries');
    }
}

export async function updateInquiryStatus(
    inquiryId: string,
    status: PremiumInquiry['status'],
    adminResponse?: string
): Promise<void> {
    try {
        const inquiryRef = doc(db, 'premiumInquiries', inquiryId);
        const updateData: any = {
            status,
            updatedAt: serverTimestamp(),
        };

        if (adminResponse) {
            updateData.adminResponse = adminResponse;
        }

        await updateDoc(inquiryRef, updateData);

        if (status === 'responded' && adminResponse) {
            await notifyUserResponse(inquiryId, adminResponse);
        }
    } catch (error) {
        console.error('Error updating inquiry status:', error);
        throw new Error('Failed to update inquiry status');
    }
}

async function notifyAdminNewInquiry(inquiryId: string, data: CreatePremiumInquiryData): Promise<void> {
    console.log('New premium inquiry received:', { inquiryId, data });
}

async function notifyUserResponse(inquiryId: string, response: string): Promise<void> {
    console.log('Admin response sent:', { inquiryId, response });
}

// Messaging APIs

export async function sendInquiryMessage(params: { inquiryId: string; text: string; sender: 'user' | 'admin'; senderId?: string; }): Promise<string> {
    const { inquiryId, text, sender, senderId } = params;
    const messagesRef = collection(db, 'premiumInquiries', inquiryId, 'messages');
    const docRef = await addDoc(messagesRef, {
        text,
        sender,
        senderId: senderId || null,
        createdAt: serverTimestamp(),
    });
    // Optionally bump parent updatedAt
    const inquiryRef = doc(db, 'premiumInquiries', inquiryId);
    await updateDoc(inquiryRef, { updatedAt: serverTimestamp(), status: sender === 'admin' ? 'responded' : 'in_progress' });
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