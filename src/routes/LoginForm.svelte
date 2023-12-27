<script lang="ts">
  import { page } from '$app/stores';
  import Form from '$lib/components/Form.svelte';
  import { loginSchema } from '$lib/schemas/LoginSchema';
</script>

<div class="max-w-[800px]">
  <Form form={$page?.data?.loginForm} schema={loginSchema} action="/login">
    <button
      type="submit"
      class="btn variant-filled-primary rounded-md mt-2 w-max"
      slot="submitButton">Log in</button
    >
  </Form>
</div>
