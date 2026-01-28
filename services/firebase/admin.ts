import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const initializeFirebaseAdmin = () => {
  const apps = getApps();

  if (!apps.length) {
    const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY;
    
    // Robust private key formatting
    let privateKey = rawPrivateKey;
    if (privateKey) {
        // Replace literal \n with actual newlines
        privateKey = privateKey.replace(/\\n/g, "\n");
        
        // Remove enclosing quotes if they exist (uncommon artifact but possible)
        if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
            privateKey = privateKey.slice(1, -1);
        }
    }

    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !privateKey) {
      console.error(
        "Missing Firebase Admin environment variables. Please check your .env file."
      );
    }
    
    // Debug log to help identify format issues (safe, doesn't log full key)
    // console.log("Debug Private Key Start:", privateKey?.substring(0, 30));

    try {
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey,
        }),
      });
    } catch (error) {
      console.error("Failed to initialize Firebase Admin:", error);
    }
  }

  return { auth: getAuth(), db: getFirestore() };
};

export const { auth, db } = initializeFirebaseAdmin();
