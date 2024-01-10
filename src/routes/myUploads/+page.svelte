<script lang="ts">
  import type { PageData } from './$types';
  import UploadSearchForm from '$lib/components/UploadSearchForm.svelte';
  import { myUploadsStore } from '$lib/stores/myUploads';
  import MyUploadsListRow from '$lib/components/MyUploadsListRow.svelte';

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
    <div class="flex flex-col justify-start items-center mt-4 w-full gap-4">
      <div class="flex items-center w-full justify-center flex-col gap-4">
        <i class="fa-solid fa-question text-[32px]"></i>
        <p>No uploads were found that matched your search.</p>
      </div>
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
  <div class="max-h-[calc(100vh - 100px)] w-full">
    <dl class="flex flex-col">
      {#each $myUploadsStore.data as upload}
        <MyUploadsListRow {upload} />
      {/each}
    </dl>
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
