<script lang="ts">
	import '../app.postcss';
	import { AppBar, AppShell } from '@skeletonlabs/skeleton';
</script>

<AppShell slotSidebarLeft="w-52 bg-surface-500/10 p-4">
	<svelte:fragment slot="header">
		<AppBar>Header</AppBar>
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
		<div id="sidebar-left" class="hidden lg:block">Sidebar Left</div>
	</svelte:fragment>
	<div class="container p-10 mx-auto">
		<slot />
	</div>
	<svelte:fragment slot="pageFooter">Page Footer</svelte:fragment>
</AppShell>
