// src/hooks/use-auth.ts
import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { UserProfile, CreateUserData } from "@/lib/types";
import { getUserProfile, createUserProfile } from "@/lib/userService";
import { isAdminUser } from "@/lib/adminUtils";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setIsAdmin(isAdminUser(user));
      
      if (user) {
        // For admin users, we don't need Firestore profile
        if (isAdminUser(user)) {
          setUserProfile(null);
        } else {
          // For incubators, fetch their profile from Firestore
          const profile = await getUserProfile(user.uid);
          setUserProfile(profile);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    }
  };

  const registerIncubator = async (
    email: string, 
    password: string, 
    additionalData: Omit<CreateUserData, 'email' | 'role'>
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user profile in Firestore
      const profile = await createUserProfile(userCredential.user, {
        ...additionalData,
        email,
        role: 'incubator'
      });
      
      setUserProfile(profile);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
      setIsAdmin(false);
    } catch (error) {
      throw error;
    }
  };

  return {
    user,
    userProfile,
    loading,
    isAdmin,
    login,
    registerIncubator,
    logout,
  };
}