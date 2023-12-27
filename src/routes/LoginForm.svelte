<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import Form from '$lib/components/Form.svelte';
  import { loginSchema } from '$lib/schemas/LoginSchema';
  import type { Event } from '$lib/types';
  import {
    getModalStore,
    getToastStore,
    type ModalSettings,
    type ToastSettings
  } from '@skeletonlabs/skeleton';

  const toastStore = getToastStore();
  const modalStore = getModalStore();

  const toast: ToastSettings = {
    message: 'Login successful',
    background: 'variant-filled-success',
    timeout: 4000
  };

  const onResult = (event: Event) => {
    if (event.result.status === 500) {
      const alertModal: ModalSettings = {
        title: 'Server error',
        body: "We're sorry, but something went wrong. Please try again later.",
        type: 'alert'
      };
      modalStore.clear();
      modalStore.trigger(alertModal);
    }
    if (event.result.type === 'success') {
      toastStore.trigger(toast);
      modalStore.clear();
      setTimeout(() => {
        goto('/');
      }, 0);
    }
  };
</script>

<div class="max-w-[800px]">
  <Form
    form={$page?.data?.loginForm}
    schema={loginSchema}
    action="/login"
    {onResult}
  >
    <button
      type="submit"
      class="btn variant-filled-primary rounded-md mt-2"
      slot="submitButton">Log in</button
    >
  </Form>
</div>
