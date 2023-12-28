import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAb0FRvm3Xb0keRL1Aj-kw9SjmaUU_6I1k',
  authDomain: 'clips-2163f.firebaseapp.com',
  projectId: 'clips-2163f',
  storageBucket: 'clips-2163f.appspot.com',
  messagingSenderId: '281630266554',
  appId: '1:281630266554:web:c7932ad00746ab62ff1e83',
  measurementId: 'G-YRPHQTBM0Q'
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
