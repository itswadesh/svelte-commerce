<script lang="ts">
	import { page } from '$app/state'
	import productNonVeg from '$lib/assets/product/non-veg.png'
	import productVeg from '$lib/assets/product/veg.png'
	import { date, formatPrice } from '$lib/core/utils'
	import LazyImg from '$lib/core/components/image/lazy-img.svelte'
	import Button from '$lib/components/ui/button/button.svelte'
	import OrderListSkeleton from '../../(my)/my/orders/_OrderListSkeleton.svelte'
	import OrderTimeline from '$lib/components/order/order-timeline.svelte'
	import StatusCell from '$lib/components/common/status-cell.svelte'
	import { CheckCircle } from 'lucide-svelte'
	import { OrderTrackingModule } from '$lib/core/composables/use-order-tracking.svelte'

	const orderTrackingModule = new OrderTrackingModule()
</script>

<svelte:head>
	<title>Order</title>
</svelte:head>
<div>
	{#if orderTrackingModule.loading}
		<div class="flex items-center justify-center">
			<OrderListSkeleton />
		</div>
	{:else if orderTrackingModule.order && orderTrackingModule.order?.orderNo}
		<section class="container mx-auto">
			<div class="my-5 overflow-hidden rounded-lg border sm:mb-10">
				<div class="flex flex-wrap items-center justify-between rounded-lg rounded-b-none border-b bg-gray-50 px-5 py-3">
					<div class="flex items-center gap-4">
						<h6>Order No : #{orderTrackingModule.order?.orderNo}</h6>
						<StatusCell value={orderTrackingModule.order?.status} />
					</div>

					<h6 class="mt-2 text-sm text-gray-500 sm:mt-0">Order Date : {date(orderTrackingModule.order?.createdAt)}</h6>
				</div>

				<!-- Order detail  -->
				<div class="flex flex-col lg:grid lg:grid-cols-2 lg:divide-x">
					<div class="order-1 flex flex-col divide-y lg:order-none">
						{#if orderTrackingModule.order?.lineItems}
							<div class="divide-y divide-dashed text-xs text-zinc-500">
								{#each orderTrackingModule.order?.lineItems as item}
									{#if item}
										<div class="flex gap-2 p-5 lg:gap-5">
											<a href={`/products/${item.slug}`} aria-label="Click to view the product details" class="shrink-0">
												{#if item.isCustomized}
													<img src={item.customizedImg} alt=" " class="h-auto w-14 object-contain object-top" />
												{:else}
													<LazyImg src={item.thumbnail || item.img} alt=" " width="56" class="h-auto w-14 object-contain object-top" />
												{/if}
											</a>

											<div class="flex w-full flex-1 flex-col gap-0.5 xl:pr-4">
												<div class="flex justify-between gap-2 sm:gap-4">
													<a href={`/products/${item.slug}`} aria-label="Click to view the product details" class="flex-1 hover:underline">
														<p>
															{item.name}
														</p>
													</a>

													{#if page.data.store?.isFnb && item.foodType}
														<div>
															{#if item.foodType === 'veg'}
																<img src={productVeg} alt="veg" class="h-5 w-5" />
															{:else if item.foodType === 'nonveg'}
																<img src={productNonVeg} alt="non veg" class="h-5 w-5" />
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
																	<ul class="flex flex-wrap items-center gap-x-2 gap-y-1">
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

													<span class="whitespace-nowrap font-bold text-zinc-800">
														{formatPrice(item.price, page?.data?.store?.currency?.code)}
													</span>

													{#if item?.mrp > item?.price}
														<span class="whitespace-nowrap text-zinc-500 line-through">
															<strike>
																{formatPrice(item.mrp, page?.data?.store?.currency?.code)}
															</strike>
														</span>

														{#if Math.floor(((item.mrp - item.price) / item.mrp) * 100) > 0}
															<span class="text-secondary-500 whitespace-nowrap">
																({Math.floor(((item.mrp - item.price) / item.mrp) * 100)}% off)
															</span>
														{/if}
													{/if}
												</div>

												<div class="flex flex-wrap items-center gap-1">
													Sub Total :

													<span class="whitespace-nowrap font-bold text-zinc-800">
														{formatPrice(item.subtotal, page?.data?.store?.currency?.code)}
													</span>

													{#if item?.total > item?.subtotal}
														<span class="whitespace-nowrap text-zinc-500 line-through">
															<strike>
																{formatPrice(item.total, page?.data?.store?.currency?.code)}
															</strike>
														</span>

														{#if Math.floor(((item.total - item.subtotal) / item.total) * 100) > 0}
															<span class="text-secondary-500 whitespace-nowrap">
																({Math.floor(((item.total - item.subtotal) / item.total) * 100)}% off)
															</span>
														{/if}
													{/if}
												</div>

												{#if item?.files?.length}
													<ul class="mt-2 flex list-none flex-col gap-1 p-0">
														{#each item?.files as file, fx}
															<li>
																<a href={file} download>
																	<Button class="text-xs">
																		Download File

																		{#if item?.files?.length > 1}
																			{fx + 1}
																		{/if}
																	</Button>
																</a>
															</li>
														{/each}
													</ul>
												{/if}

												{#if item?.status === 'delivered'}
													<div class="mt-2 xl:mt-0 xl:w-1/3">
														<a
															href="/my/reviews/create?pid={item?.pid}&oid={item?.orderItemId}&ref=/product/{item?.slug}"
															aria-label="Click to visit rate & review product"
															class="max-w-max whitespace-nowrap font-semibold text-indigo-500 hover:underline focus:outline-none"
														>
															Rate & Review Product
														</a>
													</div>
												{/if}
											</div>
										</div>
									{/if}
								{/each}
							</div>
						{:else}
							<p>No order items found</p>
						{/if}
					</div>

					<div class="order-2 p-5 lg:order-none">
						<div class="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-5">
							<div class="space-y-2">
								<h5 class="font-semibold">Delivery Address</h5>

								<p class="flex flex-col text-sm">
									<span>
										{orderTrackingModule.order?.shippingAddress?.firstName}
										{orderTrackingModule.order?.shippingAddress?.lastName}

										<br />

										{orderTrackingModule.order?.shippingAddress?.address_1}
										{#if orderTrackingModule.order?.shippingAddress?.address_2}
											, {orderTrackingModule.order?.shippingAddress?.address_2}
										{/if}

										, {orderTrackingModule.order?.shippingAddress?.city}
										<br />
										{orderTrackingModule.order?.shippingAddress?.state},
										<span class="uppercase"
											>{orderTrackingModule.order?.shippingAddress?.country || orderTrackingModule.order?.shippingAddress?.countryCode}</span
										>,
										{orderTrackingModule.order?.shippingAddress?.zip}
									</span>
								</p>

								{#if orderTrackingModule.order?.shippingAddress?.phone}
									<p class="text-sm">
										{orderTrackingModule.order?.shippingAddress?.phone}
									</p>
								{/if}
							</div>

							<div class="space-y-2">
								<h5 class="font-semibold">Billing Address</h5>
								{#if orderTrackingModule.order?.billingAddressId === orderTrackingModule.order?.shippingAddressId}
									<div class="flex items-center gap-2 text-sm text-muted-foreground">
										<CheckCircle class="h-4 w-4 text-green-500" />
										<span>Same as shipping address</span>
									</div>
								{:else if orderTrackingModule.order?.billingAddress}
									<p class="flex flex-col text-sm">
										<span>
											{orderTrackingModule.order?.billingAddress?.firstName}
											{orderTrackingModule.order?.billingAddress?.lastName}

											<br />
											{orderTrackingModule.order?.billingAddress?.address_1}

											{#if orderTrackingModule.order?.billingAddress?.address_2}
												, {orderTrackingModule.order?.billingAddress?.address_2}
											{/if}

											, {orderTrackingModule.order?.billingAddress?.city}
											<br />
											{orderTrackingModule.order?.billingAddress?.state},
											<span class="uppercase"
												>{orderTrackingModule.order?.billingAddress?.country || orderTrackingModule.order?.billingAddress?.countryCode}</span
											>,
											{orderTrackingModule.order?.billingAddress?.zip}
										</span>
									</p>

									{#if orderTrackingModule.order?.billingAddress?.phone}
										<p class="text-sm">
											{orderTrackingModule.order?.billingAddress?.phone}
										</p>
									{/if}
								{/if}
							</div>
						</div>
					</div>

					<div class="order-3 col-span-full flex justify-end !border-0 !border-t border-gray-200 bg-gray-50 p-5">
						<div class="flex w-full max-w-md flex-col items-start gap-2">
							<p class="flex items-center">
								<span class="mr-2 w-32">Subtotal</span>

								<span>
									: &nbsp; {formatPrice(orderTrackingModule.order?.subtotal || 0, page?.data?.store?.currency?.code) || '0.00'}
								</span>
							</p>

							{#if orderTrackingModule.order?.discount && orderTrackingModule.order?.discount > 0}
								<p class="flex items-center">
									<span class="mr-2 w-32">Discount</span>

									<span>
										: &nbsp;

										{formatPrice(orderTrackingModule.order?.discount || 0, page?.data?.store?.currency?.code) || '0.00'}
									</span>
								</p>
							{/if}

							<p class="flex items-center">
								<span class="mr-2 w-32">Shipping</span>

								<span>
									: &nbsp;
									{#if orderTrackingModule.order?.shippingCharges}
										{formatPrice(orderTrackingModule.order?.shippingCharges, page?.data?.store?.currency?.code)}
									{:else}
										Free
									{/if}
								</span>
							</p>

							{#if orderTrackingModule.order?.codCharges}
								<p class="flex items-center">
									<span class="mr-2 w-32">COD Charges</span>

									<span>
										: &nbsp;

										{formatPrice(orderTrackingModule.order?.codCharges, page?.data?.store?.currency?.code)}
									</span>
								</p>
							{/if}

							<hr class="w-full border-t border-zinc-200" />

							<div class="flex items-center text-sm font-bold text-zinc-800">
								<span class="mr-2 w-32">Total</span>

								<span>
									: &nbsp; {formatPrice(orderTrackingModule.order?.total || 0, page?.data?.store?.currency?.code)}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Order Timeline -->
			{#if orderTrackingModule.order.tracking?.length}
				<OrderTimeline timeline={orderTrackingModule.order.tracking} />
			{/if}
		</section>
	{:else}
		<div class="flex h-[70vh] flex-col items-center justify-center text-center">
			<h2 class="mb-2 text-2xl font-semibold text-gray-800">Invalid Order Tracking URL</h2>
			<p class="mb-5 text-gray-600">The order tracking link appears to be invalid or has expired.</p>

			<a href="/" aria-label="Return to homepage" data-sveltekit-preload-data>
				<Button class="w-40 py-2 text-sm">Return Home</Button>
			</a>
		</div>
	{/if}
</div>

