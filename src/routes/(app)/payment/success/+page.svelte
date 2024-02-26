<style>
.checkmark {
	width: 100px;
	height: 100px;
	border-radius: 50%;
	display: block;
	stroke-width: 4;
	stroke: #4bb71b;
	stroke-miterlimit: 10;
	box-shadow: inset 0px 0px 0px #4bb71b;
	animation:
		fill 0.4s ease-in-out 0.4s forwards,
		scale 0.3s ease-in-out 0.9s both;
	position: relative;
	top: 5px;
	right: 5px;
	margin: 0 auto;
}

.checkmark__circle {
	stroke-dasharray: 166;
	stroke-dashoffset: 166;
	stroke-width: 4;
	stroke-miterlimit: 10;
	stroke: #4bb71b;
	fill: #fff;
	animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}

.checkmark__check {
	transform-origin: 50% 50%;
	stroke-dasharray: 48;
	stroke-dashoffset: 48;
	animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
}

@keyframes stroke {
	100% {
		stroke-dashoffset: 0;
	}
}

@keyframes scale {
	0%,
	100% {
		transform: none;
	}

	50% {
		transform: scale3d(1.1, 1.1, 1);
	}
}

@keyframes fill {
	100% {
		box-shadow: inset 0px 0px 0px 30px #4bb71b;
	}
}
</style>

<script>
// import { storeStore } from '$lib/store/store'
import { browser } from '$app/environment'
import { Confetti } from 'svelte-confetti'
import { currency, date } from '$lib/utils'
import { fireGTagEvent } from '$lib/utils/gTagB'
import { onMount } from 'svelte'
import { page } from '$app/stores'
import { getCartFromStore, updateCartStore } from '$lib/store/cart'
import LazyImg from '$lib/components/Image/LazyImg.svelte'
import PrimaryButton from '$lib/ui/PrimaryButton.svelte'
import productNonVeg from '$lib/assets/product/non-veg.png'
import productVeg from '$lib/assets/product/veg.png'
import SEO from '$lib/components/SEO/index.svelte'
import WhiteButton from '$lib/ui/WhiteButton.svelte'

export let data

const seoProps = {
	title: 'Payment Success ',
	metaDescription: 'Payment Success '
}

// let store = {}
$: store = $page.data.store
let cart = {}
onMount(async () => {
	if (browser) {
		cart = await getCartFromStore({
			origin: $page.data?.origin,
			storeId: $page.data.storeId,
			cartId: data.cartId,
			forceUpdate: true
		})
		fireGTagEvent('purchase', data?.order)
		updateCartStore({ data: cart })
	}
})
</script>

<SEO {...seoProps} />

