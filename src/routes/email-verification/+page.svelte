<script lang="ts">
  import type { PageData } from './$types';
  export let data: PageData;

  $: email = data.email;
</script>

<div class="flex flex-col gap-2">
  <h2 class="h2">Verify Your Email Address</h2>
  <p class="w-full lg:max-w-[70%]">
    We've sent a verification link to your email address ({email}) Please check
    your email for a verification link. If you don't see the email, please check
    your spam folder.
  </p>

  <div class="flex flex-col gap-2">
    <p>
      If you need us to send you another verification email, please click the
      button below.
    </p>
    <button
      class="btn variant-filled-primary rounded-md w-max flex items-center gap-2"
      on:click={() => {
        fetch('/api/auth/email-verification/resend', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email })
        });
      }}
    >
      <i class="fas fa-envelope"></i>
      Resend Verification Email
    </button>
  </div>
</div>
