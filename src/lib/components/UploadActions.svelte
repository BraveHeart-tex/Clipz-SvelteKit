<script lang="ts">
  import type { PopupAction } from '$lib/types';
  import type { Video } from '@prisma/client';
  import { popup, type PopupSettings } from '@skeletonlabs/skeleton';

  export let upload: Video;
  export let actions: PopupAction[];

  const POPUP_TARGET = `popupActions-${upload.id}`;
  const actionsPopup: PopupSettings = {
    event: 'click',
    target: POPUP_TARGET,
    placement: 'bottom'
  };
</script>

<button
  use:popup={actionsPopup}
  class="p-2 hover:bg-surface-100 dark:hover:bg-surface-500 rounded-lg inline-flex items-center"
>
  <i class="fa-solid fa-ellipsis-vertical"></i>
</button>
<div data-popup={POPUP_TARGET}>
  <div class="card p-4 w-72 shadow-xl">
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
</div>
