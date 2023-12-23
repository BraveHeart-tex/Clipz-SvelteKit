<script lang="ts">
  import { signInWithGoogle } from '$lib';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<button
  class="btn variant-filled-primary flex items-center gap-2"
  on:click={signInWithGoogle}
>
  <i class="fa-brands fa-google"></i>
  Login with Google
</button>
