<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import { AlertCircle, Check, LockKeyhole, Minus, Plus, ShoppingBag, Tag, Trash2, X } from '@lucide/svelte'
	import { formatPrice } from '$lib/core/utils'
	import Spinner from '$lib/components/common/spinner.svelte'
	import { Skeleton } from '$lib/components/ui/skeleton/index.js'
	import { page } from '$app/state'
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte'
	import OrderTrustBadges from '$lib/core/components/plugins/order-trust-badges.svelte'
	import CouponsDrawer from '$lib/components/coupon/coupons-drawer.svelte'
	import { CartModule } from '$lib/core/composables/index.js'
	import CheckoutHeader from '$lib/components/checkout/checkout-header.svelte'
	import PriceSummary from '$lib/components/checkout/price-summary.svelte'
	import LazyImg from '$lib/core/components/image/lazy-img.svelte'
	import { tweened } from 'svelte/motion'
	import { cubicOut } from 'svelte/easing'
	import CheckoutButton from '$lib/components/buttons/checkout-button.svelte'
	import { toast } from 'svelte-sonner'
	import { onMount } from 'svelte'

	const cartModule = new CartModule()
	const cartState = cartModule.cartState

	// Keyed by line id, matching the store: cart.svelte.js resolves `lineId = cart_item?.id` and
	// flips `updatingItem[lineId]` around each mutation. Wrapped in a typed accessor because the
	// connector's CartLineItem type resolves without its own fields in this file — the same drift
	// that makes `item.qty`, `item.price` and `item.mrp` error throughout.
	// `any` on purpose: the connector's CartLineItem type resolves without its own fields in this
	// file, so a structural type here is rejected as having "no properties in common" with it.
	const isUpdating = (item: any) => !!cartState.updatingItem[item?.id]

	// Tell a failed load apart from a genuinely empty bag.
	//
	// The shared cart store catches its own hydration failure, logs "bag may display empty" and
	// resolves anyway, so a dropped connection, an expired session or a server error all landed in
	// the empty-bag branch. A shopper who had added items was told the bag was empty, with no
	// message, no retry and no sign anything had failed. Re-adding everything or abandoning the
	// purchase is the reasonable response to that.
	//
	// The store keeps its cart id in localStorage, so a stored id with no cart behind it is exactly
	// the failure case the store swallowed. `reload` counts retries and re-runs the store's own
	// hydration.
	let reloads = $state(0)
	let cartLoadFailed = $state(false)

	function detectFailedLoad() {
		if (typeof window === 'undefined') return
		let storedCartId: string | null = null
		try {
			storedCartId = window.localStorage.getItem('cart_id')
		} catch {
			// Storage blocked; there is no id to contradict, so treat it as a genuinely empty bag.
		}
		// `any` view for the same reason the rest of this file uses one: the connector's CartExtended
		// type resolves here without its own fields.
		cartLoadFailed = !!storedCartId && !(cartState.cart as any)?.id
	}

	// The store's promise resolves whether hydration succeeded or not, so the check has to happen
	// after it settles rather than during render.
	onMount(async () => {
		try {
			await cartState.hasLoaded
		} catch {
			// Resolved or rejected, the check below is what decides.
		}
		detectFailedLoad()
	})

	async function retryCartLoad() {
		cartLoadFailed = false
		reloads += 1
		try {
			await (cartState as any).setState?.()
		} catch {
			// Swallowed the same way the store does; detectFailedLoad decides what to show.
		}
		detectFailedLoad()
	}
	const discountCouponsPlugin = $derived(page?.data?.store?.plugins?.isDiscountCoupons)

	// Removing a line is one tap with no dialog, so offer an undo instead of a blocking confirm.
	function removeItem(e: Event, item: any) {
		cartModule.removeItem(e, item)
		toast('Removed from your bag', {
			action: {
				label: 'Undo',
				onClick: () =>
					cartState?.add({
						qty: item.qty,
						productId: item.productId,
						variantId: item.variantId
					})
			}
		})
	}

	const totalSavings = $derived(
		(cartState.cart?.lineItems || []).reduce((acc, item) => acc + Math.max(0, (item.mrp || item.price) - item.price) * item.qty, 0) +
			(cartState.cart?.discountAmount || 0)
	)

	// Shown twice — the summary row and the pinned mobile bar — and `total` is absent from the
	// resolved CartExtended type here, the same drift as the line-item fields above, so it is read
	// through an `any` view once.
	const cartTotal = $derived(formatPrice((cartState.cart as any)?.total, page?.data?.store?.currency?.code))

	const animatedSavings = tweened(0, {
		duration: 1000,
		easing: cubicOut
	})

	$effect(() => {
		animatedSavings.set(totalSavings)
	})

	// One busy flag for the whole page. `cartModule.loadingForCart` is declared in the core
	// composable and never assigned, so the branch that used it was unreachable and the summary kept
	// asserting the old figures at full contrast while a quantity change was still in flight — a
	// shopper could start checkout against a total that had already moved. The store does flip
	// `updatingItem[lineId]` around every line mutation, so that map plus `isUpdatingCart` is the
	// honest answer.
	const isBusy = $derived(!!cartState.isUpdatingCart || Object.values(cartState.updatingItem || {}).some(Boolean))

	// Until a shipping address exists the shipping cost is unknown, so the bottom line is an
	// estimate. Naming it "Total" one row under "Address required" was the defect.
	const shippingResolved = $derived(!!cartState.cart?.shippingAddress)

	const currencyCode = $derived(page?.data?.store?.currency?.code)
	const cartSubtotal = $derived(formatPrice(cartState.cart?.subtotal, currencyCode))
