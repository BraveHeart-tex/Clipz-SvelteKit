import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import pkg, { type ServiceAccount } from 'firebase-admin';
import { getStorage } from 'firebase-admin/storage';
import { getMessaging } from 'firebase-admin/messaging';
import serviceAccount from '$/service-account.json';

try {
  pkg.initializeApp({
    credential: pkg.credential.cert(serviceAccount as ServiceAccount)
  });

  console.log('Firebase admin initialized');
} catch (error: unknown) {
  if (error instanceof Error) {
    if (!/already exists/u.test(error.message)) {
      console.error('Firebase admin initialization error', error.stack);
    }
  }

  console.error('Firebase admin initialization error', error);
}

export const adminDB = getFirestore();
export const adminAuth = getAuth();
export const adminStorage = getStorage();
export const adminMessaging = getMessaging();
