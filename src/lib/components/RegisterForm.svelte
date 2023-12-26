<script lang="ts">
  import registerSchema from '$lib/schemas/RegisterSchema';
  import Form from './Form.svelte';
  import { page } from '$app/stores';
</script>

<Form schema={registerSchema} form={$page.form}>
  <button
    type="submit"
    class="btn variant-filled-primary rounded-md mt-4"
    slot="submitButton">Register</button
  >
</Form>
