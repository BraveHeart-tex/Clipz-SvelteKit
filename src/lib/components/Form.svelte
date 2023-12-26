<script lang="ts">
  import { cn, generateFormFields } from '$lib';
  import { Form, type SuperValidated } from 'formsnap';
  import type { ZodEffects, ZodObject } from 'zod';

  export let form: SuperValidated<ZodObject<any>>;
  export let schema: ZodObject<any> | ZodEffects<ZodObject<any>>;
  export let formRootClassname = '';

  const formFields = generateFormFields(schema);
</script>

<Form.Root
  {form}
  {schema}
  let:config
  debug={true}
  class={cn('flex flex-col gap-1', formRootClassname)}
>
  {#each formFields as formField}
    <Form.Field {config} name={formField.name}>
      <div class="flex flex-col">
        <Form.Label>{formField.label}</Form.Label>
        <Form.Input type={formField.type} class="input rounded-md" />
        <Form.Validation class="text-red-500 font-semibold" />
      </div>
    </Form.Field>
  {/each}
  <slot name="submitButton" />
</Form.Root>
