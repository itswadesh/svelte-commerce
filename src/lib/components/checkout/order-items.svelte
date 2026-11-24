<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import { Pencil } from '@lucide/svelte'
	import { formatPrice } from '$lib/utils/price'
	import { appendOneTimeCartId } from '$lib/core/utils/index.js'
	import LazyImg from '$lib/core/components/image/lazy-img.svelte'
	import { linePicture } from '$lib/customizer/line'

	// The items being bought, as the review step and the one-page checkout (GoCommerce D328) list them.
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const { cart, currencyCode = '' }: { cart: any; currencyCode?: string } = $props()

	const selectedItems = $derived(cart?.lineItems?.filter((i: any) => i.isSelectedForCheckout) || [])
</script>

<div class="rounded-lg border border-border bg-background p-3 sm:p-6">
	<div class="flex items-center justify-between border-b border-border pb-2 sm:pb-3">
		<h2 class="text-base font-bold text-foreground" style="font-family: var(--font-body);">
			Items ({selectedItems.length})
		</h2>
		<Button variant="ghost" size="sm" href={appendOneTimeCartId('/checkout/cart')} class="hit-44 h-7 px-2 text-primary hover:text-primary/80 max-md:min-h-0">
			<Pencil class="mr-1 size-3.5" /> Edit
		</Button>
	</div>
	<div class="divide-y divide-border">
		{#each selectedItems as item}
			{@const picture = linePicture(item)}
			<div class="flex gap-3 py-2 text-sm sm:py-3">
				<div class="relative size-14 shrink-0 sm:size-16 overflow-hidden rounded-radius border border-border bg-muted/20 p-1">
					<!-- The shared lazy image draws its own fallback. The raw <img> here fell back to
					     /placeholder.svg, which does not exist, so an item with no thumbnail rendered the
					     browser's broken-image glyph on the last screen before paying (UX-314). -->
					<LazyImg src={picture.src} alt={picture.alt} class="size-full object-contain" />
				</div>
				<div class="flex min-w-0 flex-1 flex-col justify-between py-1">
					<div>
						<p class="line-clamp-2 font-medium text-foreground">{item.title}</p>
						{#if picture.designed}<p class="mt-0.5 text-xs font-medium text-foreground">Your design</p>{/if}
						<!-- Two sizes of the same product are otherwise two identical rows here (UX-315). -->
						{#if item.variantTitle}
							<p class="text-xs text-muted-foreground">{item.variantTitle}</p>
						{/if}
						<p class="text-xs text-muted-foreground">Qty: {item.qty}</p>
					</div>
					<p class="font-bold text-foreground">
						{formatPrice(item.price * item.qty, currencyCode)}
					</p>
				</div>
			</div>
		{/each}
	</div>
</div>