</script>

<!-- One stepper geometry for the whole storefront: `size="icon"` is 44px on phones and the compact
     36px box from md up, which is what the drawer row uses too. The two surfaces used to disagree
     by half — 22px in the drawer against 40px here — so one shopper got two steppers for one job. -->
{#snippet quantitySelector(item: any)}
	<div class="flex items-center rounded-radius border border-border bg-background">
		<Button
			variant="ghost"
			size="icon"
			onclick={(e) => cartModule.decreaseQty(e, item)}
			disabled={isUpdating(item) || item.qty <= 1}
			class="rounded-r-none border-0"
			aria-label="Decrease quantity of {item.title}"
		>
			<Minus class="size-4" />
		</Button>
		<span
			class="flex min-w-[2.25rem] items-center justify-center px-1 text-sm font-semibold tabular-nums text-foreground"
			aria-live="polite"
			aria-atomic="true"
		>
			{#if isUpdating(item)}
				<Spinner size={4} label="Updating quantity" />
			{:else}
				{item.qty}
			{/if}
		</span>
		<Button
			variant="ghost"
			size="icon"
			class="rounded-l-none border-0"
			aria-label="Increase quantity of {item.title}"
			disabled={isUpdating(item)}
			onclick={(e) => cartModule.increaseQty(e, item)}
		>
			<Plus class="size-4" />
		</Button>
	</div>
{/snippet}

{#snippet removeButton(item: any)}
	<Button
		variant="ghost"
		size="icon"
		class="text-muted-foreground hover:border-transparent hover:bg-destructive/10 hover:text-destructive"
		aria-label="Remove {item.title} from bag"
		disabled={isUpdating(item)}
		onclick={(e) => removeItem(e, item)}
	>
		<Trash2 class="size-4" />
	</Button>
{/snippet}

<!-- The first load used to be one 34px spinner in an otherwise blank 384px region, then the whole
     page snapped in. These skeletons hold the real layout so nothing jumps. -->
{#snippet loadingSkeleton()}
	<div class="grid gap-8 lg:grid-cols-[1fr_380px]" role="status" aria-busy="true">
		<div class="min-w-0 divide-y divide-border overflow-hidden rounded-radius sm:border">
			{#each [0, 1] as row (row)}
				<div class="flex gap-4 p-4 sm:p-5">
					<Skeleton class="h-28 w-24 shrink-0 sm:h-32 sm:w-28" />
					<div class="flex min-w-0 flex-1 flex-col gap-3">
						<Skeleton class="h-4 w-2/3" />
						<Skeleton class="h-4 w-1/3" />
						<div class="mt-auto flex items-center justify-between">
							<Skeleton class="h-11 w-32" />
							<Skeleton class="h-11 w-11" />
						</div>
					</div>
				</div>
			{/each}
		</div>
		<div class="flex flex-col gap-3">
			<Skeleton class="h-12 w-full" />
			<Skeleton class="h-64 w-full" />
		</div>
	</div>
	<span class="sr-only">Loading your bag</span>
{/snippet}

<svelte:head>
	<title>Cart - {page?.data?.store?.name || ''}</title>
</svelte:head>

<div class="py-8 max-sm:pb-[calc(7rem_+_env(safe-area-inset-bottom))]">
	<div class="page-width">
		<CheckoutHeader step={1} />

		<!-- The page had no h1 at all: the step indicator above is a progress control, not a heading,
		     so a screen-reader user landed on a page with nothing naming it and the document outline
		     started at h2. Visually hidden because the step indicator already says Cart on screen. -->
		<h1 class="sr-only">Your bag</h1>

		{#await cartState.hasLoaded}
			{@render loadingSkeleton()}
		{:then _}
			{#if cartLoadFailed}
				<!-- Same shape as the orders page's error state: say what failed, and offer the one
				     action that can fix it. -->
				<div class="flex h-[60vh] flex-col items-center justify-center px-6 text-center">
					<div class="mb-6 rounded-full bg-destructive/10 p-6">
						<AlertCircle class="h-10 w-10 text-destructive" />
					</div>
					<h2 class="mb-2 text-xl font-semibold text-foreground">We couldn't load your bag</h2>
					<p class="mb-6 max-w-sm text-sm text-muted-foreground">
						Your items are still saved. This is usually a connection problem, so trying again often works.
					</p>
					<Button onclick={retryCartLoad} class="h-11 px-6">Try again</Button>
				</div>
			{:else if !cartState.cart?.lineItems?.length}
				<div class="flex h-[60vh] flex-col items-center justify-center px-6 text-center">
					<div class="mb-6 rounded-full bg-muted p-7">
						<ShoppingBag class="h-10 w-10 text-muted-foreground" />
					</div>
					<h2 class="mb-2 text-xl font-semibold text-foreground">Your bag is empty</h2>
					<p class="mb-6 max-w-sm text-sm text-muted-foreground">Looks like you haven't added anything to your bag yet.</p>
					<Button href="/" class="h-11 px-6">Start shopping</Button>
				</div>
			{:else}
				<div class="grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start">
					<!-- Left column. `min-w-0` keeps a wide min-content child from stretching the column
					     past the viewport and scrolling the page sideways on a phone. -->
					<div class="min-w-0">
						{#if totalSavings > 0}
							<div class="mb-4 flex items-center gap-2 rounded-radius border border-success/40 bg-success/5 px-4 py-3">
								<Tag class="size-3.5 shrink-0 text-success" />
								<span class="text-sm font-medium text-success">
									You saved <span class="font-bold">{formatPrice($animatedSavings, currencyCode)}</span> on this order.
								</span>
							</div>
						{/if}

						<div
							class="h-fit divide-y divide-border overflow-hidden rounded-radius sm:border {cartModule.partialCheckoutEnabled
								? '[&>div:nth-child(2)]:max-sm:!border-t-0'
								: ''}"
						>
							<!-- Root checkbox -->
							{#if cartModule.partialCheckoutEnabled}
								<div class="flex items-center gap-2 px-4 py-2">
									<Checkbox
										id="allItemsChecked"
										checked={cartModule.allItemsChecked}
										indeterminate={cartModule.isIndeterminate}
										onCheckedChange={cartModule.handleRootCheckedChange}
									/>
									<label for="allItemsChecked" class="text-sm text-muted-foreground hover:cursor-pointer">Select all items</label>
								</div>
							{/if}

							{#each cartState.cart?.lineItems || [] as item (item.id)}
								<!-- The row used to be one anchor with `target="_blank"` wrapping seven buttons, so
								     assistive technology announced a link containing a stepper, invalid markup put
								     interactive controls inside an anchor, and a tap on the row's empty space opened a
								     second tab. Only the thumbnail and the title are links now, in this tab, which is
								     the pattern the drawer row already followed. -->
								<div class="flex gap-3 p-4 sm:gap-5 sm:p-5">
									{#if cartModule.partialCheckoutEnabled}
										<label
											for={item.id}
											class="-my-4 -ml-4 flex shrink-0 items-center px-3 hover:cursor-pointer sm:-my-5 sm:-ml-5 {item.isSelectedForCheckout
												? 'bg-muted'
												: 'hover:bg-muted/50'}"
										>
											<Checkbox
												id={item.id}
												class="invisible absolute"
												bind:checked={item.isSelectedForCheckout}
												onCheckedChange={(e) => cartModule.handleCheckedChange(e, item)}
											/>
											<Check class="size-5 {item.isSelectedForCheckout ? 'text-foreground' : 'text-muted-foreground/40'}" strokeWidth={2.5} />
										</label>
									{/if}

									<div class="flex shrink-0 flex-col items-center gap-3">
										<a href={`/products/${item.slug}`} class="block w-24 overflow-hidden rounded-md bg-muted sm:w-28" aria-label="View {item.title}">
											<LazyImg src={item.thumbnail} alt={item.title} class="w-full object-contain object-top" />
										</a>

										<div class="sm:hidden">
											{@render quantitySelector(item)}
										</div>
									</div>

									<div class="flex min-w-0 flex-1 flex-col gap-2">
										<div class="flex items-start justify-between gap-3">
											<div class="min-w-0 flex-1">
												<a href={`/products/${item.slug}`} class="block">
													<h3 class="line-clamp-2 text-sm font-medium text-foreground sm:text-base">{item.title}</h3>
												</a>

												{#if item.variant?.options?.length}
													<div class="mt-1.5 flex flex-wrap gap-1.5">
														{#each item.variant.options as option}
															{#if option?.option?.title && option?.value}
																<span class="inline-flex items-center rounded-sm border border-border px-2 py-0.5 text-xs text-muted-foreground">
																	{option.option?.title}: {option?.value}
																</span>
															{/if}
														{/each}
													</div>
												{/if}
											</div>

											<div class="shrink-0 text-right">
												{#if isUpdating(item)}
													<!-- A stale figure at full contrast reads as settled. -->
													<Skeleton class="h-5 w-20" />
												{:else}
													<p class="text-sm font-semibold text-foreground sm:text-base">
														{formatPrice(item.price * item.qty, currencyCode)}
													</p>
													{#if item.mrp > item.price}
														<p class="text-xs text-muted-foreground line-through">
															{formatPrice(item.mrp * item.qty, currencyCode)}
														</p>
													{/if}
												{/if}
											</div>
										</div>

										<!-- Supporting text at 12px in the muted *text* token. The unit price used to render
										     at 10px in a 2.54:1 grey, and in two different greys depending on breakpoint. -->
										{#if item.mrp > item.price}
											<p class="text-xs font-medium text-success">
												You saved {formatPrice(item.mrp * item.qty - item.price * item.qty, currencyCode)}
											</p>
										{:else if item.qty > 1}
											<p class="text-xs text-muted-foreground">
												{formatPrice(item.price, currencyCode)} each
											</p>
										{/if}

										<div class="mt-auto flex items-center justify-between gap-3 pt-2">
											<div class="max-sm:hidden">
												{@render quantitySelector(item)}
											</div>
											<div class="ml-auto">
												{@render removeButton(item)}
											</div>
										</div>
									</div>
								</div>
							{/each}
						</div>
					</div>

					<!-- Right column - order summary -->
					<div class="flex flex-col gap-3 lg:sticky lg:top-24">
						<!-- coupon applied-->
						{#if cartState.cart?.couponCode}
							<div class="flex items-center justify-between gap-3 rounded-radius border border-border bg-background px-3 py-2">
								<p class="text-sm font-medium text-foreground">Coupon applied</p>
								<div class="flex items-center gap-1">
									<p class="rounded-sm bg-muted px-2 py-1 text-sm font-medium text-muted-foreground">
										{cartState.cart?.couponCode}
									</p>
									<Button
										variant="ghost"
										size="icon"
										class="text-muted-foreground hover:border-transparent hover:text-destructive"
										aria-label="Remove coupon {cartState.cart?.couponCode}"
										onclick={() => cartState.removeCoupon()}
									>
										<X class="size-4" />
									</Button>
								</div>
							</div>
						{/if}

						<!-- Offering a promo box a backend cannot honour is a dead end: every code the shopper
						     tries comes back "Discount codes are not available on this store". Gate it on the
						     store's own toggle, the way the wishlist and search are gated — a backend with no
						     discount engine sets `isDiscountCoupons.active` false and simply shows no box.
						     `undefined` keeps the box, for stores that predate the toggle. -->
						{#if discountCouponsPlugin?.active !== false}
							<CouponsDrawer />
						{/if}

						<div class="rounded-radius border border-border bg-background p-4 shadow-xs md:p-5">
							<h2 class="mb-4 text-sm font-semibold uppercase tracking-wide text-foreground">Price summary</h2>

							<!-- The four hand-written copies of this block had drifted; this is the shared one, and
							     it is what moves the bottom line to "Estimated total" while shipping is unknown. -->
							<PriceSummary
								subtotal={cartState.cart?.subtotal}
								discount={cartState.cart?.discountAmount}
								discountLabel={cartState.cart?.couponCode ? `Discount (${cartState.cart.couponCode})` : 'Discount'}
								shipping={cartState.cart?.shippingCharges}
								tax={(cartState.cart as any)?.tax}
								total={(cartState.cart as any)?.total}
								{currencyCode}
								{shippingResolved}
								loading={isBusy}
							/>

							<!-- Announced once, politely: a quantity change moved the subtotal with no signal at all
							     for a screen-reader user. -->
							<p class="sr-only" aria-live="polite" aria-atomic="true">
								{isBusy ? 'Updating your bag' : `Subtotal ${cartSubtotal}, ${shippingResolved ? 'total' : 'estimated total'} ${cartTotal}`}
							</p>

							<div class="mt-5 flex items-center justify-center gap-2 rounded-radius bg-muted/50 px-4 py-2.5">
								<LockKeyhole class="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
								<p class="text-xs text-muted-foreground">Secure 256-bit encryption</p>
							</div>

							{#if !cartModule.noItemsChecked}
								<CheckoutButton
									onclick={cartModule.gotoCheckout}
									loading={cartModule.loadingForCheckout}
									disabled={isBusy}
									total={cartTotal}
									totalLabel={shippingResolved ? 'Total' : 'Estimated total'}
									class="mt-4"
								/>
							{:else}
								<div class="mt-4 rounded-radius border border-warning/40 bg-warning/10 p-3 text-center text-xs font-medium text-foreground">
									Select items to proceed
								</div>
							{/if}
						</div>

						<OrderTrustBadges />
					</div>
				</div>
			{/if}
		{:catch}
			<!-- The catch branch used to render "Your cart is empty", so a shopper whose bag failed to
			     hydrate was told the items were gone. Same error shape as the failed-load state above. -->
			<div class="flex h-[60vh] flex-col items-center justify-center px-6 text-center">
				<div class="mb-6 rounded-full bg-destructive/10 p-6">
					<AlertCircle class="h-10 w-10 text-destructive" />
				</div>
				<h2 class="mb-2 text-xl font-semibold text-foreground">We couldn't load your bag</h2>
				<p class="mb-6 max-w-sm text-sm text-muted-foreground">
					Your items are still saved. This is usually a connection problem, so trying again often works.
				</p>
				<Button onclick={retryCartLoad} class="h-11 px-6">Try again</Button>
			</div>
		{/await}
	</div>
</div>
