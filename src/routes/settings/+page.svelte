<script lang="ts">
  import {
    ListBox,
    popup,
    type PopupSettings,
    type ToastSettings,
    getToastStore,
    getModalStore
  } from '@skeletonlabs/skeleton';
  import type { PageData } from './$types';
  import type { SubmitFunction } from '@sveltejs/kit';
  import { enhance } from '$app/forms';
  import { getMessaging, getToken } from 'firebase/messaging';
  import { app } from '$lib/firebase';
  import { fly } from 'svelte/transition';
  import { invalidate } from '$app/navigation';

  export let data: PageData;

  const toastStore = getToastStore();

  $: notitifcationsEnabled = data.notificationAllowed;

  $: theme = data.theme || 'Crimson';

  const themes = [
    {
      name: 'Midnight Vibes',
      value: 'midnight-vibes'
    },
    {
      name: 'Galactic Vibes',
      value: 'galactic-vibes'
    },
    {
      name: 'Lively Spectrum',
      value: 'lively-spectrum'
    },
    {
      name: 'Frutiger Aero',
      value: 'frutiger-aero'
    },
    {
      name: 'Crimson',
      value: 'crimson'
    }
  ];

  const handleNotificationPermission = async () => {
    const messaging = getMessaging(app);
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
      console.error(error);
      const errorToast: ToastSettings = {
        message: 'There was an error getting notification permissions.',
        background: 'variant-filled-error',
        timeout: 5000
      };

      toastStore.trigger(errorToast);
    }
  };

  const submitUpdateTheme: SubmitFunction = ({ action }) => {
    const theme = action.searchParams.get('theme');

    if (theme) {
      document.body.dataset.theme = theme;
    }
  };

  const popupCombobox: PopupSettings = {
    event: 'click',
    target: 'popupCombobox',
    placement: 'bottom',
    closeQuery: '.listbox-item'
  };

  const handleRemoveNotificationPermission = async () => {
    try {
      const response = await fetch('/api/notifications/permission', {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.message) {
        invalidate('app:settings');
      }
    } catch (error) {
      console.error(error);
      const errorToast: ToastSettings = {
        message: 'There was an error removing notification permissions.',
        background: 'variant-filled-error',
        timeout: 5000
      };

      toastStore.trigger(errorToast);
    }
  };

  const handleOtherNotifications = async (key: string, checked: boolean) => {
    const value = checked ? 1 : 0;
    try {
      const response = await fetch(`/api/notifications/permission`, {
        method: 'PUT',
        body: JSON.stringify({ key, value })
      });

      const data = await response.json();
      if (data.message) {
        invalidate('app:settings');
      }
    } catch (error) {
      console.error(error);
      const errorToast: ToastSettings = {
        message: 'There was an error updating notification permissions.',
        background: 'variant-filled-error',
        timeout: 5000
      };

      toastStore.trigger(errorToast);
    }
  };
</script>

<div class="flex flex-col gap-1">
  <h1 class="h2">Settings</h1>
  <p>
    Set your preferences for the app here. Color theme, notifications, sidebar
    type, etc.
  </p>
</div>

<!-- Color Theme -->
<div class="flex flex-col gap-2 mt-8">
  <div class="flex items-center gap-2">
    <i class="fa-solid fa-palette"></i>
    <h2 class="h3">Color Theme</h2>
  </div>
  <p>
    Choose a color theme for the app. This will change the color of the
    navigation bar, sidebar, and other elements.
  </p>
  <button
    class="btn variant-filled w-48 justify-between rounded-md"
    use:popup={popupCombobox}
  >
    <span class="capitalize">{theme ?? 'Color Scheme'}</span>
    <i class="fa-solid fa-chevron-down"></i>
  </button>
  <div class="card w-48 shadow-xl py-2 rounded-md" data-popup="popupCombobox">
    <ListBox rounded="rounded-none">
      <form
        method="POST"
        use:enhance={submitUpdateTheme}
        class="grid grid-cols-1 gap-2 items-start p-2"
      >
        {#each themes as colorScheme}
          <button
            class="listbox-item w-full text-left p-1 hover:bg-surface-300 dark:hover:bg-surface-600 transition-all rounded-md"
            formaction={`/settings?/setTheme&theme=${colorScheme.value}`}
          >
            {colorScheme.name}
          </button>
        {/each}
      </form>
    </ListBox>
    <div class="arrow bg-surface-100-800-token" />
  </div>
</div>

<!-- Notifications -->
<div class="flex flex-col gap-2 mt-4">
  <div class="flex items-center gap-2">
    <i class="fa-solid fa-bell"></i>
    <h2 class="h3">Customize Your Notification Experience</h2>
  </div>
  <p>
    Choose how you want to be notified about new messages, mentions, and other
    events.
  </p>
  <div class="flex flex-col gap-2">
    <div class="flex flex-row gap-2 items-center">
      <input
        type="checkbox"
        id="notifications"
        name="notifications"
        class="checkbox"
        checked={notitifcationsEnabled}
        on:change={(event) => {
          if (event.target.checked) {
            handleNotificationPermission();
          } else {
            handleRemoveNotificationPermission();
          }
        }}
      />
      <label for="notifications"
        >Enable Notifications (System notifications eg: about your upload status
        or ticket response.)</label
      >
    </div>
    {#if notitifcationsEnabled}
      <div
        class="flex flex-col gap-2"
        in:fly={{
          y: -50,
          duration: 250
        }}
        out:fly={{
          y: -50,
          duration: 250
        }}
      >
        <div class="flex flex-row gap-2 items-center">
          <input
            type="checkbox"
            id="mentions"
            name="mentions"
            class="checkbox"
            checked={data.mentionNotificationAllowed}
            on:change={(event) => {
              handleOtherNotifications(
                'allow_mention_notification',
                event.target.checked
              );
            }}
          />
          <label for="mentions">Mentions</label>
        </div>
        <div class="flex flex-row gap-2 items-center">
          <input
            type="checkbox"
            id="reactions"
            name="reactions"
            checked={data.reactionNotificationAllowed}
            on:change={(event) => {
              handleOtherNotifications(
                'allow_reaction_notification',
                event.target.checked
              );
            }}
            class="checkbox"
          />
          <label for="reactions">Reactions</label>
        </div>
      </div>
    {/if}
  </div>
</div>
