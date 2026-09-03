<script lang="ts">
	import { LoaderCircle } from '@lucide/svelte'
	import { cn } from '$lib/core/utils'

	/**
	 * The one busy indicator for app-owned surfaces. It replaces the core `loading-dots`
	 * component, whose three dots are sized in `em` at 0.1em each — 1.4px across inside the
	 * checkout button, so the highest-stakes control in the flow read as empty rather than busy
	 * (UX-077).
	 *
	 * `size` is a step on the 4px spacing scale, not a pixel value: 3 = 12px … 10 = 40px. The
	 * classes are looked up from a literal map because Tailwind scans source text, so an
	 * interpolated `size-{n}` would never be generated.
	 *
	 * Note for call sites inside `ui/button`: its base variant carries `[&_svg]:size-4`, which
	 * out-specifies the utility here, so a spinner in a Button always renders at 16px whatever
	 * `size` says. That is the right in-button size; pass `size` for standalone use.
	 */
	const sizes = {
		3: 'size-3',
		4: 'size-4',
		5: 'size-5',
		6: 'size-6',
		8: 'size-8',
		10: 'size-10'
	} as const

	let {
		size = 4,
		label = 'Loading',
		class: className = ''
	}: {
		/** Step on the 4px scale: 3 = 12px, 4 = 16px, 5 = 20px, 6 = 24px, 8 = 32px, 10 = 40px. */
		size?: keyof typeof sizes
		/** Announced to assistive technology; visually hidden. Name the thing that is loading. */
		label?: string
		class?: string
	} = $props()
</script>

<!-- `role="status"` announces the label politely the moment the spinner mounts; `aria-busy` marks
     the region itself as in-flight. Where a Button swaps its whole label out for this, the sr-only
     text also becomes that button's accessible name, so the control is never announced as
     nameless. -->
<span class={cn('spinner inline-flex shrink-0 items-center justify-center', className)} role="status" aria-busy="true">
	<LoaderCircle class={cn('animate-spin', sizes[size])} aria-hidden="true" />
	<span class="sr-only">{label}</span>
</span>

<style>
	/* Slowed rather than stopped: a still spinner would remove the only signal that work is in
	   flight. src/app.css carries the same rule globally for `.animate-spin`; this keeps the
	   component correct on its own if that block is ever narrowed. */
	@media (prefers-reduced-motion: reduce) {
		.spinner :global(svg) {
			animation-duration: 1.6s;
			animation-timing-function: linear;
		}
	}
</style>
