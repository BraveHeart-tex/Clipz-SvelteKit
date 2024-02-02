<script lang="ts">
  import NotificationPopoverItem from './NotificationPopoverItem.svelte';
  import Popper from './Popper.svelte';
  import { user } from '$/src/lib/stores/user';
  import { notificationsStore } from '../stores/notifications';
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { clickOutside } from '..';

  $: visible = false;
  let popoverContentRef: HTMLDivElement;
  $: User = $user;
  $: notifications = $notificationsStore.unreadNotifications;

  const handleMarkAllAsRead = () => {
    try {
      const promises = notifications.map((notification) => {
        return fetch(`/api/notifications/${notification.id}`, {
          method: 'PUT'
        });
      });

      Promise.all(promises).then(() => {
        notificationsStore.markAllAsRead();
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggle = () => {
    visible = !visible;
  };

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      visible = false;
    }
  };

  onMount(() => {
    window.addEventListener('keydown', handleKeydown);

    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  });
</script>

<div class="relative">
  {#if User}
    <button
      class="btn btn-md relative"
      on:click={handleToggle}
      id="notification-popover-trigger"
    >
      {#if notifications.length > 0}
        <span
          class="absolute top-0 right-2 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center"
        >
          <span class="text-sm text-white">
            {notifications.length}
          </span>
        </span>
      {/if}
      <i class="fa-solid fa-bell text-lg"></i>
    </button>

    {#if visible}
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div
        use:clickOutside={visible}
        on:clickOutside={() => {
          visible = false;
        }}
        in:fly={{ duration: 300, easing: cubicOut, y: 50 }}
        out:fly={{ duration: 300, easing: cubicOut, y: 50 }}
        class="absolute top-10 -bottom-5 lg:right-0 -right-[62px] z-[100]"
      >
        <div
          class="flex flex-col md:items-start p-4 gap-2 w-[98vw] md:w-96 md:min-w-96 bg-surface-50 dark:bg-surface-600 dark:text-white rounded-md overflow-hidden shadow-xl z-[100]"
        >
          {#if notifications.length === 0}
            <div class="flex flex-col gap-1 w-full">
              <h2 class="h4 flex items-center gap-1">
                <i class="fa-solid fa-bell-slash"></i>
                <span class="ml-2"> No Notifications </span>
              </h2>
              <p class="text-sm">You don't have any notifications yet.</p>
            </div>
          {:else}
            <h2 class="text-lg">
              Notifications
              <span class="text-surface-400 dark:text-surface-200">
                ({notifications.length})
              </span>
            </h2>
            <div
              class="max-h-[400px] w-full overflow-auto flex flex-col items-start gap-2"
            >
              {#each notifications as notification (notification.id)}
                <NotificationPopoverItem {notification} />
              {/each}
            </div>
          {/if}
          <div class="flex items-center gap-2 justify-between mt-2 w-full">
            {#if notifications.length > 0}
              <button
                class="btn btn-sm rounded-md variant-filled-primary w-max"
                on:click={() => {
                  handleMarkAllAsRead();
                }}
              >
                Mark all as read
              </button>
            {/if}
            <a
              href="/notifications"
              class="btn btn-sm rounded-md variant-filled-surface w-max"
            >
              Show All Notifications
            </a>
          </div>
        </div>
      </div>
    {/if}
  {/if}
</div>
