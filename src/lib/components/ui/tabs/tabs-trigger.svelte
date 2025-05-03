<!-- TabsTrigger.svelte -->
<script lang="ts">
	import { getContext } from 'svelte'
	import { cn } from '$lib/core/utils'

	export let value: string
	export let disabled = false

	const { trigger } = getContext('tabs')

	let className = ''
	export { className as class }
</script>

<button
	use:trigger={value}
	{disabled}
	class={cn(
		'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
		className
	)}
	{...$$restProps}
>
	<slot />
</button>
