<script lang="ts">
  import LoginForm from '../../routes/LoginForm.svelte';
  import RegisterForm from '../../routes/RegisterForm.svelte';
  import { TabGroup, Tab } from '@skeletonlabs/skeleton';

  let selectedTab: string = 'login';

  let tabs = [
    {
      value: 'login',
      label: 'Login'
    },
    {
      value: 'register',
      label: 'Register'
    }
  ];

  const setSelectedTab = (tab: string) => {
    selectedTab = tab;
  };
</script>

<div class="bg-surface-500 w-full max-w-2xl">
  <TabGroup
    rounded="rounded-md"
    hover="hover:variant-soft-primary"
    flex="flex-1"
    active="bg-primary-500"
    regionPanel="p-4"
  >
    {#each tabs as tab}
      <Tab bind:group={selectedTab} name={tab.label} value={tab.value}>
        {tab.label}
      </Tab>
    {/each}
    <!-- Tab Panels --->
    <svelte:fragment slot="panel">
      {#if selectedTab === 'login'}
        <LoginForm />
        <div class="w-full flex items-center mt-4 justify-end">
          <button
            class="btn btn-sm variant-filled-tertiary rounded-md"
            on:click={() => (selectedTab = 'register')}
          >
            Dont have an account? Register
          </button>
        </div>
      {:else if selectedTab === 'register'}
        <RegisterForm {setSelectedTab} />
      {/if}
    </svelte:fragment>
  </TabGroup>
</div>
