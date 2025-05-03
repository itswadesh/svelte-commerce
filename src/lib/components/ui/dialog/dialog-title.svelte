<script lang="ts">
	import { Dialog as DialogPrimitive } from 'bits-ui'
	import { cn } from '$lib/core/utils'

	let { ref = $bindable(null), class: className, ...restProps }: DialogPrimitive.TitleProps = $props()
</script>

<DialogPrimitive.Title bind:ref class={cn('text-lg font-semibold leading-none tracking-tight', className)} {...restProps} />
