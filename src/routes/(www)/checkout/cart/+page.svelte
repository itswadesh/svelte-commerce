<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import { Check, Loader, LockKeyhole, Minus, Plus, ShoppingBag, Tag, Trash, X } from 'lucide-svelte'
	import { formatPrice } from '$lib/core/utils'
	import LoadingDots from '$lib/core/components/common/loading-dots.svelte'
	import { page } from '$app/state'
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte'
	import { goto } from '$app/navigation'
	import { ChevronRight } from 'lucide-svelte'
	import OrderTrustBadges from '$lib/core/components/plugins/order-trust-badges.svelte'
	import CouponsDrawer from '$lib/components/coupon/coupons-drawer.svelte'
	import { CartModule } from '$lib/core/composables/use-checkout-cart.svelte'

	const cartModule = new CartModule()
	const cartState = cartModule.cartState
</script>

<svelte:head>
	<title>Cart - {page?.data?.store?.name || ''}</title>
</svelte:head>

<div class="min-h-screen py-8">
	<div class="container mx-auto px-4">
		<!-- Checkout Progress -->
		<div class="mb-8">
			<div class="flex items-center justify-center space-x-8">
				<div class="flex cursor-pointer items-center text-primary">
					<div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">1</div>
					<span class="ml-2 font-medium">Cart</span>
				</div>
				<div class="hidden h-px w-16 bg-gray-300 sm:block"></div>
				<button onclick={() => goto('/checkout/address')} class="flex cursor-pointer items-center text-gray-400">
					<div class="border-gray-300} flex h-8 w-8 items-center justify-center rounded-full border">2</div>
					<span class="ml-2 font-medium">Address</span>
				</button>
				<div class="hidden h-px w-16 bg-gray-300 sm:block"></div>
				<div class="flex items-center text-gray-400">
					<div class="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300">3</div>
					<span class="ml-2 font-medium">Payment</span>
				</div>
			</div>
		</div>

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

		{#if cartState?.isUpdatingCart}
			<div class="flex min-h-96 items-center justify-center py-8">
				<Loader class="animate-spin" />
			</div>
		{:else if cartState.cart?.lineItems?.length === 0}
			<div class="flex h-96 flex-col items-center justify-center gap-3">
				<p class="text-xl text-gray-400">Your cart is empty</p>
				<Button class="ml-4" href="/" variant="outline" size="sm">Continue Shopping</Button>
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
							<div class="group relative flex transition-all duration-200 hover:bg-gray-50">
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

								<a class="flex flex-1 gap-5 p-4" href={`/products/${item.slug}`} target="_blank">
									<div class="relative flex items-center justify-center">
										<div class="overflow-hidden rounded-md bg-gray-50 p-1">
											<img
												src={item.thumbnail || '/placeholder.svg'}
												alt={item.title}
												class="aspect-[3/4] w-20 object-contain transition-transform duration-300 sm:w-28"
											/>
										</div>
										<!-- {#if item.qty > 1}
											<div
												class="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-700 text-xs font-medium text-white shadow-sm"
											>
												{item.qty}
											</div>
										{/if} -->
									</div>

									<div class="flex flex-1 flex-col">
										<div class="flex flex-col justify-between gap-1 sm:flex-row sm:items-start">
											<div class="flex-1">
												<h3 class="line-clamp-2 text-base font-medium text-gray-900">{item.title}</h3>
												<p class="flex items-center gap-1 text-xs">
													<Tag class="size-3" />
													<span>Qty: {item.qty || '_'} x {formatPrice(item.price, page?.data?.store?.currency?.code)}</span>
												</p>

												{#if item.variant && item.variant.options && item.variant.options.length > 0}
													<div class="mt-1.5 flex flex-wrap gap-2">
														{#each item.variant.options as option}
															{#if option?.option?.title && option?.value}
																<span
																	class="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium capitalize text-gray-800"
																>
																	{option.option?.title}: {option?.value}
																</span>
															{/if}
														{/each}
													</div>
												{/if}
											</div>

											<p class="mt-1 whitespace-nowrap font-semibold text-gray-900">
												{formatPrice(item.price * item.qty, page?.data?.store?.currency?.code)}
											</p>
										</div>

										<div class="mt-auto flex items-center justify-between pt-3">
											<div class="flex rounded-md border border-gray-200 shadow-sm">
												<button
													onclick={(e) => cartModule.decreaseQty(e, item)}
													class="flex h-8 w-8 items-center justify-center rounded-l-md transition-colors hover:bg-gray-100"
													aria-label="Decrease quantity"
												>
													<Minus class="size-3.5" />
												</button>
												<span class="flex h-8 min-w-[2.5rem] items-center justify-center border-x border-gray-200 px-2 text-sm font-medium">
													{#if cartState.updatingItem[item.id]}
														<LoadingDots />
													{:else}
														{item.qty}
													{/if}
												</span>
												<button
													class="flex h-8 w-8 items-center justify-center rounded-r-md transition-colors hover:bg-gray-100"
													aria-label="Increase quantity"
													onclick={(e) => cartModule.increaseQty(e, item)}
												>
													<Plus class="size-3.5" />
												</button>
											</div>

											<button
												class="group/remove flex items-center gap-1.5 rounded-md px-2 py-1 text-sm text-gray-500 transition-colors hover:text-red-600"
												aria-label="Remove item"
												onclick={(e) => cartModule.removeItem(e, item)}
											>
												<span class="hidden sm:inline">Remove</span>
												<Trash class="size-4 transition-colors group-hover/remove:text-red-500" />
											</button>
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
								<button class="text-sm text-red-500" onclick={cartState.removeCoupon}>
									<X class="h-4 w-4" />
								</button>
							</div>
						</div>
					{/if}

					<CouponsDrawer />

					<div class="space-y-6 rounded-md border p-4">
						<div class="">
							<h2 class="text-xl font-semibold">Price Summary</h2>
							<span class="mb-4 text-sm text-gray-400">Includes all government taxes</span>
							{#if cartModule.loadingForCart}
								<div class="flex items-center justify-center py-8">
									<LoadingDots />
								</div>
							{:else}
								<div class="space-y-4 max-sm:text-sm">
									<div class="space-y-3 border-b py-4">
										<div class="flex justify-between">
											<span class="text-gray-600">Subtotal</span>
											<span>{formatPrice(cartState.cart.subtotal, page?.data?.store?.currency?.code)}</span>
										</div>
										{#if cartState.cart.discountAmount > 0}
											<div class="flex justify-between text-green-600">
												<span>Discount</span>
												<span>- {formatPrice(cartState.cart.discountAmount, page?.data?.store?.currency?.code)}</span>
											</div>
										{/if}
										<div class="flex flex-col justify-between">
											<div class="flex justify-between">
												<span class="text-gray-600">Shipping</span>
												<!-- {#if cartState.cart.total > freeShippingOn}
													<span class="rounded border border-green-500 px-1.5 text-xs text-green-500 sm:text-sm">FREE</span>
												{:else} -->
												<!-- <span
                          >{cartState.cart.shippingCharges
                            ? formatPrice(
                                cartState.cart.shippingCharges,
                                page?.data?.store?.currency?.code
                              )
                            : shippingCharges
                              ? formatPrice(
                                  shippingCharges,
                                  page?.data?.store?.currency?.code
                                )
                              : "FREE"}</span> -->
												{#if !cartState.cart.shippingAddress}
													<span class="text-gray-600"> will be calulcated after entering address. </span>
												{:else if cartState.cart.shippingCharges}
													<span>{formatPrice(cartState.cart.shippingCharges, page?.data?.store?.currency?.code)}</span>
												{:else}
													<span class="rounded border border-green-500 px-1.5 text-xs text-green-500 sm:text-sm">FREE</span>
												{/if}
												<!-- {/if} -->
											</div>
											{#if cartState.cart.shippingAddress}
												<p class="text-xs text-zinc-500">Shipping in 7 - 12 days</p>
											{/if}
										</div>
									</div>

									<div class="flex items-center justify-between text-base font-semibold sm:py-4 sm:text-lg">
										<span>Total</span>
										<span>{formatPrice(cartState.cart.total, page?.data?.store?.currency?.code)}</span>
									</div>

									{#if cartModule.showError}
										<div class="mb-4 text-red-500">
											{cartModule.errorMessage}
										</div>
									{/if}

									<div class="w-full rounded-lg bg-slate-100 p-4 shadow-sm">
										<div class="flex items-center justify-center gap-3">
											<LockKeyhole class="h-5 w-5 text-slate-600" />
											<p class="font-medium text-slate-700">Your order is secured with 256-bit encryption</p>
										</div>
									</div>

									{#if !cartModule.noItemsChecked}
										<Button
											class="group bottom-0 left-0 right-0 z-[45] w-full py-6 text-lg hover:bg-primary max-sm:fixed max-sm:h-16 max-sm:rounded-none"
											onclick={cartModule.gotoCheckout}
										>
											{#if cartModule.loadingForCheckout}
												<LoadingDots />
											{:else}
												Continue to Address <ChevronRight class="size-4 duration-300 group-hover:translate-x-2" />
											{/if}
										</Button>
									{:else}
										<div class="rounded-md bg-yellow-100 py-4">
											<p class="text-center text-gray-700">Please select at least one item to proceed</p>
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
	</div>
</div>

