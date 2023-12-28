<script lang="ts">
  import { page } from '$app/stores';
  import {
    getDrawerStore,
    getModalStore,
    getToastStore,
    type ModalSettings,
    type ToastSettings
  } from '@skeletonlabs/skeleton';
  import { user } from '$lib/state.svelte';

  $: User = $user;

  $: links = [
    {
      name: 'Home',
      href: '/',
      icon: '<i class="fa-solid fa-house"></i>',
      visible: true
    },
    {
      name: 'Feed',
      href: '/feed',
      icon: '<i class="fa-solid fa-rss"></i>',
      visible: User ? true : false
    },
    {
      name: 'Upload',
      href: '/upload',
      icon: '<i class="fa-solid fa-upload"></i>',
      visible: User ? true : false
    },
    {
      name: 'Favorites',
      href: '/favorites',
      icon: '<i class="fa-solid fa-star"></i>',
      visible: User ? true : false
    },
    {
      name: 'Friends',
      href: '/friends',
      icon: '<i class="fa-solid fa-user-group"></i>',
      visible: User ? true : false
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: '<i class="fa-solid fa-cog"></i>',
      visible: User ? true : false
    }
  ];

  const drawerStore = getDrawerStore();
  const toastStore = getToastStore();
  const modalStore = getModalStore();

  function drawerClose(link: any) {
    drawerStore.close();

    if (!link.visible) {
      // show the login modal and a toast;
      const toast: ToastSettings = {
        message: 'You must be logged in to access this page.',
        background: 'variant-filled-error',
        timeout: 4000
      };

      toastStore.trigger(toast);

      const modal: ModalSettings = {
        type: 'component',
        component: 'authenticationForm'
      };

      modalStore.trigger(modal);
    }
  }
</script>

<nav class="list-nav p-4">
  <ul>
    {#each links as link}
      <li aria-current={$page.url.pathname === link.href ? 'page' : null}>
        <a
          href={link.visible ? link.href : '#'}
          class="font-semibold flex items-center gap-2"
          on:click={() => drawerClose(link)}
        >
          {@html link.icon}
          {link.name}
        </a>
      </li>
    {/each}
  </ul>
</nav>
