import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth, onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { writable } from 'svelte/store';

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

function userStore() {
  let unsubscribe: () => void;
  if (!auth || !globalThis.window) {
    console.warn('auth or window is not defined');
    const { subscribe } = writable<User | null>(null);
    return {
      subscribe
    };
  }

  const { subscribe } = writable(auth?.currentUser ?? null, (set) => {
    unsubscribe = onAuthStateChanged(auth, (user) => {
      set(user);
    });

    return () => unsubscribe();
  });

  return {
    subscribe
  };
}

export const user = userStore();

export async function signOutSSR() {
  await fetch('/api/signout', {
    method: 'DELETE'
  });
  await signOut(auth);
}
