<script lang="ts">
  import type { PageData } from './$types';
  import { TabGroup, Tab, TabAnchor } from '@skeletonlabs/skeleton';

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
        {#each pendingRequests as pendingRequest}
          {pendingRequest?.title}
        {/each}
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
