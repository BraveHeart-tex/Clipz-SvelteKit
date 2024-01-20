<script lang="ts">
  import NotificationPopoverItem from './NotificationPopoverItem.svelte';
  import Popper from './Popper.svelte';
  import { user } from '$lib/state.svelte';
  import { notificationsStore } from '../stores/notifications';
  $: User = $user;
  $: notifications = $notificationsStore.notifications;
</script>

{#if User}
  <Popper>
    <button slot="trigger" class="btn btn-sm">
      <i class="fa-solid fa-bell"></i>
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
        <a
          href="/notifications"
          class="btn btn-sm rounded-md variant-filled-primary w-max mt-2"
        >
          Show All Notifications
        </a>
      </div>
    </div>
  </Popper>
{/if}
