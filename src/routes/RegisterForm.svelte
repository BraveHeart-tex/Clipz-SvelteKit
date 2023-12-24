<script lang="ts">
  import { createForm } from 'felte';
  import { validator } from '@felte/validator-zod';
  import {
    getModalStore,
    getToastStore,
    type ToastSettings
  } from '@skeletonlabs/skeleton';
  import { reporter, ValidationMessage } from '@felte/reporter-svelte';
  import { auth } from '$lib/firebase';
  import { createUserWithEmailAndPassword } from 'firebase/auth';
  import type { RegisterSchema } from '$lib/schemas/RegisterSchema';
  import registerSchema from '$lib/schemas/RegisterSchema';

  const { form } = createForm({
    extend: [validator({ schema: registerSchema }), reporter],
    onSubmit: async (values: RegisterSchema) => {
      const { email, password, fullName } = values;
    }
  });

  async function signUpWithGoogle() {}

  async function signUpWithEmailAndPassword({
    email,
    password
  }: {
    email: string;
    password: string;
  }) {
    try {
      createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {}
  }
</script>

<form use:form class="grid grid-cols-1 gap-2">
  <div>
    <label class="label" for="email">Email</label>
    <input
      class="input rounded-md"
      type="email"
      name="email"
      placeholder="Your email address"
    />
    <ValidationMessage for="email" let:messages={message}>
      <span class="text-error-500">{message || ''}</span>
    </ValidationMessage>
  </div>
  <div>
    <label class="label" for="email">Password</label>
    <input
      class="input rounded-md"
      type="password"
      name="password"
      placeholder="Your password"
    />
    <ValidationMessage for="password" let:messages={message}>
      <span class="text-error-500">{message || ''}</span>
    </ValidationMessage>
  </div>
  <button class="btn variant-filled-primary rounded-md" type="submit"
    >Login</button
  >
</form>
