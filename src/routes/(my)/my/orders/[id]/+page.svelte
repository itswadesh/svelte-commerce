<script lang="ts">
	import LazyImg from '$lib/core/components/image/lazy-img.svelte'
	import Button from '$lib/components/ui/button/button.svelte'
	import OrderListSkeleton from '../_OrderListSkeleton.svelte'
	import BackButton from '$lib/components/common/back-button.svelte'
	import StatusCell from '$lib/components/common/status-cell.svelte'
	import {
		FileText,
		Truck,
		Calendar,
		CreditCard,
		Home,
		Building,
		ShoppingBag,
		Tag,
		Currency,
		RefreshCw,
		ChevronRight,
		Package,
		MapPin,
		CreditCardIcon,
		ReceiptText
	} from '@lucide/svelte'
	import { page } from '$app/state'
	import { date, formatPrice } from '$lib/core/utils'
	import { MyOrdersIdRenderer } from '$lib/core/composables/index.js'

	let { class: klass = '', data, ...rest } = $props()

	// Every failure path in the connector resolves to a truthy empty object, so a stale bookmark, a
	// mistyped id or an API outage rendered a fully-formed order page: a heading with no number, an
	// address block containing only a comma, "Order Items (0)" and "$undefined" totals. The order
	// number is what says a real order came back; without it the empty state belongs on screen.
	const orderNumberOf = (order: any) => order?.orderNo ?? order?.orderNumber ?? order?.number ?? ''
	const isRealOrder = (order: any) => !!orderNumberOf(order)

	// `formatPrice(undefined, …)` renders the string "$undefined". A money row the backend did not
	// supply is shown as an em dash instead, the way an unknown value should read.
	const currencyCode = $derived(page?.data?.store?.currency?.code ?? '')
	const money = (value: unknown) => (typeof value === 'number' && Number.isFinite(value) ? formatPrice(value, currencyCode) : null)
</script>

<svelte:head>
	<title>Order Details | Svelte Commerce</title>
</svelte:head>

