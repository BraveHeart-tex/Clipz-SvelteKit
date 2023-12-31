<script lang="ts">
  import UploadCard from '$lib/components/UploadCard.svelte';
  import type { PageData } from './$types';
  import { page } from '$app/stores';
  export let data: PageData;

  $: hasSearchParams = $page.url.searchParams.size > 0;

  $: uploads = data?.userUploads;
</script>

<h1 class="h2">My Uploads</h1>
<p>Manage your uploads here. Search, delete, and edit your uploads.</p>

{#if !uploads || uploads?.length === 0}
  {#if hasSearchParams}
    <div class="flex flex-col gap-1 mt-4">
      <p>No uplaods were found that matched your search</p>
      <a class="w-max btn variant-filled-primary rounded-md" href="/myUploads">
        Clear all filters
      </a>
    </div>
  {:else}
    <div class="flex flex-col gap-1 mt-4">
      <p>It looks like you have no uploads.</p>
      <a class="w-max btn variant-filled-primary rounded-md" href="/upload"
        >Upload a video</a
      >
    </div>
  {/if}
{:else}
  <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
    {#each uploads as upload}
      <UploadCard video={upload} />
    {/each}
  </div>
{/if}
