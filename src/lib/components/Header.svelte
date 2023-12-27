<script lang="ts">
  import { AppBar } from '@skeletonlabs/skeleton';
  import { getDrawerStore } from '@skeletonlabs/skeleton';
  import UserMenu from './UserMenu.svelte';

  const drawerStore = getDrawerStore();

  function drawerOpen() {
    drawerStore.open();
  }
</script>

<AppBar>
  <slot:fragment slot="lead">
    <div class="flex items-center">
      <button on:click={drawerOpen} class="btn btn-sm md:hidden mr-4">
        <i class="fa-solid fa-bars"></i>
      </button>
      <a href="/">
        <img
          src="/Logo.svg"
          alt="Logo"
          class="w-[100px] invert dark:invert-0 transition-all"
        />
      </a>
    </div>
  </slot:fragment>
  <!-- User Menu -->
  <slot:fragment slot="trail">
    <UserMenu />
  </slot:fragment>
</AppBar>
