<script lang="ts">
  import { onNavigate } from '$app/navigation';
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
  import { user } from '$lib/state.svelte';
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

  export let data: LayoutData;

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

  onMount(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js')
        .then(function (registration) {
          console.log('Registration successful, scope is:', registration.scope);
        })
        .catch(function (err) {
          console.error('Service worker registration failed, error:', err);
        });
    }
  });

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
