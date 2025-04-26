import express from 'express';
import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Firebase user interface for the application
export interface FirebaseUser {
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  emailVerified: boolean;
}

// Initialize Firebase Admin for server-side verification
// In VSCode development, you'll need to add your service account key
// Create a .env file with FIREBASE_SERVICE_ACCOUNT (base64 encoded)
try {
  // Check if app is already initialized to prevent multiple instances
  admin.app();
  console.log('Firebase Admin already initialized');
} catch (error) {
  // Initialize only if not already initialized
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
  
  if (serviceAccount) {
    try {
      // Decode the base64 encoded service account
      const decodedServiceAccount = Buffer.from(serviceAccount, 'base64').toString();
      const serviceAccountJson = JSON.parse(decodedServiceAccount);
      
      // Initialize with service account
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccountJson)
      });
      
      console.log('Firebase Admin initialized with service account');
    } catch (initError) {
      console.error('Error initializing Firebase Admin with service account:', initError);
      
      // Initialize with minimal configuration for development
      admin.initializeApp();
      console.log('⚠️ Firebase Admin initialized with default configuration');
    }
  } else {
    // For development in VSCode, allow using Firebase without service account
    console.log('⚠️ No service account provided');
    
    // Initialize with minimal configuration
    admin.initializeApp();
    
    console.log('⚠️ Firebase Admin initialized without service account');
    console.log('⚠️ Token verification will not work properly');
    console.log('⚠️ To enable full functionality, add FIREBASE_SERVICE_ACCOUNT to .env');
  }
}

// Middleware to verify Firebase ID tokens
export const firebaseAuth = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized - No token provided' });
  }
  
  const idToken = authHeader.split('Bearer ')[1];
  
  try {
    // Verify ID token with Firebase Admin
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    // Convert Firebase token to our app's user format
    const firebaseUser: FirebaseUser = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      displayName: decodedToken.name,
      photoURL: decodedToken.picture,
      emailVerified: decodedToken.email_verified || false
    };
    
    req.firebaseUser = firebaseUser; // Add the firebase user to the request
    next();
  } catch (error) {
    console.error('Firebase token verification failed:', error);
    
    if (process.env.NODE_ENV === 'development') {
      // In development mode, allow continuing for easier testing in VSCode
      console.warn('⚠️ Development mode - bypassing Firebase authentication');
      req.firebaseUser = {
        uid: 'development-user-id',
        email: 'dev@example.com',
        displayName: 'Development User',
        emailVerified: true
      };
      next();
    } else {
      return res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }
  }
};

// Function to get user by ID
export const getUserById = async (uid: string): Promise<FirebaseUser | null> => {
  try {
    const userRecord = await admin.auth().getUser(uid);
    return {
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      photoURL: userRecord.photoURL,
      emailVerified: userRecord.emailVerified
    };
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

// Extend Express Request interface to include firebase user
declare global {
  namespace Express {
    interface Request {
      firebaseUser?: FirebaseUser;
    }
  }
}

export default admin;