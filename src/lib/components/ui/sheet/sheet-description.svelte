<script lang="ts">
	import { Dialog as SheetPrimitive } from 'bits-ui'
	import { cn } from '$lib/core/utils'

	let { ref = $bindable(null), class: className, ...restProps }: SheetPrimitive.DescriptionProps = $props()
</script>

<SheetPrimitive.Description bind:ref class={cn('text-sm text-muted-foreground', className)} {...restProps} />
