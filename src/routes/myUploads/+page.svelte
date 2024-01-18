<script lang="ts">
  import type { PageData } from './$types';
  import UploadSearchForm from '$lib/components/UploadSearchForm.svelte';
  import { myUploadsStore } from '$lib/stores/myUploads';
  import MyUploadsListRow from '$lib/components/MyUploadsListRow.svelte';
  import { cn, longpress } from '$/src/lib';
  import type { Video } from '@prisma/client';
  import {
    getModalStore,
    getToastStore,
    type ModalSettings,
    type ToastSettings
  } from '@skeletonlabs/skeleton';
  import { invalidate } from '$app/navigation';

  export let data: PageData;
  const modalStore = getModalStore();
  const toastStore = getToastStore();

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

  let editMode = false;

  $: selectedUploads = [] as Video[];

  const onCheckboxChange = (checked: boolean, upload: Video) => {
    if (checked) {
      selectedUploads.push(upload);
      selectedUploads = selectedUploads;
    } else {
      selectedUploads = selectedUploads.filter((u) => u.id !== upload.id);
    }
  };

  const handleDeleteSelectedVideos = () => {
    const confirmModal: ModalSettings = {
      type: 'confirm',
      title: selectedUploads.length === 1 ? 'Delete Video' : `Delete Videos`,
      body:
        (selectedUploads.length === 1
          ? 'Are you sure you want to delete this video?'
          : `You have selected ${selectedUploads.length} videos. Are you sure you want to delete all of them?`) +
        ' This action cannot be undone.',
      async response(r) {
        if (r) {
          try {
            const promises = selectedUploads.map((item) => {
              return fetch(`/api/videos/${item.id}`, {
                method: 'DELETE'
              });
            });

            await Promise.all(promises);

            invalidate('app:myVideos');
            const successToast: ToastSettings = {
              message: 'Your video was deleted successfully.',
              background: 'variant-filled-success',
              timeout: 5000
            };

            toastStore.trigger(successToast);
          } catch (error) {
            const errorToast: ToastSettings = {
              message: 'There was an error deleting your video.',
              background: 'variant-filled-error',
              timeout: 5000
            };

            toastStore.trigger(errorToast);
          } finally {
            editMode = false;
            selectedUploads = [];
          }
        }
      }
    };

    modalStore.trigger(confirmModal);
  };
</script>

<h1 class="h2">My Uploads</h1>
<p>Manage your uploads here. Search, delete, and edit your uploads.</p>

<UploadSearchForm />
{#if editMode && selectedUploads.length > 0}
  <div class="flex items-center gap-2 justify-end w-full">
    <p class=" font-semibold">
      ({selectedUploads.length}) {selectedUploads.length === 1
        ? 'video'
        : 'videos'} selected
    </p>
    <button
      class="btn flex gap-2 btn-sm rounded-md variant-filled-error"
      on:click={handleDeleteSelectedVideos}
    >
      <i class="fa-solid fa-trash"></i>
      Delete
    </button>
  </div>
{/if}

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
      <a
        class="w-max btn variant-filled-primary rounded-md flex items-center gap-2"
        href="/upload"
      >
        <i class="fa-solid fa-upload"></i>
        Upload a video
      </a>
    </div>
  {/if}
{:else}
  <div class="max-h-[calc(100vh - 100px)] w-full">
    <dl
      class={cn('flex flex-col select-none w-full')}
      use:longpress
      on:longpress={(e) => {
        editMode = !editMode;
      }}
    >
      {#each $myUploadsStore.data as upload}
        <MyUploadsListRow
          checked={selectedUploads.find((item) => item.id === upload.id)
            ? true
            : false}
          {editMode}
          {onCheckboxChange}
          {upload}
        />
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
