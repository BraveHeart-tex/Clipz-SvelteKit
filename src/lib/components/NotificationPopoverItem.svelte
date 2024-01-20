<script lang="ts">
  import type { Notification } from '@prisma/client';
  import { notificationsStore } from '../stores/notifications';
  import { fly } from 'svelte/transition';
  export let notification: Notification;

  const { title, description, created_at, is_read } = notification;

  let startX: number;

  function handleTouchStart(event: TouchEvent) {
    startX = event.touches[0].clientX;
  }

  function handleTouchEnd(event: TouchEvent) {
    const endX = event.changedTouches[0].clientX;
    const deltaX = endX - startX;

    if (deltaX < -50) {
      // Swipe left detected, you can perform your actions here
      notificationsStore.markAsRead(notification.id);
    }
  }
</script>

<div
  on:touchstart={handleTouchStart}
  on:touchend={handleTouchEnd}
  in:fly={{ x: 150, duration: 300 }}
  out:fly={{ x: -150, duration: 300 }}
  class="bg-surface-100 dark:bg-surface-700 p-2 rounded-md shadow-md w-full cursor-pointer hover:bg-surface-200 transition-all dark:hover:bg-surface-500"
>
  <div class="flex items-center justify-between">
    <h3 class="text-lg font-semibold">{title}</h3>
    <!-- <span class="text-sm">{created_at.toLocaleDateString('tr-TR')}</span> -->
  </div>

  <p class="text-sm">{description}</p>
  <div class="flex w-full justify-end">
    <button
      type="button"
      class="hidden lg:inline-flex btn p-0 w-8 h-8 self-end rounded-md btn-icon hover:bg-surface-200 dark:hover:bg-surface-500 transition-all"
      on:click={(e) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        e.stopPropagation();
        notificationsStore.markAsRead(notification.id);
      }}
    >
      <i class="fa-solid fa-check"></i>
    </button>
  </div>
</div>
