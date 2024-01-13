<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements';

  interface $$Props extends HTMLButtonAttributes {
    loading?: boolean;
  }

  export let loading = false;
</script>

<button {...$$restProps} disabled={$$restProps.disabled || loading}>
  {#if loading}
    <i class="fa-solid fa-circle-notch animate-spin"></i>
  {/if}
  <slot />
</button>
