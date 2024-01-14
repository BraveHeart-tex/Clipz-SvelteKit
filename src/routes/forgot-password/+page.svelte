<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;

  $: email = '';
</script>

<div class="flex flex-col gap-2">
  <h1 class="h2">Reset Password</h1>
  <p>
    Enter your email address below and we'll send you a link to reset your
    password.
  </p>
</div>

<form class="mt-4 grid grid-cols-1 gap-2" action="/forgot-password">
  <div>
    <label class="label" for="email"> Email </label>
    <input
      class="input rounded-md w-full lg:max-w-[50%]"
      type="email"
      name="email"
      id="email"
      bind:value={email}
    />
  </div>

  <button class="w-full lg:w-max btn variant-filled-primary rounded-md"
    >Send Reset Link</button
  >
</form>
