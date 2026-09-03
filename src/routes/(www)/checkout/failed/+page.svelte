<script lang="ts">
	import { getCartState } from '$lib/core/stores/index.js'
	import { Button } from '$lib/components/ui/button/index.js'
	import { appendOneTimeCartId } from '$lib/core/utils/index.js'
	import { goto } from '$app/navigation'
	import { AlertCircle, ArrowLeft, ShoppingBag } from '@lucide/svelte'
	import LazyImg from '$lib/core/components/image/lazy-img.svelte'
	import Spinner from '$lib/components/common/spinner.svelte'
	import CheckoutHeader from '$lib/components/checkout/checkout-header.svelte'
	import PriceSummary from '$lib/components/checkout/price-summary.svelte'
	import { page } from '$app/state'

	const cartState = getCartState()
	const currencyCode = $derived(page?.data?.store?.currency?.code)
	// `CartLineItem` in the core types carries none of the display fields the API actually returns
	// (title, thumbnail, slug, variantTitle), so the cart step reads its rows loosely too.
	const cart = $derived(cartState?.cart as any)
	const items = $derived((cart?.lineItems ?? []) as any[])

	let retrying = $state(false)

	// The button used to say "Try Payment Again" and then reload the whole app onto the cart, three
	// steps back, so the shopper re-picked the address and the payment method to reach the screen
	// they had just left. The payment step is where the retry belongs, and the one-time cart id is
	// how every other checkout link carries the cart across (UX-090).
	async function retryPayment() {
		retrying = true
		try {
			await goto(appendOneTimeCartId('/checkout/payment'))
		} finally {
			retrying = false
		}
	}
</script>

<!-- No SeoHeader here: a checkout failure page must not emit a canonical URL or share cards.
     The checkout layout already marks the whole tree noindex, nofollow. -->
<svelte:head>
	<title>Payment not completed - {page?.data?.store?.name || ''}</title>
</svelte:head>

<!-- Inside the checkout system, on the same rail and the same surface tokens as every other step.
     This page used to be a hand-written stylesheet of raw hex: its own off-white band that stopped
     mid-page, its own card radius and shadow, and a green retry button whose rules never applied
     because the component scoped them while the class landed on a child (UX-090). -->
<div class="py-8 max-sm:pb-12">
	<div class="page-width">
		<CheckoutHeader step={3} />

		<div class="mx-auto flex max-w-2xl flex-col gap-6">
			<div class="rounded-lg border border-border bg-card p-6 text-center shadow-sm sm:p-8">
				<div class="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-destructive/10">
					<AlertCircle class="size-7 text-destructive" aria-hidden="true" />
				</div>
				<h1 class="text-3xl font-bold tracking-tight text-foreground md:text-4xl">Payment not completed</h1>
				<p class="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
					We weren't able to process your payment. Your order has not been placed and you have not been charged — your bag is exactly as you left it.
				</p>

				<div class="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
					<Button onclick={retryPayment} disabled={retrying} class="h-11 w-full sm:w-auto sm:min-w-52">
						{#if retrying}
							<Spinner label="Opening the payment step" />
							<span>Back to payment</span>
						{:else}
							Back to payment
						{/if}
					</Button>
					<Button variant="outline" href={appendOneTimeCartId('/checkout/cart')} class="h-11 w-full sm:w-auto sm:min-w-52">
						<ArrowLeft class="mr-2 size-4" />
						Review your bag
					</Button>
				</div>

				<p class="mt-5 text-sm text-muted-foreground">
					Still not going through?
					<a href="/contact-us" class="font-semibold text-primary underline-offset-4 hover:underline">Contact us</a>
					and we'll help you finish the order.
				</p>
			</div>

			{#if items.length}
				<div class="rounded-lg border border-border bg-card p-6 shadow-sm">
					<h2 class="text-base font-bold uppercase text-foreground">Order summary</h2>
					<ul class="mt-4 divide-y divide-border">
						{#each items as item (item.id ?? item.slug)}
							<li class="flex gap-3 py-3 text-sm">
								<a
									href={`/products/${item.slug}${item.variant?.id ? `?variant_id=${item.variant.id}` : ''}`}
									class="size-16 shrink-0 overflow-hidden rounded-radius border border-border bg-muted/20 p-1"
								>
									<!-- The shared lazy image already draws its own fallback; the raw <img> here pointed
									     at /images/placeholder.png, which does not exist, so any item without a working
									     thumbnail rendered the browser's broken-image glyph (UX-314). -->
									<LazyImg src={item.thumbnail} alt={item.title} class="size-full object-contain" />
								</a>
								<div class="flex min-w-0 flex-1 flex-col justify-between py-0.5">
									<div>
										<a href={`/products/${item.slug}`} class="line-clamp-2 font-medium text-foreground underline-offset-4 hover:underline">
											{item.title}
										</a>
										{#if item.variantTitle}
											<p class="mt-0.5 text-xs text-muted-foreground">{item.variantTitle}</p>
										{/if}
									</div>
									<p class="text-xs text-muted-foreground">Qty: {item.qty}</p>
								</div>
							</li>
						{/each}
					</ul>

					<div class="mt-4 border-t border-border pt-4">
						<PriceSummary
							subtotal={cart?.subtotal}
							discount={cart?.discountAmount}
							shipping={cart?.shippingCharges}
							tax={cart?.tax}
							total={cart?.total}
							{currencyCode}
							shippingResolved={!!cart?.shippingAddress}
						/>
					</div>
				</div>
			{:else}
				<div class="flex flex-col items-center gap-3 rounded-lg border border-border bg-card p-8 text-center shadow-sm">
					<ShoppingBag class="size-6 text-muted-foreground" aria-hidden="true" />
					<p class="text-sm text-muted-foreground">There is nothing in your bag right now.</p>
					<Button variant="outline" href="/products" class="h-11">Continue shopping</Button>
				</div>
			{/if}
		</div>
	</div>
</div>
