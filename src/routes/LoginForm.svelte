<script lang="ts">
  import { createForm } from 'felte';
  import { validator } from '@felte/validator-zod';
  import { loginSchema, type LoginSchema } from '$lib/schemas/LoginSchema';
  import {
    getModalStore,
    getToastStore,
    type ToastSettings
  } from '@skeletonlabs/skeleton';
  import { reporter, ValidationMessage } from '@felte/reporter-svelte';
  import {
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup
  } from 'firebase/auth';
  import { auth } from '$lib/firebase';

  const toastStore = getToastStore();
  const modalStore = getModalStore();

  const { form } = createForm({
    extend: [validator({ schema: loginSchema }), reporter],
    onSubmit: async (values: LoginSchema) => {
      const { email, password } = values;
      signInWithEmailAndPasswordSSR({ email, password });
    }
  });

  export async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(auth, provider);
    const idToken = await credential.user.getIdToken();

    modalStore.close();

    await fetch('/api/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ idToken })
    });
  }

  async function signInWithEmailAndPasswordSSR({
    email,
    password
  }: {
    email: string;
    password: string;
  }) {
    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(credential);

      const idToken = await credential.user.getIdToken();

      await fetch('/api/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ idToken })
      });
    } catch (error) {
      const toast: ToastSettings = {
        message: 'Invalid email or password.',
        timeout: 5000,
        background: 'variant-filled-error',
        hoverable: true,
        classes: 'z-[1000]'
      };
      toastStore.trigger(toast);
    }
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
  <button
    class="btn variant-filled-secondary rounded-md flex items-center gap-1"
    type="button"
    on:click={signInWithGoogle}
  >
    <i class="fa-brands fa-google"></i>
    Sign in with Google
  </button>
</form>
