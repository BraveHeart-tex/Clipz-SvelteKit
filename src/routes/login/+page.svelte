<script lang="ts">
  import { signInWithGoogle, user } from '$lib/firebase';
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
