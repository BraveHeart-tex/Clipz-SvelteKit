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
  import { acceptedFileTypes } from '$lib';
  import { ffmpegService } from '$lib/ffempegService';
  import { v4 as uuidv4 } from 'uuid';
  import { ref, uploadBytes, uploadBytesResumable } from 'firebase/storage';
  import { storage } from '$lib/firebase';
  import { onMount } from 'svelte';

  export let data: PageData;
  let videoSrc: string | null = null;
  let title: string = '';
  let selectedScreenshot: string = '';
  let loading: boolean = false;
  let uploadedVideo: File;
  let screenShots: string[] = [];
  let uploadTask: any;
  let screenshotTask: any;

  const toastStore = getToastStore();
  const modalStore = getModalStore();

  const superFrm = superForm(data.form, {});

  onMount(async () => {
    await ffmpegService.init();
  });

  async function handleFormSubmit() {
    if (ffmpegService.isRunning) return;

    // generate a file name for the clip
    const clipFileName = uuidv4();
    const clipPath = `clips/${clipFileName}.mp4`;

    const screenShotBlob = await ffmpegService.blobFromURL(selectedScreenshot);
    const screenShotPath = `screenshots/${clipFileName}.png`;

    const fileRef = ref(storage, clipPath);
    const screenShotRef = ref(storage, screenShotPath);

    uploadTask = uploadBytesResumable(fileRef, uploadedVideo);

    screenshotTask = uploadBytes(screenShotRef, screenShotBlob, {
      contentType: 'image/png',
      customMetadata: {
        clipId: clipFileName,
        clipPath
      }
    });

    combineLatest([
      uploadTask.percentageChanges(),
      screenshotTask.percentageChanges()
    ]).subscribe((progress) => {
      const [clipProgress, screenshotProgress] = progress;
      console.log(clipProgress, screenshotProgress);
    });
  }

  async function onChangeHandler(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target.files) {
      const file = target?.files[0];
      if (!file || file.type !== 'video/map4') return;

      if (acceptedFileTypes.includes(file.type)) {
        screenShots = await ffmpegService.getScreenShots(file);
        selectedScreenshot = screenShots[0];
        title = file.name.replace(/\.[^/.]+$/, '');
        uploadedVideo = file;
        videoSrc = URL.createObjectURL(file);
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
  {#if videoSrc}
    <div class="flex flex-col gap-1">
      <h1 class="h2">Preview Your Clip</h1>
      <p>Please confirm that the video below is the clip you want to upload.</p>
    </div>
    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 mt-4">
      <Form.Root
        controlled
        form={superFrm}
        schema={uploadVideoSchema}
        let:config
        method="POST"
        action="/upload"
      >
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
            type="button"
            on:click={handleFormSubmit}
            class="btn variant-filled-primary rounded-md"
            disabled={loading}
          >
            Upload <i class="fa-solid fa-spinner animate-spin ml-2"></i>
          </button>
        </div>
      </Form.Root>
      <video src={videoSrc} controls class="w-full h-auto rounded-lg shadow-lg">
        <track kind="captions" />
      </video>
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
      name="video"
      on:change={onChangeHandler}
      accept="video/mp4,video/x-m4v,video/*"
      value={videoSrc}
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
