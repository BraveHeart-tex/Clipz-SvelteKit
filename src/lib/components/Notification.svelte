<script lang="ts">
  import { onMount } from 'svelte';
  import { getMessaging, onMessage } from 'firebase/messaging';
  import { app } from '$lib/firebase';
  import { type ToastSettings, getToastStore } from '@skeletonlabs/skeleton';
  import { fade, fly } from 'svelte/transition';

  onMount(() => {
    const messaging = getMessaging(app);
    onMessage(messaging, (payload) => {
      console.log('🚀 ~ onMessage ~ payload:', payload);

      if (payload?.data?.body) {
        const { body } = payload.data;
      }
    });
  });
</script>
