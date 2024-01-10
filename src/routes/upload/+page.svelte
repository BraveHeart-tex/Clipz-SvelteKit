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
  import {
    getDownloadURL,
    ref,
    uploadBytesResumable,
    uploadString
  } from 'firebase/storage';
  import { storage } from '$lib/firebase';
  import { v4 as uuidv4 } from 'uuid';
  import UploadProgress from '$lib/components/UploadProgress.svelte';
  import UploadVideoPreview from '$lib/components/UploadVideoPreview.svelte';

  export let data: PageData;
  let videoSrc: string | null = null;
  let poster: string = '';
  let uploadedFile: File | null = null;
  let progress: number = 0;
  let isSubmitting: boolean = false;
  let submitCompleted: boolean = false;
  let thumbnail: File | null = null;

  const toastStore = getToastStore();
  const modalStore = getModalStore();

  const superFrm = superForm(data.form, {
    validators: uploadVideoSchema
  });

  async function onChangeHandler(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target.files) {
      const file = target?.files[0];
      if (!file || file.type !== 'video/mp4') return;

      if (acceptedFileTypes.includes(file.type)) {
        uploadedFile = file;

        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => {
          videoSrc = reader.result as string;

          const videoTitle = file.name.split('.').slice(0, -1).join('.');
          superFrm.fields.title.value.set(videoTitle);
        };
        reader.onerror = (error) => {
          console.error(error);
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
    }
  }

  const resetForm = () => {
    superFrm.reset();
    videoSrc = null;
    uploadedFile = null;
    isSubmitting = false;
    submitCompleted = false;
    poster = '';
    thumbnail = null;
  };

  const handleCancelClick = () => {
    const modal: ModalSettings = {
      type: 'confirm',
      title: 'Cancel Upload',
      body: 'Are you sure you want to cancel this upload? Any progress will be lost.',
      buttonTextCancel: 'No, continue upload',
      buttonTextConfirm: 'Yes, cancel upload',
      response(r) {
        if (r) {
          resetForm();
        }
      }
    };

    modalStore.trigger(modal);
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    isSubmitting = true;

    const validationResult = await superFrm.validate();
    if (!validationResult.valid) {
      isSubmitting = false;
      superFrm.errors.set(validationResult.errors);
      return;
    }

    try {
      const { title, description } = validationResult.data;

      const formData = new FormData();

      const fileInputs = [
        {
          name: 'video',
          file: uploadedFile as File,
          title: `${title.replace(/\s/g, '_')}.mp4`,
          contentType: 'video/mp4',
          storageRef: ref(
            storage,
            `videos/${uuidv4() + title.replace(/\s/g, '_')}.mp4`
          )
        },
        {
          name: 'thumbnail',
          file: thumbnail as File,
          title: thumbnail?.name.replace(/\s/g, '_') as string,
          contentType: 'image/jpeg',
          storageRef: ref(
            storage,
            `thumbnails/${uuidv4() + thumbnail?.name.replace(/\s/g, '_') ?? ''}`
          )
        }
      ];

      if (!thumbnail) {
        fileInputs.pop();
      }

      const uploadPromises = fileInputs.map((fileInput) => {
        return new Promise((resolve, reject) => {
          const uploadTask = uploadBytesResumable(
            fileInput.storageRef,
            fileInput.file,
            {
              contentType: fileInput.contentType
            }
          );

          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const { bytesTransferred, totalBytes } = snapshot;
              progress = (bytesTransferred / totalBytes) * 100;
            },
            (error) => {
              isSubmitting = false;
              const errorToast: ToastSettings = {
                message:
                  'An error occurred while uploading your video. Please try again later.',
                background: 'variant-filled-error',
                timeout: 5000
              };
              toastStore.trigger(errorToast);
              reject(error);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                if (url) {
                  resolve({
                    name: fileInput.name,
                    url
                  });
                } else {
                  reject('Failed to get download URL');
                }
              });
            }
          );
        });
      });

      const urls = await Promise.all(uploadPromises);
      if (urls.length) {
        const [videoUrl, thumbnailUrl] = urls as {
          name: string;
          url: string;
        }[];

        formData.set('title', title);
        formData.set('description', description);
        formData.set('videoUrl', videoUrl?.url);
        if (thumbnailUrl) formData.set('thumbnailUrl', thumbnailUrl?.url);

        // send the form data to the server
        fetch('/upload', {
          method: 'POST',
          body: formData
        }).then(() => {
          isSubmitting = false;
          submitCompleted = true;
        });
      }
    } catch (error) {
      console.error(error);
      isSubmitting = false;
      const errorToast: ToastSettings = {
        message:
          'An error occurred while uploading your video. Please try again later.',
        background: 'variant-filled-error',
        timeout: 5000
      };
      toastStore.trigger(errorToast);
    }
  };

  const handleThumbnailChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files) {
      const file = target?.files[0];
      if (!file) return;

      if (file.type.startsWith('image/')) {
        thumbnail = file;
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => {
          poster = reader.result as string;
        };
        reader.onerror = (error) => {
          console.error(error);
        };
      } else {
        const errorToast: ToastSettings = {
          message: 'Invalid file type. Please upload an image file.',
          background: 'variant-filled-error',
          timeout: 5000
        };
        toastStore.trigger(errorToast);
      }
    } else {
    }
  };

  $: {
    if (submitCompleted) {
      const successToast: ToastSettings = {
        message: 'Your video has been uploaded successfully.',
        background: 'variant-filled-success',
        timeout: 5000
      };
      toastStore.trigger(successToast);

      resetForm();
    }
  }
</script>

<div class="mt-2">
  {#if videoSrc}
    <div class="flex flex-col gap-1">
      <h1 class="h2">Preview Your Clip</h1>
      <p>Please confirm that the video below is the clip you want to upload.</p>
    </div>
    {#if isSubmitting && !submitCompleted}
      <UploadProgress {progress} />
    {/if}
    <div class="grid grid-cols-1 gap-4 mt-4 lg:max-w-[75%]">
      <Form.Root
        form={superFrm}
        schema={uploadVideoSchema}
        controlled
        let:config
        on:submit={handleSubmit}
      >
        <div class="grid grid-cols-1 gap-2">
          <Form.Field {config} name="title">
            <div class="flex flex-col">
              <Form.Label>Video Title</Form.Label>
              <Form.Input type="text" class="input rounded-md" />
              <Form.Validation class="text-red-500 font-semibold" />
            </div>
          </Form.Field>
          <Form.Field {config} name="thumbnail">
            <Form.Control id="thumbnail" let:attrs>
              <div class="flex flex-col">
                <label for="thumbnail">Thumbnail</label>
                <input
                  {...attrs}
                  id="thumbnail"
                  name="thumbnail"
                  type="file"
                  class="input rounded-md"
                  accept="image/*"
                  on:change={handleThumbnailChange}
                />
                <Form.Validation class="text-red-500 font-semibold" />
                <Form.Description>
                  Upload a custom thumbnail for your video. If you do not upload
                  a thumbnail, a thumbnail will be generated from your video.
                </Form.Description>
              </div>
            </Form.Control>
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
            disabled={isSubmitting}
            on:click={handleCancelClick}>Cancel</button
          >
          <button
            type="submit"
            disabled={isSubmitting}
            class="btn variant-filled-primary rounded-md"
          >
            Upload
          </button>
        </div>
      </Form.Root>
    </div>
    <UploadVideoPreview {videoSrc} {poster} />
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
</div>
