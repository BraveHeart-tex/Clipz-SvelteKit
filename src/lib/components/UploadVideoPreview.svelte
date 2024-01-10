<script lang="ts">
  import Plyr from 'plyr';
  import { onMount } from 'svelte';

  export let poster: string;
  export let videoSrc: string;

  onMount(() => {
    const player = new Plyr('#player', {
      controls: [
        'play-large',
        'play',
        'progress',
        'current-time',
        'mute',
        'volume',
        'captions',
        'settings',
        'pip',
        'airplay',
        'fullscreen'
      ]
    });
  });
</script>

<div class="cursor-pointer grid grid-cols-1 gap-2 lg:grid-cols-2 mt-4">
  <div class="flex flex-col gap-2">
    <h3 class="h3">Video Preview:</h3>
    <video id="player" playsinline controls data-poster={poster ?? ''}>
      <track kind="captions" />
      <source src={videoSrc} type="video/mp4" />
    </video>
  </div>

  {#if poster}
    <div class="flex flex-col gap-2">
      <h3 class="h3">Thumbnail Preview:</h3>
      <img
        src={poster}
        alt="video thumbnail"
        class="rounded-md shadow-md"
        width="800"
        height="600"
      />
    </div>
  {/if}
</div>
