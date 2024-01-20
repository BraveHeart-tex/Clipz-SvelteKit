<script lang="ts">
  import Popper from './Popper.svelte';
</script>

<Popper>
  <button slot="trigger" class="btn btn-sm">
    <i class="fa-solid fa-bell"></i>
  </button>

  <div slot="content">
    <div
      class="flex flex-col items-start gap-2 p-4 min-w-max bg-surface-50 dark:bg-surface-600 dark:text-white rounded-md overflow-hidden shadow-xl z-[100]"
    >
      <p class="w-full">
        <span class="font-semibold">Notification</span>
        <br />
        <span class="text-sm dark:text-white">Notification body</span>
      </p>
    </div>
  </div>
</Popper>
