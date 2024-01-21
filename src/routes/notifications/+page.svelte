<script lang="ts">
  import type { PageData } from './$types';
  import { notificationsStore } from '$/src/lib/stores/notifications';
  import NotificationPopoverItem from '$/src/lib/components/NotificationPopoverItem.svelte';
  import { cn } from '$lib';

  $: notifications = $notificationsStore.notifications;

  $: {
    if (selectedTab === 'all') {
      notifications = $notificationsStore.notifications;
    } else {
      notifications = $notificationsStore.unreadNotifications;
    }
  }

  let query = '';
  let selectedTab = 'all';

  $: {
    notifications = query
      ? notifications.filter(({ title, description }) =>
          [title, description].some((text) =>
            text.toLowerCase().includes(query.toLowerCase())
          )
        )
      : selectedTab === 'all'
        ? $notificationsStore.notifications
        : $notificationsStore.unreadNotifications;
  }
</script>

<div class="flex flex-col gap-2 mb-4">
  <h2 class="h3">
    <i class="fa-solid fa-bell"></i>
    <span class="ml-2">Notifications</span>
  </h2>
  <p>
    Take a detailed look to your notifications here. Read notifications will be
    deleted after 30 days.
  </p>
</div>

<div class="flex items-center justify-between gap-2 mb-4">
  <div class="w-full lg:max-w-[300px] relative">
    <label for="search" class="sr-only">Search</label>
    <input
      class="input rounded-md w-full px-8"
      id="search"
      name="search"
      placeholder="Search"
      bind:value={query}
    />
    <i class="fa-solid fa-search absolute left-3 top-[13px]"></i>
    {#if query}
      <button
        on:click={() => {
          query = '';
        }}
        class="absolute right-3 top-[10px]"
      >
        <i class="fa-solid fa-times-circle cursor-pointer"></i>
      </button>
    {/if}
  </div>
  <div
    class="flex items-center gap-2 bg-surface-200 dark:bg-surface-600 p-2 rounded-md w-max ml-auto"
  >
    <button
      on:click={() => {
        selectedTab = 'all';
        notifications = $notificationsStore.notifications;
      }}
      class={cn(
        'btn btn-sm rounded-md',
        selectedTab === 'all' &&
          'variant-filled-primary dark:variant-filled-secondary'
      )}>All</button
    >
    <button
      on:click={() => {
        selectedTab = 'unread';
        notifications = $notificationsStore.unreadNotifications;
      }}
      class={cn(
        'btn btn-sm rounded-md',
        selectedTab === 'unread' &&
          'variant-filled-primary dark:variant-filled-secondary'
      )}>Unread</button
    >
  </div>
</div>

{#if notifications.length === 0 && !query}
  <div class="flex flex-col gap-1 w-full">
    <h2 class="h3 flex items-center gap-1">
      <i class="fa-solid fa-bell-slash"></i>
      <span class="ml-2"> No Notifications </span>
    </h2>
    <p class="text-sm">You don't have any notifications yet.</p>
  </div>
{:else if notifications.length === 0 && query}
  <div class="flex flex-col gap-1 w-full">
    <h2 class="h3 flex items-center gap-1">
      <i class="fa-solid fa-bell-slash"></i>
      <span class="ml-2"> No Results </span>
    </h2>
    <p class="text-sm">No notifications found for "{query}".</p>
  </div>
{:else}
  <h2 class="text-xl font-semibold mb-2">
    {selectedTab[0].toUpperCase() + selectedTab.slice(1) + ' '}
    Notifications
    <span class="text-surface-400 dark:text-surface-200">
      ({notifications.length})
    </span>
  </h2>
  <div
    class="flex flex-col border rounded-md p-4 max-h-[400px] overflow-auto border-surface-200 dark:border-surface-500 gap-2 w-full"
  >
    {#each notifications.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) as notification (notification.id)}
      <NotificationPopoverItem {notification} {selectedTab} />
    {/each}
  </div>
{/if}
