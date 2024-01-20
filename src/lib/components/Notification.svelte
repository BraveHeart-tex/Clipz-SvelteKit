<script lang="ts">
  import { onMount } from 'svelte';
  import { getMessaging, onMessage } from 'firebase/messaging';
  import { app } from '$lib/firebase';
  import { Toaster, toast } from 'svelte-sonner';
  import type { Notification } from '@prisma/client';

  import NotificationToast from './NotificationToast.svelte';
  import { notificationsStore } from '../stores/notifications';

  onMount(() => {
    const messaging = getMessaging(app);
    onMessage(messaging, (payload) => {
      if (payload?.data?.body) {
        console.log(payload.data);

        const { body, notificationObject } = payload.data;

        toast.custom(NotificationToast, {
          duration: 5000,
          style: 'top: 0; right: 0;',
          componentProps: {
            title: payload?.data?.title || 'Notification',
            body: body
          }
        });

        notificationsStore.addNotification(
          JSON.parse(notificationObject) as Notification
        );
      }
    });
  });
</script>

<Toaster closeButton richColors />
