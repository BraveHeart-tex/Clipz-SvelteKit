import type { Video } from '@prisma/client';
import { writable } from 'svelte/store';

export const createMyUploadsStore = (
  initialData: Video[] | null | undefined
) => {
  const { subscribe, set } = writable(initialData);

  return {
    subscribe,
    set
  };
};

export const myUploads = createMyUploadsStore([]);
