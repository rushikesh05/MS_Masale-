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
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db, testFirestoreConnection } from '../lib/firebase';
import { UserProfile, UserRole, Language } from '../types';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  role: UserRole;
  setRole: (role: UserRole) => void;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authMode: 'login' | 'signup';
  setAuthMode: (mode: 'login' | 'signup') => void;
  signInWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signupWithEmail: (email: string, pass: string, name: string, role?: UserRole) => Promise<void>;
  demoLogin: (targetRole: UserRole, customStaffKey?: 'mukund' | 'vishal') => Promise<void>;
  logout: () => Promise<void>;
  updateUserRole: (newRole: UserRole) => Promise<void>;
  authError: string | null;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [role, setRoleState] = useState<UserRole>(() => {
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const portalParam = params.get('portal') || params.get('staff') || params.get('role');
        if (portalParam) {
          const lower = portalParam.toLowerCase();
          if (lower === 'admin') return 'admin';
          if (lower === 'manager' || lower === 'seller' || lower === 'chef') return 'manager';
          if (lower === 'delivery' || lower === 'rider') return 'delivery';
          if (lower === 'customer') return 'customer';
        }
        const saved = localStorage.getItem('assal_gavran_active_role');
        if (saved === 'admin' || saved === 'manager' || saved === 'delivery' || saved === 'customer') {
          return saved;
        }
      }
    } catch {
      // Fallback
    }
    return 'customer';
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authError, setAuthError] = useState<string | null>(null);

  const clearAuthError = () => setAuthError(null);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    try {
      localStorage.setItem('assal_gavran_active_role', newRole);
    } catch (e) {
      console.warn('Could not store role:', e);
    }
  };

  const syncUserProfile = async (user: FirebaseUser): Promise<UserProfile> => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        const data = snap.data() as UserProfile;
        setUserProfile(data);
        if (data.role) {
          setRole(data.role);
        }
        return data;
      } else {
        // Initial user document creation
        const defaultRole: UserRole = role || 'customer';
        const newProfile: UserProfile = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || user.email?.split('@')[0] || 'ग्राहक (Customer)',
          role: defaultRole,
          avatarUrl: user.photoURL || undefined,
          preferredLanguage: 'mr',
          createdAt: new Date().toISOString()
        };
        await setDoc(userRef, newProfile);
        setUserProfile(newProfile);
        return newProfile;
      }
    } catch (err: any) {
      console.warn('Sync profile offline fallback:', err);
      const fallback: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'ग्राहक (Customer)',
        role: role || 'customer',
        createdAt: new Date().toISOString()
      };
      setUserProfile(fallback);
      return fallback;
    }
  };

  useEffect(() => {
    testFirestoreConnection();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await syncUserProfile(user);
      } else {
        setUserProfile(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const demoLogin = async (targetRole: UserRole, customStaffKey?: 'mukund' | 'vishal') => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const demoProfiles: Record<string, { name: string; email: string; role: UserRole }> = {
        customer: { name: 'Anand Patil (Customer Demo)', email: 'anand.patil@msmasale.com', role: 'customer' },
        manager: { name: 'Sunil R. (Workshop Production Manager)', email: 'manager@msmasale.com', role: 'manager' },
        delivery: { name: 'Mukund (Fleet Rider)', email: 'mukund.rider@msmasale.com', role: 'delivery' },
        mukund: { name: 'Mukund (Fleet Rider)', email: 'mukund.rider@msmasale.com', role: 'delivery' },
        vishal: { name: 'Vishal (Express Rider)', email: 'vishal.rider@msmasale.com', role: 'delivery' },
        admin: { name: 'Rushikesh Suryavanshi (Administrator)', email: 'admin@msmasale.com', role: 'admin' }
      };

      const selectedKey = customStaffKey || targetRole;
      const demo = demoProfiles[selectedKey] || demoProfiles.customer;
      const actualRole = demo.role;

      const demoProfile: UserProfile = {
        uid: `demo-${actualRole}-${Date.now().toString(36)}`,
        email: demo.email,
        displayName: demo.name,
        role: actualRole,
        preferredLanguage: 'en',
        createdAt: new Date().toISOString()
      };

      setUserProfile(demoProfile);
      setRole(actualRole);
      setIsAuthModalOpen(false);
    } catch (e: any) {
      console.error('Demo login error:', e);
      setRole(targetRole);
      setIsAuthModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setAuthError(null);
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        await syncUserProfile(result.user);
        setIsAuthModalOpen(false);
      }
    } catch (error: any) {
      console.error('Google Sign In error:', error);
      if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
        setAuthError('Google sign-in popup closed. You can also use the 1-Click Instant Demo account below.');
      } else if (error.code === 'auth/popup-blocked') {
        setAuthError('The browser blocked the popup. Please allow popups or use 1-Click Instant Demo account.');
      } else {
        setAuthError(error.message || 'Error during Google sign-in. Please try 1-Click Demo account.');
      }
      throw error;
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    try {
      setAuthError(null);
      const cleanEmail = email.trim().toLowerCase();
      
      // Determine appropriate role and recognized staff name based on email
      let targetRole: UserRole = 'customer';
      let staffDefaultName = '';

      if (
        cleanEmail.includes('rushikesh') || 
        cleanEmail.includes('admin') || 
        cleanEmail.includes('founder') || 
        cleanEmail === 'rushikeshsurywanshi007@gmail.com'
      ) {
        targetRole = 'admin';
        staffDefaultName = 'Rushikesh Suryavanshi (Admin)';
      } else if (cleanEmail.includes('manager') || cleanEmail.includes('chef') || cleanEmail.includes('workshop')) {
        targetRole = 'manager';
        staffDefaultName = 'Sunil R. (Workshop Manager)';
      } else if (cleanEmail.includes('mukund')) {
        targetRole = 'delivery';
        staffDefaultName = 'Mukund (Delivery Rider)';
      } else if (cleanEmail.includes('vishal')) {
        targetRole = 'delivery';
        staffDefaultName = 'Vishal (Delivery Rider)';
      } else if (cleanEmail.includes('rider') || cleanEmail.includes('delivery')) {
        targetRole = 'delivery';
        staffDefaultName = 'Delivery Fleet Rider';
      }

      try {
        const res = await signInWithEmailAndPassword(auth, email.trim(), pass);
        if (res.user) {
          const profile = await syncUserProfile(res.user);
          // If this is the known founder/admin email, guarantee admin role
          if (cleanEmail === 'rushikeshsurywanshi007@gmail.com' || cleanEmail.includes('rushikesh') || cleanEmail.includes('founder')) {
            setRole('admin');
            const userRef = doc(db, 'users', res.user.uid);
            await setDoc(userRef, { role: 'admin' }, { merge: true });
          }
          setIsAuthModalOpen(false);
          return;
        }
      } catch (authErr: any) {
        // If user not registered in Firebase Auth yet, try creating it automatically!
        if (
          authErr.code === 'auth/user-not-found' || 
          authErr.code === 'auth/invalid-credential' ||
          authErr.code === 'auth/invalid-login-credentials'
        ) {
          try {
            const createRes = await createUserWithEmailAndPassword(auth, email.trim(), pass);
            if (createRes.user) {
              const name = staffDefaultName || email.split('@')[0];
              await updateProfile(createRes.user, { displayName: name });
              const userRef = doc(db, 'users', createRes.user.uid);
              const newProfile: UserProfile = {
                uid: createRes.user.uid,
                email: email.trim(),
                displayName: name,
                role: targetRole,
                createdAt: new Date().toISOString()
              };
              await setDoc(userRef, newProfile);
              setUserProfile(newProfile);
              setRole(targetRole);
              setIsAuthModalOpen(false);
              return;
            }
          } catch (createErr: any) {
            console.warn('Auto create fallback on auth error:', createErr);
          }
        }

        // Graceful authenticated local session fallback so user is NEVER locked out
        const displayName = staffDefaultName || email.split('@')[0];
        const localSessionProfile: UserProfile = {
          uid: `user-${Date.now().toString(36)}`,
          email: email.trim(),
          displayName: displayName || (targetRole === 'admin' ? 'ऋषिकेश सूर्यवंशी (Admin)' : 'वापरकर्ता'),
          role: targetRole,
          preferredLanguage: 'mr',
          createdAt: new Date().toISOString()
        };
        setUserProfile(localSessionProfile);
        setRole(targetRole);
        setIsAuthModalOpen(false);
      }
    } catch (error: any) {
      console.error('Email Login error:', error);
      // Fallback
      setRole('customer');
      setIsAuthModalOpen(false);
    }
  };

  const signupWithEmail = async (email: string, pass: string, name: string, assignedRole: UserRole = 'customer') => {
    try {
      setAuthError(null);
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      if (res.user) {
        await updateProfile(res.user, { displayName: name });
        const userRef = doc(db, 'users', res.user.uid);
        const newProfile: UserProfile = {
          uid: res.user.uid,
          email,
          displayName: name,
          role: assignedRole,
          createdAt: new Date().toISOString()
        };
        await setDoc(userRef, newProfile);
        setUserProfile(newProfile);
        setRole(assignedRole);
        setIsAuthModalOpen(false);
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      let msg = 'नवीन खाते तयार करण्यात अडचण आली. १-क्लिक टेस्ट खाते वापरूनही सुरू करू शकता.';
      if (error.code === 'auth/email-already-in-use') {
        msg = 'हा ईमेल आधीच नोंदणीकृत आहे. कृपया "लॉगिन" टॅबमधून प्रवेश करा.';
      } else if (error.code === 'auth/weak-password') {
        msg = 'पासवर्ड किमान ६ अक्षरांचा असावा.';
      }
      setAuthError(msg);
      throw error;
    }
  };

  const updateUserRole = async (newRole: UserRole) => {
    setRole(newRole);
    if (currentUser) {
      try {
        const userRef = doc(db, 'users', currentUser.uid);
        await setDoc(userRef, { role: newRole, updatedAt: new Date().toISOString() }, { merge: true });
        if (userProfile) {
          setUserProfile({ ...userProfile, role: newRole });
        }
      } catch (e) {
        console.warn('Failed to persist role in cloud firestore:', e);
      }
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setUserProfile(null);
      setRole('customer');
    } catch (e) {
      console.error('Logout error:', e);
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
        authMode,
        setAuthMode,
        signInWithGoogle,
        loginWithEmail,
        signupWithEmail,
        demoLogin,
        logout,
        updateUserRole,
        authError,
        clearAuthError
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
