<script lang="ts">
  import type { Placement } from '@floating-ui/dom';
  import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
  import { cubicOut } from 'svelte/easing';
  import { fly } from 'svelte/transition';
  import { v4 as uuidv4 } from 'uuid';

  export let placement: Placement = 'bottom';
  export let event: 'click' | 'hover' | 'focus-blur' | 'focus-click' = 'click';
  let visible = false;

  const POPUP_TARGET = `popupActions-${uuidv4()}`;
  const settings: PopupSettings = {
    event,
    target: POPUP_TARGET,
    placement,
    state: (e) => {
      visible = e.state;
    }
  };
</script>

<button use:popup={settings} type="button">
  <slot name="trigger" />
</button>

<div
  data-popup={POPUP_TARGET}
  class="z-[500]"
  in:fly={{ duration: 300, easing: cubicOut, y: 50 }}
  out:fly={{ duration: 300, easing: cubicOut, y: 50 }}
>
  <slot name="content" />
</div>
