<script lang="ts">
  import { onMount } from 'svelte';
  import { getMessaging, onMessage } from 'firebase/messaging';
  import { app } from '$lib/firebase';
  import NotificationToast from './NotificationToast.svelte';
  import { Toaster, toast } from 'svelte-sonner';

  onMount(() => {
    const messaging = getMessaging(app);
    onMessage(messaging, (payload) => {
      toast(NotificationToast, {
        componentProps: {
          title: payload.notification?.title,
          body: payload.notification?.body
        }
      });
    });
  });
</script>

<Toaster />
