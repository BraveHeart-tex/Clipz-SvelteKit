<script lang="ts">
  import forgotPasswordSchema from '$lib/schemas/ForgotPasswordSchema';
  import type { PageData } from './$types';
  import { Form } from 'formsnap';
  import { type ToastSettings, getToastStore } from '@skeletonlabs/skeleton';
  import { superForm } from 'sveltekit-superforms/client';

  const toastStore = getToastStore();
  export let data: PageData;

  const form = superForm(data.forgotPasswordForm, {
    onResult(event) {
      if (event.result.type === 'success') {
        const successToast: ToastSettings = {
          message: `Password reset link sent! If you don't see the email in your inbox, please check your spam folder.`,
          background: 'variant-filled-success',
          timeout: 7000
        };
        toastStore.trigger(successToast);
      }
    },
    validators: forgotPasswordSchema,
    autoFocusOnError: true
  });

  $: submitting = form.submitting;
</script>

<div class="flex flex-col gap-2">
  <h1 class="h2">Reset Password</h1>
  <p>
    Enter your email address below and we'll send you a link to reset your
    password.
  </p>
</div>

<Form.Root
  {form}
  controlled
  schema={forgotPasswordSchema}
  let:config
  method="POST"
  action="/forgot-password"
>
  <Form.Field {config} name="email">
    <Form.Label>Email</Form.Label>
    <Form.Input class="input rounded-md w-full lg:max-w-[45%]" type="email" />
    <Form.Validation class="text-red-500 font-semibold" />
  </Form.Field>
  <button
    type="submit"
    disabled={$submitting}
    class="mt-2 w-full lg:w-max btn variant-filled-primary rounded-md flex items-center gap-2"
  >
    <i class="fa-solid fa-key"></i>
    {$submitting ? 'Sending...' : 'Reset Password'}
  </button>
</Form.Root>
