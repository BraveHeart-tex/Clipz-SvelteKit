<script lang="ts">
  import { page } from '$app/stores';
  import {
    getDrawerStore,
    getModalStore,
    getToastStore,
    type ModalSettings,
    type ToastSettings
  } from '@skeletonlabs/skeleton';
  import { user } from '$/src/lib/stores/user';
  import { fly } from 'svelte/transition';

  $: User = $user;

  $: navigationlinks = [
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
      name: 'My Uploads',
      href: '/myUploads',
      icon: '<i class="fa-solid fa-play"></i>',
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
      name: 'Inbox',
      href: '/inbox',
      icon: '<i class="fa-solid fa-inbox"></i>',
      visible: User ? true : false
    },
    {
      name: 'Admin',
      href: '/admin',
      icon: '<i class="fa-solid fa-user-tie"></i>',
      adminOnly: true,
      visible: User?.isAdmin ? true : false
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

      $page.url.searchParams.set('redirectTo', link.href);
      modalStore.trigger(modal);
    }
  }
</script>

<nav class="p-4">
  <ul class="flex flex-col gap-1">
    {#each navigationlinks.filter((item) => {
      if (!User) return !item.adminOnly;
      if (User && User.isAdmin) return item;
      return item.visible && !item.adminOnly;
    }) as link}
      <li
        class="p-2 hover:variant-filled-surface rounded-md"
        aria-current={$page.url.pathname === link.href ? 'page' : null}
      >
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
