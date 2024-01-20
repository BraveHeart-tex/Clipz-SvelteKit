<script lang="ts">
  import DataTable from '$lib/components/DataTable.svelte';
  import { VideoStatus, type Video } from '@prisma/client';
  import type { PageData } from './$types';
  import {
    TabGroup,
    getModalStore,
    getToastStore,
    type ModalSettings
  } from '@skeletonlabs/skeleton';
  import Popper from '$lib/components/Popper.svelte';
  import { handleAdminReviewAction } from '$lib/admin';
  import AdminWatchVideo from '$lib/components/AdminWatchVideo.svelte';

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

  const actions = [
    {
      icon: '<i class="fa-solid fa-play"></i>',
      label: 'Watch',
      onClick: (row: Video) => {
        handleWatch(row);
      }
    },
    {
      icon: '<i class="fa-solid fa-check"></i>',
      label: 'Approve',
      onClick: (row: Video) => {
        handleApprove(row);
      }
    }
  ];

  const handleApprove = (row: Video) => {
    handleAdminReviewAction({
      row,
      action: 'Approve',
      errorMessage: 'There was an error approving the video request.',
      modalStore,
      toastStore,
      status: VideoStatus.PUBLISHED,
      successMessage: 'Video request approved.'
    });
  };

  const handleReject = (row: Video) => {
    handleAdminReviewAction({
      row,
      action: 'Reject',
      errorMessage: 'There was an error rejecting the video request.',
      modalStore,
      toastStore,
      status: VideoStatus.REJECTED,
      successMessage: 'Video request rejected.'
    });
  };

  const handleWatch = (row: Video) => {
    const watchModal: ModalSettings = {
      type: 'component',
      component: { ref: AdminWatchVideo, props: { video: row } }
    };

    modalStore.trigger(watchModal);
  };

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
            class="absolute bg-primary-500 bottom-0 h-[2px] z-1 w-full"
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
          <div slot="actions" let:row>
            <Popper>
              <div
                slot="trigger"
                class="p-2 hover:bg-surface-100 dark:hover:bg-surface-500 rounded-lg inline-flex items-center z-[500]"
              >
                <i class="fa-solid fa-ellipsis-vertical"></i>
              </div>
              <div slot="content" class="card p-4 w-72 shadow-xl">
                {#each actions as action}
                  <button
                    class="w-full btn flex items-center gap-1 justify-start hover:bg-surface-200 dark:hover:bg-surface-600 rounded-md"
                    on:click={(event) => {
                      // @ts-ignore
                      action.onClick(row.original);
                    }}
                  >
                    {@html action.icon}
                    <span>{action.label}</span>
                  </button>
                {/each}
              </div>
            </Popper>
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
