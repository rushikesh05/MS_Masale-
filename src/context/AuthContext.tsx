import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { auth, googleProvider, db, testFirestoreConnection } from '../lib/firebase';
import { UserProfile, UserRole, SavedAddress, SavedPaymentMethod } from '../types';

export interface CustomerUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
}

interface StoredRegisteredCustomer {
  uid: string;
  email: string;
  password: string;
  profile: UserProfile;
}

interface AuthContextType {
  currentUser: FirebaseUser | CustomerUser | null;
  userProfile: UserProfile | null;
  role: UserRole;
  setRole: (role: UserRole) => void;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isAccountModalOpen: boolean;
  setIsAccountModalOpen: (open: boolean) => void;
  authMode: 'login' | 'signup';
  setAuthMode: (mode: 'login' | 'signup') => void;
  signInWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signupWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserRole: (newRole: UserRole) => Promise<void>;
  authError: string | null;
  clearAuthError: () => void;
  
  // Account Management
  updateProfileDetails: (name: string, phone?: string) => Promise<void>;
  addSavedAddress: (address: Omit<SavedAddress, 'id'>) => Promise<void>;
  updateSavedAddress: (address: SavedAddress) => Promise<void>;
  deleteSavedAddress: (addressId: string) => Promise<void>;
  setDefaultAddress: (addressId: string) => Promise<void>;
  savePaymentMethod: (method: Omit<SavedPaymentMethod, 'id'>) => Promise<void>;
  deletePaymentMethod: (methodId: string) => Promise<void>;
  setDefaultPaymentMethod: (methodId: string) => Promise<void>;
}

const STORAGE_ACTIVE_USER = 'msmasale_active_user';
const STORAGE_REGISTERED_CUSTOMERS = 'msmasale_registered_customers';

// Seed demo customer if database is completely empty
function initializeRegisteredCustomers(): StoredRegisteredCustomer[] {
  try {
    const raw = localStorage.getItem(STORAGE_REGISTERED_CUSTOMERS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Could not read registered customers:', e);
  }

  const initialDemo: StoredRegisteredCustomer[] = [
    {
      uid: 'cust_demo_anand',
      email: 'anand.joshi@gmail.com',
      password: 'password123',
      profile: {
        uid: 'cust_demo_anand',
        email: 'anand.joshi@gmail.com',
        displayName: 'Anand Joshi',
        phone: '8591254237',
        role: 'customer',
        preferredLanguage: 'en',
        addresses: [
          {
            id: 'addr_demo_1',
            label: 'Home',
            fullName: 'Anand Joshi',
            phone: '8591254237',
            addressLine1: 'Flat 402, Swamini Heights, Baner Road',
            landmark: 'Near Ganpati Temple',
            talukaDistrict: 'Pune',
            pincode: '411045',
            state: 'Maharashtra',
            isDefault: true
          }
        ],
        paymentMethods: [
          {
            id: 'pm_demo_1',
            type: 'upi',
            upiId: 'anand.joshi@okaxis',
            label: 'Google Pay UPI',
            isDefault: true
          }
        ],
        createdAt: new Date().toISOString()
      }
    }
  ];

  try {
    localStorage.setItem(STORAGE_REGISTERED_CUSTOMERS, JSON.stringify(initialDemo));
  } catch (e) {
    console.warn('Could not write demo customer:', e);
  }

  return initialDemo;
}

function saveRegisteredCustomers(customers: StoredRegisteredCustomer[]) {
  try {
    localStorage.setItem(STORAGE_REGISTERED_CUSTOMERS, JSON.stringify(customers));
  } catch (e) {
    console.warn('Failed to persist registered customers:', e);
  }
}

function getStoredActiveUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_ACTIVE_USER);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Could not read active user from localStorage:', e);
  }
  return null;
}

