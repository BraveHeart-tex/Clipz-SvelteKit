<script lang="ts">
  import { invalidate, invalidateAll } from '$app/navigation';
  import type { Video } from '@prisma/client';
  import {
    getModalStore,
    getToastStore,
    type ModalSettings,
    type ToastSettings
  } from '@skeletonlabs/skeleton';

  export let video: Video;
  const modalStore = getModalStore();
  const toastStore = getToastStore();

  const handleDeleteClick = () => {
    const modal: ModalSettings = {
      type: 'confirm',
      title: 'Delete video?',
      body: 'Are you sure you want to delete this video? This action cannot be undone.',
      buttonTextCancel: 'Cancel',
      buttonTextConfirm: 'Yes, delete this video',
      async response(r) {
        if (r) {
          try {
            await fetch(`/api/videos/${video.id}`, {
              method: 'DELETE'
            });
            invalidate('app:myVideos');
            const successToast: ToastSettings = {
              message: 'Your video was deleted successfully.',
              background: 'variant-filled-success',
              timeout: 5000
            };

            toastStore.trigger(successToast);
          } catch (error) {
            const errorToast: ToastSettings = {
              message:
                'There was an error deleting your video. Please try again later.',
              background: 'variant-filled-error',
              timeout: 5000
            };
            toastStore.trigger(errorToast);
          }
        }
      }
    };

    modalStore.trigger(modal);
  };
</script>

<div class="card justify-between flex flex-col">
  <header class="card-header">
    <h3 class="h4">{video.title}</h3>
    <p class="text-sm text-gray-500">{video.description} {video.description}</p>
  </header>
  <section class="p-4">
    <video poster="" src={video.url}> <track kind="captions" /></video>
  </section>
  <footer class="card-footer self-end flex items-center gap-2">
    <a
      class="btn variant-filled-primary rounded-md flex items-center gap-1"
      href="/watch/{video.id}"
    >
      <i class="fa-solid fa-play"></i>
      Watch
    </a>
    <button
      class="btn variant-filled-secondary rounded-md flex items-center gap-1"
    >
      <i class="fa-solid fa-edit"></i>
      Edit
    </button>
    <button
      type="submit"
      on:click={handleDeleteClick}
      class="btn variant-filled-primary rounded-md flex items-center gap-1"
    >
      <i class="fa-solid fa-trash"></i>
      Delete
    </button>
  </footer>
</div>
