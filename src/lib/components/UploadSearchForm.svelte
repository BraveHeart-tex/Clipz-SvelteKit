<script lang="ts">
  import { generateReadbleEnumLabels } from '$lib';
  import { myUploadsStore } from '$lib/stores/myUploads';
  import type { SearchUploadsResponse } from '$lib/types';
  import { VideoStatus } from '@prisma/client';
  import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
  import { page } from '$app/stores';
  import { user } from '$lib/stores/user';

  const toastStore = getToastStore();

  const statusSelectOptions = generateReadbleEnumLabels({
    enumObj: VideoStatus
  });

  const handleSearchSubmit = async (e: Event) => {
    e.preventDefault();
    try {
      const userId = $user?.userId;
      const response = await fetch(
        `/api/uploads/${userId}?q=${$myUploadsStore.searchQuery}&status=${$myUploadsStore.statusQuery}`
      );
      const data = (await response.json()) as SearchUploadsResponse;
      myUploadsStore.update((store) => ({
        ...store,
        ...data,
        data: data.userUploads
      }));
    } catch (error) {
      const errorToast: ToastSettings = {
        message: 'There was an error searching for your uploads',
        background: 'variant-filled-error',
        timeout: 5000
      };
      toastStore.trigger(errorToast);
    }
  };
</script>

<form
  on:submit={handleSearchSubmit}
  class="grid grid-cols-1 md:grid-cols-2 gap-2 my-5"
>
  <div>
    <label for="q">Search By Title or Description</label>
    <input
      name="q"
      id="q"
      class="input rounded-md"
      type="text"
      placeholder="Enter a search term"
      bind:value={$myUploadsStore.searchQuery}
    />
  </div>
  <div>
    <label for="status">Status</label>
    <select
      id="status"
      name="status"
      class="select rounded-md"
      bind:value={$myUploadsStore.statusQuery}
    >
      <option value="">All</option>
      {#each statusSelectOptions as statusOption}
        <option value={statusOption.value}>{statusOption.label}</option>
      {/each}
    </select>
  </div>
  <div class="flex items-center gap-2 justify-between lg:justify-start">
    <button
      type="button"
      class="w-max btn rounded-md"
      on:click={() => {
        myUploadsStore.reset($page?.data?.userUploads);
      }}>Reset</button
    >
    <button type="submit" class="w-max btn rounded-md variant-filled-primary"
      >Search</button
    >
  </div>
</form>
