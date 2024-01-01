<script lang="ts">
  import DataTable from '$lib/components/DataTable.svelte';
  import type { PageData } from './$types';
  import { TabGroup, Tab } from '@skeletonlabs/skeleton';

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
  export let data: PageData;

  $: pendingRequests = data.pendingRequests || [];
  $: openTickets = data.openTickets || [];
</script>

<h1 class="h2">Admin Page</h1>
<p>Review pending video requests, manage tickets, and more.</p>

<div class="mt-4">
  <TabGroup>
    {#each tabs as tab}
      <Tab bind:group={selectedTab} name={tab.label} value={tab.value}>
        <span class="flex items-center gap-2">
          {@html tab.icon} {tab.label}</span
        >
      </Tab>
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
            },
            {
              accessorKey: 'url',
              header: 'URL',
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
            >
              <i class="fa-solid fa-video"></i>
              Watch
            </button>
            <button
              class="flex items-center gap-2 btn variant-filled-error rounded-md btn-sm p-2"
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
