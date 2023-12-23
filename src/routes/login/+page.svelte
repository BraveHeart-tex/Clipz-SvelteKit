<script lang="ts">
	import type { PageData } from './$types';
	import { auth } from '$lib/firebase';
	import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

	export let data: PageData;

	async function signInWithGoogle() {
		const provider = new GoogleAuthProvider();
		const user = await signInWithPopup(auth, provider);
		console.log(user);
	}
</script>

<button class="btn variant-filled-primary flex items-center gap-2" on:click={signInWithGoogle}>
	<i class="fa-brands fa-google"></i>
	Login with Google
</button>
