<script lang="ts">
  import type { PageData } from './$types';
  import {
    FileDropzone,
    getToastStore,
    type ToastSettings
  } from '@skeletonlabs/skeleton';

  export let data: PageData;

  const toastStore = getToastStore();

  let acceptedFileTypes = [
    'video/mp4',
    'video/x-m4v',
    'video/*',
    'video/quicktime',
    'video/x-msvideo',
    'video/x-flv',
    'video/webm',
    'video/x-matroska',
    'video/mpeg'
  ];

  function onChangeHandler(e: Event): void {
    const target = e.target as HTMLInputElement;
    if (target.files) {
      const file = target?.files[0];
      if (!file) return;
      if (acceptedFileTypes.includes(file.type)) {
        // Process file
        // Show progress bar
        // Show success toast
        // show user a preview of the video
        // show user a form to fill out the rest of the details
        // After confirm insert the record into db and upload file to firebase storage
      } else {
        const errorToast: ToastSettings = {
          message:
            'Invalid file type. Please upload a video file. Accepted file types: mp4, m4v, mov, avi, wmv, flv, webm, mkv, mpeg',
          background: 'variant-filled-error',
          timeout: 5000
        };
        toastStore.trigger(errorToast);
      }
    } else {
      console.log('no file');
    }
  }
</script>

<div class="flex flex-col gap-1">
  <h1 class="h2">Upload Your Clip Here</h1>
  <p>
    Use the input field below to upload your video clip. Drap and drop or click
    on the field to select your file.
  </p>
</div>

<div class="mt-2">
  <FileDropzone
    name="video"
    on:change={onChangeHandler}
    accept="video/mp4,video/x-m4v,video/*"
  >
    <svelte:fragment slot="lead">
      <i class="fa-solid fa-file-video text-4xl"></i>
    </svelte:fragment>
    <svelte:fragment slot="message">
      Drag and drop your video file here or click to select a file.
    </svelte:fragment>
    <svelte:fragment slot="meta">
      Accepted file types: mp4, m4v, mov, avi, wmv, flv, webm, mkv, mpeg
    </svelte:fragment>
  </FileDropzone>
</div>
