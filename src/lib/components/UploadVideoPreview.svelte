<script lang="ts">
  import { cn } from '$lib';
  import Plyr from 'plyr';
  import { onMount } from 'svelte';

  export let poster: string;
  export let videoSrc: string;
  export let handleRemoveThumbnail: (() => void) | null = null;

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

<div class={cn('grid grid-cols-1 gap-2 mt-4', poster && 'lg:grid-cols-2')}>
  <div class="flex flex-col gap-2">
    <div class="flex items-center gap-1">
      <i class="fa-solid fa-video text-2xl"></i>
      <h3 class="h3">Video Preview:</h3>
    </div>
    <div
      class={cn(
        'rounded-md shadow-md lg:max-w-6xl',
        poster && 'lg:col-span-1',
        !poster && 'lg:col-span-2'
      )}
    >
      <video
        id="player"
        playsinline
        controls
        data-poster={poster ?? ''}
        data-plyr-config={{
          title: 'Video Preview'
        }}
      >
        <track kind="captions" />
        <source src={videoSrc} type="video/mp4" />
      </video>
    </div>
  </div>

  {#if poster}
    <div class="flex flex-col gap-2">
      <div class="flex items-center gap-1">
        <i class="fa-solid fa-photo-film text-2xl"></i>
        <h3 class="h3">Thumbnail Preview:</h3>
        {#if handleRemoveThumbnail}
          <button class="ml-auto btn-icon btn" on:click={handleRemoveThumbnail}>
            <i class="fa-solid fa-trash"></i>
          </button>
        {/if}
      </div>
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
