<script lang="ts">
  import VideoUploadArea from './VideoUploadArea.svelte';

  export let onChangeHandler: (event: Event) => void;
</script>

<div class="flex flex-col gap-1 mb-4">
  <div class="flex justify-between items-center">
    <h1 class="h2">Upload Your Clip Here</h1>
    <a href="/myUploads" class="btn btn-sm variant-filled-tertiary rounded-md">
      Previous Uploads
    </a>
  </div>
  <p>
    Use the input field below to upload your video clip. Drap and drop or click
    on the field to select your file.
  </p>
</div>

<VideoUploadArea {onChangeHandler} />
