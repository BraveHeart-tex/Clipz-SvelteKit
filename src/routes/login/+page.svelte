<script lang="ts">
  import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
  import type { PageData } from './$types';
  import { auth, user } from '$lib/firebase';

  export let data: PageData;

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
</script>

{#if !$user}
  <button
    class="btn variant-filled-primary flex items-center gap-2"
    on:click={signInWithGoogle}
  >
    <i class="fa-brands fa-google"></i>
    Login with Google
  </button>
{/if}
