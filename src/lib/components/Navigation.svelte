<script lang="ts">
  import { page } from '$app/stores';
  import { getDrawerStore } from '@skeletonlabs/skeleton';

  let links = [
    {
      name: 'Home',
      href: '/',
      icon: 'home'
    },
    {
      name: 'Feed',
      href: '/feed',
      icon: 'information-circle'
    },
    {
      name: 'Manage',
      href: '/manage',
      icon: 'information-circle'
    },
    {
      name: 'Favorites',
      href: '/favorites',
      icon: 'information-circle'
    },
    {
      name: 'Friends',
      href: '/categories',
      icon: 'information-circle'
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: 'information-circle'
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
      <li>
        <a
          href={link.href}
          on:click={drawerClose}
          class:variant-filled-primary={link.href === $page.url.pathname}
          >{link.name}
        </a>
      </li>
    {/each}
  </ul>
</nav>
