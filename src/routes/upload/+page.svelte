<script lang="ts">
  import uploadVideoSchema from '$lib/schemas/UploadVideoSchema';
  import { page } from '$app/stores';
  import type { PageData } from './$types';
  import { Form, type SuperValidated } from 'formsnap';
  import {
    FileDropzone,
    getToastStore,
    type ToastSettings
  } from '@skeletonlabs/skeleton';
  import { superForm } from 'sveltekit-superforms/client';

  export let data: PageData;
  let videoSrc: string | null = null;

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
        // Show preview
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result;
          if (typeof result === 'string') {
            videoSrc = result;
          }
        };
        reader.readAsDataURL(file);

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

  const superFrm = superForm(data.form, {
    onSubmit(input) {
      console.log(input);
    }
  });

  console.log(videoSrc);
</script>

<div class="mt-2">
  {#if videoSrc}
    <div class="flex flex-col gap-1">
      <h1 class="h2">Preview Your Clip</h1>
      <p>Please confirm that the video below is the clip you want to upload.</p>
    </div>
    <Form.Root
      controlled
      form={superFrm}
      {uploadVideoSchema}
      let:config
      debug={true}
      method="POST"
      action="/upload"
    >
      <Form.Field {config} name={formField.name}>
        <div class="flex flex-col">
          <Form.Label>{formField.label}</Form.Label>
          <Form.Input type={formField.type} class="input rounded-md" />
          <Form.Validation class="text-red-500 font-semibold" />
        </div>
      </Form.Field>
      <slot name="submitButton" />
    </Form.Root>
    <video src={videoSrc} controls class="w-full h-auto rounded-lg shadow-lg">
      <track kind="captions" />
    </video>
  {:else}
    <div class="flex items-center justify-between">
      <div class="flex flex-col gap-1">
        <h1 class="h2">Upload Your Clip Here</h1>
        <p>
          Use the input field below to upload your video clip. Drap and drop or
          click on the field to select your file.
        </p>
      </div>
      <a href="/myUploads" class="btn variant-filled-tertiary rounded-md">
        Previous Uploads
      </a>
    </div>
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
  {/if}
</div>
