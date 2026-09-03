<script lang="ts" module>
	import type { WithElementRef } from 'bits-ui'
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements'
	import { type VariantProps, tv } from 'tailwind-variants'

	// Focus: no local focus style. The storefront has exactly one focus indicator, the global
	// `:focus-visible` rule in src/app.css (2px of --ring, 2px offset). The default theme used to
	// cancel it on buttons, because `.ed-btn-base` set `box-shadow: none` and the ring paints as a
	// box-shadow; that rule is now scoped to `:not(:focus-visible)` so the shared ring comes
	// through. Keep this string short: `tv()` infers it as a literal type, and the consumers that
	// pass its output into a bits-ui prop (pagination, range-calendar) sit close enough to
	// TypeScript's union-complexity ceiling that a few extra classes here tip them over it.
	export const buttonVariants = tv({
		base: 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-radius text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
		variants: {
			variant: {
				default: 'bg-primary text-primary-foreground shadow',
				destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm',
				outline: 'border-input bg-background border shadow-sm',
				secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm',
				ghost: 'hover:border-primary border border-transparent hover:text-primary',
				link: 'text-primary underline-offset-4 hover:underline',
				plain: ''
			},
			size: {
				default: 'h-9 px-4 py-2',
				sm: 'h-8 rounded-radius px-3 text-xs',
				lg: 'h-10 rounded-radius px-8',
				// An icon button is the whole target, so it carries the density rule itself: 44px on
				// phones for header, card, stepper and checkout actions, the compact 36px box from md
				// up. Written as a `max-md:` bump on top of h-9/w-9 rather than the mobile-first pair,
				// so a call site that overrides the size with `h-8 w-8` keeps its desktop size (a
				// trailing `md:h-9` would silently win over it) and still gets the mobile target.
				// `w-9` stays spelled out because app.css targets icon buttons as `.ed-btn-base.w-9`.
				icon: 'h-9 w-9 max-md:size-11'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'default'
		}
	})

	export type ButtonVariant = VariantProps<typeof buttonVariants>['variant']
	export type ButtonSize = VariantProps<typeof buttonVariants>['size']

	export type ButtonProps = WithElementRef<HTMLButtonAttributes> &
		WithElementRef<HTMLAnchorAttributes> & {
			variant?: ButtonVariant
			size?: ButtonSize
		}
</script>

<script lang="ts">
	import { cn } from '$lib/core/utils/index.js'

	let {
		class: className,
		variant = 'default',
		size = 'default',
		ref = $bindable(null),
		href = undefined,
		type = 'button',
		children,
		...restProps
	}: ButtonProps = $props()
</script>

{#if href}
	<a bind:this={ref} class={cn('ed-btn-base', buttonVariants({ variant, size }), className)} {href} {...restProps}>
		{@render children?.()}
	</a>
{:else}
	<button bind:this={ref} class={cn('ed-btn-base', buttonVariants({ variant, size }), className)} {type} {...restProps}>
		{@render children?.()}
	</button>
{/if}
