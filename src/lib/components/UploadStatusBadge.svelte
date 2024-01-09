<script lang="ts">
  import { cn, generateReadbleEnum } from '$lib';
  import type { VideoStatus } from '@prisma/client';

  export let status: VideoStatus;

  const statusColors: {
    [key in VideoStatus]: string;
  } = {
    PUBLISHED: 'variant-filled-success',
    REJECTED: 'variant-filled-error',
    PENDING_REVIEW: 'variant-filled-warning'
  };

  const statusIcons: {
    [key in VideoStatus]: string;
  } = {
    PUBLISHED: 'fa fa-check',
    REJECTED: 'fa fa-times',
    PENDING_REVIEW: 'fa fa-clock'
  };
</script>

<span
  class={cn(
    'inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium',
    statusColors[status]
  )}
>
  <span class="mr-1">
    <i class={statusIcons[status]}></i>
  </span>
  <span
    >{generateReadbleEnum({
      key: status,
      separator: '_'
    })}</span
  >
</span>
