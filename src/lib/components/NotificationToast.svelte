<script lang="ts">
  import { fly } from 'svelte/transition';

  export let title: string;
  export let body: string;
</script>

<aside
  in:fly={{ y: -100, duration: 400 }}
  out:fly={{ y: 100, duration: 400 }}
  class="relative bg-surface-200 dark:bg-surface-500 px-4 py-3 flex items-center gap-4 rounded-lg shadow-md lg:w-[350px]"
>
  <i class="fa-regular fa-bell text-2xl"></i>

  <div class="flex flex-col gap-1">
    <h3 class="text-2xl">{title}</h3>
    <p class="">{body}</p>
  </div>
</aside>
