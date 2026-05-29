<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import { Check, Loader, LoaderCircle, LockKeyhole, Minus, Plus, ShoppingBag, Tag, Trash, X } from '@lucide/svelte'
	import { formatPrice } from '$lib/core/utils'
	import LoadingDots from '$lib/core/components/common/loading-dots.svelte'
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

	const cartModule = new CartModule()
	const cartState = cartModule.cartState

	const totalSavings = $derived(
		(cartState.cart?.lineItems || []).reduce(
			(acc, item) => acc + (Math.max(0, (item.mrp || item.price) - item.price) * item.qty),
			0
		) + (cartState.cart?.discountAmount || 0)
	)

	const animatedSavings = tweened(0, {
		duration: 1000,
		easing: cubicOut
	})

	$effect(() => {
		animatedSavings.set(totalSavings)
	})
</script>

{#snippet quantitySelector(item: any)}
	<div
		class="flex items-center rounded-sm border border-gray-200 bg-white p-1 shadow-sm transition-all duration-300 hover:shadow-md"
	>
		<Button
			variant="ghost"
			size="icon"
			onclick={(e) => cartModule.decreaseQty(e, item)}
			class="flex h-7 w-7 items-center justify-center rounded-full"
			aria-label="Decrease quantity"
		>
			<Minus class="size-3 text-gray-900" />
		</Button>
		<span class="flex min-w-[2.5rem] items-center justify-center px-1 text-xs font-bold text-gray-900">
			{#if cartState.updatingItem[item.id]}
				<LoadingDots />
			{:else}
				{item.qty}
			{/if}
		</span>
		<Button
			variant="ghost"
			size="icon"
			class="flex h-7 w-7 items-center justify-center rounded-full"
			aria-label="Increase quantity"
			onclick={(e) => cartModule.increaseQty(e, item)}
		>
			<Plus class="size-3 text-gray-900" />
		</Button>
	</div>
{/snippet}

<svelte:head>
	<title>Cart - {page?.data?.store?.name || ''}</title>
</svelte:head>

<div class="min-h-screen py-8">
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
			{#if cartState.cart?.lineItems?.length === 0}
				<div class="flex h-[60vh] flex-col items-center justify-center text-center">
					<div class="mb-6 rounded-full bg-gray-50 p-8 ring-1 ring-gray-100">
						<ShoppingBag class="h-12 w-12 text-gray-300" />
					</div>
					<h2 class="mb-2 text-xl font-bold uppercase tracking-widest text-gray-900">Your bag is empty</h2>
					<p class="mb-8 max-w-xs text-sm text-gray-500">Looks like you haven't added anything to your bag yet.</p>
					<Button
						href="/"
						variant="default"
						class="rounded-full px-8 py-3 text-xs font-bold uppercase tracking-[0.2em]"
					>
						Start Shopping
					</Button>
				</div>
			{:else}
				<div class="grid gap-8 lg:grid-cols-[1fr_400px]">
					<!-- Left Column -->
					<div>
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
						<div class="py-3 px-4 mb-4 border rounded-md bg-success/5 border-success/40 flex items-center justify-between">
							<div class="flex items-center gap-2">
								<Tag class="size-3.5 text-success" />
								<span class="text-sm font-medium text-success">You saved <span class="font-bold">{formatPrice($animatedSavings, page?.data?.store?.currency?.code)}</span> on this order.</span>
							</div>
						</div>


						<div
							class="h-fit divide-y divide-gray-200 overflow-hidden rounded-md sm:border {cartModule.partialCheckoutEnabled
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
													{#if cartState.updatingItem[item.id]}
														<LoadingDots />
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

							{#each cartState.cart.lineItems || [] as item}
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

									<a class="flex flex-1 gap-3 md:gap-6 py-5 md:p-5" href={`/products/${item.slug}`} target="_blank">
										<div class="flex flex-col items-center gap-3">
											<div class="relative flex items-center justify-center">
												<div class="overflow-hidden  bg-gray-50 p-1 ring-1 ring-gray-100">
													<LazyImg
														src={item.thumbnail || '/placeholder.svg'}
														alt={item.title}
														class="aspect-[3/4] w-24 object-contain sm:w-32"
													/>
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
															class="inline-flex items-center rounded bg-gray-50 px-2 py-0.5 text-xs  text-muted font-semibold ring-1 ring-gray-100"
														>
															Qty: {item.qty}
														</span>
														{#if item.variant && item.variant.options && item.variant.options.length > 0}
															{#each item.variant.options as option}
																{#if option?.option?.title && option?.value}
																	<span
																		class="inline-flex items-center rounded bg-primary/5 px-2 py-0.5 text-xs font-semibold  text-muted ring-1 ring-primary/10"
																	>
																		{option.option?.title}: {option?.value}
																	</span>
																{/if}
															{/each}
														{/if}
													</div>
												</div>

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
														<p class="text-xs font-medium tracking-tight text-red-900">
															You saved {formatPrice((item.mrp * item.qty) - (item.price * item.qty), page?.data?.store?.currency?.code)}
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
														onclick={(e) => cartModule.removeItem(e, item)}
													>
														<Trash class="size-3.5 text-red-500" />
													</Button>
												</div>
											</div>

											<div class="mt-auto flex items-center justify-between pt-6">
													<div
													class="hidden items-center rounded-sm border border-gray-200 bg-white p-1 shadow-sm transition-all duration-300 hover:shadow-md sm:flex"
												>
													<Button
														variant="ghost"
														size="icon"
														onclick={(e) => cartModule.decreaseQty(e, item)}
														class="flex h-7 w-7 items-center justify-center rounded-full"
														aria-label="Decrease quantity"
													>
														<Minus class="size-3 text-gray-900" />
													</Button>
													<span class="flex min-w-[2.5rem] items-center justify-center px-1 text-xs font-bold text-gray-900">
														{#if cartState.updatingItem[item.id]}
															<LoadingDots />
														{:else}
															{item.qty}
														{/if}
													</span>
													<Button
														variant="ghost"
														size="icon"
														class="flex h-7 w-7 items-center justify-center rounded-full"
														aria-label="Increase quantity"
														onclick={(e) => cartModule.increaseQty(e, item)}
													>
														<Plus class="size-3 text-gray-900" />
													</Button>
												</div>

												<div class="lg:hidden">
													<Button
														variant="ghost"
														size="icon"
														class="h-auto w-auto p-1.5 text-gray-400"
														aria-label="Remove item"
														onclick={(e) => cartModule.removeItem(e, item)}
													>
														<Trash class="size-3.5 text-red-500" />
													</Button>
												</div>
												<div class="text-right hidden lg:block">
													<div class="flex items-baseline justify-end gap-2">

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
														<p class="text-xs font-medium tracking-tight text-success">
															You saved {formatPrice((item.mrp * item.qty) - (item.price * item.qty), page?.data?.store?.currency?.code)}
														</p>
													{:else}
														<p class="text-[10px] font-bold uppercase tracking-tighter text-gray-400">
															{formatPrice(item.price, page?.data?.store?.currency?.code)} each
														</p>
													{/if}
												</div>
											</div>
										</div>
									</a>
								</div>
							{/each}
						</div>
					</div>

					<!-- Right Column - Order Summary -->
					<div class="flex flex-col gap-3">
						<!-- coupon applied-->
						{#if cartState.cart.couponCode}
							<div class="flex items-center justify-between px-1 text-sm sm:text-base">
								<p class="font-medium">Coupon Applied</p>
								<div class="flex items-center gap-2 rounded-lg bg-gray-100 p-2 px-3">
									<p class="text-sm font-medium text-gray-600">
										{cartState.cart.couponCode}
									</p>
								<Button
									variant="ghost"
									size="icon"
									class="h-auto w-auto p-1 text-red-500"
									onclick={() => cartState.removeCoupon()}
								>
									<X class="size-4" />
								</Button>
								</div>
							</div>
						{/if}

						<CouponsDrawer />

						<div class="space-y-4 rounded-lg border border-muted/20 bg-white p-3 md:p-6 shadow-sm">
							<div class="">
								<div class="mb-6 flex flex-col gap-1">
									<h2 class="text-base font-bold uppercase  text-gray-900" style="font-family: 'Montserrat', sans-serif;">
										Price Summary
									</h2>
									<div class="h-1 w-12 bg-primary"></div>
								</div>
								{#if cartModule.loadingForCart}
									<div class="flex items-center justify-center py-8">
										<LoadingDots />
									</div>
								{:else}
									<div class="space-y-4">
										<div class="space-y-3 border-b border-gray-50 pb-6">
											<div class="flex justify-between text-sm">
												<span class="font-medium text-gray-500">Subtotal</span>
												<span class="font-bold text-gray-900">{formatPrice(cartState.cart.subtotal, page?.data?.store?.currency?.code)}</span>
											</div>
											{#if cartState.cart.discountAmount > 0}
												<div class="flex justify-between text-sm">
													<span class="font-medium text-gray-500">Discount</span>
													<span class="font-bold uppercase tracking-tight text-orange-600"
														>- {formatPrice(cartState.cart.discountAmount, page?.data?.store?.currency?.code)}</span
													>
												</div>
											{/if}
											<div class="flex flex-col gap-1">
												<div class="flex justify-between text-sm">
													<span class="font-medium text-gray-500">Shipping</span>
													{#if !cartState.cart.shippingAddress}
														<span class="text-[10px] font-bold uppercase tracking-tighter text-gray-400"> Address required </span>
													{:else if cartState.cart.shippingCharges}
														<span class="font-bold text-gray-900"
															>{formatPrice(cartState.cart.shippingCharges, page?.data?.store?.currency?.code)}</span
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
											<span class="text-xl font-bold text-gray-900">{formatPrice(cartState.cart.total, page?.data?.store?.currency?.code)}</span>
										</div>

										<!-- {#if totalSavings > 0}
											<div class="flex justify-end pt-1">
												<p class="text-[10px] font-bold uppercase tracking-tight text-green-600">
													You saved {formatPrice(totalSavings, page?.data?.store?.currency?.code)} on this order
												</p>
											</div>
										{/if} -->

										{#if cartModule.showError}
											<div class="mt-4 rounded bg-red-50 p-3 text-[11px] font-bold uppercase tracking-tight text-red-600 ring-1 ring-red-100">
												{cartModule.errorMessage}
											</div>
										{/if}

										<div class="mt-6 flex items-center justify-center gap-2 rounded-md border border-gray-100 bg-gray-50/50 px-4 py-3">
											<LockKeyhole class="h-3.5 w-3.5 text-gray-400" />
											<p class="text-[10px] font-bold uppercase tracking-widest text-gray-500">Secure 256-bit encryption</p>
										</div>

										{#if !cartModule.noItemsChecked}
											<CheckoutButton
												onclick={cartModule.gotoCheckout}
												loading={cartModule.loadingForCheckout}
											/>
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
