<script lang="ts">
	import { page } from '$app/state'
	import { useProductState } from '$lib/core/composables/index.js'
	import { ChevronDown } from '@lucide/svelte'
	import { slide } from 'svelte/transition'
	import { prefersReducedMotion } from 'svelte/motion'

	const productState = useProductState()
	const data = $derived(page.data)
	const description = $derived(productState.selectedVariant?.description || data?.product?.description || '')
	const hasDescription = $derived(
		description
			.replace(/<[^>]*>/g, '')
			.replace(/&nbsp;/gi, '')
			.trim().length > 0
	)

	let isOpen = $state(true)

	// One panel duration for both PDP accordions (the project's panel budget is 180-240ms), and
	// zero for anyone who asked the OS for reduced motion — the panel then swaps instantly instead
	// of sliding. Same constant, same import, in product-specifications.svelte.
	const panelMs = $derived(prefersReducedMotion.current ? 0 : 200)
</script>

{#if hasDescription}
	<div class="edp-acc border-b" data-testid="product-description">
		<!-- aria-expanded/aria-controls: the open state was previously conveyed only by a swapped
		     icon, so a screen reader announced an unlabelled button with no state and no link to
		     the region it controls. -->
		<button
			type="button"
			class="edp-acc-btn flex min-h-11 w-full items-center justify-between gap-3 py-2.5 text-left md:min-h-10"
			aria-expanded={isOpen}
			aria-controls="product-description-panel"
			onclick={() => (isOpen = !isOpen)}
		>
			<span class="edp-acc-label text-sm font-semibold text-foreground">Product Description</span>

			<!-- One chevron that rotates, not two that swap: the swap gave the icon no state to
			     animate between, which is what read as "no animation". -->
			<ChevronDown
				class="size-4 shrink-0 text-muted-foreground transition-transform duration-panel ease-standard motion-reduce:transition-none {isOpen
					? 'rotate-180'
					: ''}"
				aria-hidden="true"
			/>
		</button>

		{#if isOpen}
			<div id="product-description-panel" class="overflow-hidden" transition:slide={{ duration: panelMs }}>
				<div
					class="edp-prose prose prose-sm max-w-none pb-4 leading-relaxed text-muted-foreground prose-headings:text-foreground prose-strong:text-foreground prose-li:list-disc [&>table]:w-full [&>table]:border-collapse [&_td]:border-b [&_td]:py-2 [&_td]:text-sm [&_th]:border-b [&_th]:py-2 [&_th]:text-left [&_th]:text-xs [&_th]:font-medium [&_th]:text-muted-foreground"
				>
					{@html description}
				</div>
			</div>
		{/if}
	</div>
{/if}

<style>
	/* Refined Editorial — default theme only. */
	:global([data-theme='default'] .edp-acc) {
		border-bottom: 1px solid var(--ed-line);
	}

	:global([data-theme='default'] .edp-acc-label) {
		font-family: var(--ed-body);
		font-size: 0.78rem;
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--ed-ink);
	}

	:global([data-theme='default'] .edp-prose) {
		color: var(--ed-soft);
		/* 14.4px / 1.6 — inside the 14-16px body band. Was 0.92rem/1.7, which read as a long
		   loose column next to a compact buy box. */
		font-size: 0.9rem;
		line-height: 1.6;
	}

	:global([data-theme='default'] .edp-prose :is(h1, h2, h3, h4, strong)) {
		color: var(--ed-ink);
	}
</style>
