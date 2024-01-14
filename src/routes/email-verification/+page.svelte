<script lang="ts">
  import type { PageData } from './$types';
  import { type ToastSettings, getToastStore } from '@skeletonlabs/skeleton';
  export let data: PageData;

  const toastStore = getToastStore();
  $: email = data.email;
  $: loading = false;

  const handleResendVerificationEmail = async () => {
    loading = true;
    try {
      const response = await fetch('/api/auth/email-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (data?.message) {
        const successToast: ToastSettings = {
          message: data.message,
          background: 'variant-filled-success',
          timeout: 5000
        };

        toastStore.trigger(successToast);
      }
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        const errorToast: ToastSettings = {
          message: error.message,
          background: 'variant-filled-error',
          timeout: 5000
        };

        toastStore.trigger(errorToast);
      }
    } finally {
      loading = false;
    }
  };
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
      disabled={loading}
      on:click={() => {
        handleResendVerificationEmail();
      }}
    >
      <i class="fas fa-envelope"></i>
      {loading ? 'Sending...' : 'Resend Verification Email'}
    </button>
  </div>
</div>
