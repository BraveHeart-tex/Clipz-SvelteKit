<script lang="ts">
  import type { Notification } from '@prisma/client';
  import { notificationsStore } from '../stores/notifications';
  import { fly } from 'svelte/transition';
  import { cn } from '..';
  import { formatDistance } from 'date-fns';
  export let notification: Notification;
  export let selectedTab = '';

  const { title, description, created_at } = notification;

  $: read_date = notification.read_date;

  let startX: number;

  function handleTouchStart(event: TouchEvent) {
    startX = event.touches[0].clientX;
  }

  async function updateNotificationStatus() {
    try {
      const response = await fetch(`/api/notifications/${notification.id}`, {
        method: 'PUT'
      });
      const data = await response.json();
      if (data.message) {
        notificationsStore.markAsRead(notification.id);
      }
    } catch (error) {
      console.error(error);
    }
  }

  function handleTouchEnd(event: TouchEvent) {
    const endX = event.changedTouches[0].clientX;
    const deltaX = endX - startX;

    if (deltaX < -50) {
      // Swipe left detected, you can perform your actions here
      updateNotificationStatus();
    }
  }

  const getTransitionAttributes = (direction: 'in' | 'out') => {
    if (selectedTab === 'all') {
      return {};
    }

    if (direction === 'in') {
      return {
        x: 150,
        duration: 300
      };
    }

    return {
      x: -150,
      duration: 300
    };
  };
</script>

<div
  on:touchstart={handleTouchStart}
  on:touchend={handleTouchEnd}
  in:fly={getTransitionAttributes('in')}
  out:fly={getTransitionAttributes('out')}
  class="bg-surface-100 dark:bg-surface-700 p-2 rounded-md shadow-md w-full cursor-pointer hover:bg-surface-200 transition-all dark:hover:bg-surface-500 relative"
>
  <div class="flex items-center justify-between">
    <h3 class={cn('text-lg font-semibold ', !selectedTab && 'max-w-[400px]')}>
      {title}
    </h3>
    <span class="text-sm text-surface-500 dark:text-surface-100"
      >{formatDistance(new Date(created_at), new Date(), {
        addSuffix: true
      })}</span
    >
  </div>

  <p class={cn('text-sm', !selectedTab && 'max-w-[400px] truncate')}>
    {description}
  </p>
  <div class="flex w-full justify-end">
    {#if !read_date}
      <button
        type="button"
        class="hidden lg:inline-flex btn p-0 w-8 h-8 self-end rounded-md btn-icon hover:bg-surface-200 dark:hover:bg-surface-500 transition-all"
        on:click={(e) => {
          updateNotificationStatus();
          e.stopPropagation();
        }}
      >
        <i class="fa-solid fa-check"></i>
      </button>
    {/if}
  </div>
</div>
