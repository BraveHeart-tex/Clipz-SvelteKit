import type { DocumentSnapshot } from 'firebase/firestore';
import { auth } from '$lib/firebase';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

export const mapDocumentWithId = (doc: DocumentSnapshot) => ({
  id: doc.id,
  ...doc.data()
});

const lazyLoadOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0
};

export const lazyLoad = (image: HTMLImageElement, src: string) => {
  const loaded = () => {
    image.style.opacity = '1';
  };
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      image.src = src;
      if (image.complete) {
        loaded();
      } else {
        image.addEventListener('load', loaded);
      }
    }
  }, lazyLoadOptions);
  observer.observe(image); // intersection observer

  return {
    destroy() {
      image.removeEventListener('load', loaded); // clean up the event listener
    }
  };
};

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  const credential = await signInWithPopup(auth, provider);
  const idToken = await credential.user.getIdToken();

  await fetch('/api/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ idToken })
  });
}

export async function signOutSSR() {
  await fetch('/api/signout', {
    method: 'DELETE'
  });
  await signOut(auth);
}
