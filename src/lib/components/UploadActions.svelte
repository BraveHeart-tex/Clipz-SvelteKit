<script lang="ts">
  import type { PopupAction } from '$lib/types';
  import type { Video } from '@prisma/client';
  import { fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { popup, type PopupSettings } from '@skeletonlabs/skeleton';

  export let upload: Video;
  export let actions: PopupAction[];
  let visible = false;

  const POPUP_TARGET = `popupActions-${upload.id}`;
  const actionsPopup: PopupSettings = {
    event: 'click',
    target: POPUP_TARGET,
    placement: 'bottom',
    state(e) {
      visible = e.state;
    }
  };
</script>

<button
  use:popup={actionsPopup}
  class="p-2 hover:bg-surface-100 dark:hover:bg-surface-500 rounded-lg inline-flex items-center"
>
  <i class="fa-solid fa-ellipsis-vertical"></i>
</button>
<div data-popup={POPUP_TARGET}>
  {#if visible}
    <div
      class="card p-4 w-72 shadow-xl"
      in:fly={{ duration: 300, easing: cubicOut, y: 50 }}
      out:fly={{ duration: 300, easing: cubicOut, y: 50 }}
    >
      {#each actions as option}
        <button
          class="w-full btn flex items-center gap-1 justify-start hover:bg-surface-200 dark:hover:bg-surface-600 rounded-md"
          on:click={(event) => option.onClick(event, upload)}
        >
          <i class={option.icon}></i>
          <span>{option.label}</span>
        </button>
      {/each}
    </div>
  {/if}
</div>
