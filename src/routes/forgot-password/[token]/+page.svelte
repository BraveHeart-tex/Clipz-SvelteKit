<script lang="ts">
  import resetPasswordSchema from '$lib/schemas/ResetPasswordSchema';
  import type { PageData } from './$types';
  import { superForm } from 'sveltekit-superforms/client';
  import { Form } from 'formsnap';
  export let data: PageData;

  const form = superForm(data.resetPasswordForm, {
    validators: resetPasswordSchema,
    autoFocusOnError: true
  });

  $: isSubmitting = form.submitting;
</script>

<div class="flex flex-col gap-1">
  <h1 class="h2">Reset Password</h1>
  <p>
    Use the form below to set a new password. Your password must be at least 8
    characters long.
  </p>
</div>

<Form.Root
  {form}
  controlled
  let:config
  schema={resetPasswordSchema}
  class="flex flex-col gap-1"
>
  <Form.Field {config} name="password">
    <Form.Label>Password</Form.Label>
    <Form.Input type="password" class="input rounded-md" />
    <Form.Validation class="text-red-500 font-semibold" />
  </Form.Field>
  <Form.Field {config} name="confirmPassword">
    <Form.Label>Confirm Password</Form.Label>
    <Form.Input type="password" class="input rounded-md" />
    <Form.Validation class="text-red-500 font-semibold" />
  </Form.Field>

  <button
    type="submit"
    disabled={$isSubmitting}
    class="w-max btn variant-filled-primary rounded-md flex items-center gap-2"
  >
    <i class="fa-solid fa-key"></i>
    {$isSubmitting ? 'Submitting...' : 'Reset Password'}
  </button>
</Form.Root>
