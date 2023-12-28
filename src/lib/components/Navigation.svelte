<script lang="ts">
  import { page } from '$app/stores';
  import { getDrawerStore } from '@skeletonlabs/skeleton';
  import { user } from '$lib/state.svelte';

  $: User = $user;

  let links = [
    {
      name: 'Home',
      href: '/',
      icon: '<i class="fa-solid fa-house"></i>'
    },
    {
      name: 'Feed',
      href: '/feed',
      icon: '<i class="fa-solid fa-rss"></i>'
    },
    {
      name: 'Favorites',
      href: '/favorites',
      icon: '<i class="fa-solid fa-star"></i>'
    },
    {
      name: 'Friends',
      href: '/friends',
      icon: '<i class="fa-solid fa-user-group"></i>'
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: '<i class="fa-solid fa-cog"></i>'
    }
  ];

  const drawerStore = getDrawerStore();

  function drawerClose() {
    drawerStore.close();
  }
</script>

<nav class="list-nav p-4">
  <ul>
    {#each links as link}
      <li aria-current={$page.url.pathname === link.href ? 'page' : null}>
        <a
          href={link.href}
          class="font-semibold flex items-center gap-2"
          on:click={drawerClose}
        >
          {@html link.icon}
          {link.name}
        </a>
      </li>
    {/each}
  </ul>
</nav>
