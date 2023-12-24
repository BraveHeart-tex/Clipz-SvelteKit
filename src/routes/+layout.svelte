<script lang="ts">
  import { onNavigate } from '$app/navigation';
  import Header from '$lib/components/Header.svelte';
  import Navigation from '$lib/components/Navigation.svelte';
  import '../app.postcss';
  import { AppShell, Drawer, initializeStores } from '@skeletonlabs/skeleton';

  initializeStores();

  onNavigate(() => {
    // @ts-ignore
    if (!document.startViewTransition) return;

    return new Promise((resolve) => {
      // @ts-ignore
      document.startViewTransition(() => new Promise(resolve));
    });
  });
</script>

<Drawer>
  <Navigation />
</Drawer>

<AppShell slotSidebarLeft="w-0 md:w-52 bg-surface-500/10">
  <svelte:fragment slot="header">
    <Header />
  </svelte:fragment>
  <svelte:fragment slot="sidebarLeft">
    <Navigation />
  </svelte:fragment>
  <div class="p-10 mx-auto">
    <slot />
  </div>
</AppShell>
