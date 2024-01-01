import type { Video } from '@prisma/client';
import { writable } from 'svelte/store';

export const createMyUploadsStore = (
  initialData: Video[] | null | undefined
) => {
  const { subscribe, set } = writable({
    data: initialData,
    hasNextPage: false,
    hasPreviousPage: false,
    currentPage: 1,
    totalPageCount: 1,
    searchQuery: '',
    statusQuery: ''
  });

  return {
    subscribe,
    set
  };
};

export const myUploadsStore = createMyUploadsStore([]);
