<script lang="ts" module>
	import { SvelteMap } from 'svelte/reactivity'
	import { productService } from '$lib/core/services'

	// Each bag product's options and variants, asked once per page visit and shared by the drawer and
	// the bag page. A line's own record names its variant but not which value is the size.
	const products = new SvelteMap<string, unknown>()
	const asked = new Set<string>()

	/** The product behind a bag line, once it has arrived; null until then, or when it cannot. */
	export function lineProduct(line: { slug?: string; variantTitle?: string; addOnId?: unknown; designId?: unknown }): any {
		const slug = line?.slug
		// A line with no options has no size, and an add-on or a made-to-design line is priced or
		// drawn for the variant it is on.
		if (!slug || !line.variantTitle || line.addOnId || line.designId) return null
		if (!asked.has(slug)) {
			asked.add(slug)
			Promise.resolve(productService.getOne(slug))
				.then((product) => products.set(slug, product))
				.catch(() => {})
		}
		return products.get(slug) ?? null
	}
</script>

<script lang="ts">
	import { ChevronDown } from '@lucide/svelte'
	import { toast } from 'svelte-sonner'
	import Spinner from '$lib/components/common/spinner.svelte'
	import { getCartState } from '$lib/core/stores/index.js'
	import { cartService } from '$lib/core/services'
	import { lineSizes } from '$lib/product/size-choice.svelte'

	/**
	 * "Size: M" beside the bag line's quantity, as the big Indian shopping apps have it: a real select
	 * lies invisible over the chip, so a tap opens the phone's own picker (the Qty chip's pattern).
	 * Changing it swaps the line's variant and keeps its quantity; the shopper no longer removes the
	 * line and finds the product again. Nothing shows for a line with no size to change.
	 */
	let { line, class: className = '' }: { line: any; class?: string } = $props()

	const cartState = getCartState()
	const sizes = $derived(lineSizes(lineProduct(line), line))
	let busy = $state(false)

	// The engine changes a line's quantity only, so the new size is added first and the old line
	// removed after: a failure between the two leaves both in the bag, never neither.
	async function change(variantId: unknown) {
		if (!cartState || busy) return
		busy = true
		const cartId = (cartState.cart as any)?.id || cartState.retrieveCartId()
		try {
			cartState.cart = await cartService.addToCart({ cartId, qty: line.qty, productId: line.productId, variantId: String(variantId) } as any)
			cartState.cart = await cartService.updateCart({ cartId, lineId: line.id, qty: 0 } as any)
		} catch (err) {
			toast.error(err instanceof Error && err.message ? err.message : "Couldn't change the size")
		} finally {
			busy = false
		}
	}
</script>

{#if sizes}
	<label
		class="line-size relative inline-flex h-7 items-center gap-1 rounded-sm border border-border bg-background px-2 text-xs font-medium text-foreground transition-colors duration-150 focus-within:ring-2 focus-within:ring-ring hover:bg-muted {busy
			? 'opacity-60'
			: ''} {className}"
		data-testid="line-size"
	>
		<span aria-hidden="true">{sizes.title}:</span>
		{#if busy}
			<Spinner size={3} label="Changing the size" />
		{:else}
			<span class="font-semibold" aria-hidden="true">{sizes.value}</span>
		{/if}
		<ChevronDown class="size-3.5 text-muted-foreground" aria-hidden="true" />
		<select
			class="absolute inset-x-0 top-1/2 h-11 w-full -translate-y-1/2 cursor-pointer opacity-0 disabled:cursor-default"
			aria-label="{sizes.title} of {line.title}"
			value={sizes.value}
			disabled={busy}
			onchange={(e) => {
				const value = e.currentTarget.value
				// Back to the bag's size until the bag itself moves, as the Qty chip does.
				e.currentTarget.value = sizes.value
				const choice = sizes.choices.find((c) => c.value === value)
				if (choice && value !== sizes.value) change(choice.variant.id)
			}}
		>
			{#each sizes.choices as choice (choice.value)}
				<option value={choice.value} disabled={choice.soldOut && choice.value !== sizes.value}
					>{choice.value}{choice.soldOut ? ' (sold out)' : ''}</option
				>
			{/each}
		</select>
	</label>
{/if}

<style>
	.line-size:active {
		transform: scale(0.97);
		transition: transform var(--motion-fast, 150ms) ease;
	}
	@media (prefers-reduced-motion: reduce) {
		.line-size:active {
			transform: none;
		}
	}
</style>
