import express from 'express';
import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { join } from 'path';

// Firebase user interface for the application
export interface FirebaseUser {
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  emailVerified: boolean;
}

// Initialize Firebase Admin for server-side verification
try {
  // Check if app is already initialized to prevent multiple instances
  admin.app();
  console.log('Firebase Admin already initialized');
} catch (error) {
  try {
    // Read the service account JSON file directly
    const serviceAccountPath = join(process.cwd(), 'quickrent-furnish-firebase-adminsdk-fbsvc-c9122db31f.json');
    const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
    
    // Initialize with service account
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    
    console.log('Firebase Admin initialized with service account');
  } catch (initError) {
    console.error('Error initializing Firebase Admin:', initError);
    throw initError;
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
    
    req.firebaseUser = firebaseUser;
    next();
  } catch (error) {
    console.error('Firebase token verification failed:', error);
    return res.status(401).json({ error: 'Unauthorized - Invalid token' });
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