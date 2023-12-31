<script lang="ts">
  import uploadVideoSchema from '$lib/schemas/UploadVideoSchema';
  import type { PageData } from './$types';
  import { Form } from 'formsnap';
  import {
    FileDropzone,
    getModalStore,
    getToastStore,
    type ModalSettings,
    type ToastSettings
  } from '@skeletonlabs/skeleton';
  import { superForm } from 'sveltekit-superforms/client';
  import { acceptedFileTypes, generateVideoThumbnail } from '$lib';

  export let data: PageData;
  let videoSrc: string | null = null;
  let title: string = '';
  let loading: boolean = false;
  let poster: string = '';
  let uploadedFile: File | null = null;

  const toastStore = getToastStore();
  const modalStore = getModalStore();

  const superFrm = superForm(data.form, {});

  async function onChangeHandler(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target.files) {
      const file = target?.files[0];
      if (!file || file.type !== 'video/mp4') return;

      if (acceptedFileTypes.includes(file.type)) {
        uploadedFile = file;
        const thumbnail = await generateVideoThumbnail(file);
        poster = thumbnail as string;

        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => {
          videoSrc = reader.result as string;

          const videoTitle = file.name.split('.').slice(0, -1).join('.');
          superFrm.fields.title.value.set(videoTitle);
        };
        reader.onerror = (error) => {
          console.log(error);
        };
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

  const handleCancelClick = () => {
    const modal: ModalSettings = {
      type: 'confirm',
      title: 'Cancel Upload',
      body: 'Are you sure you want to cancel this upload? Any progress will be lost.',
      buttonTextCancel: 'No, continue upload',
      buttonTextConfirm: 'Yes, cancel upload',
      response(r) {
        if (r) {
          videoSrc = null;
          title = '';
        }
      }
    };

    modalStore.trigger(modal);
  };
</script>

<div class="mt-2">
  <Form.Root
    controlled
    form={superFrm}
    schema={uploadVideoSchema}
    let:config
    method="POST"
    action="/upload"
    debug
  >
    {#if videoSrc}
      <div class="flex flex-col gap-1">
        <h1 class="h2">Preview Your Clip</h1>
        <p>
          Please confirm that the video below is the clip you want to upload.
        </p>
      </div>
      <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 mt-4">
        <div class="grid grid-cols-1 gap-2">
          <Form.Field {config} name="title">
            <div class="flex flex-col">
              <Form.Label>Video Title</Form.Label>
              <Form.Input type="text" class="input rounded-md" />
              <Form.Validation class="text-red-500 font-semibold" />
            </div>
          </Form.Field>
          <Form.Field {config} name="description">
            <div class="flex flex-col">
              <Form.Label>Description</Form.Label>
              <Form.Input type="text" class="input rounded-md" />
              <Form.Validation class="text-red-500 font-semibold" />
            </div>
          </Form.Field>
        </div>
        <div class="flex items-center gap-2 w-full mt-4">
          <button
            type="button"
            class="btn variant-outline-tertiary rounded-md"
            on:click={handleCancelClick}>Cancel</button
          >
          <button
            type="submit"
            class="btn variant-filled-primary rounded-md"
            disabled={loading}
          >
            Upload
          </button>
        </div>
        <div class="cursor-pointer">
          <video controls src={videoSrc} class="rounded-md shadow-md">
            <track kind="captions" />
          </video>
        </div>
      </div>
    {:else}
      <div class="flex flex-col gap-1 mb-4">
        <div class="flex justify-between items-center">
          <h1 class="h2">Upload Your Clip Here</h1>
          <a
            href="/myUploads"
            class="btn btn-sm variant-filled-tertiary rounded-md"
          >
            Previous Uploads
          </a>
        </div>
        <p>
          Use the input field below to upload your video clip. Drap and drop or
          click on the field to select your file.
        </p>
      </div>
      <FileDropzone
        name="file"
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
  </Form.Root>
</div>
