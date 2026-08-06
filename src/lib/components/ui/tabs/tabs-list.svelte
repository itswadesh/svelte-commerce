<!-- TabsList.svelte -->
<script lang="ts">
	import { getContext } from 'svelte'
	import type { createTabs } from './tabs.js'

	type TabsContext = ReturnType<typeof createTabs>

	const { list } = getContext<TabsContext>('tabs')
</script>

<!-- role=tablist is required: the trigger action sets aria-selected, which is only allowed on
	 role=tab, and role=tab in turn requires a tablist parent. -->
<div use:list role="tablist" class="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground" {...$$restProps}>
	<slot />
</div>
