<script lang="ts">
  import {
    getCoreRowModel,
    type ColumnDef,
    getSortedRowModel,
    type TableOptions,
    flexRender,
    type SortingState,
    createSvelteTable
  } from '@tanstack/svelte-table';
  import { writable } from 'svelte/store';
  import { onMount } from 'svelte';
  import { debounce } from '$lib';

  type T = $$Generic;

  export let data: T[] = [];
  export let title = '';
  export let columns: ColumnDef<T>[];
  export let apiPath: string = '';
  export let actionsColumnLabel = '';

  let sorting: SortingState = [];
  let host = '';
  let page = 1;
  let maxPages = 1;
  const pageSize = 25;
  let search = '';
  let filters: Record<string, string> = {};

  function requestData() {
    if (!host) return;
    const url = new URL(host + apiPath);

    if (sorting?.length > 0) {
      url.searchParams.set('sortCol', sorting[0].id);
      url.searchParams.set('sortDir', sorting[0].desc ? 'desc' : 'asc');
    }

    url.searchParams.set('page', page.toString());
    url.searchParams.set('pageSize', pageSize.toString());

    if (search) {
      url.searchParams.set('q', search);
    }

    if (Object.keys(filters).length > 0) {
      url.searchParams.set('colFilters', JSON.stringify(filters));
    }

    const dest = url.toString().replace(host, '');

    fetch(dest)
      .then((res) => res.json())
      .then((res: any) => {
        data = res.rows;
        maxPages = Math.ceil(res.count / pageSize);
        options.update((o) => ({ ...o, data }));
      });
  }

  const setSorting = (updater: any) => {
    if (updater instanceof Function) {
      sorting = updater(sorting);
    } else {
      sorting = updater;
    }
    options.update((old) => ({
      ...old,
      state: {
        ...old.state,
        sorting
      }
    }));

    requestData();
  };

  const setPagination = (newPage: number) => {
    page = newPage;
    requestData();
  };

  const setSearch = (newSearch: string) => {
    debounce(() => {
      page = 1;
      search = newSearch;
      requestData();
    }, 750);
  };

  $: {
    options.update((store) => ({ ...store, data }));
  }

  const setFilter = (col: string, newFilter: string) => {
    page = 1;
    filters[col] = newFilter;
    requestData();
  };

  const options = writable<TableOptions<T>>({
    data,
    columns,
    state: {
      sorting
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel()
  });

  const table = createSvelteTable(options);

  onMount(() => {
    host = window.location.host;
  });
</script>

<div>
  <h3 class="h3 mb-2">
    {title}
  </h3>
  <div class="flex flex-col gap-2">
    <div>
      <input
        class="input rounded-md"
        type="search"
        bind:value={search}
        on:input={() => setSearch(search)}
        placeholder="Search all rows..."
      />
    </div>
    <div class="table-container rounded-md">
      <table class="table rounded-md table-hover">
        <thead>
          {#each $table.getHeaderGroups() as headerGroup}
            <tr>
              {#each headerGroup.headers as header}
                <th colSpan={header.colSpan}>
                  <div class="flex flex-col items-start font-semibold">
                    {#if !header.isPlaceholder}
                      <button
                        class="whitespace-nowrap"
                        class:is-disabled={!header.column.getCanSort()}
                        disabled={!header.column.getCanSort()}
                        on:click={header.column.getToggleSortingHandler()}
                      >
                        <svelte:component
                          this={flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          class="whitespace-nowrap"
                        />
                      </button>
                      <!-- @ts-ignore -->
                      {#if header.column.columnDef.meta?.sort}
                        <tr>
                          <td>
                            <input
                              class="input rounded-md h-7 w-max"
                              type="search"
                              bind:value={filters[header.column.id]}
                              on:input={() =>
                                setFilter(
                                  header.column.id,
                                  filters[header.column.id]
                                )}
                              placeholder={`Filter by ${header.column.columnDef.header}...`}
                            />
                          </td>
                        </tr>
                      {/if}
                    {/if}
                  </div>
                </th>
              {/each}
              {#if actionsColumnLabel}
                <th class="w-24 whitespace-nowrap font-semibold"
                  >{actionsColumnLabel}</th
                >
              {/if}
            </tr>
          {/each}
        </thead>
        <tbody>
          {#if $table.getRowModel().rows.length === 0}
            <tr>
              <td colspan={columns.length + 1} class="text-center">
                No data to display.
              </td>
            </tr>
          {/if}
          {#each $table.getRowModel().rows as row}
            <tr>
              {#each row.getVisibleCells() as cell}
                <td>
                  <svelte:component
                    this={flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  />
                </td>
              {/each}
              {#if actionsColumnLabel}
                <td colspan={columns.length + 1}>
                  <slot name="actions" {row} />
                </td>
              {/if}
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <div class="flex items-center gap-4 justify-center">
      <div>
        <button
          class="btn btn-sm variant-filled-primary rounded-md"
          disabled={page <= 1}
          on:click={() => setPagination(1)}>{`<<`}</button
        >
        <button
          class="btn btn-sm variant-filled-primary rounded-md"
          disabled={page <= 1}
          on:click={() => setPagination(page - 1)}
        >
          Previous
        </button>
      </div>
      <span>Page {page}</span>
      <div>
        <button
          class="btn btn-sm variant-filled-primary rounded-md"
          disabled={page >= maxPages}
          on:click={() => setPagination(page + 1)}
        >
          Next
        </button>
        <button
          class="btn btn-sm variant-filled-primary rounded-md"
          disabled={page >= maxPages}
          on:click={() => setPagination(maxPages)}>{`>>`}</button
        >
      </div>
    </div>
  </div>
</div>
