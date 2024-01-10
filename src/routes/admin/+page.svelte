<script lang="ts">
  import DataTable from '$lib/components/DataTable.svelte';
  import type { Video } from '@prisma/client';
  import type { PageData } from './$types';
  import {
    TabGroup,
    type ModalSettings,
    getModalStore,
    type ToastSettings,
    getToastStore
  } from '@skeletonlabs/skeleton';
  import { invalidate } from '$app/navigation';

  export let data: PageData;

  const modalStore = getModalStore();
  const toastStore = getToastStore();
  let selectedTab: number = 0;

  const tabs = [
    {
      label: 'Pending Requests',
      icon: '<i class="fa-solid fa-user-clock"></i>',
      value: 0
    },
    {
      label: 'Tickets',
      icon: '<i class="fa-solid fa-ticket"></i>',
      value: 1
    }
  ];

  const handleReject = (row: Video) => {
    const confirmationModal: ModalSettings = {
      type: 'confirm',
      title: 'Reject Video Request',
      body: `Are you sure you want to reject the video request titled "${row.title}"?`,
      buttonTextCancel: 'No',
      buttonTextConfirm: 'Yes',
      async response(r) {
        if (r) {
          try {
            await fetch(`/api/admin/requests/${row.id}`, {
              method: 'DELETE'
            });
            invalidate('app:admin');
            toastStore.trigger({
              message: 'Video request rejected.',
              background: 'variant-filled-success',
              timeout: 4000
            });
          } catch (error) {
            console.error(error);
            const toast: ToastSettings = {
              message: 'There was an error rejecting the video request.',
              background: 'variant-filled-error',
              timeout: 4000
            };
            toastStore.trigger(toast);
          }
        }
      }
    };

    modalStore.trigger(confirmationModal);
  };

  const handleWatch = (row: Video) => {};

  $: pendingRequests = data?.pendingRequests || [];
  $: openTickets = data?.openTickets || [];
</script>

<h1 class="h2">Admin Page</h1>
<p>Review pending video requests, manage tickets, and more.</p>

<div class="mt-4">
  <TabGroup>
    {#each tabs as tab}
      <button
        type="button"
        class="px-4 py-2 btn relative hover:bg-surface-400/25 dark:hover:bg-surface-800 rounded-md"
        name={tab.label}
        on:click={() => {
          document.startViewTransition(() => {
            selectedTab = tab.value;
          });
        }}
        aria-label={`Switch selected tab to ${tab.label}`}
      >
        <span class="flex items-center gap-2 relative">
          {@html tab.icon}
          {tab.label}
        </span>
        {#if selectedTab === tab.value}
          <div
            aria-current="step"
            class="absolute bg-primary-500 bottom-0 h-[2px] z-10 w-full"
          />
        {/if}
      </button>
    {/each}
    <svelte:fragment slot="panel">
      {#if selectedTab === 0}
        <!-- Pending Requests -->
        <DataTable
          columns={[
            {
              accessorKey: 'title',
              header: 'Title',
              meta: {
                sort: true
              }
            },
            {
              accessorKey: 'description',
              header: 'Description',
              meta: {
                sort: true
              }
            }
          ]}
          data={pendingRequests}
          title="Pending Video Requests"
          apiPath="/api/admin/tickets"
          actionsColumnLabel="Actions"
        >
          <div class="flex items-center gap-2" slot="actions" let:row>
            <button
              class="flex items-center gap-2 btn variant-filled-secondary rounded-md btn-sm p-2"
              on:click={() => {
                // @ts-ignore
                handleWatch(row.original);
              }}
            >
              <i class="fa-solid fa-video"></i>
              Watch
            </button>
            <button
              class="flex items-center gap-2 btn variant-filled-error rounded-md btn-sm p-2"
              on:click={() => {
                // @ts-ignore
                handleReject(row.original);
              }}
            >
              <i class="fa-solid fa-xmark"></i>
              Reject
            </button>
            <button
              class="flex items-center gap-2 btn variant-filled-primary rounded-md btn-sm p-2"
              on:click={() => {
                console.log(row.original);
              }}
            >
              <i class="fa-solid fa-check"></i>
              Approve
            </button>
          </div>
        </DataTable>
      {:else if selectedTab === 1}
        <!-- Open Tickets -->
        {#if openTickets.length === 0}
          <p>No open tickets were found.</p>
        {:else}
          Tickets with datatable
        {/if}
      {/if}
    </svelte:fragment>
  </TabGroup>
</div>
