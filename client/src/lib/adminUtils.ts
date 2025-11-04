
import { User } from "firebase/auth";

// Base admin(s) baked into the app (safe to keep yours here)
const BASE_ADMIN_EMAILS = [
  'kamini9926@gmail.com',
];

// Optional: add more admins via env so they aren't exposed in git

const ENV_ADMIN_EMAILS = String(import.meta.env.VITE_ADMIN_EMAILS || '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

const ADMIN_EMAIL_SET = new Set<string>([
  ...BASE_ADMIN_EMAILS.map((e) => e.toLowerCase()),
  ...ENV_ADMIN_EMAILS,
]);

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAIL_SET.has(email.toLowerCase());
}

export function isAdminUser(user: User | null): boolean {
  if (!user?.email) return false;
  return isAdminEmail(user.email);
}