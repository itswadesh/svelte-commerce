<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import { AlertCircle, Check, Loader, LoaderCircle, LockKeyhole, Minus, Plus, ShoppingBag, Tag, Trash, X } from '@lucide/svelte'
	import { formatPrice } from '$lib/core/utils'
	import Spinner from '$lib/components/common/spinner.svelte'
	import { page } from '$app/state'
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte'
	import { goto } from '$app/navigation'
	import { ChevronRight } from '@lucide/svelte'
	import OrderTrustBadges from '$lib/core/components/plugins/order-trust-badges.svelte'
	import CouponsDrawer from '$lib/components/coupon/coupons-drawer.svelte'
	import { CartModule } from '$lib/core/composables/index.js'
	import CheckoutHeader from '$lib/components/checkout/checkout-header.svelte'
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
</script>

<!-- Touch-sized: this is the mobile-only stepper, so the controls are 40px rather than the 28px
     the pointer-driven sm+ one uses. -->
{#snippet quantitySelector(item: any)}
	<div class="flex items-center rounded-radius border border-border bg-background p-1 shadow-sm transition-all duration-300 hover:shadow-md">
		<Button
			variant="ghost"
			size="icon"
			onclick={(e) => cartModule.decreaseQty(e, item)}
			disabled={isUpdating(item) || item.qty <= 1}
			class="flex h-10 w-10 items-center justify-center"
			aria-label="Decrease quantity"
		>
			<Minus class="size-4 text-gray-900" />
		</Button>
		<span class="flex min-w-[2.5rem] items-center justify-center px-1 text-sm font-bold text-gray-900">
			{#if isUpdating(item)}
				<Spinner label="Updating quantity" />
			{:else}
				{item.qty}
			{/if}
		</span>
		<Button
			variant="ghost"
			size="icon"
			class="flex h-10 w-10 items-center justify-center"
			aria-label="Increase quantity"
			disabled={isUpdating(item)}
			onclick={(e) => cartModule.increaseQty(e, item)}
		>
			<Plus class="size-4 text-gray-900" />
		</Button>
	</div>
{/snippet}

<svelte:head>
	<title>Cart - {page?.data?.store?.name || ''}</title>
</svelte:head>

<div class="min-h-screen py-8 max-sm:pb-[calc(9rem_+_env(safe-area-inset-bottom))]">
	<div class="container mx-auto px-4">
		<CheckoutHeader step={1} />

		<!-- <div class="mb-8">
		  <div>
				<p class="font-semibold tracking-tight text-xl">My Bag <span class="font-bold">({cartState?.cart?.lineItems?.length ?? 0}) {cartState.cart.lineItems.length>1 ? "Items" : "Item"}</span></p>
			</div>
		</div> -->

		<!-- {#if freeShippingOn && cartState?.cart?.total <= freeShippingOn}
      <div class="bg-gray-100 p-4 py-2 rounded-lg text-sm text-gray-600 w-fit mb-5">
        <p>
          <span>✨🎉 Free Shipping For all Orders Over {formatPrice(
              freeShippingOn,
              page?.data?.store?.currency?.code
            )} 🚚</span>
        </p>
      </div>
    {:else if freeShippingOn && cartState?.cart?.total > freeShippingOn}
      <div class="bg-gray-100 p-4 py-2 rounded-lg text-sm text-gray-600 w-fit mb-5">
        <p>
          <span>🚚 Yay! You get <span class="text-green-400">FREE</span> delivery on
            this order</span>
        </p>
      </div>
    {/if} -->

		{#await cartState.hasLoaded}
			<div class="flex min-h-96 items-center justify-center py-8">
				<LoaderCircle class="animate-spin" />
			</div>
		{:then _}
			<!-- `=== 0` missed a null/undefined cart (e.g. login before anything is added) and fell
			     through to the item branch, which then crashed. -->
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
				<div class="flex h-[60vh] flex-col items-center justify-center text-center">
					<div class="mb-6 rounded-full bg-gray-50 p-8 ring-1 ring-gray-100">
						<ShoppingBag class="h-12 w-12 text-gray-300" />
					</div>
					<h2 class="mb-2 text-xl font-bold uppercase tracking-widest text-gray-900">Your bag is empty</h2>
					<p class="mb-8 max-w-xs text-sm text-gray-500">Looks like you haven't added anything to your bag yet.</p>
					<Button href="/" variant="default" class="rounded-full px-8 py-3 text-xs font-bold uppercase tracking-[0.2em]">Start Shopping</Button>
				</div>
			{:else}
				<div class="grid gap-8 lg:grid-cols-[1fr_400px]">
					<!-- Left Column. `min-w-0` keeps a wide min-content child from stretching the column
					     past the viewport and scrolling the page sideways on a phone. -->
					<div class="min-w-0">
						<!-- {#if freeShippingOn && cartState?.cart?.total <= freeShippingOn}
						<div class="mb-5 w-fit rounded-lg bg-gray-100 p-4 py-2 text-sm text-gray-600">
							<p>
								<span>✨🎉 Free Shipping For all Orders Over {formatPrice(freeShippingOn, page?.data?.store?.currency?.code)} 🚚</span>
							</p>
						</div>
					{:else if freeShippingOn && cartState?.cart?.total > freeShippingOn}
						<div class="mb-5 w-fit rounded-lg bg-gray-100 p-4 py-2 text-sm text-gray-600">
							<p>
								<span>🚚 Yay! You get <span class="text-green-400">FREE</span> delivery on this order</span>
							</p>
						</div>
					{/if} -->
						{#if totalSavings > 0}
							<div class="mb-4 flex items-center justify-between rounded-radius border border-success/40 bg-success/5 px-4 py-3">
								<div class="flex items-center gap-2">
									<Tag class="size-3.5 text-success" />
									<span class="text-sm font-medium text-success"
										>You saved <span class="font-bold">{formatPrice($animatedSavings, page?.data?.store?.currency?.code)}</span> on this order.</span
									>
								</div>
							</div>
						{/if}

						<div
							class="h-fit divide-y divide-gray-200 overflow-hidden rounded-radius sm:border {cartModule.partialCheckoutEnabled
								? '[&>div:nth-child(2)]:max-sm:!border-t-0'
								: ''}"
						>
							<!-- Root checkbox -->
							{#if cartModule.partialCheckoutEnabled}
								<div class="flex items-center justify-between">
									<div class="flex h-full items-stretch gap-2">
										<div class="flex min-h-full items-center justify-center px-1">
											<Checkbox
												id="allItemsChecked"
												checked={cartModule.allItemsChecked}
												indeterminate={cartModule.isIndeterminate}
												onCheckedChange={cartModule.handleRootCheckedChange}
											/>
										</div>
										<label for="allItemsChecked" class="py-1.5 text-sm text-gray-700 hover:cursor-pointer">Select all items</label>
									</div>
								</div>
							{/if}

							<!-- {#each cartState.cart.lineItems || [] as item}
							<div class="flex h-full">
								{#if partialCheckoutEnabled}
									<label
										for={item.id}
										class="flex min-h-full max-w-fit items-center border-transparent px-1 hover:cursor-pointer max-sm:mr-3 sm:border-r {item.isSelectedForCheckout
											? 'bg-gray-200'
											: '!border-gray-200 hover:bg-gray-100'}"
									>
										<Checkbox
											id={item.id}
											class="invisible absolute"
											bind:checked={item.isSelectedForCheckout}
											onCheckedChange={(checked) => {
												cartState?.update({
													qty: item.qty,
													lineId: item.id,
													productId: item.productId,
													variantId: item.variantId,
													isSelectedForCheckout: checked
												})
											}}
										/>

										<div>
											{#if item.isSelectedForCheckout}
												<Check class="size-4" strokeWidth={3} />
											{:else}
												<Check class="size-4 text-gray-400" strokeWidth={3} />
											{/if}
										</div>
									</label>
								{/if}
								<a class="flex flex-1 gap-4 py-3 sm:px-2 sm:py-1.5" href={`/products/${item.slug}`} target="_blank">
									<div class="relative flex items-center justify-center">
										<img src={item.thumbnail} alt={item.title} class="aspect-[3/4] w-20 rounded-md object-contain sm:w-28" />
									</div>
									<div class="flex-1">
										<div class="flex flex-col justify-between sm:flex-row sm:items-center">
											<p class="line-clamp-2 font-medium">{item.title}</p>

											<p class="mt-1 font-semibold">
												{formatPrice(item.price * item.qty, page?.data?.store?.currency?.code)}
											</p>
										</div>

										<div class="flex items-center justify-between">
											<div class="my-2 flex w-fit rounded-md border">
												<button
													onclick={(e) => {
														e?.preventDefault()
														e?.stopPropagation()
														fireGTagEvent('remove_from_cart', {
															items: [{ ...item, qty: 1 }],
															price: item.price
														})
														cartState.update({
															qty: item.qty - 1,
															lineId: item.id,
															productId: item.productId,
															variantId: item.variantId
														})
													}}
													class="px-3 py-1 hover:bg-gray-100"
													aria-label="Decrease quantity"
												>
													<Minus class="size-4" />
												</button>
												<span class="border-x px-4 py-1">
													{#if isUpdating(item)}
														<Spinner label="Updating quantity" />
													{:else}
														{item.qty}
													{/if}
												</span>
												<button
													class="px-3 py-1 hover:bg-gray-100"
													aria-label="Increase quantity"
													onclick={(e) => {
														e?.preventDefault()
														e?.stopPropagation()
														cartState.update({
															qty: item.qty + 1,
															lineId: item.id,
															productId: item.productId,
															variantId: item.variantId
														})
													}}
												>
													<Plus class="size-4" />
												</button>
											</div>

											<button
												class="px-3 py-1"
												aria-label="Remove item"
												onclick={(e) => {
													e?.preventDefault()
													e?.stopPropagation()
													fireGTagEvent('remove_from_cart', {
														items: [{ ...item }],
														price: item.price
													})
													cartState.update({
														qty: 0,
														lineId: item.id,
														productId: item.productId,
														variantId: item.variantId
													})
												}}
											>
												<Trash class="size-4 text-red-500 hover:text-red-300" />
											</button>
										</div>
									</div>
								</a>
							</div>
						{/each} -->

							{#each cartState.cart?.lineItems || [] as item}
								<div class="group relative flex">
									{#if cartModule.partialCheckoutEnabled}
										<label
											for={item.id}
											class="flex min-h-full items-center border-transparent px-4 hover:cursor-pointer {item.isSelectedForCheckout
												? 'bg-gray-100'
												: 'hover:bg-gray-50'}"
										>
											<Checkbox
												id={item.id}
												class="invisible absolute"
												bind:checked={item.isSelectedForCheckout}
												onCheckedChange={(e) => cartModule.handleCheckedChange(e, item)}
											/>

											<div>
												{#if item.isSelectedForCheckout}
													<Check class="size-5" strokeWidth={2.5} />
												{:else}
													<Check class="size-5 text-gray-300" strokeWidth={2.5} />
												{/if}
											</div>
										</label>
									{/if}

									<a class="flex flex-1 gap-3 py-5 sm:p-3 sm:px-4 md:gap-6 md:p-5" href={`/products/${item.slug}`} target="_blank">
										<div class="flex flex-col items-center gap-3">
											<div class="relative flex items-center justify-center">
												<div class="overflow-hidden bg-gray-50 ring-gray-100">
													<LazyImg src={item.thumbnail || '/placeholder.svg'} alt={item.title} class="w-24 object-contain object-top sm:w-32" />
												</div>
											</div>

											<div class="sm:hidden">
												{@render quantitySelector(item)}
											</div>
										</div>

										<div class="flex flex-1 flex-col">
											<div class="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
												<div class="flex-1">
													<h3 class="line-clamp-2 text-base font-bold tracking-tight text-gray-900 sm:text-lg">{item.title}</h3>

													<div class="mt-2 flex flex-wrap gap-2">
														<span
															class="inline-flex items-center rounded-radius border border-primary px-2 py-0.5 text-xs font-semibold ring-1 ring-gray-100"
														>
															Qty: {item.qty}
														</span>
														{#if item.variant && item.variant.options && item.variant.options.length > 0}
															{#each item.variant.options as option}
																{#if option?.option?.title && option?.value}
																	<span
																		class="inline-flex items-center rounded-radius border border-primary px-2 py-0.5 text-xs font-semibold ring-1 ring-primary/10"
																	>
																		{option.option?.title}: {option?.value}
																	</span>
																{/if}
															{/each}
														{/if}
													</div>
												</div>

												<div class="flex justify-between">
													<div class="text-left lg:hidden">
														<div class="flex items-baseline gap-2">
															<p class="text-base font-bold text-gray-900 sm:text-lg">
																{formatPrice(item.price * item.qty, page?.data?.store?.currency?.code)}
															</p>
															{#if item.mrp > item.price}
																<span class="text-xs text-gray-400 line-through">
																	{formatPrice(item.mrp * item.qty, page?.data?.store?.currency?.code)}
																</span>
															{/if}
														</div>
														{#if item.mrp > item.price}
															<p class="text-xs font-medium tracking-tight text-green-600">
																You saved {formatPrice(item.mrp * item.qty - item.price * item.qty, page?.data?.store?.currency?.code)}
															</p>
														{:else}
															<p class="text-[10px] font-bold uppercase tracking-tighter text-gray-400">
																{formatPrice(item.price, page?.data?.store?.currency?.code)} each
															</p>
														{/if}
													</div>
													<div class="hidden lg:block">
														<Button
															variant="ghost"
															size="icon"
															class="h-auto w-auto p-1.5 text-gray-400"
															aria-label="Remove item"
															disabled={isUpdating(item)}
															onclick={(e) => removeItem(e, item)}
														>
															<Trash class="size-3.5 text-destructive" />
														</Button>
													</div>
												</div>
											</div>

											<div class="mt-auto flex items-center justify-between pt-6">
												<div
													class="hidden items-center rounded-radius border border-border bg-background p-1 shadow-sm transition-all duration-300 hover:shadow-md sm:flex"
												>
													<Button
														variant="ghost"
														size="icon"
														onclick={(e) => cartModule.decreaseQty(e, item)}
														disabled={isUpdating(item) || item.qty <= 1}
														class="flex h-7 w-7 items-center justify-center rounded-full"
														aria-label="Decrease quantity"
													>
														<Minus class="size-3 text-gray-900" />
													</Button>
													<span class="flex min-w-[2.5rem] items-center justify-center px-1 text-xs font-bold text-gray-900">
														{#if isUpdating(item)}
															<Spinner size={3} label="Updating quantity" />
														{:else}
															{item.qty}
														{/if}
													</span>
													<Button
														variant="ghost"
														size="icon"
														class="flex h-7 w-7 items-center justify-center rounded-full"
														aria-label="Increase quantity"
														disabled={isUpdating(item)}
														onclick={(e) => cartModule.increaseQty(e, item)}
													>
														<Plus class="size-3 text-gray-900" />
													</Button>
												</div>
												<div class="hidden sm:block lg:hidden">
													<Button
														variant="ghost"
														size="icon"
														class="h-auto w-auto p-1.5 text-gray-400"
														aria-label="Remove item"
														disabled={isUpdating(item)}
														onclick={(e) => removeItem(e, item)}
													>
														<Trash class="size-3.5 text-destructive" />
													</Button>
												</div>

												<div class="hidden text-right lg:block">
													<div class="flex items-baseline justify-end gap-2">
														<p class="text-base font-bold text-gray-900 sm:text-lg">
															{formatPrice(item.price * item.qty, page?.data?.store?.currency?.code)}
														</p>
														{#if item.mrp > item.price}
															<span class="text-xs line-through">
																{formatPrice(item.mrp * item.qty, page?.data?.store?.currency?.code)}
															</span>
														{/if}
													</div>
													{#if item.mrp > item.price}
														<p class="text-xs font-medium tracking-tight text-success">
															You saved {formatPrice(item.mrp * item.qty - item.price * item.qty, page?.data?.store?.currency?.code)}
														</p>
													{:else}
														<p class="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">
															{formatPrice(item.price, page?.data?.store?.currency?.code)} each
														</p>
													{/if}
												</div>
											</div>

											<Button
												variant="ghost"
												size="icon"
												class="mb-1.5 h-10 w-10 self-end text-gray-400 sm:hidden"
												aria-label="Remove item"
												disabled={isUpdating(item)}
												onclick={(e) => removeItem(e, item)}
											>
												<Trash class="size-4 text-destructive" />
											</Button>
										</div>
									</a>
								</div>
							{/each}
						</div>
					</div>

					<!-- Right Column - Order Summary -->
					<div class="flex flex-col gap-3">
						<!-- coupon applied-->
						{#if cartState.cart?.couponCode}
							<div class="flex items-center justify-between px-1 text-sm sm:text-base">
								<p class="font-medium">Coupon Applied</p>
								<div class="flex items-center gap-2 rounded-radius bg-gray-100 p-2 px-3">
									<p class="text-sm font-medium text-gray-600">
										{cartState.cart?.couponCode}
									</p>
									<Button variant="ghost" size="icon" class="h-auto w-auto p-1 text-destructive" onclick={() => cartState.removeCoupon()}>
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

						<div class="space-y-4 rounded-lg border border-border bg-background p-3 shadow-sm md:p-6">
							<div class="">
								<div class="mb-6 flex flex-col gap-1">
									<h2 class="text-base font-bold uppercase text-gray-900" style="font-family: var(--font-body);">Price Summary</h2>
									<div class="h-1 w-12 bg-primary"></div>
								</div>
								{#if cartModule.loadingForCart}
									<div class="flex items-center justify-center py-8">
										<Spinner size={6} label="Loading order totals" />
									</div>
								{:else}
									<div class="space-y-4">
										<div class="space-y-3 border-b border-border pb-6">
											<div class="flex justify-between text-sm">
												<span class="font-medium text-gray-500">Subtotal</span>
												<span class="font-bold text-gray-900">{formatPrice(cartState.cart?.subtotal, page?.data?.store?.currency?.code)}</span>
											</div>
											{#if cartState.cart?.discountAmount > 0}
												<div class="flex justify-between text-sm">
													<span class="font-medium text-gray-500">Discount</span>
													<span class="font-bold uppercase tracking-tight text-orange-600"
														>- {formatPrice(cartState.cart?.discountAmount, page?.data?.store?.currency?.code)}</span
													>
												</div>
											{/if}
											<div class="flex flex-col gap-1">
												<div class="flex justify-between text-sm">
													<span class="font-medium text-gray-500">Shipping</span>
													{#if !cartState.cart?.shippingAddress}
														<span class="text-[10px] font-bold uppercase tracking-tighter text-gray-400"> Address required </span>
													{:else if cartState.cart?.shippingCharges}
														<span class="font-bold text-gray-900"
															>{formatPrice(cartState.cart?.shippingCharges, page?.data?.store?.currency?.code)}</span
														>
													{:else}
														<span
															class="rounded bg-green-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-green-600 ring-1 ring-green-100"
															>FREE</span
														>
													{/if}
												</div>
											</div>
										</div>

										<div class="flex items-center justify-between pt-2">
											<span class="text-sm font-bold uppercase text-gray-900">Total</span>
											<span class="text-xl font-bold text-gray-900">{cartTotal}</span>
										</div>

										<!-- {#if totalSavings > 0}
											<div class="flex justify-end pt-1">
												<p class="text-[10px] font-bold uppercase tracking-tight text-green-600">
													You saved {formatPrice(totalSavings, page?.data?.store?.currency?.code)} on this order
												</p>
											</div>
										{/if} -->

										{#if cartModule.showError}
											<div
												class="mt-4 rounded bg-destructive p-3 text-[11px] font-bold uppercase tracking-tight text-destructive-foreground ring-1 ring-red-100"
											>
												{cartModule.errorMessage}
											</div>
										{/if}

										<div class="mt-6 flex items-center justify-center gap-2 rounded-md border border-gray-100 bg-gray-50/50 px-4 py-3">
											<LockKeyhole class="h-3.5 w-3.5 text-gray-400" />
											<p class="text-[10px] font-bold uppercase tracking-widest text-gray-500">Secure 256-bit encryption</p>
										</div>

										{#if !cartModule.noItemsChecked}
											<CheckoutButton onclick={cartModule.gotoCheckout} loading={cartModule.loadingForCheckout} total={cartTotal} />
										{:else}
											<div
												class="mt-4 rounded bg-yellow-50 p-3 text-center text-[10px] font-bold uppercase tracking-widest text-yellow-700 ring-1 ring-yellow-100"
											>
												Select items to proceed
											</div>
										{/if}
									</div>
								{/if}
							</div>
						</div>

						<!-- <div class="rounded-md bg-gray-100 border p-4">
            <div class="flex items-center text-sm text-gray-600">
              <ShoppingBag class="mr-2 size-4" />
              <span>Your order is secured with 256-bit encryption</span>
            </div>
          </div> -->

						<OrderTrustBadges />

						<!-- <div
            class="bg-gray-100 flex items-start justify-between gap-3 p-4 border rounded-md"
          >
            <div
              class="flex flex-col items-center justify-center gap-2 text-center text-[0.5em] text-zinc-500 uppercase"
            >
              <img
                src="/cart-badge-trust.svg"
                alt="cart badge trust"
                class="h-8 w-8 object-contain object-bottom"
              /> <span>100% secure payments</span>
            </div>
            <div
              class="flex flex-col items-center justify-center gap-2 text-center text-[0.5em] text-zinc-500 uppercase"
            >
              <img
                src="/cart-easy-return.svg"
                alt="cart badge trust"
                class="h-8 w-8 object-contain object-bottom"
              /> <span>Easy return &amp; quick refunds</span>
            </div>
            <div
              class="flex flex-col items-center justify-center gap-2 text-center text-[0.5em] text-zinc-500 uppercase"
            >
              <img
                src="/quality-check.svg"
                alt="cart badge trust"
                class="h-8 w-8 object-contain object-bottom"
              /> <span>Quality assurance</span>
            </div>
          </div> -->
					</div>
				</div>
			{/if}
		{:catch}
			<div class="flex h-96 flex-col items-center justify-center gap-3">
				<p class="text-xl text-gray-400">Your cart is empty</p>
				<Button class="ml-4" href="/" variant="outline" size="sm">Continue Shopping</Button>
			</div>
		{/await}
	</div>
</div>
