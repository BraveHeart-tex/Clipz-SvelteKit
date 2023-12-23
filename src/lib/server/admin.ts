import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import {
	FIREBASE_CLIENT_EMAIL,
	FIREBASE_PRIVATE_KEY,
	FIREBASE_PROJECT_ID
} from '$env/static/private';
import pkg from 'firebase-admin';

try {
	pkg.initializeApp({
		credential: pkg.credential.cert({
			projectId: FIREBASE_PROJECT_ID,
			clientEmail: FIREBASE_CLIENT_EMAIL,
			privateKey: FIREBASE_PRIVATE_KEY
		})
	});
} catch (error: unknown) {
	if (error instanceof Error) {
		if (!/already exists/u.test(error.message)) {
			console.error('Firebase admin initialization error', error.stack);
		}
	}
}

export const adminDB = getFirestore();
export const adminAuth = getAuth();