function persistActiveUser(profile: UserProfile | null) {
  try {
    if (profile) {
      localStorage.setItem(STORAGE_ACTIVE_USER, JSON.stringify(profile));
    } else {
      localStorage.removeItem(STORAGE_ACTIVE_USER);
    }
  } catch (e) {
    console.warn('Failed to persist active user:', e);
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | CustomerUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [role, setRoleState] = useState<UserRole>('customer');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authError, setAuthError] = useState<string | null>(null);

  const clearAuthError = () => setAuthError(null);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
  };

  // Sync profile update across local storage & customer registry
  const syncLocalCustomerProfile = (updatedProfile: UserProfile) => {
    persistActiveUser(updatedProfile);
    try {
      const customers = initializeRegisteredCustomers();
      const idx = customers.findIndex(c => c.uid === updatedProfile.uid || c.email.toLowerCase() === updatedProfile.email.toLowerCase());
      if (idx !== -1) {
        customers[idx].profile = updatedProfile;
        saveRegisteredCustomers(customers);
      }
    } catch (e) {
      console.warn('Could not update customer registry:', e);
    }
  };

  // Real-time listener for Auth & Firestore User Profile
  useEffect(() => {
    testFirestoreConnection();
    initializeRegisteredCustomers();

    // Check if we have an active stored session
    const savedActiveUser = getStoredActiveUser();
    if (savedActiveUser) {
      setCurrentUser({
        uid: savedActiveUser.uid,
        email: savedActiveUser.email,
        displayName: savedActiveUser.displayName,
        photoURL: savedActiveUser.avatarUrl
      });
      setUserProfile(savedActiveUser);
      setRoleState(savedActiveUser.role || 'customer');
    }

    let unsubscribeSnapshot: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setCurrentUser(firebaseUser);
        const userDocRef = doc(db, 'users', firebaseUser.uid);

        // Initial check & auto-creation if doc doesn't exist
        try {
          const snap = await getDoc(userDocRef);
          if (!snap.exists()) {
            const initialDoc: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Customer',
              role: 'customer',
              avatarUrl: firebaseUser.photoURL || undefined,
              preferredLanguage: 'en',
              addresses: [],
              paymentMethods: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            await setDoc(userDocRef, initialDoc, { merge: true });
            setUserProfile(initialDoc);
            persistActiveUser(initialDoc);
          } else {
            const data = snap.data() as UserProfile;
            setUserProfile(data);
            persistActiveUser(data);
          }
        } catch (e) {
          console.warn('Initial user doc fetch note:', e);
        }

        // Real-time Firestore document sync
        if (unsubscribeSnapshot) unsubscribeSnapshot();
        unsubscribeSnapshot = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data() as UserProfile;
            setUserProfile(data);
            persistActiveUser(data);
          }
        }, (err) => {
          console.warn('Real-time profile listener notice:', err);
        });

      } else {
        // If Firebase does not report a user, verify if we have a locally stored active session
        const stored = getStoredActiveUser();
        if (stored) {
          setCurrentUser({
            uid: stored.uid,
            email: stored.email,
            displayName: stored.displayName,
            photoURL: stored.avatarUrl
          });
          setUserProfile(stored);
        } else {
          if (unsubscribeSnapshot) {
            unsubscribeSnapshot();
            unsubscribeSnapshot = null;
          }
          setCurrentUser(null);
          setUserProfile(null);
          setRoleState('customer');
        }
      }

      setIsLoading(false);
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, []);

  // Real-time Login Handling (Attempts Firebase Auth, with resilient local registry sync)
  const loginWithEmail = async (email: string, pass: string) => {
    setAuthError(null);
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setAuthError('Please enter your email address.');
      throw new Error('Email is required');
    }
    if (!pass) {
      setAuthError('Please enter your password.');
      throw new Error('Password is required');
    }

    let firebaseAuthSuccess = false;

    // 1. Attempt real Firebase Auth
    try {
      const res = await signInWithEmailAndPassword(auth, cleanEmail, pass);
      if (res.user) {
        firebaseAuthSuccess = true;
        setCurrentUser(res.user);
        setIsAuthModalOpen(false);
        return;
      }
    } catch (err: any) {
      console.warn('Firebase Auth Login note:', err.code || err.message);

      // If user supplied wrong password for an account that Firebase authenticated, report it
      if (err.code === 'auth/wrong-password') {
        const msg = 'Incorrect password. Please verify and try again.';
        setAuthError(msg);
        throw new Error(msg);
      }
    }

    // 2. Check customer registry (for new and previous customers)
    const registeredList = initializeRegisteredCustomers();
    const existing = registeredList.find(c => c.email.toLowerCase() === cleanEmail.toLowerCase());

    if (existing) {
      if (existing.password === pass) {
        // Successful match
        const loggedUser: CustomerUser = {
          uid: existing.uid,
          email: existing.email,
          displayName: existing.profile.displayName || cleanEmail.split('@')[0],
          photoURL: existing.profile.avatarUrl
        };
        setCurrentUser(loggedUser);
        setUserProfile(existing.profile);
        persistActiveUser(existing.profile);
        setIsAuthModalOpen(false);

        // Attempt Firestore sync in background
        try {
          await setDoc(doc(db, 'users', existing.uid), existing.profile, { merge: true });
        } catch (e) {
          // Non-blocking
        }
        return;
      } else {
        const msg = 'Incorrect password. Please verify and try again.';
        setAuthError(msg);
        throw new Error(msg);
      }
    }

    // If account not found in either system
    const notFoundMsg = 'No account found with this email. Please switch to "Create Account" above to register.';
    setAuthError(notFoundMsg);
    throw new Error(notFoundMsg);
  };

  // Real-time Sign Up Handling (Attempts Firebase Auth, with resilient local registry sync)
  const signupWithEmail = async (email: string, pass: string, name: string) => {
    setAuthError(null);
    const cleanEmail = email.trim();
    const cleanName = name.trim() || cleanEmail.split('@')[0];

    if (!cleanEmail) {
      setAuthError('Please enter an email address.');
      throw new Error('Email is required');
    }
    if (pass.length < 6) {
      setAuthError('Password must be at least 6 characters.');
      throw new Error('Password must be at least 6 characters');
    }

    // Check if email already registered locally
    const registeredList = initializeRegisteredCustomers();
    if (registeredList.some(c => c.email.toLowerCase() === cleanEmail.toLowerCase())) {
      const msg = 'An account already exists with this email. Please switch to "Sign In".';
      setAuthError(msg);
      throw new Error(msg);
    }

    let createdFirebaseUser: FirebaseUser | null = null;

    // 1. Attempt real Firebase Auth
    try {
      const res = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
      if (res.user) {
        createdFirebaseUser = res.user;
        try {
          await updateProfile(res.user, { displayName: cleanName });
        } catch (e) {
          console.warn('Could not update Firebase displayName:', e);
        }
      }
    } catch (err: any) {
      console.warn('Firebase Auth Signup note:', err.code || err.message);

      if (err.code === 'auth/email-already-in-use') {
        const msg = 'An account already exists with this email. Please switch to "Sign In".';
        setAuthError(msg);
        throw new Error(msg);
      }
      // If operation is not allowed or offline, we continue with local customer registration
    }

    // 2. Create customer profile
    const assignedUid = createdFirebaseUser?.uid || 'cust_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6);
    const newProfile: UserProfile = {
      uid: assignedUid,
      email: cleanEmail,
      displayName: cleanName,
      role: 'customer',
      preferredLanguage: 'en',
      addresses: [],
      paymentMethods: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save to registered customers list
    const newRecord: StoredRegisteredCustomer = {
      uid: assignedUid,
      email: cleanEmail,
      password: pass,
      profile: newProfile
    };
    registeredList.push(newRecord);
    saveRegisteredCustomers(registeredList);

    // Set state & persist active user
    const newUserObj: CustomerUser = {
      uid: assignedUid,
      email: cleanEmail,
      displayName: cleanName
    };
    setCurrentUser(createdFirebaseUser || newUserObj);
    setUserProfile(newProfile);
    persistActiveUser(newProfile);
    setIsAuthModalOpen(false);

    // Save document to Firestore
    try {
      const userRef = doc(db, 'users', assignedUid);
      await setDoc(userRef, newProfile, { merge: true });
    } catch (e) {
      console.warn('Firestore user profile write note:', e);
    }
  };

  // Google Sign In
  const signInWithGoogle = async () => {
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        const userRef = doc(db, 'users', result.user.uid);
        const snap = await getDoc(userRef);
        let profileData: UserProfile;
        if (!snap.exists()) {
          profileData = {
            uid: result.user.uid,
            email: result.user.email || '',
            displayName: result.user.displayName || result.user.email?.split('@')[0] || 'Customer',
            role: 'customer',
            avatarUrl: result.user.photoURL || undefined,
            preferredLanguage: 'en',
            addresses: [],
            paymentMethods: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          await setDoc(userRef, profileData, { merge: true });
        } else {
          profileData = snap.data() as UserProfile;
        }
        setCurrentUser(result.user);
        setUserProfile(profileData);
        persistActiveUser(profileData);
        setIsAuthModalOpen(false);
      }
    } catch (err: any) {
      console.error('Google Sign In error:', err);
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
        setAuthError('Google sign-in popup was closed.');
      } else if (err.code === 'auth/popup-blocked') {
        setAuthError('Popup was blocked by your browser. Please allow popups or use email sign-in.');
      } else {
        setAuthError(err.message || 'Google sign-in failed. Please use email and password.');
      }
      throw err;
    }
  };

  // Update Role (if needed internally)
  const updateUserRole = async (newRole: UserRole) => {
    setRoleState(newRole);
    if (currentUser) {
      const updated = userProfile ? { ...userProfile, role: newRole, updatedAt: new Date().toISOString() } : null;
      if (updated) {
        setUserProfile(updated);
        syncLocalCustomerProfile(updated);
      }
      try {
        const userRef = doc(db, 'users', currentUser.uid);
        await setDoc(userRef, { role: newRole, updatedAt: new Date().toISOString() }, { merge: true });
      } catch (e) {
        console.warn('Failed to update role in Firestore:', e);
      }
    }
  };

  // Sign Out
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Firebase signOut note:', e);
    }
    persistActiveUser(null);
    setCurrentUser(null);
    setUserProfile(null);
    setRoleState('customer');
    setIsAccountModalOpen(false);
  };

  // Update Profile Name & Phone
  const updateProfileDetails = async (name: string, phone?: string) => {
    if (!currentUser) throw new Error('Not authenticated');
    const cleanName = name.trim();

    try {
      if ('getIdToken' in currentUser) {
        await updateProfile(currentUser as FirebaseUser, { displayName: cleanName });
      }
    } catch (e) {
      console.warn('Could not update Firebase displayName:', e);
    }

    const updates = {
      displayName: cleanName,
      phone: phone ? phone.trim() : '',
      updatedAt: new Date().toISOString()
    };

    if (userProfile) {
      const updatedProfile = { ...userProfile, ...updates };
      setUserProfile(updatedProfile);
      syncLocalCustomerProfile(updatedProfile);
    }

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await setDoc(userRef, updates, { merge: true });
    } catch (e) {
      console.warn('Failed to update profile in Firestore:', e);
    }
  };

  // Add Saved Address
  const addSavedAddress = async (addrData: Omit<SavedAddress, 'id'>) => {
    if (!currentUser) throw new Error('Not authenticated');

    const newId = 'addr_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6);
    const newAddress: SavedAddress = {
      ...addrData,
      id: newId
    };

    const currentAddresses = userProfile?.addresses || [];
    let updatedAddresses: SavedAddress[];

    if (newAddress.isDefault || currentAddresses.length === 0) {
      newAddress.isDefault = true;
      updatedAddresses = [
        newAddress,
        ...currentAddresses.map(a => ({ ...a, isDefault: false }))
      ];
    } else {
      updatedAddresses = [...currentAddresses, newAddress];
    }

    if (userProfile) {
      const updatedProfile = { 
        ...userProfile, 
        addresses: updatedAddresses,
        updatedAt: new Date().toISOString()
      };
      setUserProfile(updatedProfile);
      syncLocalCustomerProfile(updatedProfile);
    }

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await setDoc(userRef, { 
        addresses: updatedAddresses,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.warn('Firestore address update note:', e);
    }
  };

  // Update Saved Address
  const updateSavedAddress = async (address: SavedAddress) => {
    if (!currentUser) throw new Error('Not authenticated');

    const currentAddresses = userProfile?.addresses || [];
    const updatedAddresses = currentAddresses.map(a => {
      if (a.id === address.id) {
        return address;
      }
      if (address.isDefault) {
        return { ...a, isDefault: false };
      }
      return a;
    });

    if (userProfile) {
      const updatedProfile = { 
        ...userProfile, 
        addresses: updatedAddresses,
        updatedAt: new Date().toISOString()
      };
      setUserProfile(updatedProfile);
      syncLocalCustomerProfile(updatedProfile);
    }

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await setDoc(userRef, { 
        addresses: updatedAddresses,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.warn('Firestore address update note:', e);
    }
  };

  // Delete Saved Address
  const deleteSavedAddress = async (addressId: string) => {
    if (!currentUser) throw new Error('Not authenticated');

    const currentAddresses = userProfile?.addresses || [];
    let updatedAddresses = currentAddresses.filter(a => a.id !== addressId);

    // If default was deleted, make the first one default
    if (updatedAddresses.length > 0 && !updatedAddresses.some(a => a.isDefault)) {
      updatedAddresses[0].isDefault = true;
    }

    if (userProfile) {
      const updatedProfile = { 
        ...userProfile, 
        addresses: updatedAddresses,
        updatedAt: new Date().toISOString()
      };
      setUserProfile(updatedProfile);
      syncLocalCustomerProfile(updatedProfile);
    }

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await setDoc(userRef, { 
        addresses: updatedAddresses,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.warn('Firestore address delete note:', e);
    }
  };

  // Set Default Address
  const setDefaultAddress = async (addressId: string) => {
    if (!currentUser) throw new Error('Not authenticated');

    const currentAddresses = userProfile?.addresses || [];
    const updatedAddresses = currentAddresses.map(a => ({
      ...a,
      isDefault: a.id === addressId
    }));

    if (userProfile) {
      const updatedProfile = { 
        ...userProfile, 
        addresses: updatedAddresses,
        updatedAt: new Date().toISOString()
      };
      setUserProfile(updatedProfile);
      syncLocalCustomerProfile(updatedProfile);
    }

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await setDoc(userRef, { 
        addresses: updatedAddresses,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.warn('Firestore default address note:', e);
    }
  };

  // Save Payment Method (e.g. UPI ID or COD preference)
  const savePaymentMethod = async (methodData: Omit<SavedPaymentMethod, 'id'>) => {
    if (!currentUser) throw new Error('Not authenticated');

    const newId = 'pm_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6);
    const newMethod: SavedPaymentMethod = {
      ...methodData,
      id: newId
    };

    const currentMethods = userProfile?.paymentMethods || [];
    let updatedMethods: SavedPaymentMethod[];

    if (newMethod.isDefault || currentMethods.length === 0) {
      newMethod.isDefault = true;
      updatedMethods = [
        newMethod,
        ...currentMethods.map(m => ({ ...m, isDefault: false }))
      ];
    } else {
      updatedMethods = [...currentMethods, newMethod];
    }

    if (userProfile) {
      const updatedProfile = { 
        ...userProfile, 
        paymentMethods: updatedMethods,
        updatedAt: new Date().toISOString()
      };
      setUserProfile(updatedProfile);
      syncLocalCustomerProfile(updatedProfile);
    }

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await setDoc(userRef, { 
        paymentMethods: updatedMethods,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.warn('Firestore payment method note:', e);
    }
  };

  // Delete Payment Method
  const deletePaymentMethod = async (methodId: string) => {
    if (!currentUser) throw new Error('Not authenticated');

    const currentMethods = userProfile?.paymentMethods || [];
    let updatedMethods = currentMethods.filter(m => m.id !== methodId);

    if (updatedMethods.length > 0 && !updatedMethods.some(m => m.isDefault)) {
      updatedMethods[0].isDefault = true;
    }

    if (userProfile) {
      const updatedProfile = { 
        ...userProfile, 
        paymentMethods: updatedMethods,
        updatedAt: new Date().toISOString()
      };
      setUserProfile(updatedProfile);
      syncLocalCustomerProfile(updatedProfile);
    }

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await setDoc(userRef, { 
        paymentMethods: updatedMethods,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.warn('Firestore payment method delete note:', e);
    }
  };

  // Set Default Payment Method
  const setDefaultPaymentMethod = async (methodId: string) => {
    if (!currentUser) throw new Error('Not authenticated');

    const currentMethods = userProfile?.paymentMethods || [];
    const updatedMethods = currentMethods.map(m => ({
      ...m,
      isDefault: m.id === methodId
    }));

    if (userProfile) {
      const updatedProfile = { 
        ...userProfile, 
        paymentMethods: updatedMethods,
        updatedAt: new Date().toISOString()
      };
      setUserProfile(updatedProfile);
      syncLocalCustomerProfile(updatedProfile);
    }

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await setDoc(userRef, { 
        paymentMethods: updatedMethods,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.warn('Firestore default payment method note:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        role,
        setRole,
        isLoading,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isAccountModalOpen,
        setIsAccountModalOpen,
        authMode,
        setAuthMode,
        signInWithGoogle,
        loginWithEmail,
        signupWithEmail,
        logout,
        updateUserRole,
        authError,
        clearAuthError,
        updateProfileDetails,
        addSavedAddress,
        updateSavedAddress,
        deleteSavedAddress,
        setDefaultAddress,
        savePaymentMethod,
        deletePaymentMethod,
        setDefaultPaymentMethod
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
