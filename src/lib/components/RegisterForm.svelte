<script lang="ts">
  import { createForm } from 'felte';
  import { validator } from '@felte/validator-zod';
  import {
    getModalStore,
    getToastStore,
    type ToastSettings
  } from '@skeletonlabs/skeleton';
  import { reporter, ValidationMessage } from '@felte/reporter-svelte';
  import type { RegisterSchema } from '$lib/schemas/RegisterSchema';
  import registerSchema from '$lib/schemas/RegisterSchema';
  import { goto } from '$app/navigation';

  const toastStore = getToastStore();

  const { form: customForm } = createForm({
    extend: [validator({ schema: registerSchema }), reporter]
  });
</script>

<form
  use:customForm
  class="grid grid-cols-1 gap-2"
  method="post"
  action="/register"
>
  <div>
    <label class="label" for="email">Full Name</label>
    <input
      class="input rounded-md"
      type="text"
      name="fullName"
      placeholder="John Doe"
    />
    <ValidationMessage for="fullName" let:messages={message}>
      <span class="text-error-500">{message || ''}</span>
    </ValidationMessage>
  </div>
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
  <div>
    <label class="label" for="email">Confirm Password</label>
    <input
      class="input rounded-md"
      type="password"
      name="confirmPassword"
      placeholder="Your password"
    />
    <ValidationMessage for="confirmPassword" let:messages={message}>
      <span class="text-error-500">{message || ''}</span>
    </ValidationMessage>
  </div>
  <button class="btn variant-filled-primary rounded-md" type="submit"
    >Register</button
  >
</form>
