import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, getDocs, doc, updateDoc } from 'firebase/firestore';

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
  createdAt: Date;
  updatedAt: Date;
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
}

// Create a new premium support inquiry
export async function createPremiumInquiry(data: CreatePremiumInquiryData): Promise<string> {
  try {
    const inquiryData = {
      ...data,
      status: 'new' as const,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'premiumInquiries'), inquiryData);
    
    // Trigger admin notification (this would be handled by Firebase Functions in production)
    await notifyAdminNewInquiry(docRef.id, data);
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating premium inquiry:', error);
    throw new Error('Failed to submit premium support inquiry');
  }
}

// Fetch all premium inquiries (admin only)
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

// Update inquiry status and add admin response
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
    
    // If responding, notify the user
    if (status === 'responded' && adminResponse) {
      await notifyUserResponse(inquiryId, adminResponse);
    }
  } catch (error) {
    console.error('Error updating inquiry status:', error);
    throw new Error('Failed to update inquiry status');
  }
}

// Notify admin about new inquiry (placeholder for Firebase Functions)
async function notifyAdminNewInquiry(inquiryId: string, data: CreatePremiumInquiryData): Promise<void> {
  // In a real implementation, this would trigger a Firebase Function
  // that sends email/SMS notifications to admins
  console.log('New premium inquiry received:', { inquiryId, data });
  
  // For now, we'll just log it. In production, you'd implement:
  // 1. Email notification to admin
  // 2. SMS notification to admin
  // 3. Dashboard notification
}

// Notify user about admin response (placeholder for Firebase Functions)
async function notifyUserResponse(inquiryId: string, response: string): Promise<void> {
  // In a real implementation, this would trigger a Firebase Function
  // that sends email/SMS notifications to the user
  console.log('Admin response sent:', { inquiryId, response });
  
  // For now, we'll just log it. In production, you'd implement:
  // 1. Email notification to user
  // 2. SMS notification to user
}
