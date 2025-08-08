// src/lib/userService.ts
import { db } from './firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { UserProfile, CreateUserData } from './types';
import { User } from 'firebase/auth';

export async function createUserProfile(
  user: User, 
  additionalData: Partial<CreateUserData> = {}
): Promise<UserProfile> {
  const userRef = doc(db, 'users', user.uid);
  
  const userProfile: UserProfile = {
    uid: user.uid,
    email: user.email!,
    role: additionalData.role || 'incubator',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...additionalData
  };

  await setDoc(userRef, {
    ...userProfile,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  return userProfile;
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const data = userSnap.data();
      return {
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      } as UserProfile;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

export async function updateUserProfile(
  uid: string, 
  updates: Partial<UserProfile>
): Promise<void> {
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, {
    ...updates,
    updatedAt: serverTimestamp()
  }, { merge: true });
}