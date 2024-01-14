<script lang="ts">
  import { onMount } from 'svelte';
  import { getMessaging, onMessage } from 'firebase/messaging';
  import { app } from '$lib/firebase';
  import { type ToastSettings, getToastStore } from '@skeletonlabs/skeleton';

  const toastStore = getToastStore();

  onMount(() => {
    const messaging = getMessaging(app);
    onMessage(messaging, (payload) => {
      if (payload?.notification?.body) {
        const { body } = payload.notification;

        if (!body) return;

        const toastSettings: ToastSettings = {
          hoverable: true,
          message: body,
          background: 'variant-filled-secondary',
          action: {
            label: 'View',
            response() {
              alert('View');
            }
          }
        };

        toastStore.trigger(toastSettings);
      }
    });
  });
</script>
