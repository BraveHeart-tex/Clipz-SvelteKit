<script lang="ts">
  import NotificationPopoverItem from './NotificationPopoverItem.svelte';
  import Popper from './Popper.svelte';
  import { user } from '$lib/state.svelte';
  import { notificationsStore } from '../stores/notifications';

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
</script>

{#if User}
  <Popper>
    <button slot="trigger" class="btn btn-md relative">
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

    <div slot="content">
      <div
        class="flex flex-col md:items-start p-4 gap-2 w-[100vw] md:w-max md:min-w-max bg-surface-50 dark:bg-surface-600 dark:text-white rounded-md overflow-hidden shadow-xl z-[100]"
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
            class="max-h-[400px] overflow-auto flex flex-col items-start gap-2"
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
  </Popper>
{/if}
