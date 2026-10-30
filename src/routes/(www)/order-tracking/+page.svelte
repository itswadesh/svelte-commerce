<script lang="ts">
	import { page } from '$app/state'
	import { onMount } from 'svelte'
	import { fade } from 'svelte/transition'
	import productNonVeg from '$lib/assets/product/non-veg.png'
	import productVeg from '$lib/assets/product/veg.png'
	import { date } from '$lib/core/utils'
	import { formatPrice } from '$lib/utils/price'
	import LazyImg from '$lib/core/components/image/lazy-img.svelte'
	import { linePicture } from '$lib/customizer/line'
	import Button from '$lib/components/ui/button/button.svelte'
	import { Input } from '$lib/components/ui/input'
	import { Label } from '$lib/components/ui/label'
	import OrderListSkeleton from '../../(my)/my/orders/_OrderListSkeleton.svelte'
	import OrderTimeline from '$lib/components/order/order-timeline.svelte'
	import StatusCell from '$lib/components/common/status-cell.svelte'
	import { orderService } from '$lib/core/services/index.js'
	import { CheckCircle } from '@lucide/svelte'

	// A guest opens their order with its number and the email or phone on it.
	// The link in the order emails carries the order's key as well, and opens
	// it with nothing to type; an order this browser already holds opens at once.
	let order = $state<any>(null)
	let loading = $state(false)
	let orderNo = $state(page.url.searchParams.get('order') || '')
	let contact = $state('')
	let busy = $state(false)
	let error = $state('')

	const message = (e: unknown) => (e as { message?: string })?.message || 'Something went wrong. Please try again.'

	onMount(async () => {
		if (!orderNo) return
		const key = page.url.searchParams.get('key')
		// The key opens the order, so it leaves the address bar, the history and every analytics
		// tag that records the page as soon as it is read.
		if (key) {
			const url = new URL(location.href)
			url.searchParams.delete('key')
			history.replaceState(history.state, '', url)
		}
		loading = true
		try {
			if (key) {
				order = (await orderService.openOrderWithKey({ orderNo, key })).data[0]
			} else {
				order = await orderService.getOrder(orderNo)
			}
		} catch (err) {
			// A key that no longer matches says so; otherwise the form asks.
			if (key) error = 'This link no longer opens the order. Enter your email or phone instead.'
		} finally {
			loading = false
		}
	})

	async function open(e?: SubmitEvent) {
		e?.preventDefault()
		if (busy || !orderNo.trim() || !contact.trim()) return
		busy = true
		error = ''
		try {
			order = (await orderService.openOrder({ orderNo, contact })).data[0]
		} catch (err) {
			error = message(err)
		} finally {
			busy = false
		}
	}
</script>

<svelte:head>
	<title>Order</title>
