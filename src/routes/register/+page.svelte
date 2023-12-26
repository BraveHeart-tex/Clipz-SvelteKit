<script lang="ts">
  import registerSchema from '$lib/schemas/RegisterSchema';
  import type { PageData } from './$types';
  import Form from '$lib/components/Form.svelte';

  export let data: PageData;
</script>

<div class="max-w-[1200px]">
  <Form form={data.form} schema={registerSchema}>
    <button class="btn variant-filled-primary" slot="submitButton">Save</button>
  </Form>
</div>
