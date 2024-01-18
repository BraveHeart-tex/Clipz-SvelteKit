<script lang="ts">
  import { onMount } from 'svelte';
  import { getMessaging, onMessage } from 'firebase/messaging';
  import { app } from '$lib/firebase';
  import { Toaster, toast } from 'svelte-sonner';

  import NotificationToast from './NotificationToast.svelte';

  onMount(() => {
    const messaging = getMessaging(app);
    onMessage(messaging, (payload) => {
      console.log('🚀 ~ onMessage ~ payload:', payload);

      if (payload?.data?.body) {
        const { body } = payload.data;

        toast.custom(NotificationToast, {
          duration: 5000,
          style: 'top: 0; right: 0;',
          componentProps: {
            title: payload?.data?.title || 'Notification',
            body: body
          }
        });
      }
    });
  });
</script>

<Toaster closeButton richColors />
