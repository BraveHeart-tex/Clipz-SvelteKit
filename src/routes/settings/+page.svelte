<script lang="ts">
  import { ListBox, popup, type PopupSettings } from '@skeletonlabs/skeleton';
  import type { PageData } from './$types';
  import type { SubmitFunction } from '@sveltejs/kit';
  import { enhance } from '$app/forms';

  export let data: PageData;

  $: theme = data.theme;

  const themes = [
    {
      name: 'Midnight Vibes',
      value: 'midnight-vibes'
    },
    {
      name: 'Galactic Vibes',
      value: 'galactic-vibes'
    },
    {
      name: 'Lively Spectrum',
      value: 'lively-spectrum'
    },
    {
      name: 'Frutiger Aero',
      value: 'frutiger-aero'
    },
    {
      name: 'Crimson',
      value: 'crimson'
    }
  ];

  const submitUpdateTheme: SubmitFunction = ({ action }) => {
    const theme = action.searchParams.get('theme');

    if (theme) {
      document.body.dataset.theme = theme;
    }
  };

  const popupCombobox: PopupSettings = {
    event: 'click',
    target: 'popupCombobox',
    placement: 'bottom',
    closeQuery: '.listbox-item'
  };
</script>

<div class="flex flex-col gap-1">
  <h1 class="h2">Settings</h1>
  <p>
    Set your preferences for the app here. Color theme, notifications, sidebar
    type, etc.
  </p>
</div>

<div class="flex flex-col gap-2 mt-4">
  <h2 class="h3">Color Theme</h2>
  <p>
    Choose a color theme for the app. This will change the color of the
    navigation bar, sidebar, and other elements.
  </p>
  <button
    class="btn variant-filled w-48 justify-between rounded-md"
    use:popup={popupCombobox}
  >
    <span class="capitalize">{theme ?? 'Color Scheme'}</span>
    <i class="fa-solid fa-chevron-down"></i>
  </button>
  <div class="card w-48 shadow-xl py-2 rounded-md" data-popup="popupCombobox">
    <ListBox rounded="rounded-none">
      <form
        method="POST"
        use:enhance={submitUpdateTheme}
        class="grid grid-cols-1 gap-2 items-start p-2"
      >
        {#each themes as colorScheme}
          <button
            class="listbox-item w-full text-left p-1 hover:bg-surface-300 dark:hover:bg-surface-600 transition-all rounded-md"
            formaction={`/settings?/setTheme&theme=${colorScheme.value}`}
          >
            {colorScheme.name}
          </button>
        {/each}
      </form>
    </ListBox>
    <div class="arrow bg-surface-100-800-token" />
  </div>
</div>
