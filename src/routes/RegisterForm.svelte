<script lang="ts">
  import registerSchema from '$lib/schemas/RegisterSchema';
  import { Form } from 'formsnap';
  import { getModalStore } from '@skeletonlabs/skeleton';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import TermsAndConditions from '$lib/components/TermsAndConditions.svelte';
  import Popper from '$lib/components/Popper.svelte';
  import FormButton from '$lib/components/FormButton.svelte';
  import { superForm } from 'sveltekit-superforms/client';

  const modalStore = getModalStore();

  const form = superForm($page?.data?.registerForm, {
    async onResult(event) {
      if (event.result.type === 'success' && event?.result?.data) {
        const email = event.result.data.form.data.email;
        const encodedEmail = btoa(email);
        const url = '/email-verification?email=' + encodedEmail;

        setTimeout(async () => {
          await goto(url);
          modalStore.close();
        });
      }
    },
    validators: registerSchema,
    autoFocusOnError: true
  });

  const isSubmmiting = form.submitting;
</script>

<Form.Root
  {form}
  controlled
  let:config
  schema={registerSchema}
  debug={true}
  class={'flex flex-col gap-1'}
  method="POST"
  action="/auth/register"
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
  <FormButton
    loading={$isSubmmiting}
    type="submit"
    class="btn variant-filled-primary rounded-md mt-4 flex items-center gap-2"
  >
    {$isSubmmiting ? 'Loading...' : 'Register'}
  </FormButton>
</Form.Root>
