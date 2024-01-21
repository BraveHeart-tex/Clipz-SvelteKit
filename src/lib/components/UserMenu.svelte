<script lang="ts">
  import {
    getModalStore,
    popup,
    type ModalSettings,
    type PopupSettings
  } from '@skeletonlabs/skeleton';
  import { Avatar } from '@skeletonlabs/skeleton';
  import { user } from '$lib/state.svelte';

  $: User = $user;

  const popupClick: PopupSettings = {
    event: 'click',
    target: 'userMenuPopUp',
    placement: 'bottom'
  };

  const modal: ModalSettings = {
    type: 'component',
    component: 'authenticationForm'
  };

  const modalStore = getModalStore();
</script>

{#if User}
  <div class="relative">
    <button use:popup={popupClick}>
      <Avatar
        width="w-11"
        class="cursor-pointer"
        src={User?.profilePicture || '/images/default-avatar.svg'}
        initials={User?.name
          ?.split(' ')
          .map((n) => n[0])
          .join('')}
      />
    </button>
    <div
      data-popup="userMenuPopUp"
      class="absolute top-0 right-0 min-w-max bg-surface-50 dark:bg-surface-600 dark:text-white rounded-md overflow-hidden shadow-xl z-[100] p-2"
    >
      <div class="flex flex-col items-start gap-2">
        <p class="w-full">
          <span class="font-semibold">{User?.name}</span>
          <br />
          <span class="text-sm dark:text-white">{User?.email}</span>
        </p>
        <form method="post" action="/logout">
          <button
            class="self-end btn btn-sm variant-filled-primary rounded-md"
            type="submit">Sign out</button
          >
        </form>
      </div>
    </div>
  </div>
{:else}
  <button
    class="btn btn-sm variant-filled-secondary"
    on:click={() => {
      modalStore.trigger(modal);
    }}
  >
    Sign in
  </button>
{/if}
