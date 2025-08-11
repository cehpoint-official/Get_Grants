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
      const adminStatus = isAdminUser(user);
      setIsAdmin(adminStatus);
      
      if (user) {
        // We don't need a Firestore profile for admin users
        if (adminStatus) {
          setUserProfile(null);
        } else {
          // For any other user (founder or incubator), fetch their profile
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

  // New signup function for Founders
  const signup = async (email: string, password: string, fullName: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Prepare the data for the founder's profile
      const profileData: CreateUserData = {
        fullName,
        email,
        role: 'founder' // Set the role as 'founder'
      };

      // Create the user profile in Firestore
      const profile = await createUserProfile(userCredential.user, profileData);
      
      setUserProfile(profile);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };

  // This function is specifically for incubators, we'll keep it for later use.
  const registerIncubator = async (
    email: string, 
    password: string, 
    additionalData: Omit<CreateUserData, 'email' | 'role'>
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
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
    signup, // Export the new signup function
    registerIncubator,
    logout,
  };
}
