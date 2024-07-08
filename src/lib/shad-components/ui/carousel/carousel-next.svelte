<script lang="ts">
import { Button, type Props, buttonVariants } from '$lib/shad-components/ui/button/index.js'
import { cn } from '$lib/shad-components/utils'
import type { VariantProps } from 'tailwind-variants'
import { getEmblaContext } from './context.js'

type $$Props = Props

let className: $$Props['class'] = undefined
export { className as class }
export let variant: VariantProps<typeof buttonVariants>['variant'] = 'outline'
export let size: VariantProps<typeof buttonVariants>['size'] = 'icon'
const { orientation, canScrollNext, scrollNext, handleKeyDown } =
	getEmblaContext('<Carousel.Next/>')
</script>

<Button
	{variant}
	{size}
	class="{cn(
		'absolute h-8 w-8 touch-manipulation bg-white hover:bg-white/50 p-2 border rounded-full flex items-center justify-center',
		$orientation === 'horizontal'
			? 'right-4 top-1/2 -translate-y-1/2'
			: 'bottom-4 left-1/2 -translate-x-1/2 rotate-90',
		className
	)}"
	disabled="{!$canScrollNext}"
	on:click="{scrollNext}"
	on:keydown="{handleKeyDown}"
	{...$$restProps}>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke-width="1.5"
		stroke="currentColor"
		class="w-6 h-6">
		<path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"></path>
	</svg>

	<span class="sr-only">Next slide</span>
</Button>
