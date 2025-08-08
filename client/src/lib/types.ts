// src/lib/types.ts
export type UserRole = 'admin' | 'incubator';

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  // Incubator specific fields
  companyName?: string;
  contactName?: string;
  phone?: string;
  website?: string;
  description?: string;
  status?: 'pending' | 'approved' | 'rejected';
}

export interface CreateUserData {
  email: string;
  role: UserRole;
  companyName?: string;
  contactName?: string;
  phone?: string;
  website?: string;
  description?: string;
}