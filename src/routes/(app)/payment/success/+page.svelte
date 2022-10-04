<style>
.success-animation {
	margin: 150px auto;
}

.checkmark {
	width: 100px;
	height: 100px;
	border-radius: 50%;
	display: block;
	stroke-width: 4;
	stroke: #4bb71b;
	stroke-miterlimit: 10;
	box-shadow: inset 0px 0px 0px #4bb71b;
	animation: fill 0.4s ease-in-out 0.4s forwards, scale 0.3s ease-in-out 0.9s both;
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
import SEO from '$lib/components/SEO/index.svelte'
import LazyImg from '$lib/components/Image/LazyImg.svelte'
import PrimaryButton from '$lib/ui/PrimaryButton.svelte'
import { currency, date } from '$lib/util'
import { post } from '$lib/util/api'
import WhiteButton from '$lib/ui/WhiteButton.svelte'
import { Confetti } from 'svelte-confetti'
import { fireGTagEvent } from '$lib/util/gTag'
import { onMount } from 'svelte'

export let data

const seoProps = {
	title: 'Success ',
	metadescription: 'Success '
}

onMount(async () => {
	fireGTagEvent('purchase', data.order)
})
</script>

<SEO {...seoProps} />

{#if data.order}
	<div class="min-h-screen w-full  px-3 py-5 sm:p-10 ">
		<div class="container mx-auto max-w-6xl">
			<div>
				<div class="mb-5 sm:mb-10">
					<svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
						<circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"></circle>

						<path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"></path>
					</svg>
				</div>

				{#if data.order}
					<h2 class="mb-2 text-center text-2xl font-bold sm:text-3xl">
						{#if data.order?.seatsBooked}
							Thank You For Your Booking!!
						{:else}
							Thank You For Your Purchase!!
						{/if}
					</h2>
				{/if}

				<p class="mb-5 text-center text-sm">
					A confirmation e-mail will be sent to the e-mail address that you specified in Order
					details.
				</p>

				<ul class="mx-auto mb-5 flex max-w-max flex-col gap-2 sm:mb-10">
					<li class="flex items-start gap-2 text-sm">
						<h6 class="flex w-36 flex-shrink-0 items-center justify-between gap-1">
							<span>Order No</span> <span>:</span>
						</h6>

						<b>
							{data.order?.orderNo}
						</b>
					</li>

					<li class="flex items-start gap-2 text-sm">
						<h6 class="flex w-36 flex-shrink-0 items-center justify-between gap-1">
							<span>Order placed on</span> <span>:</span>
						</h6>

						<b>
							{date(data.order?.createdAt)}
						</b>
					</li>

					<li class="flex items-start gap-2 text-sm">
						<h6 class="flex w-36 flex-shrink-0 items-center justify-between gap-1">
							<span>Payment Status</span> <span>:</span>
						</h6>

						<spn class="uppercase" class:text-green-500="{data.order?.paymentStatus === 'paid'}">
							<b>
								{data.order?.paymentStatus}
							</b>
						</spn>
					</li>

					<li class="flex items-start gap-2 text-sm">
						<h6 class="flex w-36 flex-shrink-0 items-center justify-between gap-1">
							<span>Payment Mode</span> <span>:</span>
						</h6>

						<spn class="uppercase">
							<b>
								{data.order?.paymentMode}
							</b>
						</spn>
					</li>

					{#if data.order?.paymentGateway}
						<li class="flex items-start gap-2 text-sm">
							<h6 class="flex w-36 flex-shrink-0 items-center justify-between gap-1">
								<span>Payment Gateway</span> <span>:</span>
							</h6>

							<spn class="first-letter:uppercase">
								<b>
									{data.order?.paymentGateway}
								</b>
							</spn>
						</li>
					{/if}
				</ul>

				<div class="mb-5 flex flex-wrap items-center justify-center gap-2 sm:mb-10 sm:gap-5">
					{#if data.order?.seatsBooked}
						<a
							href="/my/orders?page=1#BusTickets"
							rel="noopener"
							aria-label="Click to view the booking details">
							<PrimaryButton type="button">View Booking Details</PrimaryButton>
						</a>
					{:else}
						<a
							href="/my/orders"
							rel="noopener"
							aria-label="Click to view the order details"
							data-sveltekit-prefetch>
							<PrimaryButton type="button">View Order Details</PrimaryButton>
						</a>
					{/if}

					<a href="/" rel="noopener" aria-label="Click to route home" data-sveltekit-prefetch>
						<WhiteButton type="button">Continue Shopping</WhiteButton>
					</a>
				</div>
			</div>

			<div
				class="mx-auto max-w-7xl gap-5 sm:flex sm:items-start sm:justify-center sm:gap-10 md:gap-20">
				<div class="sm:w-1/2">
					{#if data.order?.items?.length > 0}
						<div class="mb-5">
							<h6
								class="border-b border-dashed border-gray-400 pb-2 text-base font-bold sm:text-lg">
								Item Details
							</h6>

							<div class="itmes-start flex flex-col">
								{#each data.order?.items as item, ix}
									<a
										href="/product/{item.slug}"
										aria-label="Click to view the product details"
										class="group flex w-full flex-row justify-between py-4
										{ix != data.order?.items.length - 1 ? 'border-b' : ''}">
										<div class="flex w-full flex-row gap-4">
											<div>
												<LazyImg
													src="{item.isCustomizeditem ? item.customizedImg : item.imgCdn}"
													alt=""
													width="80"
													class="h-auto w-20 object-contain" />
											</div>

											<div class="w-4/5 flex-1 lg:w-10/12">
												<!-- {#if store.isFnb && item.vendor}
												<b class="mb-2 text-sm">
													{item.vendor.businessName}
												</b>
											{:else if item.brandName}
												<b class="mb-2 text-sm">
													{item.brandName}
												</b>
											{/if} -->

												<div class="mb-2 flex items-start gap-2">
													<a
														href="/product/{item.slug}"
														aria-label="Click to view the product details"
														class="text-sm text-gray-500 group-hover:underline">
														{item.name}
													</a>

													{#if store.isFnb}
														<div>
															{#if item.foodType === 'V'}
																<LazyImg
																	src="/product/veg.png"
																	alt="veg"
																	width="20"
																	height="20"
																	class="h-5 w-5" />
															{:else if item.foodType === 'N' || item.foodType === 'E'}
																<LazyImg
																	src="/product/non-veg.png"
																	alt="veg"
																	width="20"
																	height="20"
																	class="h-5 w-5" />
															{:else}
																<LazyImg
																	src="/product/other.png"
																	alt="veg"
																	width="20"
																	height="20"
																	class="h-5 w-5" />
															{/if}
														</div>
													{/if}
												</div>

												<div class="mb-2 flex w-full items-center gap-4 text-sm">
													<div class="me-4">
														<span class="font-medium text-gray-500 me-2">Qty :</span>

														<b>{item.qty}</b>
													</div>

													<div>
														<span class="font-medium text-gray-500 me-2">Price :</span>

														<b>{currency(item.price)}</b>
													</div>
												</div>

												<!-- Options -->

												{#if item.usedOptions}
													<div class="mb-2 flex flex-col gap-2 text-sm sm:mb-4">
														{#each item.usedOptions as o}
															<div class="flex flex-col items-start sm:flex-row">
																<h6 class="mb-1 w-full sm:mb-0 sm:w-52 sm:me-5">
																	{o.name}
																</h6>

																{#if o.val && o.val.length}
																	<span class="font-medium">
																		{o.val[0]}
																	</span>
																{/if}

																<div class="flex flex-col gap-1 font-medium">
																	{#if o.dates && o.dates[0]}
																		<span>
																			{o.dates[0]}
																		</span>
																	{/if}

																	{#if o.dates && o.dates[1]}
																		<span>
																			{o.dates[1]}
																		</span>
																	{/if}
																</div>
															</div>
														{/each}
													</div>
												{/if}
											</div>
										</div>
									</a>
								{/each}
							</div>
						</div>
					{/if}

					{#if data.order?.seats?.length > 0}
						<div class="mb-5">
							<h6
								class="mb-4 border-b border-dashed border-gray-400 pb-2 text-base font-semibold sm:text-lg">
								Booking Details
							</h6>

							<div class="itmes-start flex flex-col divide-y text-sm">
								{#each data.order?.seats as seat}
									<div class="flex flex-col gap-2 py-4">
										<span><b>Seat Number : &nbsp; </b> {seat.seatNo} </span>

										<span>
											<b>Seat Type : &nbsp; </b>

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
					{/if}
				</div>

				<div class="flex flex-col gap-4 sm:w-1/2">
					{#if data.order && data.order?.address}
						<div class="text-sm">
							<h6
								class="mb-4 border-b border-dashed border-gray-400 pb-2 text-base font-semibold sm:text-lg">
								Shipping Information
							</h6>

							<div class="text-sm text-gray-600">
								{#if data.order?.address.firstName}
									<h5 class="mb-2 text-base font-semibold capitalize tracking-wide">
										{data.order?.address.firstName}

										{data.order?.address.lastName}
									</h5>
								{/if}

								<div class="s flex flex-wrap">
									{#if data.order?.address.address}
										<div>
											{data.order?.address.address},
										</div>
									{/if}

									{#if data.order?.address.city}
										<div>
											{data.order?.address.city},
										</div>
									{/if}

									{#if data.order?.address.country}
										<div>
											{data.order?.address.country}
										</div>
									{/if}

									{#if data.order?.address.zip}
										<div>
											{data.order?.address.zip}
										</div>
									{/if}
								</div>

								{#if data.order?.address.phone || data.order?.address.userPhone}
									<div>
										<b>Phone:</b>

										<span>{data.order?.address.phone || data.order?.userPhone}</span>
									</div>
								{/if}

								{#if data.order?.address.email}
									<div>
										<b>Email:</b>

										<span>{data.order?.address.email}</span>
									</div>
								{/if}
							</div>
						</div>
					{/if}

					{#if data.order && data.order?.amount}
						<div class="text-sm">
							<h6
								class="mb-4 border-b border-dashed border-gray-400 pb-2 text-base font-semibold sm:text-lg">
								Payment Information
							</h6>

							<div class="flex max-w-max flex-col items-start gap-2">
								{#if data.order?.amount.subtotal}
									<div class="flex items-center">
										<h6 class="mr-2 w-20">Subtotal</h6>

										<span>: &nbsp; {currency(data.order?.amount.subtotal)} </span>
									</div>
								{/if}

								{#if data.order?.amount.discount}
									<div class="flex items-center">
										<h6 class="mr-2 w-20">Discount</h6>

										<span>: &nbsp; {currency(data.order?.amount.discount)} </span>
									</div>
								{/if}

								{#if data.order?.amount.shipping}
									<div class="flex items-center">
										<h6 class="mr-2 w-20">Shipping</h6>

										<span>: &nbsp; {currency(data.order?.amount.shipping)} </span>
									</div>
								{/if}

								{#if data.order?.amount.total}
									<hr class="w-full border-t border-gray-300" />

									<div class="flex items-center text-base font-bold">
										<h6 class="mr-2 w-20">Total</h6>

										<span>: &nbsp; {currency(data.order?.amount.total)} </span>
									</div>
								{/if}
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
