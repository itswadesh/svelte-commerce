<script lang="ts">
	import { Checkbox as CheckboxPrimitive, type WithoutChildrenOrChild } from 'bits-ui'
  import { Check, Minus } from 'lucide-svelte'
	import { cn } from '$lib/core/utils'

	let {
		ref = $bindable(null),
		class: className,
		checked = $bindable(false),
		...restProps
	}: WithoutChildrenOrChild<CheckboxPrimitive.RootProps> = $props()
</script>

<CheckboxPrimitive.Root
	class={cn(
		'peer box-content size-4 shrink-0 rounded-sm border border-primary shadow data-[disabled=true]:cursor-not-allowed data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[disabled=true]:opacity-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
		className
	)}
	bind:checked
	bind:ref
	{...restProps}
>
	{#snippet children({ checked })}
		<span class="flex size-4 items-center justify-center text-current">
			{#if restProps.indeterminate}
				<Minus class="size-3.5" />
			{:else}
				<Check class={cn('size-3.5', !checked && 'text-transparent')} />
			{/if}
		</span>
	{/snippet}
</CheckboxPrimitive.Root>
