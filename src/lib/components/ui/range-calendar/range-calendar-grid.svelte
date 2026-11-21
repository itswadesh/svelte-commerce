<script lang="ts">
	import { RangeCalendar as RangeCalendarPrimitive } from 'bits-ui'
	import { cn } from '$lib/core/utils'

	let { ref = $bindable(null), class: className, ...restProps }: RangeCalendarPrimitive.GridProps = $props()
</script>

<RangeCalendarPrimitive.Grid bind:ref class={cn('w-full border-collapse space-y-1', className)} {...restProps} />
