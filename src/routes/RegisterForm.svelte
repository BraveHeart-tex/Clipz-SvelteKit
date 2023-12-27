<script lang="ts">
  import registerSchema from '$lib/schemas/RegisterSchema';
  import Form from '../lib/components/Form.svelte';
  import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
  import type { Event } from '$lib/types';
  import { page } from '$app/stores';

  export let setSelectedTab: (tab: string) => void;

  const toastStore = getToastStore();

  const toast: ToastSettings = {
    message: 'Successfully registered! You can now login to your account.',
    background: 'variant-filled-success',
    timeout: 5000
  };

  const handleResult = (event: Event) => {
    if (event.result.type === 'success') {
      toastStore.trigger(toast);
      setSelectedTab('login');
    }
  };
</script>

<Form
  schema={registerSchema}
  form={$page?.data?.registerForm}
  action="/register"
  onResult={handleResult}
>
  <button
    type="submit"
    class="btn variant-filled-primary rounded-md mt-4"
    slot="submitButton">Register</button
  >
</Form>
