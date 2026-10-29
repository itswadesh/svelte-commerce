<script lang="ts">
	import { page } from '$app/state'
	import { cartService } from '$lib/core/services'
	import { formatPrice } from '$lib/core/utils'
	import LazyImg from '$lib/core/components/image/lazy-img.svelte'
	import { fade } from '$lib/motion'
	import { Check, Plus } from '@lucide/svelte'
	import Spinner from '$lib/components/common/spinner.svelte'

	/**
	 * "You may be interested in" (GoCommerce D133): what the bag's products suggest, less what it
	 * already holds, with a + that adds one. With nothing curated the connector answers the first
	 * item's related products. Re-asked when the bag's products change.
	 */
	let { productIds = '', add }: { productIds?: string; add: (p: { productId: string; variantId: string }) => Promise<unknown> } = $props()

	let products = $state<any[]>([])
	let adding = $state('')
	let added = $state<Record<string, boolean>>({})
	const currencyCode = $derived(page?.data?.store?.currency?.code)

	$effect(() => {
		void productIds
		const svc = cartService as unknown as { listCrossSells?: (q: { limit?: number }) => Promise<any[]> }
		if (typeof svc.listCrossSells !== 'function') return
		let live = true
		svc
			.listCrossSells({ limit: 10 })
			.then((rows) => {
				if (live) products = (rows ?? []).filter((p: any) => p?.variants?.length)
			})
			.catch(() => {
				if (live) products = []
			})
		return () => {
			live = false
		}
	})

	async function quickAdd(p: any) {
		const variant = p.variants.find((v: any) => v.active !== false) ?? p.variants[0]
		adding = p.id
		try {
			await add({ productId: p.id, variantId: variant.id })
			added = { ...added, [p.id]: true }
		} finally {
			adding = ''
		}
	}
</script>

{#if products.length}
	<section class="mt-6" aria-labelledby="bag-suggestions-title" data-testid="cart-cross-sells">
		<h2 id="bag-suggestions-title" class="mb-3 text-sm font-semibold text-foreground">You may be interested in</h2>
		<ul class="ccs-rail -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:scroll-px-0 sm:px-0">
			{#each products as p (p.id)}
				<li class="w-36 shrink-0 snap-start overflow-hidden rounded-radius border border-border bg-background" in:fade>
					<a href={`/products/${p.slug}`} class="relative block aspect-square bg-muted" aria-label={p.title}>
						<LazyImg src={p.thumbnail} alt={p.title} class="h-full w-full object-contain" />
					</a>
					<div class="flex items-end gap-2 p-2">
						<div class="min-w-0 flex-1">
							<p class="line-clamp-2 text-xs text-foreground">{p.title}</p>
							<p class="mt-1 text-xs">
								<span class="font-semibold text-foreground">{formatPrice(p.price, currencyCode)}</span>
								{#if p.mrp > p.price}
									<s class="ml-1 text-muted-foreground">{formatPrice(p.mrp, currencyCode)}</s>
								{/if}
							</p>
						</div>
						<button
							type="button"
							class="ccs-add flex size-11 shrink-0 items-center justify-center rounded-full border border-border bg-background text-foreground hover:bg-muted disabled:opacity-60 sm:size-9"
							aria-label={added[p.id] ? `${p.title} is in your bag` : `Add ${p.title} to bag`}
							disabled={!!adding || added[p.id]}
							onclick={() => quickAdd(p)}
						>
							{#if adding === p.id}
								<Spinner size={4} label="Adding" />
							{:else if added[p.id]}
								<Check class="motion-pop-in size-4 text-success" aria-hidden="true" />
							{:else}
								<Plus class="size-4" aria-hidden="true" />
							{/if}
						</button>
					</div>
				</li>
			{/each}
		</ul>
	</section>
{/if}

<style>
	.ccs-rail {
		scrollbar-width: none;
		list-style: none;
	}
	.ccs-rail::-webkit-scrollbar {
		display: none;
	}
	.ccs-add {
		transition:
			transform var(--motion-fast, 150ms) ease,
			background-color var(--motion-fast, 150ms) ease;
	}
	.ccs-add:active:not(:disabled) {
		transform: scale(0.92);
	}
	@media (prefers-reduced-motion: reduce) {
		.ccs-add:active:not(:disabled) {
			transform: none;
		}
	}
</style>
