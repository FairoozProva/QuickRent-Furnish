import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  User as FirebaseUser,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';

// Firebase configuration
// For VSCode development, you'll need to add these values to a .env file in the root directory
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "your-api-key-here", 
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "your-project-id"}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "your-project-id"}.appspot.com`,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "your-messaging-sender-id",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "your-app-id",
};

// Initialize Firebase for the application
export const firebaseApp = initializeApp(firebaseConfig);

// Get the auth instance
export const auth = getAuth(firebaseApp);

// Create a Google provider instance
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Auth functions
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const signInWithEmail = (email: string, password: string) => 
  signInWithEmailAndPassword(auth, email, password);
export const createUserWithEmail = (email: string, password: string) => 
  createUserWithEmailAndPassword(auth, email, password);
export const updateUserProfile = (user: FirebaseUser, displayName: string) => 
  updateProfile(user, { displayName });
export const logoutUser = () => signOut(auth);
export const resetPassword = (email: string) => 
  sendPasswordResetEmail(auth, email);

// Export types
export type { FirebaseUser };

// Export auth state listener
export const onAuthChange = (callback: (user: FirebaseUser | null) => void) => 
  onAuthStateChanged(auth, callback);

// Export providers
export { GoogleAuthProvider };