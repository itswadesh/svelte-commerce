<!-- TabsContent.svelte -->
<script lang="ts">
	import { getContext } from 'svelte'
	import { cn } from '$lib/core/utils'
	import type { createTabs } from './tabs.js'

	type TabsContext = ReturnType<typeof createTabs>

	export let value: string

	const { content } = getContext<TabsContext>('tabs')

	let className = ''
	export { className as class }
</script>

<div
	use:content={value}
	class={cn(
		'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
		className
	)}
	{...$$restProps}
>
	<slot />
</div>
