<script lang="ts">
  import registerSchema from '$lib/schemas/RegisterSchema';
  import { Form } from 'formsnap';
  import {
    getToastStore,
    type ToastSettings,
    getModalStore
  } from '@skeletonlabs/skeleton';
  import type { Event } from '$lib/types';
  import { page } from '$app/stores';
  import { superForm } from 'sveltekit-superforms/client';
  import TermsAndConditions from '$lib/components/TermsAndConditions.svelte';
  import Popper from '$lib/components/Popper.svelte';

  const toastStore = getToastStore();
  const modalStore = getModalStore();

  const toast: ToastSettings = {
    message:
      'Success! To complete your registration, please check your email for a confirmation link.',
    background: 'variant-filled-success',
    timeout: 6000
  };

  const handleResult = (event: Event) => {
    if (event.result.type === 'success') {
      modalStore.clear();
      toastStore.trigger(toast);
    }
  };

  const superFrm = superForm($page?.data?.registerForm, {
    onResult(event) {
      handleResult(event);
    }
  });

  const capture = superFrm.capture;
  const restore = superFrm.restore;
  export const snapshot = { capture, restore };
</script>

<Form.Root
  form={superFrm}
  schema={registerSchema}
  controlled
  let:config
  debug={true}
  class={'flex flex-col gap-1'}
  method="POST"
  action="/register"
>
  <Form.Field {config} name={'fullName'}>
    <Form.Label>Name</Form.Label>
    <Form.Input type="text" class="input rounded-md" />
    <Form.Validation class="text-red-500 font-semibold" />
  </Form.Field>
  <Form.Field {config} name={'email'}>
    <Form.Label>Email</Form.Label>
    <Form.Input type="email" class="input rounded-md" />
    <Form.Validation class="text-red-500 font-semibold" />
    <Form.Description>
      Please use a valid email address. It will be used to send you a
      confirmation email.
    </Form.Description>
  </Form.Field>
  <Form.Field {config} name={'password'}>
    <Form.Label>Password</Form.Label>
    <Form.Input type="password" class="input rounded-md" />
    <Form.Validation class="text-red-500 font-semibold" />
  </Form.Field>
  <Form.Field {config} name={'confirmPassword'}>
    <Form.Label>Confirm Password</Form.Label>
    <Form.Input type="password" class="input rounded-md" />
    <Form.Validation class="text-red-500 font-semibold" />
  </Form.Field>
  <Form.Field {config} name={'termsAndConditions'}>
    <div class="flex items-center gap-2">
      <Form.Checkbox type="checkbox" class="checkbox" />
      <p>
        I agree to the <Popper placement="bottom">
          <span slot="trigger" class="underline">Terms and Conditions</span>
          <div slot="content">
            <TermsAndConditions />
          </div>
        </Popper>
      </p>
    </div>
    <Form.Validation class="text-red-500 font-semibold" />
  </Form.Field>
  <button type="submit" class="btn variant-filled-primary rounded-md mt-4"
    >Register</button
  >
</Form.Root>
