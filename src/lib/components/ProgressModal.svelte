<script lang="ts">
  import { ProgressBar } from '@skeletonlabs/skeleton';

  export let progress: number = 0;
  export let title: string;
  export let description: string;
</script>

<div
  class={'fixed top-0 left-0 w-[98vw] h-full flex items-center justify-center bg-surface-900 bg-opacity-75 z-50'}
>
  <div
    class="flex flex-col gap-2 bg-surface-50 rounded-md p-10 dark:bg-surface-600"
  >
    <div class="flex items-center gap-1">
      <i class="fa-solid fa-cloud-arrow-up text-3xl"></i>
      <h3 class="h3">
        {title} (%{progress.toFixed(0)})
      </h3>
    </div>
    <p>
      {description}
    </p>
    <ProgressBar
      label="Progress Bar"
      value={progress}
      max={100}
      transition="transition-all animate-pulse"
    />
  </div>
</div>