</svelte:head>
<div>
	<!-- The page shipped no h1, so nothing named it in the document outline. Visually hidden: the
	     order number below becomes the visible title once an order resolves. -->
	<h1 class="sr-only">Track your order</h1>
	{#if loading}
		<div class="flex items-center justify-center">
			<OrderListSkeleton />
		</div>
	{:else if order && order?.orderNo}
		<section class="container mx-auto">
			<div class="my-5 overflow-hidden rounded-lg border sm:mb-10">
				<div class="flex flex-wrap items-center justify-between rounded-lg rounded-b-none border-b bg-muted px-5 py-3">
					<div class="flex items-center gap-4">
						<h6>Order No : #{order?.orderNo}</h6>
						<StatusCell value={order?.status} />
					</div>

					<h6 class="mt-2 text-sm text-muted-foreground sm:mt-0">Order Date : {date(order?.createdAt)}</h6>
				</div>

				<!-- Order detail  -->
				<div class="flex flex-col lg:grid lg:grid-cols-2 lg:divide-x">
					<div class="order-1 flex flex-col divide-y lg:order-none">
						{#if order?.lineItems}
							<div class="divide-y divide-dashed text-xs text-muted-foreground">
								{#each order?.lineItems as item}
									{@const picture = linePicture(item)}
									{#if item}
										<div class="flex gap-2 p-5 lg:gap-5">
											<a href={`/products/${item.slug}`} aria-label="Click to view the product details" class="shrink-0">
												<LazyImg src={picture.src} alt={picture.alt} width="56" class="h-auto w-14 object-contain object-top" />
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

												{#if picture.designed}<p class="font-medium text-foreground">Your design</p>{/if}

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

													<span class="whitespace-nowrap font-bold text-foreground">
														{formatPrice(item.price, page?.data?.store?.currency?.code)}
													</span>

													{#if item?.mrp > item?.price}
														<span class="whitespace-nowrap text-muted-foreground line-through">
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

													<span class="whitespace-nowrap font-bold text-foreground">
														{formatPrice(item.subtotal, page?.data?.store?.currency?.code)}
													</span>

													{#if item?.total > item?.subtotal}
														<span class="whitespace-nowrap text-muted-foreground line-through">
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
																		Download file

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
															href="/products/{item?.slug}#review"
															aria-label="Click to visit rate & review product"
															class="max-w-max whitespace-nowrap font-semibold text-primary hover:underline focus:outline-none"
														>
															Rate & review product
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
								<h5 class="font-semibold">Delivery address</h5>

								<p class="flex flex-col text-sm">
									<span>
										{order?.shippingAddress?.firstName}
										{order?.shippingAddress?.lastName}

										<br />

										{order?.shippingAddress?.address_1}
										{#if order?.shippingAddress?.address_2}
											, {order?.shippingAddress?.address_2}
										{/if}

										, {order?.shippingAddress?.city}
										<br />
										{order?.shippingAddress?.state},
										<span class=""
											>{order?.shippingAddress?.country || order?.shippingAddress?.countryCode}</span
										>,
										{order?.shippingAddress?.zip}
									</span>
								</p>

								{#if order?.shippingAddress?.phone}
									<p class="text-sm">
										{order?.shippingAddress?.phone}
									</p>
								{/if}
							</div>

							<div class="space-y-2">
								<h5 class="font-semibold">Billing address</h5>
								{#if order?.billingAddressId === order?.shippingAddressId}
									<div class="flex items-center gap-2 text-sm text-muted-foreground">
										<CheckCircle class="h-4 w-4 text-success" />
										<span>Same as shipping address</span>
									</div>
								{:else if order?.billingAddress}
									<p class="flex flex-col text-sm">
										<span>
											{order?.billingAddress?.firstName}
											{order?.billingAddress?.lastName}

											<br />
											{order?.billingAddress?.address_1}

											{#if order?.billingAddress?.address_2}
												, {order?.billingAddress?.address_2}
											{/if}

											, {order?.billingAddress?.city}
											<br />
											{order?.billingAddress?.state},
											<span class=""
												>{order?.billingAddress?.country || order?.billingAddress?.countryCode}</span
											>,
											{order?.billingAddress?.zip}
										</span>
									</p>

									{#if order?.billingAddress?.phone}
										<p class="text-sm">
											{order?.billingAddress?.phone}
										</p>
									{/if}
								{/if}
							</div>
						</div>
					</div>

					<div class="order-3 col-span-full flex justify-end !border-0 !border-t border-border bg-muted p-5">
						<div class="flex w-full max-w-md flex-col items-start gap-2">
							<p class="flex items-center">
								<span class="mr-2 w-32">Subtotal</span>

								<span>
									: &nbsp; {formatPrice(order?.subtotal || 0, page?.data?.store?.currency?.code) || '0.00'}
								</span>
							</p>

							{#if order?.discount && order?.discount > 0}
								<p class="flex items-center">
									<span class="mr-2 w-32">Discount</span>

									<span>
										: &nbsp;

										{formatPrice(order?.discount || 0, page?.data?.store?.currency?.code) || '0.00'}
									</span>
								</p>
							{/if}

							<p class="flex items-center">
								<span class="mr-2 w-32">Shipping</span>

								<span>
									: &nbsp;
									{#if order?.shippingCharges}
										{formatPrice(order?.shippingCharges, page?.data?.store?.currency?.code)}
									{:else}
										Free
									{/if}
								</span>
							</p>

							{#if order?.codCharges}
								<p class="flex items-center">
									<span class="mr-2 w-32">COD Charges</span>

									<span>
										: &nbsp;

										{formatPrice(order?.codCharges, page?.data?.store?.currency?.code)}
									</span>
								</p>
							{/if}

							<hr class="w-full border-t border-border" />

							<div class="flex items-center text-sm font-bold text-foreground">
								<span class="mr-2 w-32">Total</span>

								<span>
									: &nbsp; {formatPrice(order?.total || 0, page?.data?.store?.currency?.code)}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Order Timeline -->
			{#if order.tracking?.length}
				<OrderTimeline timeline={order.tracking} />
			{/if}
		</section>
	{:else}
		<section class="mx-auto flex min-h-[60vh] w-full max-w-sm flex-col justify-center px-4 py-10">
			<h2 class="mb-1 text-2xl font-semibold text-foreground">Track your order</h2>
			<p class="mb-6 text-sm text-muted-foreground">Enter your order number and the email or phone you ordered with.</p>
			<form class="flex flex-col gap-4" onsubmit={open} in:fade={{ duration: 200 }}>
				<div class="flex flex-col gap-1.5">
					<Label for="order-no">Order number</Label>
					<Input id="order-no" bind:value={orderNo} placeholder="GC-000049" autocomplete="off" required />
				</div>
				<div class="flex flex-col gap-1.5">
					<Label for="order-contact">Email or phone</Label>
					<Input id="order-contact" bind:value={contact} autocomplete="email" required />
				</div>
				{#if error}
					<p class="text-sm text-destructive" role="alert">{error}</p>
				{/if}
				<Button type="submit" class="w-full" disabled={busy}>{busy ? 'Opening…' : 'Track order'}</Button>
			</form>
		</section>
	{/if}
</div>
