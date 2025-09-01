import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import {
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
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

  const signup = async (email: string, password: string, fullName: string, phone: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const profileData: CreateUserData = {
      fullName,
      email,
      phone,
      role: 'founder',
    };
   
    await createUserProfile(userCredential.user, profileData);
    
   
    await signOut(auth);

    return userCredential.user;
  };
  
  const logout = async () => {
    await signOut(auth);
  };

  return {
    user,
    loading,
    isAdmin,
    login,
    signup,
    logout,
  };
}