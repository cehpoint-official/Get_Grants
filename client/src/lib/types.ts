

// Firestore user profile data
export interface UserProfile {
  id: string; 
  fullName: string;
  email: string;
  role: 'founder' | 'incubator';
  subscriptionStatus: 'free' | 'premium' | 'active' | 'inactive' | 'expired'; 
  subscriptionPlan?: 'monthly' | 'quarterly' | 'free';
  subscriptionEndDate?: Date | null;
  savedGrants?: string[];
  createdAt: Date;
  phone?: string;
  notifyEmail?: boolean;
  notifyWhatsapp?: boolean;
  notificationConsentGiven?: boolean;
  avatarUrl?: string;
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