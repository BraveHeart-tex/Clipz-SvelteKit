<script lang="ts">
  import { FileDropzone } from '@skeletonlabs/skeleton';

  export let onChangeHandler: (event: Event) => void;
</script>

<FileDropzone
  name="file"
  on:change={(e) => onChangeHandler(e)}
  accept="video/mp4,video/x-m4v,video/*"
>
  <svelte:fragment slot="lead">
    <i class="fa-solid fa-file-video text-4xl"></i>
  </svelte:fragment>
  <svelte:fragment slot="message">
    Drag and drop your video file here or click to select a file.
  </svelte:fragment>
  <svelte:fragment slot="meta">Accepted file types: mp4</svelte:fragment>
</FileDropzone>
