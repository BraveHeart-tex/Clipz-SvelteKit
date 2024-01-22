<script lang="ts">
  import { invalidate, onNavigate } from '$app/navigation';
  import { AppBar, LightSwitch } from '@skeletonlabs/skeleton';
  import { getDrawerStore } from '@skeletonlabs/skeleton';
  import UserMenu from '$lib/components/UserMenu.svelte';
  import Navigation from '$lib/components/Navigation.svelte';
  import Transition from '$lib/components/Transition.svelte';
  import NotificationComponent from '$lib/components/Notification.svelte';
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
  import { user } from '$/src/lib/stores/user';
  import { page } from '$app/stores';
  import {
    getToastStore,
    getModalStore,
    type ToastSettings
  } from '@skeletonlabs/skeleton';
  import { cn } from '../lib';
  import { onMount } from 'svelte';
  import NotificationPopover from '../lib/components/NotificationPopover.svelte';
  import { notificationsStore } from '../lib/stores/notifications';
  import { deleteToken, getMessaging, getToken } from 'firebase/messaging';
  import { app } from '../lib/firebase';
  import { browser } from '$app/environment';
  import { FirebaseError } from 'firebase/app';

  export let data: LayoutData;
  let askForNotificationPermission = false;

  const modalRegistry: Record<string, ModalComponent> = {
    authenticationForm: { ref: AuthenticationForm }
  };

  initializeStores();

  const toastStore = getToastStore();
  const modalStore = getModalStore();
  const drawerStore = getDrawerStore();

  storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

  let sidebarCollapsed = false;

  function drawerOpen() {
    drawerStore.open();
  }

  const handleNotificationPermission = async () => {
    const messaging = getMessaging(app);
    await navigator.serviceWorker.ready;
    try {
      const permission = await Notification.requestPermission();

      if (permission === 'granted') {
        const currentToken = await getToken(messaging, {
          vapidKey:
            'BM73otlGttByAOoPXDYocnEDsZOFKpIpd477VnpNH2kaaurb0CxrMLRhJcDtGB4Ei7l5C0qJ8GcowgqYCzKTN00'
        });

        if (currentToken) {
          const response = await fetch('/api/notifications/permission', {
            method: 'POST',
            body: JSON.stringify({ token: currentToken })
          });

          const data = await response.json();
          if (data.message) {
            invalidate('app:settings');
          }
        }
      }
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.error('Messaging error', error);
        const errorCode = error.code;
        if (
          errorCode === 'messaging/invalid-argument' ||
          errorCode === 'messaging/registration-token-not-registered'
        ) {
          // delete the token
          await deleteToken(messaging);
        }
      }
      console.error(error);
    }
  };

  onMount(async () => {
    navigator.serviceWorker
      .register('/firebase-messaging-sw.js')
      .then((registration) => {
        console.log('Registration successful, scope is:', registration.scope);
      })
      .catch((err) => {
        console.error('Service worker registration failed, error:', err);
      });
  });

  $: {
    if (askForNotificationPermission && browser) {
      navigator.serviceWorker.ready.then(async () => {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          handleNotificationPermission();
        } else if (permission === 'default') {
          Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
              handleNotificationPermission();
            }
          });
        }
      });
    }
  }

  onNavigate(() => {
    if (!document.startViewTransition) return;

    return new Promise((resolve) => {
      document.startViewTransition(() => new Promise(resolve));
    });
  });

  const showToastWithRedirect = (message: string) => {
    const successToast: ToastSettings = {
      message,
      timeout: 5000,
      background: 'variant-filled-success'
    };

    toastStore.trigger(successToast);

    setTimeout(() => {
      if (browser) {
        goto('/');
      }
    });
  };

  $: {
    const newUser = data?.user;
    if (newUser?.userId) {
      askForNotificationPermission = true;
    }
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

  $: {
    if (Array.isArray(data.notifications)) {
      notificationsStore.update((state) => ({
        ...state,
        notifications: data.notifications || [],
        unreadNotifications:
          data.notifications?.filter(
            (notification) => !notification.read_date
          ) || []
      }));
    }
  }
</script>

<Modal components={modalRegistry} />
<Toast />
<NotificationComponent />
<Drawer duration={500} rounded="rounded-none">
  <Navigation />
</Drawer>

<AppShell
  slotSidebarLeft={cn(
    'hidden md:block md:w-52 bg-surface-500/10',
    sidebarCollapsed && 'md:w-0'
  )}
>
  <svelte:fragment slot="header">
    <AppBar>
      <slot:fragment slot="lead">
        <div class="flex items-center">
          <button
            on:click={() => {
              sidebarCollapsed = !sidebarCollapsed;
            }}
            class="btn btn-sm hidden md:inline-flex mr-2 hover:bg-surface-300 dark:hover:bg-surface-600 transition-all"
          >
            <i class="fa-solid fa-bars"></i>
          </button>
          <button
            on:click={drawerOpen}
            class="btn btn-sm md:hidden mr-2 hover:bg-surface-300 dark:hover:bg-surface-600 transition-all"
          >
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
        <div class="flex items-center gap-1">
          <LightSwitch />
          <NotificationPopover />
          <UserMenu />
        </div>
      </slot:fragment>
    </AppBar>
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
