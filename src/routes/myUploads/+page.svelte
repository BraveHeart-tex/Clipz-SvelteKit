<script lang="ts">
  import UploadCard from '$lib/components/UploadCard.svelte';
  import type { PageData } from './$types';
  import UploadSearchForm from '$lib/components/UploadSearchForm.svelte';
  import { myUploadsStore } from '$lib/stores/myUploads';

  export let data: PageData;

  $: hasSearchParams =
    (data?.userUploads?.length ?? 0) > 0 && $myUploadsStore?.data?.length === 0;

  $: {
    myUploadsStore.update((store) => ({
      ...store,
      data: data?.userUploads || [],
      currentPage: data?.currentPage || 1,
      totalPageCount: data?.totalPageCount || 1,
      hasNextPage: data?.hasNextPage || false,
      hasPreviousPage: data?.hasPreviousPage || false
    }));
  }
</script>

<h1 class="h2">My Uploads</h1>
<p>Manage your uploads here. Search, delete, and edit your uploads.</p>

<UploadSearchForm />

{#if !$myUploadsStore || $myUploadsStore?.data?.length === 0}
  {#if hasSearchParams}
    <div class="flex flex-col gap-1 mt-4">
      <p>No uploads were found that matched your search</p>
      <button
        class="w-max btn variant-filled-primary rounded-md"
        on:click={() => {
          myUploadsStore.reset(data?.userUploads ?? []);
        }}
      >
        Clear all filters
      </button>
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
  <div
    class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[calc(100vh - 100px)]"
  >
    {#each $myUploadsStore?.data || [] as upload}
      <UploadCard video={upload} />
    {/each}
  </div>
  <div class="flex justify-center mt-4 bg-red-500">
    <nav class="flex gap-2">
      {#if data.currentPage > 1}
        <button
          disabled={data.currentPage === 1}
          class="btn variant-filled-primary rounded-md"
        >
          <a href="/myUploads/{data.currentPage - 1}"> Previous </a>
        </button>
      {/if}
      {#if data.currentPage < data.totalPageCount}
        <button disabled={data.currentPage === data.totalPageCount}>
          <a
            class="btn variant-filled-primary rounded-md"
            href="/myUploads/{data.currentPage + 1}"
          >
            Next
          </a>
        </button>
      {/if}
    </nav>
  </div>
{/if}
