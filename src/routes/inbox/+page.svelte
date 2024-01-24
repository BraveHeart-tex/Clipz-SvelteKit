<script lang="ts">
  import type { PageData } from './$types';
  import { TestClass } from '$lib/services/test';

  export let data: PageData;

  const testClass = new TestClass();
</script>

<h1>
  {$testClass}
</h1>

<button
  class="btn variant-filled-primary"
  on:click={() => testClass.increment()}>Click</button
>
