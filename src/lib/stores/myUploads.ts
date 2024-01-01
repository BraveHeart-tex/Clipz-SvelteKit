import type { MyUploadsStore } from '$lib/types';
import type { Video } from '@prisma/client';
import { writable } from 'svelte/store';

export function createMyUploadsStore(initialData: Video[]) {
  const store = writable<MyUploadsStore>({
    data: initialData,
    hasNextPage: false,
    hasPreviousPage: false,
    currentPage: 1,
    totalPageCount: 1,
    searchQuery: '',
    statusQuery: ''
  });

  return {
    ...store,
    reset: (data: Video[]) =>
      store.update((store) => ({
        ...store,
        data: data ?? [],
        hasNextPage: false,
        hasPreviousPage: false,
        currentPage: 1,
        totalPageCount: 1,
        searchQuery: '',
        statusQuery: ''
      }))
  };
}

export const myUploadsStore = createMyUploadsStore([]);
