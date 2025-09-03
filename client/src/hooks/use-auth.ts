import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase"; // db ko import karein
import {
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  updatePassword,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore"; // firestore se imports
import { UserProfile, CreateUserData } from "@/lib/types";
import { getUserProfile, createUserProfile } from "@/lib/userService";
import { isAdminUser } from "@/lib/adminUtils";

export type AppUser = UserProfile & { uid: string };

export function useAuth() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        const adminStatus = isAdminUser(firebaseUser);
        setIsAdmin(adminStatus);
        const profile = await getUserProfile(firebaseUser.uid);
        if (profile) {
          setUser({
            ...profile,
            uid: firebaseUser.uid,
          });
        } else if (!adminStatus) {
            setUser(null);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (email: string, password: string, fullName: string, phone: string, opts?: { notifyEmail?: boolean; notifyWhatsapp?: boolean }) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const profileData: CreateUserData = {
      fullName,
      email,
      phone,
      role: 'founder',
      notifyEmail: opts?.notifyEmail ?? true,
      notifyWhatsapp: opts?.notifyWhatsapp ?? true,
    };
    await createUserProfile(userCredential.user, profileData);
    await signOut(auth);
    return userCredential.user;
  };
  
  const logout = async () => {
    await signOut(auth);
  };

  const updateUserProfileDetails = async (details: { fullName: string; phoneNumber: string }) => {
    if (!auth.currentUser) throw new Error("User not found");

    // Update Firebase Auth profile
    await updateProfile(auth.currentUser, { displayName: details.fullName });

    // Update Firestore document
    const userRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(userRef, {
      fullName: details.fullName,
      phoneNumber: details.phoneNumber,
    });

    // Update local state
    setUser(prevUser => prevUser ? { ...prevUser, ...details } : null);
  };

  const changePassword = async (newPassword: string) => {
    if (!auth.currentUser) throw new Error("User not found");
    await updatePassword(auth.currentUser, newPassword);
  };

  const deleteAccount = async (password: string) => {
    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.email) throw new Error("User not found or email is missing");
    
    // Re-authenticate user before deletion for security
    const credential = EmailAuthProvider.credential(currentUser.email, password);
    await reauthenticateWithCredential(currentUser, credential);
    
    // User re-authenticated, now delete
    await deleteUser(currentUser);
  };

  const updateUserState = (updates: Partial<UserProfile>) => {
    setUser(prevUser => prevUser ? { ...prevUser, ...updates } : null);
  };

  return {
    user,
    loading,
    isAdmin,
    login,
    signup,
    logout,
    updateUserProfileDetails,
    changePassword,
    deleteAccount,
    updateUserState,
  };
}