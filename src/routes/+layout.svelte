<script lang="ts">
  import { onNavigate } from '$app/navigation';
  import Header from '$lib/components/Header.svelte';
  import Navigation from '$lib/components/Navigation.svelte';
  import Transition from '$lib/components/Transition.svelte';
  import {
    computePosition,
    autoUpdate,
    offset,
    shift,
    flip,
    arrow
  } from '@floating-ui/dom';
  import '../app.postcss';
  import {
    AppShell,
    Drawer,
    Modal,
    initializeStores,
    type ModalComponent,
    Toast
  } from '@skeletonlabs/skeleton';
  import type { LayoutData } from './$types';
  import AuthenticationForm from '$lib/components/AuthenticationModal.svelte';
  import { storePopup } from '@skeletonlabs/skeleton';
  import { setUserState } from '$lib/state.svelte';

  export let data: LayoutData;

  const modalRegistry: Record<string, ModalComponent> = {
    authenticationForm: { ref: AuthenticationForm }
  };

  initializeStores();

  storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

  onNavigate(() => {
    // @ts-ignore
    if (!document.startViewTransition) return;

    return new Promise((resolve) => {
      // @ts-ignore
      document.startViewTransition(() => new Promise(resolve));
    });
  });

  const user = setUserState(data?.user);
</script>

<Modal components={modalRegistry} />
<Toast />
<Drawer duration={500} rounded="rounded-none">
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
    <Transition url={data.url}>
      <slot />
    </Transition>
  </div>
</AppShell>
