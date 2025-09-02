// client/src/lib/types.ts

// Firestore user profile data
export interface UserProfile {
  id: string; // This will be the Firebase UID
  fullName: string;
  email: string;
  role: 'founder' | 'incubator';
  subscriptionStatus: 'free' | 'premium';
  subscriptionEndDate?: Date | null;
  savedGrants?: string[];
  createdAt: Date;
  phone?: string; 
  notifyEmail?: boolean;
  notifyWhatsapp?: boolean;
}

// Data needed to create a new user profile
export interface CreateUserData {
  fullName: string;
  email: string;
  phone?: string;
  role: 'founder' | 'incubator';
  notifyEmail?: boolean;
  notifyWhatsapp?: boolean;
}