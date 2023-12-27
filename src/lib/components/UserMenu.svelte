<script lang="ts">
  import {
    getModalStore,
    popup,
    type ModalSettings,
    type PopupSettings
  } from '@skeletonlabs/skeleton';
  import { signOutSSR } from '$lib/firebase';
  import { Avatar } from '@skeletonlabs/skeleton';
  import { getUserState } from '$lib/state.svelte';

  const popupClick: PopupSettings = {
    event: 'click',
    target: 'userMenuPopUp',
    placement: 'bottom'
  };

  const user = getUserState();

  const modal: ModalSettings = {
    type: 'component',
    component: 'authenticationForm'
  };

  const modalStore = getModalStore();
</script>

{#if $user}
  <div class="relative">
    <button use:popup={popupClick}>
      <Avatar
        width="w-11"
        class="cursor-pointer"
        initials={$user?.name
          .split(' ')
          .map((n) => n[0])
          .join('')}
      />
    </button>
    <div
      data-popup="userMenuPopUp"
      class="absolute top-0 right-0 w-48 bg-surface-50 dark:bg-surface-600 dark:text-white rounded-md overflow-hidden shadow-xl z-[100] p-2"
    >
      <div class="flex flex-col items-start gap-2">
        <p class="w-full">
          <span class="font-semibold">{$user.name}</span>
          <br />
          <span class="text-sm dark:text-white">{$user.email}</span>
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
