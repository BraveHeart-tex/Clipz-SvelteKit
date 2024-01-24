<script lang="ts">
  import uploadVideoSchema from '$lib/schemas/UploadVideoSchema';
  import type { PageData } from './$types';
  import { Form } from 'formsnap';
  import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
  import { superForm } from 'sveltekit-superforms/client';
  import UploadProgress from '$/src/lib/components/ProgressModal.svelte';
  import UploadVideoPreview from '$lib/components/UploadVideoPreview.svelte';
  import UploadVideoStepOne from '$lib/components/UploadVideoStepOne.svelte';
  import VideoUploadArea from '$lib/components/VideoUploadArea.svelte';
  import { VideoFormHandler } from '$/src/lib/services/video-form-handler';
  import { onMount } from 'svelte';
  import { storage } from '$/src/lib/firebase';
  import { videoService } from '$/src/lib/services/video-service';

  export let data: PageData;

  $: isEditMode = data?.currentVideo?.url ? true : false;

  const toastStore = getToastStore();
  const modalStore = getModalStore();

  const superFrm = superForm(data.form, {
    validators: uploadVideoSchema
  });

  let videoFormHandler: VideoFormHandler;

  onMount(() => {
    videoFormHandler = new VideoFormHandler({
      modalStore,
      toastStore,
      superFrm,
      isEditMode,
      storage,
      currentVideo: data.currentVideo || null,
      videoService: videoService
    });
  });
</script>

{#if videoFormHandler}
  <div class="mt-2">
    {#if $videoFormHandler.videoSrc || data.currentVideo?.url}
      <div class="flex flex-col gap-1">
        <h1 class="h2">
          {isEditMode ? 'Update Your Clip' : 'Upload Your Clip'}
        </h1>
        <p>
          {isEditMode ? 'Update' : 'Upload'} your video by filling out the form below
        </p>
      </div>
      {#if $videoFormHandler.isSubmitting && !$videoFormHandler.submitCompleted}
        <UploadProgress
          title="Uploading Video"
          description="Please do not close this window or navigate away from this page until the
      upload is complete."
          progress={$videoFormHandler.progress}
        />
      {/if}
      <div class="grid grid-cols-1 gap-4 mt-4 lg:max-w-[75%]">
        <Form.Root
          form={superFrm}
          schema={uploadVideoSchema}
          controlled
          let:config
          on:submit={async (e) => videoFormHandler.handleUploadSubmit(e)}
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
                    on:change={videoFormHandler.handleThumbnailChange}
                  />
                  <Form.Validation class="text-red-500 font-semibold" />
                  <Form.Description>
                    Upload a custom thumbnail for your video. If you do not
                    upload a thumbnail, a thumbnail will be generated from your
                    video.
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
              disabled={$videoFormHandler.isSubmitting}
              on:click={videoFormHandler.handleCancelUploadClick}>Cancel</button
            >
            <button
              type="submit"
              disabled={$videoFormHandler.isSubmitting ||
                (!$videoFormHandler.videoSrc && !data.currentVideo?.url)}
              class="btn variant-filled-primary rounded-md"
            >
              Upload
            </button>
          </div>
        </Form.Root>

        {#if isEditMode}
          <p>
            If you would like to upload a different video, you can drop your
            video to the zone below or click on it to select a file.
          </p>
          <VideoUploadArea
            onChangeHandler={videoFormHandler.handleVideoChange}
          />
        {/if}
      </div>

      {#if $videoFormHandler.videoSrc}
        <UploadVideoPreview
          handleRemoveThumbnail={videoFormHandler.handleRemoveThumbnail}
          videoSrc={$videoFormHandler.videoSrc}
          poster={$videoFormHandler.poster ||
            data?.currentVideo?.poster_url ||
            ''}
        />
      {:else if data.currentVideo?.url}
        <UploadVideoPreview
          handleRemoveThumbnail={videoFormHandler.handleRemoveThumbnail}
          videoSrc={data?.currentVideo?.url}
          poster={$videoFormHandler.poster ||
            data?.currentVideo?.poster_url ||
            ''}
        />
      {/if}
    {:else}
      <UploadVideoStepOne
        onChangeHandler={videoFormHandler.handleVideoChange}
      />
    {/if}
  </div>
{/if}
