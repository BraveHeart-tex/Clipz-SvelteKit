<script lang="ts">
  import LoginForm from '../../routes/LoginForm.svelte';
  import RegisterForm from '../../routes/RegisterForm.svelte';
  import { TabGroup, Tab } from '@skeletonlabs/skeleton';
  import { getModalStore } from '@skeletonlabs/skeleton';

  const modalStore = getModalStore();
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
</script>

<div class="dark:bg-surface-500 bg-surface-200 w-full max-w-2xl">
  <TabGroup
    rounded="rounded-md"
    hover="hover:variant-soft-primary"
    flex="flex-1"
    active="rounded-sm variant-filled-primary font-semibold"
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
        <div class="w-full flex items-center mt-4 justify-between">
          <a
            class="text-sm font-semibold hover-underline-animation"
            href="/forgot-password"
            on:click={() => modalStore.clear()}
          >
            Forgot your password?
          </a>
          <button
            class="btn btn-sm variant-filled-tertiary rounded-md"
            on:click={() => (selectedTab = 'register')}
          >
            Dont have an account? Register
          </button>
        </div>
      {:else if selectedTab === 'register'}
        <RegisterForm />
      {/if}
    </svelte:fragment>
  </TabGroup>
</div>
