<script lang="ts">
  import {
    ListBox,
    popup,
    type PopupSettings,
    type ToastSettings,
    getToastStore,
    type ModalSettings,
    getModalStore
  } from '@skeletonlabs/skeleton';
  import type { PageData } from './$types';
  import type { SubmitFunction } from '@sveltejs/kit';
  import { enhance } from '$app/forms';
  import { getMessaging, getToken } from 'firebase/messaging';
  import { app } from '$lib/firebase';
  import { fly } from 'svelte/transition';
  import { invalidate } from '$app/navigation';
  import { user } from '$lib/state.svelte';
  import {
    deleteObject,
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable
  } from 'firebase/storage';
  import ProgressModal from '$/src/lib/components/ProgressModal.svelte';
  import { cn } from '$/src/lib';

  export let data: PageData;

  const toastStore = getToastStore();
  const modalStore = getModalStore();

  $: notitifcationsEnabled = data.notificationAllowed;
  $: User = $user;
  $: uploading = false;

  let progress = 0;

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

  const handleAvatarUpload = (event: Event) => {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files && fileInput.files[0];
    if (!file) return;
    if (file.size > 1024 * 1024 * 5) {
      const errorToast: ToastSettings = {
        message: 'File size must be less than 5MB.',
        background: 'variant-filled-error',
        timeout: 5000
      };

      toastStore.trigger(errorToast);
      return;
    }

    if (!file.type.startsWith('image/')) {
      const errorToast: ToastSettings = {
        message: 'File must be an image.',
        background: 'variant-filled-error',
        timeout: 5000
      };

      toastStore.trigger(errorToast);
      return;
    }

    uploading = true;
    const storage = getStorage(app);
    const storageRef = ref(storage, `avatars/${data.username}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const UploadProgress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        progress = UploadProgress;
      },
      (error) => {
        const errorToast: ToastSettings = {
          message: 'There was an error uploading your avatar.',
          background: 'variant-filled-error',
          timeout: 5000
        };

        toastStore.trigger(errorToast);
        progress = 0;
        uploading = false;
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          const response = await fetch('/settings?/profilePicture', {
            method: 'POST',
            body: JSON.stringify({
              profilePicture: downloadURL
            })
          });

          const data = await response.json();

          if (data.type === 'success') {
            progress = 0;
            const successToast: ToastSettings = {
              message: 'Avatar uploaded successfully.',
              background: 'variant-filled-success',
              timeout: 5000
            };

            toastStore.trigger(successToast);
            // @ts-expect-error
            user.update((user) => ({
              ...user,
              profilePicture: downloadURL
            }));
            uploading = false;
          }
        } catch (error) {
          console.error(error);
          const errorToast: ToastSettings = {
            message: 'There was an error uploading your avatar.',
            background: 'variant-filled-error',
            timeout: 5000
          };

          toastStore.trigger(errorToast);
          progress = 0;
          uploading = false;
        }
      }
    );
  };

  const deleteAvatar = () => {
    const modal: ModalSettings = {
      type: 'confirm',
      title: 'Delete Avatar',
      body: 'Are you sure you want to delete your avatar?',
      async response(r) {
        if (r) {
          const storage = getStorage(app);
          const storageRef = ref(storage, `avatars/${data.username}`);

          try {
            const response = await fetch('/settings?/profilePicture', {
              method: 'POST',
              body: JSON.stringify({
                deletePicture: true
              })
            });

            const apiData = await response.json();

            if (apiData.type === 'success') {
              deleteObject(storageRef)
                .then((value) => {
                  const successToast: ToastSettings = {
                    message: 'Avatar deleted successfully.',
                    background: 'variant-filled-success',
                    timeout: 5000
                  };

                  toastStore.trigger(successToast);

                  // @ts-expect-error
                  user.update((user) => ({
                    ...user,
                    profilePicture: null
                  }));
                })
                .catch((error) => {
                  const errorToast: ToastSettings = {
                    message: 'There was an error deleting your avatar.',
                    background: 'variant-filled-error',
                    timeout: 5000
                  };

                  toastStore.trigger(errorToast);
                });
            }
          } catch (error) {
            console.error(error);
            const errorToast: ToastSettings = {
              message: 'There was an error deleting your avatar.',
              background: 'variant-filled-error',
              timeout: 5000
            };

            toastStore.trigger(errorToast);
          }
        }
      }
    };

    modalStore.trigger(modal);
  };
</script>

{#if uploading}
  <ProgressModal
    title="Uploading Your Avatar"
    description="Please do not close this window or navigate away from this page until the
upload is complete."
    {progress}
  />
{/if}

<div class="flex flex-col gap-1">
  <h1 class="h2">Settings</h1>
  <p>
    Set your preferences for the app here. You can change your profile picture,
    manage your notification settings, and more.
  </p>
</div>

<!-- Profile Picture -->
<div class="flex flex-col gap-2 my-4">
  <!-- TODO: Fallback profile picture default avatar -->
  <div class="flex flex-col gap-2">
    <h2 class="h3 flex items-center gap-2">
      <i class="fa-solid fa-user"></i>
      Profile Picture
    </h2>
    <p>
      Your profile picture is used to identify you in the app. It is visible to
      other users.
    </p>
  </div>
  {#if User?.profilePicture}
    <div class="relative w-max">
      <img
        src={User?.profilePicture || ''}
        loading="lazy"
        alt={User?.name}
        class="rounded-full w-24 h-24 object-cover"
      />
      <button
        class="btn w-5 h-5 btn-icon variant-filled-error absolute top-0 right-0"
        on:click={() => {
          deleteAvatar();
        }}
      >
        <i class="fa-solid fa-times"></i>
      </button>
    </div>
  {/if}

  <form
    method="POST"
    class=""
    enctype="multipart/form-data"
    use:enhance={submitUpdateTheme}
  >
    <label
      for="profilePicture"
      class={cn(
        'btn variant-filled-primary btn-sm rounded-md w-48 cursor-pointer',
        uploading && 'pointer-events-none opacity-70'
      )}
      aria-disabled={progress > 0}
    >
      <span>
        <i class="fa-solid fa-upload"></i>
        {User?.profilePicture ? 'Change' : 'Upload'}
        Profile Picture
      </span>
    </label>
    <input
      type="file"
      name="profilePicture"
      id="profilePicture"
      class="hidden"
      accept="image/*"
      on:change={handleAvatarUpload}
    />
  </form>
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
                event?.target.checked
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
