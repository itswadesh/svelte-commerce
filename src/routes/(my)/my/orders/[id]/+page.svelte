<script lang="ts">
	import LazyImg from '$lib/core/components/image/lazy-img.svelte'
	import Button from '$lib/components/ui/button/button.svelte'
	import OrderListSkeleton from '../_OrderListSkeleton.svelte'
	import BackButton from '$lib/components/common/back-button.svelte'
	import StatusCell from '$lib/components/common/status-cell.svelte'
	import { FileText, Truck, Calendar, CreditCard, Home, Building, ShoppingBag, Tag, Currency, RefreshCw, ChevronRight } from 'lucide-svelte'
	import { page } from '$app/state'
	import { date, formatPrice } from '$lib/core/utils'
	import MyOrdersIdRenderer from '$lib/core/composables/my-orders-id-renderer.svelte'

	let { class: klass = '', data, ...rest } = $props()
</script>

<svelte:head>
	<title>Order Details</title>
</svelte:head>

<MyOrdersIdRenderer>
	{#snippet content({ loading, order })}
		<div class={klass}>
			{#if loading}
				<OrderListSkeleton />
			{:else if order}
				<section class="space-y-4">
					<div class="flex flex-wrap items-center gap-2">
						<BackButton to="/my/orders" title="Orders" />
					</div>

					<div class="overflow-hidden rounded-lg border bg-white shadow-sm">
						<div class="flex flex-wrap items-center justify-between gap-4 rounded-lg rounded-b-none border-b bg-gray-50 px-4 py-3">
							<div class="flex items-center gap-2">
								<ShoppingBag class="h-4 w-4 text-gray-500" />
								<h6 class="text-sm font-medium">Order #{order?.orderNo}</h6>
							</div>

							<div class="flex items-center gap-1.5">
								<Calendar class="h-3.5 w-3.5 text-gray-400" />
								<h6 class="text-xs text-gray-500">{date(order?.createdAt)}</h6>
							</div>
						</div>

						<div class="grid grid-cols-1 divide-y lg:grid-cols-3 lg:divide-x lg:divide-y-0">
							<!-- Order Items -->
							<div class="col-span-2 flex flex-col">
								{#if order?.lineItems}
									<div class="space-y-2 p-3">
										{#each order?.lineItems as item}
											{#if item}
												<div class="flex gap-3 border border-gray-200 bg-white p-3 transition-colors hover:bg-gray-50">
													<a href={`/product/${item.slug}`} aria-label="Click to view the product details" class="shrink-0">
														{#if item.isCustomized}
															<img src={item.customizedImg} alt=" " class="h-16 w-16 border border-gray-100 object-contain object-top" />
														{:else}
															<LazyImg
																src={item.thumbnail || item.img}
																alt=" "
																width="64"
																class="h-16 w-16 border border-gray-100 object-contain object-top"
															/>
														{/if}
													</a>

													<div class="flex w-full flex-1 flex-col">
														<div class="mb-1.5 flex items-start justify-between">
															<a href={`/products/${item.slug}`} aria-label="Click to view the product details" class="flex-1 hover:underline">
																<h3 class="line-clamp-2 text-sm font-medium text-gray-900">
																	{item.title}
																</h3>
															</a>

															<div class="text-sm font-medium text-gray-900">
																{formatPrice(item.price, page?.data?.store?.currency?.code)}
															</div>
														</div>

														<div class="mb-1.5 flex flex-wrap gap-2 text-xs text-gray-500">
															{#if item.qty}
																<span class="flex items-center gap-1">
																	<Tag class="h-3 w-3" />
																	<span class="font-medium">Qty:</span>
																	{item.qty}
																</span>
															{/if}

															{#if item.size}
																<span class="flex items-center gap-1">
																	<span class="font-medium">Size:</span>
																	{item.size}
																</span>
															{/if}

															{#if item?.mrp > item?.price && Math.floor(((item.mrp - item.price) / item.mrp) * 100) > 0}
																<span class="flex items-center gap-1 text-xs text-green-600">
																	<Tag class="h-3 w-3" />
																	({Math.floor(((item.mrp - item.price) / item.mrp) * 100)}% off)
																</span>
															{/if}
														</div>

														{#if item?.usedOptions?.length}
															<div class="mb-1.5 flex flex-wrap gap-2 text-xs">
																{#each item?.usedOptions as option}
																	{#if option?.val?.length && option?.val !== undefined && option?.val != ''}
																		<div class="flex flex-wrap text-gray-500">
																			<span class="mr-1 font-medium">{option.name}:</span>
																			<span>
																				{#each option.val as v, valIndex}
																					{#if v}{v}{#if valIndex < option.val?.length - 1},
																						{/if}{/if}
																				{/each}
																			</span>
																		</div>
																	{/if}
																{/each}
															</div>
														{/if}

														<div class="flex flex-wrap gap-2">
															{#if item?.files?.length}
																{#each item?.files as file, fx}
																	<a href={file} download class="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800">
																		<FileText class="h-3.5 w-3.5" />
																		Download File {#if item?.files?.length > 1}{fx + 1}{/if}
																	</a>
																{/each}
															{/if}

															{#if item?.status === 'delivered'}
																<a
																	href="/my/reviews/create?pid={item?.pid}&oid={item?.orderItemId}&ref=/product/{item?.slug}"
																	aria-label="Click to visit rate & review product"
																	class="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800"
																>
																	<svg
																		xmlns="http://www.w3.org/2000/svg"
																		class="h-3.5 w-3.5"
																		viewBox="0 0 24 24"
																		fill="none"
																		stroke="currentColor"
																		stroke-width="2"
																		stroke-linecap="round"
																		stroke-linejoin="round"
																		><polygon
																			points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
																		/></svg
																	>
																	Rate & Review Product
																</a>
															{/if}
														</div>
													</div>
												</div>
											{/if}
										{/each}
									</div>
								{:else}
									<p class="p-4 text-sm text-gray-500">No order items found</p>
								{/if}
							</div>

							<!-- Order Details -->
							<div class="col-span-1 flex flex-col gap-4 bg-gray-50/50 p-4">
								<!-- Estimated Delivery -->
								<div class="space-y-1.5">
									<div class="flex items-center gap-1.5">
										<Truck class="h-4 w-4 text-gray-500" />
										<h5 class="text-sm font-semibold">Estimated Delivery</h5>
									</div>
									<div class="rounded-lg border bg-white p-2.5">
										<div class="flex flex-col gap-1.5">
											<div class="group relative flex items-center gap-1.5">
												<Calendar class="h-3.5 w-3.5 text-gray-400" />
												<p class="text-xl font-bold text-green-600">
													{order?.shippingRate?.estimatedMaxDays
														? date(order.createdAt + order?.shippingRate?.estimatedMaxDays)
														: date(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))}
												</p>
												<div class="absolute bottom-full left-0 mb-2 hidden rounded bg-gray-800 p-2 text-xs text-white shadow-lg group-hover:block">
													Estimated delivery date
												</div>
											</div>
											<div class="flex items-center justify-between">
												<div class="flex items-center gap-2">
													<StatusCell value={order?.status || 'processing'} />
												</div>
												{#if order?.status === 'shipped' && order?.fulfillments?.[0]?.trackingUrl}
													<a
														target="_blank"
														href={order?.fulfillments[0]?.trackingUrl}
														class="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800"
													>
														Track Order
														<ChevronRight class="h-3 w-3" />
													</a>
												{/if}
											</div>
										</div>
									</div>
								</div>

								<!-- Addresses -->
								<div class="space-y-1.5">
									<div class="flex items-center gap-1.5">
										<Home class="h-4 w-4 text-gray-500" />
										<h5 class="text-sm font-semibold">Delivery Address</h5>
									</div>

									<div class="rounded-lg border p-2">
										<p class="flex flex-col gap-0.5 text-xs">
											<span class="font-medium text-gray-900">
												{order?.shippingAddress?.firstName}
												{order?.shippingAddress?.lastName}
											</span>
											<span class="text-gray-600">
												{order?.shippingAddress?.address_1}
												{#if order?.shippingAddress?.address_2}
													, {order?.shippingAddress?.address_2}
												{/if}
												, {order?.shippingAddress?.city}, {order?.shippingAddress?.state}
												, {order?.shippingAddress?.country || order?.shippingAddress?.countryCode}
												, {order?.shippingAddress?.zip}
											</span>
											{#if order?.shippingAddress?.phone}
												<span class="text-gray-600">{order?.shippingAddress?.phone}</span>
											{/if}
										</p>
									</div>
								</div>

								{#if order?.billingAddress}
									<div class="space-y-1.5">
										<div class="flex items-center gap-1.5">
											<Building class="h-4 w-4 text-gray-500" />
											<h5 class="text-sm font-semibold">Billing Address</h5>
										</div>

										<div class="rounded-lg border p-2">
											<p class="flex flex-col gap-0.5 text-xs">
												<span class="font-medium text-gray-900">
													{order?.billingAddress?.firstName}
													{order?.billingAddress?.lastName}
												</span>
												<span class="text-gray-600">
													{order?.billingAddress?.address_1}
													{#if order?.billingAddress?.address_2}
														, {order?.billingAddress?.address_2}
													{/if}
													, {order?.billingAddress?.city}, {order?.billingAddress?.state}
													, {order?.billingAddress?.country || order?.billingAddress?.countryCode}
													, {order?.billingAddress?.zip}
												</span>
												{#if order?.billingAddress?.phone}
													<span class="text-gray-600">{order?.billingAddress?.phone}</span>
												{/if}
											</p>
										</div>
									</div>
								{/if}

								<!-- Fulfillments -->
								<div class="space-y-3">
									<div class="flex items-center gap-2">
										<Truck class="h-4 w-4 text-gray-500" />
										<h5 class="text-sm font-semibold">Fulfillments</h5>
									</div>
									<div class="space-y-3">
										{#each order.fulfillments as fulfillment, ix}
											<div class="flex justify-between gap-3 rounded-lg border p-3">
												<div class="flex grow gap-2 overflow-x-auto">
													<div class="text-xs font-medium text-gray-700">Fulfillment-{ix + 1}</div>
													{#each fulfillment?.lineItems as item}
														<a href="/products/{item.slug}" class="relative">
															<LazyImg src={item.thumbnail || item.img} alt=" " width="48" class="h-12 w-12 rounded-lg object-contain object-top" />
															<span
																class="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] text-white"
															>
																{item.qty}
															</span>
														</a>
													{/each}
												</div>
												<div class="flex flex-col items-end gap-1.5">
													<StatusCell value={fulfillment?.status} />
													{#if fulfillment?.trackingUrl}
														<a
															target="_blank"
															href={fulfillment?.trackingUrl}
															class="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800"
														>
															<Truck class="h-3.5 w-3.5" />
															Track Delivery
														</a>
													{/if}
												</div>
											</div>
										{:else}
											<p class="text-xs text-gray-500">No fulfillments yet</p>
										{/each}
									</div>
								</div>

								<!-- Order Summary -->
								<div class="space-y-3">
									<div class="flex items-center gap-2">
										<Currency class="h-4 w-4 text-gray-500" />
										<h5 class="text-sm font-semibold">Order Summary</h5>
									</div>
									<div class="rounded-lg border bg-white p-3">
										<div class="flex flex-col gap-2">
											<div class="flex items-center justify-between text-xs">
												<span class="text-gray-600">Subtotal</span>
												<span class="font-medium">
													{formatPrice(order?.subtotal, page?.data?.store?.currency?.code) || '0.00'}
												</span>
											</div>

											{#if order?.discount > 0}
												<div class="flex items-center justify-between text-xs">
													<span class="text-gray-600">Discount</span>
													<span class="font-medium">
														{formatPrice(order?.discount, page?.data?.store?.currency?.code)}
													</span>
												</div>
											{/if}

											{#if order?.coupon?.code}
												<div class="flex items-center justify-between text-xs">
													<span class="text-gray-600">Applied Coupon</span>
													<span class="font-medium">{order?.coupon?.code}</span>
												</div>
											{/if}

											<div class="flex items-center justify-between text-xs">
												<span class="text-gray-600">Shipping</span>
												<span class="font-medium">
													{#if order?.shippingCharges}
														{formatPrice(order?.shippingCharges, page?.data?.store?.currency?.code)}
													{:else}
														Free
													{/if}
												</span>
											</div>

											{#if order?.codCharges}
												<div class="flex items-center justify-between text-xs">
													<span class="text-gray-600">COD Charges</span>
													<span class="font-medium">
														{formatPrice(order?.codCharges, page?.data?.store?.currency?.code)}
													</span>
												</div>
											{/if}

											<hr class="my-1 border-t border-zinc-200" />

											<div class="flex items-center justify-between text-sm">
												<span class="font-semibold text-gray-900">Total</span>
												<span class="font-bold text-gray-900">
													{formatPrice(order?.total, page?.data?.store?.currency?.code)}
												</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- Actions -->
					<div class="space-y-4">
						{#if !!order?.foodType && order?.status !== 'delivered' && order?.expectedDeliveryDate}
							<div class="flex flex-wrap items-center gap-2 rounded-lg border bg-white p-3">
								<Calendar class="h-4 w-4 text-gray-500" />
								<h5 class="text-sm font-medium">Expected Delivery Date:</h5>
								<p class="text-sm text-gray-600">{date(order?.expectedDeliveryDate)}</p>
							</div>
						{/if}

						<div class="flex flex-wrap gap-3">
							{#if order?.invoiceLink}
								<a href={order?.invoiceLink} aria-label="Click to download invoice" target="blank" class="inline-flex items-center gap-2">
									<Button class="w-40 py-2 text-sm" type="button">
										<FileText class="h-4 w-4" />
										Download Invoice
									</Button>
								</a>
							{/if}

							{#if order?.replaceValidTill != null && now && now <= order?.replaceValidTill && !order?.isReplaceOrReturn}
								<a
									href="/my/exchange?orderId=${order?.orderId}&itemId=${order?.itemId}"
									aria-label="Click to visit exchange"
									class="inline-flex items-center gap-2"
								>
									<Button class="w-40 py-2 text-sm" type="button">
										<RefreshCw class="h-4 w-4" />
										Exchange
									</Button>
								</a>
							{/if}
						</div>
					</div>

					<!-- Action Buttons -->
					<div class="mt-4 flex flex-wrap gap-3 border-t border-gray-200 bg-gray-50 p-4">
						<Button variant="outline" href="/products?collection={order?.collection?.slug || ''}">Buy Again</Button>
						<Button variant="ghost" class="flex items-center gap-1" href="/my/orders">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-4 w-4"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg
							>
							Back to Orders
						</Button>
					</div>
				</section>
			{:else}
				<div class="flex h-[70vh] flex-col items-center justify-center text-center">
					<h2 class="mb-2 text-xl font-semibold">You haven't Ordered Yet!</h2>
					<p class="mb-5 text-gray-600">Add items to it now</p>
					<a href="/" aria-label="Click to visit home" data-sveltekit-preload-data>
						<Button class="w-40 py-2 text-sm">Shop Now</Button>
					</a>
				</div>
			{/if}
		</div>
	{/snippet}
</MyOrdersIdRenderer>

