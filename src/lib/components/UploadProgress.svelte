<script lang="ts">
  import { ProgressBar } from '@skeletonlabs/skeleton';

  export let progress: number = 0;
</script>

<div
  class={'fixed top-0 left-0 w-full h-full flex items-center justify-center bg-surface-900 bg-opacity-75 z-50'}
>
  <div
    class="flex flex-col gap-2 bg-surface-50 rounded-md p-10 dark:bg-surface-600"
  >
    <h3 class="h3">
      Your video is being uploaded (%{progress.toFixed(0)})
    </h3>
    <p>
      Please do not close this window or navigate away from this page until the
      upload is complete.
    </p>
    <ProgressBar
      label="Progress Bar"
      value={progress}
      max={100}
      transition="transition-all animate-pulse"
    />
  </div>
</div>