{#if data.order}
	<div class="min-h-screen w-full px-3 py-5 sm:p-10">
		<div class="container mx-auto max-w-6xl">
			<div>
				<div class="mb-5 sm:mb-10">
					<svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
						<circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"></circle>

						<path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"></path>
					</svg>
				</div>

				{#if data.order}
					<h1 class="mb-2 text-center">
						{#if data.order?.seatsBooked}
							Thank You For Your Booking!!
						{:else}
							Thank You For Your Purchase!!
						{/if}
					</h1>
				{/if}

				<p class="mb-5 text-center">
					A confirmation e-mail/sms will be sent to the e-mail address that you specified during
					Order.
				</p>

				<div
					class="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-10 md:gap-20 mb-8">
					<!-- Order Info -->
					<div class="flex flex-col gap-5 col-span-1">
						{#if data.order && data.order?.amount}
							<div>
								<h4 class="mb-5 border-b border-dashed border-zinc-400 pb-2">Order Info</h4>

								<div class="flex max-w-max flex-col items-start gap-2">
									<p class="flex items-center">
										<span class="mr-2 w-32">Order No</span>

										<span>
											: &nbsp; {data.order?.orderNo || '_'}
										</span>
									</p>

									<p class="flex items-center">
										<span class="mr-2 w-32">Order Placed On </span>

										<span>
											: &nbsp; {#if data.order?.createdAt}{date(data.order?.createdAt)}{:else}
												_{/if}
										</span>
									</p>

									<p class="flex items-center">
										<span class="mr-2 w-32">Payment Status </span>

										<span
											class="uppercase"
											class:text-brand-500="{data.order?.paymentStatus === 'paid'}">
											: &nbsp; {data.order?.paymentStatus || '_'}
										</span>
									</p>

									<p class="flex items-center">
										<span class="mr-2 w-32">Payment Mode </span>

										<span class="uppercase">
											: &nbsp; {data.order?.paymentMode || '_'}
										</span>
									</p>
									{#if data.order?.paymentGateway}
										<p class="flex items-center">
											<span class="mr-2 w-32">Payment Gateway </span>

											<span class="uppercase">
												: &nbsp; {data.order?.paymentGateway || '_'}
											</span>
										</p>
									{/if}
								</div>
							</div>
						{/if}
					</div>
					<!-- Payment Information -->
					<div class="flex flex-col gap-5 col-span-1">
						{#if data.order && data.order?.amount}
							<div>
								<h4 class="mb-5 border-b border-dashed border-zinc-400 pb-2">
									Payment Information
								</h4>

								<div class="flex max-w-max flex-col items-start gap-2">
									<p class="flex items-center">
										<span class="mr-2 w-32">Subtotal</span>

										<span>
											: &nbsp; {currency(data.order?.amount.subtotal, store?.currencySymbol)}
										</span>
									</p>

									<p class="flex items-center">
										<span class="mr-2 w-32">Discount</span>

										<span>
											: &nbsp;

											{currency(data.order?.amount.discount, store?.currencySymbol)}
										</span>
									</p>

									{#if data.order?.coupon.code}
										<p class="flex items-center">
											<span class="mr-2 w-32">Applied Coupon</span>

											<span>
												: &nbsp;
												{data.order?.coupon.code}
											</span>
										</p>
									{/if}

									<p class="flex items-center">
										<span class="mr-2 w-32">Shipping</span>

										<span>
											: &nbsp;
											{#if data.order?.amount.shipping}
												{currency(data.order?.amount.shipping, store?.currencySymbol)}
											{:else}
												Free
											{/if}
										</span>
									</p>

									{#if data.order?.amount.cod_charges}
										<p class="flex items-center">
											<span class="mr-2 w-32">COD Charges</span>

											<span>
												: &nbsp;
												{currency(data.order?.amount.cod_charges, store?.currencySymbol)}
											</span>
										</p>
									{/if}

									<hr class="w-full border-t border-zinc-200" />

									<div class="flex items-center text-sm font-bold text-zinc-800">
										<span class="mr-2 w-32">Total</span>

										<span>
											: &nbsp; {currency(data.order?.amount.total, store?.currencySymbol)}
										</span>
									</div>
								</div>
							</div>
						{/if}
					</div>
				</div>

				<div class="mb-5 flex flex-wrap items-center justify-center gap-2 sm:mb-10 sm:gap-5">
					{#if data.order?.seatsBooked}
						<a
							href="/my/orders?page=1"
							rel="noopener"
							aria-label="Click to view the booking details">
							<PrimaryButton type="button">View Booking Details</PrimaryButton>
						</a>
					{:else}
						<a
							href="/my/orders"
							rel="noopener"
							aria-label="Click to view the order details"
							data-sveltekit-preload-data>
							<PrimaryButton type="button">View Order Details</PrimaryButton>
						</a>
					{/if}

					<a href="/" rel="noopener" aria-label="Click to visit home" data-sveltekit-preload-data>
						<WhiteButton type="button">Continue Shopping</WhiteButton>
					</a>
				</div>
			</div>

			<div class="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-10 md:gap-20">
				<div class="flex flex-col gap-5 col-span-1">
					<!-- Booking Information -->

					<!-- {#if data.order?.seats?.length > 0}
							<div>
								<h4 class="mb-5 border-b border-dashed border-zinc-400 pb-2">Booking Information</h4>
	
								<div class="items-start flex flex-col divide-y text-sm">
									{#each data.order?.seats as seat}
										<div class="flex flex-col gap-2 py-4">
											<span><span>Seat Number : &nbsp; </span> {seat.seatNo} </span>
	
											<span>
												<span>Seat Type : &nbsp; </span>
	
												{#if seat.seatType === 'horizontal_sleeper'}
													Sleeper
												{:else}
													Seater
												{/if}
											</span>
										</div>
									{/each}
								</div>
							</div>
						{/if} -->

					<!-- Delivery Information -->

					{#if data.order && data.order?.shipping_address}
						<div>
							<h4 class="mb-5 border-b border-dashed border-zinc-400 pb-2">Delivery Information</h4>

							<div class="flex flex-col gap-1">
								{#if data.order?.shipping_address.firstName}
									<p>
										{data.order?.shipping_address.firstName}

										{data.order?.shipping_address.lastName}
									</p>
								{/if}

								<p>
									{#if data.order?.shipping_address.address}
										{data.order?.shipping_address.address}
									{/if}

									{#if data.order?.shipping_address.city}
										, {data.order?.shipping_address.city}
									{/if}

									{#if data.order?.shipping_address.country}
										, {data.order?.shipping_address.country}
									{/if}

									{#if data.order?.shipping_address.zip}
										- {data.order?.shipping_address.zip}
									{/if}
								</p>

								{#if data.order?.shipping_address.phone || data.order?.shipping_address.userPhone}
									<p>
										{data.order?.shipping_address.phone || data.order?.userPhone}
									</p>
								{/if}

								{#if data.order?.shipping_address.email}
									<p>
										{data.order?.shipping_address.email}
									</p>
								{/if}
							</div>
						</div>
					{/if}
				</div>
				<!-- Billing Information -->
				<div class="flex flex-col gap-5 col-span-1">
					{#if data.order && data.order?.billing_address}
						<div>
							<h4 class="mb-5 border-b border-dashed border-zinc-400 pb-2">Billing Information</h4>

							<div class="flex flex-col gap-1">
								{#if data.order?.billing_address.firstName}
									<p>
										{data.order?.billing_address.firstName}

										{data.order?.billing_address.lastName}
									</p>
								{/if}

								<p>
									{#if data.order?.billing_address.address}
										{data.order?.billing_address.address}
									{/if}

									{#if data.order?.billing_address.city}
										, {data.order?.billing_address.city}
									{/if}

									{#if data.order?.billing_address.country}
										, {data.order?.billing_address.country}
									{/if}

									{#if data.order?.billing_address.zip}
										- {data.order?.billing_address.zip}
									{/if}
								</p>

								{#if data.order?.billing_address.phone || data.order?.billing_address.userPhone}
									<p>
										{data.order?.billing_address.phone || data.order?.userPhone}
									</p>
								{/if}

								{#if data.order?.billing_address.email}
									<p>
										{data.order?.billing_address.email}
									</p>
								{/if}
							</div>
						</div>
					{/if}
				</div>

				<!-- Item Details -->
				<div class="flex flex-col gap-5 col-span-1">
					{#if data.order?.items?.length > 0}
						<div>
							<h4 class="border-b border-dashed border-zinc-400 pb-2">Item Details</h4>

							<div class="divide-y divide-dashed text-xs text-zinc-500">
								{#each data.order?.items as item}
									<div class="flex gap-2 py-5 lg:gap-5">
										<a
											href="{`/product/${item.slug}`}"
											aria-label="Click to view the product details"
											class="shrink-0">
											<LazyImg
												src="{item.isCustomized ? item.customizedImg : item.img}"
												alt=""
												width="56"
												class="h-auto w-14 object-contain object-top" />
										</a>

										<div class="flex w-full flex-1 flex-col gap-0.5 xl:pr-4">
											<div class="flex justify-between gap-2 sm:gap-4">
												<a
													href="{`/product/${item.slug}`}"
													aria-label="Click to view the product details"
													class="flex-1 hover:underline">
													<p>
														{item.name}
													</p>
												</a>

												{#if $page.data.store?.isFnb && item.foodType}
													<div>
														{#if item.foodType === 'veg'}
															<img src="{productVeg}" alt="veg" class="h-5 w-5" />
														{:else if item.foodType === 'nonveg'}
															<img src="{productNonVeg}" alt="non veg" class="h-5 w-5" />
														{/if}
													</div>
												{/if}
											</div>

											{#if item.qty}
												<span>
													Qty :

													<b>
														{item.qty}
													</b>
												</span>
											{/if}

											{#if item.size}
												<span>
													Size :

													<b>
														{item.size}
													</b>
												</span>
											{/if}

											{#if item?.usedOptions?.length}
												{#each item?.usedOptions as option}
													{#if option?.val?.length && option?.val !== undefined && option?.val != ''}
														<div class="flex flex-wrap gap-2">
															<span>{option.name}:</span>

															{#if option.val}
																<ul
																	class="flex flex-wrap items-center gap-x-2 gap-y-1 text-zinc-800">
																	{#each option.val as v, valIndex}
																		{#if v}
																			<b>
																				{v}
																			</b>

																			{#if valIndex < option.val?.length - 1}
																				,
																			{/if}
																		{/if}
																	{/each}
																</ul>
															{/if}
														</div>
													{/if}
												{/each}
											{/if}

											<div class="flex flex-wrap items-center gap-1">
												Item price :

												<span class="font-bold whitespace-nowrap text-zinc-800">
													{currency(item.price, store?.currencySymbol)}
												</span>

												{#if item?.mrp > item?.price}
													<span class="whitespace-nowrap text-zinc-500 line-through">
														<strike>
															{currency(item.mrp, store?.currencySymbol)}
														</strike>
													</span>

													{#if Math.floor(((item.mrp - item.price) / item.mrp) * 100) > 0}
														<span class="whitespace-nowrap text-secondary-500">
															({Math.floor(((item.mrp - item.price) / item.mrp) * 100)}% off)
														</span>
													{/if}
												{/if}
											</div>

											<div class="flex flex-wrap items-center gap-1">
												Sub Total :

												<span class="font-bold whitespace-nowrap text-zinc-800">
													{currency(item.subtotal, store?.currencySymbol)}
												</span>

												{#if item?.total > item?.subtotal}
													<span class="whitespace-nowrap text-zinc-500 line-through">
														<strike>
															{currency(item.total, store?.currencySymbol)}
														</strike>
													</span>

													{#if Math.floor(((item.total - item.subtotal) / item.total) * 100) > 0}
														<span class="whitespace-nowrap text-secondary-500">
															({Math.floor(((item.total - item.subtotal) / item.total) * 100)}% off)
														</span>
													{/if}
												{/if}
											</div>

											{#if item?.files?.length}
												<ul class="mt-2 p-0 list-none flex flex-col gap-1">
													{#each item?.files as file, fx}
														<li>
															<a href="{file}" download>
																<PrimaryButton loadingringsize="xs" class="text-xs">
																	Download File

																	{#if item?.files?.length > 1}
																		{fx + 1}
																	{/if}
																</PrimaryButton>
															</a>
														</li>
													{/each}
												</ul>
											{/if}
										</div>
									</div>
								{/each}
							</div>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}

<div
	style="position: fixed; top: -50px; left: 0; height: 100vh; width: 100vw; display: flex; justify-content: center; overflow: hidden; pointer-events: none;">
	<Confetti
		x="{[-5, 5]}"
		y="{[0, 0.1]}"
		delay="{[50, 2000]}"
		duration="2000"
		amount="500"
		fallDistance="100vh" />
</div>
