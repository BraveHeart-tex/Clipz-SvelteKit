<script lang="ts">
  import Header from '$lib/components/Header.svelte';
  import Navigation from '$lib/components/Navigation.svelte';
  import '../app.postcss';
  import { AppShell, Drawer, initializeStores } from '@skeletonlabs/skeleton';

  initializeStores();
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
  <div class="container p-10 mx-auto">
    <slot />
  </div>
</AppShell>