<MyOrdersIdRenderer>
	{#snippet content({ loading, order })}
		<div class="mx-auto max-w-6xl {klass}">
			{#if loading}
				<OrderListSkeleton />
			{:else if order && isRealOrder(order)}
				<section class="space-y-5 lg:pt-8">
					<!-- Back Navigation -->
					<div class="flex items-center gap-4">
						<BackButton to="/my/orders" title="Order History" />
					</div>

					<!-- Header Section -->
					<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<h1 class="text-lg font-bold tracking-tight text-gray-900 md:text-xl">Order #{orderNumberOf(order)}</h1>
							<p class="mt-2 text-sm text-gray-500">
								Placed on <span class="font-medium text-gray-900">{date(order?.createdAt)}</span>
							</p>
						</div>
						<div class="flex items-center gap-3">
							{#if order?.invoiceLink}
								<Button variant="outline" href={order?.invoiceLink} target="_blank" class="h-11 gap-2">
									<FileText class="h-4 w-4" />
									Download Invoice
								</Button>
							{/if}
						</div>
					</div>

					<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
						<!-- Main Content (Items) -->
						<div class="space-y-6 lg:col-span-2">
							<!-- Order Status Banner -->
							<div class="rounded-md border border-muted/20 bg-muted/5 p-6">
								<div class="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
									<div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-background shadow-sm ring-1 ring-muted/20">
										<Package class="h-6 w-6 text-primary" />
									</div>
									<div class="flex-1">
										<div class="flex items-center gap-4">
											<h3 class="text-base font-bold text-gray-900">Order Status</h3>
											<StatusCell value={order?.status || 'processing'} />
										</div>
										<p class="mt-2 text-sm text-gray-500">
											Your order is currently {order?.status || 'being processed'}.
										</p>
										<!-- No connector supplies a shipping rate, so the seven-day fallback that used to sit
										     here put a delivery promise the merchant never made on every order. The row shows
										     only when the backend actually estimates a date. -->
										{#if order?.shippingRate?.estimatedMaxDays}
											<div class="mt-4 flex w-fit items-center gap-2 rounded-lg bg-success/10 px-3 py-2 text-sm text-success ring-1 ring-success/20">
												<Truck class="h-4 w-4" />
												<span class="font-medium">Estimated Arrival:</span>
												<span class="font-bold uppercase tracking-tight">
													{date(order.createdAt + order.shippingRate.estimatedMaxDays * 86400000)}
												</span>
											</div>
										{/if}
									</div>
								</div>
							</div>

							<!-- Items List -->
							<div class="overflow-hidden rounded-xl border border-muted/20 bg-background shadow-sm">
								<div class="px-3 py-4 sm:px-6">
									<h3 class="font-medium text-gray-900">Order Items ({order?.lineItems?.length || 0})</h3>
								</div>
								<div class="divide-y divide-gray-100">
									{#each order?.lineItems || [] as item}
										<div class="p-3 transition-colors hover:bg-gray-50/30 sm:p-6">
											<div class="flex gap-6">
												<a href="/products/{item.slug}" class="relative shrink-0 overflow-hidden">
													<!-- <LazyImg
															src={item.isCustomized ? item.customizedImg : (item.thumbnail || item.img)}
															alt={item.title}
															aspectRatio="5:6"
															class="h-full w-full object-cover object-center"
														/> -->
													<LazyImg
														src={item.isCustomized ? item.customizedImg : item.thumbnail || item.img}
														alt={item.title}
														class="aspect-[3/4] w-24 object-contain sm:w-24"
													/>
												</a>

												<div class="flex flex-1 flex-col">
													<div class="flex flex-col justify-between gap-1 sm:flex-row sm:items-start sm:gap-4">
														<div class="flex-1">
															<a href="/products/{item.slug}" class="group">
																<h4 class="text-base font-semibold text-gray-900 transition-colors">
																	{item.title}
																</h4>
															</a>
															<div class="mt-2 flex flex-wrap gap-4 text-xs font-bold uppercase tracking-wider text-gray-400">
																<span class="flex items-center gap-1.5">
																	<Tag class="h-3.5 w-3.5" />
																	Qty: {item.qty}
																</span>
																{#if item.size}
																	<span class="h-1 w-1 self-center rounded-full bg-gray-300"></span>
																	<span>Size: {item.size}</span>
																{/if}
																{#if item.variantTitle}
																	<span class="h-1 w-1 self-center rounded-full bg-gray-300"></span>
																	<span>{item.variantTitle}</span>
																{/if}
															</div>
														</div>
														<div class="mt-2 sm:mt-0 sm:text-right">
															<p class="text-base font-semibold text-gray-900">
																{formatPrice(item.price * item.qty, page?.data?.store?.currency?.code)}
															</p>
															{#if item?.mrp > item?.price}
																<p class="mt-1 text-sm text-muted-foreground line-through">
																	{formatPrice(item.mrp * item.qty, page?.data?.store?.currency?.code)}
																</p>
															{/if}
														</div>
													</div>

													<div class="mt-auto flex items-center justify-between pt-4">
														<div class="flex flex-wrap gap-2">
															{#if item?.status === 'delivered'}
																<Button variant="ghost" size="sm" href="/products/{item?.slug}#review" class="h-8 gap-2 text-xs font-bold">
																	Rate & Review
																</Button>
															{/if}
														</div>

														{#if item?.files?.length}
															<div class="flex gap-2">
																{#each item.files as file, fx}
																	<Button variant="outline" size="sm" href={file} download class="h-8 gap-2 text-xs">
																		<FileText class="h-3.5 w-3.5" />
																		File {fx + 1}
																	</Button>
																{/each}
															</div>
														{/if}
													</div>
												</div>
											</div>
										</div>
									{/each}
								</div>
							</div>

							<!-- Fulfillments Timeline -->
							{#if order.fulfillments?.length}
								<div class="overflow-hidden rounded-xl border border-muted/20 bg-background shadow-sm">
									<div class="border-b border-gray-100 bg-gray-50/50 px-3 py-4 sm:px-6">
										<h3 class="font-bold text-gray-900">Shipments</h3>
									</div>
									<div class="divide-y divide-gray-100">
										{#each order.fulfillments as fulfillment, ix}
											<div class="p-6">
												<div class="flex flex-col gap-6 sm:flex-row sm:items-center">
													<div class="flex-1">
														<div class="flex items-center gap-3">
															<span class="text-sm font-bold text-gray-900">Shipment {ix + 1}</span>
															<StatusCell value={fulfillment?.status} />
														</div>
														<div class="mt-4 flex flex-wrap gap-2">
															{#each fulfillment?.lineItems || [] as item}
																<div class="h-12 w-10 shrink-0 overflow-hidden rounded border border-gray-100">
																	<LazyImg src={item.thumbnail || item.img} alt={item.title} class="h-full w-full object-cover" />
																</div>
															{/each}
														</div>
													</div>
													{#if fulfillment?.trackingUrl}
														<Button variant="outline" href={fulfillment.trackingUrl} target="_blank" class="h-10 gap-2">
															<Truck class="h-4 w-4" />
															Track Shipment
														</Button>
													{/if}
												</div>
											</div>
										{/each}
									</div>
								</div>
							{/if}
						</div>

						<!-- Sidebar (Details) -->
						<div class="space-y-6">
							<!-- Address Cards -->
							<div class="overflow-hidden rounded-md border border-muted/20 bg-background shadow-sm">
								<div class="bg-muted/20 px-6 py-3">
									<h3 class="font-semibold text-gray-900">Address Details</h3>
								</div>
								<div class="space-y-8 p-3 sm:p-6">
									<!-- Shipping -->
									<div>
										<div class="mb-3 flex items-center gap-2">
											<MapPin class="h-4 w-4 text-gray-400" />
											<h4 class="text-sm font-bold uppercase tracking-tight text-gray-900">Shipping Address</h4>
										</div>
										<div class="text-sm leading-relaxed text-gray-600">
											<p class="font-bold text-gray-900">
												{order?.shippingAddress?.firstName}
												{order?.shippingAddress?.lastName}
											</p>
											<p>{order?.shippingAddress?.address_1}</p>
											{#if order?.shippingAddress?.address_2}
												<p>{order?.shippingAddress?.address_2}</p>
											{/if}
											<p>{order?.shippingAddress?.city}, {order?.shippingAddress?.state}</p>
											<p>{order?.shippingAddress?.country || order?.shippingAddress?.countryCode} - {order?.shippingAddress?.zip}</p>
											{#if order?.shippingAddress?.phone}
												<p class="mt-2 font-medium text-gray-900">{order?.shippingAddress?.phone}</p>
											{/if}
										</div>
									</div>

									<!-- Billing -->
									{#if order?.billingAddress}
										<div class="pt-0">
											<div class="mb-3 flex items-center gap-2">
												<ReceiptText class="h-4 w-4 text-gray-400" />
												<h4 class="text-sm font-bold uppercase tracking-tight text-gray-900">Billing Address</h4>
											</div>
											<div class="text-sm leading-relaxed text-gray-600">
												<p class="font-bold text-gray-900">
													{order?.billingAddress?.firstName}
													{order?.billingAddress?.lastName}
												</p>
												<p>{order?.billingAddress?.address_1}</p>
												<p>{order?.billingAddress?.city}, {order?.billingAddress?.state} - {order?.billingAddress?.zip}</p>
											</div>
										</div>
									{/if}
								</div>
							</div>

							<!-- Summary Card -->
							<div class="overflow-hidden rounded-md border border-muted/20 bg-background shadow-sm">
								<div class=" bg-muted/20 px-3 py-4 sm:px-6">
									<h3 class="font-semibold text-gray-900">Payment Summary</h3>
								</div>
								<div class="p-6">
									<div class="space-y-2">
										<div class="flex justify-between text-sm">
											<span class="text-gray-500">Subtotal</span>
											{#if money(order?.subtotal)}
												<span class="font-medium text-gray-900">{money(order?.subtotal)}</span>
											{:else}
												<span class="font-medium text-muted-foreground">&mdash;</span>
											{/if}
										</div>

										{#if order?.discount > 0}
											<div class="flex justify-between text-sm text-green-600">
												<span>Discount</span>
												<span>-{formatPrice(order?.discount, page?.data?.store?.currency?.code)}</span>
											</div>
										{/if}

										{#if order?.coupon?.code}
											<div class="flex justify-between text-xs font-bold text-primary">
												<span>Coupon ({order.coupon.code})</span>
												<span>Applied</span>
											</div>
										{/if}

										<div class="flex justify-between text-sm">
											<span class="text-gray-500">Shipping</span>
											<span class="font-medium text-gray-900">
												{order?.shippingCharges > 0 ? formatPrice(order.shippingCharges, page?.data?.store?.currency?.code) : 'FREE'}
											</span>
										</div>

										{#if order?.codCharges}
											<div class="flex justify-between text-sm">
												<span class="text-gray-500">COD Charges</span>
												<span class="font-medium text-gray-900">{formatPrice(order.codCharges, page?.data?.store?.currency?.code)}</span>
											</div>
										{/if}

										<div class="flex items-baseline justify-between pt-1">
											<span class="text-base font-bold text-gray-900">Total</span>
											{#if money(order?.total)}
												<span class="text-base font-bold text-gray-900">
													{money(order?.total)}
												</span>
											{:else}
												<span class="text-base font-bold text-muted-foreground">&mdash;</span>
											{/if}
										</div>

										<div class="mt-6 flex items-center justify-between gap-2 border-t border-gray-100 pt-6">
											<div class="flex items-center gap-2">
												<CreditCardIcon class="h-4 w-4 text-gray-400" />
												<span class="text-xs font-bold uppercase tracking-tight text-gray-400">Payment Status</span>
											</div>
											<span
												class="text-xs font-bold uppercase tracking-wider {!order?.paymentStatus
													? 'text-muted-foreground'
													: order.paymentStatus === 'paid'
														? 'text-success'
														: 'text-destructive'}"
											>
												{order?.paymentStatus || '—'}
											</span>
										</div>
									</div>
								</div>
							</div>

							<!-- Exchange/Return -->
							{#if order?.replaceValidTill != null && new Date().getTime() <= order?.replaceValidTill && !order?.isReplaceOrReturn}
								<Button variant="secondary" href="/my/exchange?orderId={order?.orderId}&itemId={order?.itemId}" class="h-12 w-full gap-2">
									<RefreshCw class="h-4 w-4" />
									Exchange or Return
								</Button>
							{/if}
						</div>
					</div>

					<!-- Bottom Back Button (Mobile) -->
					<div class="flex justify-center pt-10 lg:hidden">
						<Button variant="ghost" href="/my/orders" class="gap-2">
							<ChevronRight class="h-4 w-4 rotate-180" />
							Back to All Orders
						</Button>
					</div>
				</section>
			{:else}
				<div class="flex h-[70vh] flex-col items-center justify-center text-center">
					<div class="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted/10">
						<ShoppingBag class="h-10 w-10 text-muted-foreground/50" />
					</div>
					<h2 class="text-2xl font-bold text-gray-900">Order not found</h2>
					<p class="mt-2 text-gray-500">We couldn't find the order details you're looking for.</p>
					<Button href="/my/orders" class="mt-8 h-12 px-8">View All Orders</Button>
				</div>
			{/if}
		</div>
	{/snippet}
</MyOrdersIdRenderer>

<style>
	:global(body) {
		background-color: #fafafa;
	}
</style>
