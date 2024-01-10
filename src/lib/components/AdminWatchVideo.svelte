<script lang="ts">
  import { VideoStatus, type Video } from '@prisma/client';
  import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
  import UploadVideoPreview from './UploadVideoPreview.svelte';
  import { updateVideoStatus } from '$lib/admin';

  let status = 'preview';
  let rejectionReason: string = '';
  let confirmationTitle: string = '';

  const modalStore = getModalStore();
  const toastStore = getToastStore();

  export let video: Video;
</script>

<div class="bg-surface-100 dark:bg-surface-700 rounded-md p-4 lg:p-10">
  {#if status === 'preview'}
    <div class="flex flex-col gap-2">
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <h3 class="h3 font-semibold">Video Title:</h3>
          <p>{video.title}</p>
        </div>

        <div class="flex flex-col gap-2">
          <h3 class="h3 font-semibold">Video Description:</h3>
          <p>{video.description}</p>
        </div>
      </div>
      <UploadVideoPreview
        poster={video.poster_url ?? ''}
        videoSrc={video.url}
      />
    </div>
    <div class="flex items-center gap-2 mt-4 justify-end">
      <button
        type="button"
        class="mr-auto btn variant-filled-tertiary rounded-md flex items-center gap-1"
        on:click={() => {
          modalStore.close();
        }}
      >
        Close Modal
      </button>
      <button
        type="button"
        class="btn variant-filled-error rounded-md flex items-center gap-1"
        on:click={() => {
          status = 'rejected';
        }}
      >
        <i class="fa-solid fa-times x"></i>
        Reject
      </button>
      <button
        type="button"
        class="btn variant-filled-success rounded-md flex items-center gap-1"
        on:click={() => {
          status = 'approved';
        }}
      >
        <i class="fa-solid fa-check"></i>
        Approve
      </button>
    </div>
  {:else if status === 'rejected'}
    <div class="flex flex-col gap-2">
      <h2 class="text-2xl font-semibold">Reject Video Request</h2>
      <div>
        <p>
          Are you sure you want to reject this video request? This action cannot
          be undone.
        </p>
        <p>
          If you are sure, please provide a reason for rejecting the video
          request.
        </p>
      </div>

      <div class="flex flex-col mt-2">
        <label for="rejectionReason" class="label">Rejection Reason</label>
        <input
          id="rejectionReason"
          type="text"
          class="input rounded-md"
          placeholder="Reason for rejection"
          bind:value={rejectionReason}
        />
      </div>

      <div class="flex items-center gap-2 mt-4 justify-end">
        <button
          type="button"
          class="btn variant-filled-error rounded-md flex items-center gap-1"
          on:click={() => {
            status = 'preview';
          }}
        >
          <i class="fa-solid fa-times x"></i>
          Cancel
        </button>
        <button
          type="button"
          disabled={!rejectionReason}
          class="btn variant-filled-success rounded-md flex items-center gap-1"
          on:click={async () => {
            await updateVideoStatus({
              row: video,
              errorMessage: 'There was an error rejecting the video request.',
              toastStore,
              status: VideoStatus.REJECTED,
              successMessage: 'Video request rejected.',
              extraData: { rejectionReason }
            });

            modalStore.close();
          }}
        >
          <i class="fa-solid fa-check"></i>
          Confirm
        </button>
      </div>
    </div>
  {:else if status === 'approved'}
    <div class="flex flex-col gap-2 w-full lg:min-w-[700px]">
      <h2 class="text-2xl font-semibold">Approve Video Request</h2>
      <div>
        <p>Are you sure you want to approve this video request?</p>
        <p>
          If you are sure, please type <span class="font-semibold"
            >{video.title}</span
          > below.
        </p>
      </div>

      <div class="flex flex-col mt-2">
        <label for="videoTitle" class="label">Video Title</label>
        <input
          id="videoTitle"
          type="text"
          class="input rounded-md"
          placeholder={`Type: ${video.title}`}
          bind:value={confirmationTitle}
        />
      </div>

      <div class="flex items-center gap-2 mt-4 justify-end">
        <button
          type="button"
          class="btn variant-filled-error rounded-md flex items-center gap-1"
          on:click={() => {
            status = 'preview';
          }}
        >
          <i class="fa-solid fa-times x"></i>
          Cancel
        </button>
        <button
          type="button"
          disabled={confirmationTitle !== video.title}
          class="btn variant-filled-success rounded-md flex items-center gap-1"
          on:click={async () => {
            await updateVideoStatus({
              row: video,
              errorMessage: 'There was an error approving the video request.',
              toastStore,
              status: VideoStatus.PUBLISHED,
              successMessage: 'Video request approved.'
            });

            modalStore.close();
          }}
        >
          <i class="fa-solid fa-check"></i>
          Confirm
        </button>
      </div>
    </div>
  {/if}
</div>
