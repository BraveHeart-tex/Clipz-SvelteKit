import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDfhi45CK_2WWct5FxrHWPGkPDQH5BWpE0',
  authDomain: 'svelte-kit-a399c.firebaseapp.com',
  projectId: 'svelte-kit-a399c',
  storageBucket: 'svelte-kit-a399c.appspot.com',
  messagingSenderId: '19767501940',
  appId: '1:19767501940:web:491801c204bb11a972dd21'
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
