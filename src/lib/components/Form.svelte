<script lang="ts">
  import { cn, generateFormFields } from '$lib';
  import type { Event } from '$lib/types';
  import { Form, type SuperValidated } from 'formsnap';
  import { superForm } from 'sveltekit-superforms/client';
  import type { ZodEffects, ZodObject } from 'zod';

  export let form: SuperValidated<ZodObject<any>>;
  export let schema: ZodObject<any> | ZodEffects<ZodObject<any>>;
  export let formRootClassname = '';
  export let action = '';
  export let onResult = (event: Event) => {};

  const formFields = generateFormFields(schema);

  const superFrm = superForm(form, {
    onResult(event) {
      onResult(event);
    }
  });

  const capture = superFrm.capture;
  const restore = superFrm.restore;
  export const snapshot = { capture, restore };
</script>

<Form.Root
  controlled
  form={superFrm}
  {schema}
  let:config
  class={cn('flex flex-col gap-1', formRootClassname)}
  method="POST"
  {action}
>
  {#each formFields as formField}
    <Form.Field {config} name={formField.name}>
      <div class="flex flex-col">
        {#if formField.type === 'checkbox'}
          <div class="flex items-center gap-2">
            <Form.Input type={formField.type} class="checkbox" />
            <p>{formField.label}</p>
          </div>
        {:else}
          <Form.Label>{formField.label}</Form.Label>
          <Form.Input type={formField.type} class="input rounded-md" />
        {/if}
        <Form.Validation class="text-red-500 font-semibold" />
      </div>
    </Form.Field>
  {/each}
  <slot name="submitButton" />
</Form.Root>
