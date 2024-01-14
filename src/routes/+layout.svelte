<script lang="ts">
  import { onNavigate } from '$app/navigation';
  import { onMount } from 'svelte';
  import Header from '$lib/components/Header.svelte';
  import Navigation from '$lib/components/Navigation.svelte';
  import Transition from '$lib/components/Transition.svelte';
  import { goto } from '$app/navigation';
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
  import { user } from '$lib/state.svelte';
  import { page } from '$app/stores';
  import {
    getToastStore,
    getModalStore,
    type ToastSettings
  } from '@skeletonlabs/skeleton';
  import { getMessaging, getToken } from 'firebase/messaging';
  import { app } from '$lib/firebase';

  export let data: LayoutData;

  const modalRegistry: Record<string, ModalComponent> = {
    authenticationForm: { ref: AuthenticationForm }
  };

  initializeStores();

  const toastStore = getToastStore();
  const modalStore = getModalStore();

  storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

  onNavigate(() => {
    if (!document.startViewTransition) return;

    return new Promise((resolve) => {
      document.startViewTransition(() => new Promise(resolve));
    });
  });

  onMount(() => {
    const messaging = getMessaging(app);
    try {
      const handleNotificationPermission = async () => {
        try {
          const permission = await Notification.requestPermission();

          if (permission === 'granted') {
            console.log('Notification permission granted.');

            const currentToken = await getToken(messaging, {
              vapidKey:
                'BM73otlGttByAOoPXDYocnEDsZOFKpIpd477VnpNH2kaaurb0CxrMLRhJcDtGB4Ei7l5C0qJ8GcowgqYCzKTN00'
            });

            if (currentToken) {
              console.log('currentToken', currentToken);
            } else {
              console.log(
                'No registration token available. Request permission to generate one.'
              );
            }
          } else {
            console.log('Unable to get permission to notify.');
          }
        } catch (error) {
          console.error('Error handling notification permission:', error);
        }
      };

      handleNotificationPermission();
    } catch (error) {
      console.error('Error getting messaging:', error);
    }
  });

  const showToastWithRedirect = (message: string) => {
    const successToast: ToastSettings = {
      message,
      timeout: 5000,
      background: 'variant-filled-success'
    };

    toastStore.trigger(successToast);

    setTimeout(() => {
      goto('/');
    });
  };

  $: {
    const newUser = data?.user;
    user.set(newUser);
  }

  $: {
    if ($page.url.searchParams.get('emailVerified')) {
      showToastWithRedirect(' 🎉 Success! Your email has been verified! 🎉');
    }
  }

  $: {
    if ($page.url.searchParams.get('passwordReset') === 'success') {
      showToastWithRedirect('Success! Your password has been reset ✅');
    }
  }

  $: {
    if ($page.url.searchParams.get('redirectToLogin')) {
      modalStore.trigger({
        type: 'component',
        component: 'authenticationForm'
      });
    }
  }
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
  <div class="p-4 lg:p-10 mx-auto">
    <Transition url={data.url}>
      <slot />
    </Transition>
  </div>
</AppShell>
