import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
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
  GoogleAuthProvider, 
  signInWithPopup,      
} from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { UserProfile, CreateUserData } from "@/lib/types";
import { getUserProfile, createUserProfile } from "@/lib/userService";
import { isAdminUser } from "@/lib/adminUtils";
import { getFirebaseErrorMessage, isNetworkError, shouldRetry } from "@/lib/errorUtils";

export type AppUser = UserProfile & { uid: string };

export function useAuth() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      try {
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
      } catch (error) {
        console.error('Error in auth state change:', error);
       
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential; 
    } catch (error) {
      const friendlyError = getFirebaseErrorMessage(error);
      throw new Error(friendlyError.message);
    }
  };

  const signup = async (email: string, password: string, fullName: string, phone: string, opts?: { notifyEmail?: boolean; notifyWhatsapp?: boolean }) => {
    try {
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
      
      return userCredential; 
    } catch (error) {
      const friendlyError = getFirebaseErrorMessage(error);
      throw new Error(friendlyError.message);
    }
  };

  // ---  Function for Google Sign-In ---
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const firebaseUser = userCredential.user;

      const profile = await getUserProfile(firebaseUser.uid);
      if (!profile) {
        // If profile doesn't exist, it's a new user
        const profileData: CreateUserData = {
          fullName: firebaseUser.displayName || "Google User",
          email: firebaseUser.email || "",
          phone: firebaseUser.phoneNumber || "",
          role: 'founder',
          notifyEmail: true,
          notifyWhatsapp: true,
        };
        await createUserProfile(firebaseUser, profileData);
      }
      return userCredential;
    } catch (error) {
      const friendlyError = getFirebaseErrorMessage(error);
      throw new Error(friendlyError.message);
    }
  };
  
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      const friendlyError = getFirebaseErrorMessage(error);
      throw new Error(friendlyError.message);
    }
  };

  const updateUserProfileDetails = async (details: { fullName?: string; phone?: string; avatarUrl?: string }) => {
    if (!auth.currentUser) throw new Error("User not found");

    try {
      const authUpdates: { displayName?: string; photoURL?: string } = {};
      if (details.fullName) authUpdates.displayName = details.fullName;
      if (details.avatarUrl) authUpdates.photoURL = details.avatarUrl;
      
      if (Object.keys(authUpdates).length > 0) {
          await updateProfile(auth.currentUser, authUpdates);
      }

      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, details);

      setUser(prevUser => prevUser ? { ...prevUser, ...details } : null);
    } catch (error) {
      const friendlyError = getFirebaseErrorMessage(error);
      throw new Error(friendlyError.message);
    }
  };

  const changePassword = async (newPassword: string) => {
    if (!auth.currentUser) throw new Error("User not found");
    try {
      await updatePassword(auth.currentUser, newPassword);
    } catch (error) {
      const friendlyError = getFirebaseErrorMessage(error);
      throw new Error(friendlyError.message);
    }
  };

  const deleteAccount = async (password: string) => {
    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.email) throw new Error("User not found or email is missing");
    
    try {
      const credential = EmailAuthProvider.credential(currentUser.email, password);
      await reauthenticateWithCredential(currentUser, credential);
      
      await deleteUser(currentUser);
    } catch (error) {
      const friendlyError = getFirebaseErrorMessage(error);
      throw new Error(friendlyError.message);
    }
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
    signInWithGoogle, 
    logout,
    updateUserProfileDetails,
    changePassword,
    deleteAccount,
    updateUserState,
  };
}