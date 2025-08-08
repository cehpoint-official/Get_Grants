// src/lib/adminUtils.ts
import { User } from "firebase/auth";

// List of admin emails - only these can access admin dashboard
const ADMIN_EMAILS = [
  'admin@getgrants.in'
];

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

export function isAdminUser(user: User | null): boolean {
  if (!user?.email) return false;
  return isAdminEmail(user.email);
}