<script lang="ts">
  import type { Placement } from '@floating-ui/dom';
  import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
  import { v4 as uuidv4 } from 'uuid';

  export let placement: Placement = 'bottom';
  export let event: 'click' | 'hover' | 'focus-blur' | 'focus-click' = 'click';

  const POPUP_TARGET = `popupActions-${uuidv4()}`;
  const settings: PopupSettings = {
    event,
    target: POPUP_TARGET,
    placement
  };
</script>

<button use:popup={settings}>
  <slot name="trigger" />
</button>

<div data-popup={POPUP_TARGET} class="z-[500]">
  <slot name="content" />
</div>
