import { db } from './firebase';
import { doc, getDoc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { UserProfile, CreateUserData } from './types';
import { User as FirebaseUser } from 'firebase/auth';

export async function createUserProfile(
  user: FirebaseUser,
  additionalData: CreateUserData
): Promise<UserProfile> {
  const userRef = doc(db, 'users', user.uid);
  
  const userProfile: UserProfile = {
    id: user.uid,
    email: user.email!,
    fullName: additionalData.fullName,
    phone: additionalData.phone || '',
    role: additionalData.role,
    createdAt: new Date(),
    subscriptionStatus: 'free',
    savedGrants: [],
  };

  await setDoc(userRef, {
    ...userProfile,
    createdAt: serverTimestamp(),
  });

  return userProfile;
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const data = userSnap.data();
      const profile: UserProfile = {
        id: uid,
        fullName: data.fullName,
        email: data.email,
        role: data.role,
        subscriptionStatus: data.subscriptionStatus || 'free',
        subscriptionEndDate: data.subscriptionEndDate?.toDate() || null,
        savedGrants: data.savedGrants || [],
        phone: data.phone || '',
        createdAt: data.createdAt?.toDate() || new Date(),
      };
      return profile;
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
  await updateDoc(userRef, {
    ...updates,
    updatedAt: serverTimestamp()
  });
}