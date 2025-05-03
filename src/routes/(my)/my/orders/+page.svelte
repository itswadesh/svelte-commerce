<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte'
	import LazyImg from '$lib/core/components/image/lazy-img.svelte'
	import { ChevronRight, ShoppingBag, Calendar, Tag } from 'lucide-svelte'
	import { page } from '$app/state'
	import { date, formatPrice } from '$lib/core/utils'
	import MyOrdersRenderer from '$lib/core/composables/my-orders-renderer.svelte'
</script>

<svelte:head>
	<title>My Orders - KitCommerce</title>
</svelte:head>

<MyOrdersRenderer>
	{#snippet content({ orders })}
		<div class="min-h-screen">
			<div class="">
				<!-- Header -->
				<!-- <div class="mb-8">
			<h1 class="text-2xl font-bold text-gray-900 md:text-3xl">My Orders</h1>
			<p class="mt-2 text-gray-600">Track and manage your orders</p>
		</div> -->

				{#if orders.data?.length === 0}
					<div class="flex min-h-[400px] flex-col items-center justify-center rounded-lg bg-white p-8 text-center shadow-sm">
						<div class="mb-4 rounded-full bg-gray-100 p-4">
							<ShoppingBag class="h-8 w-8 text-gray-400" />
						</div>
						<h2 class="mb-2 text-xl font-semibold text-gray-900">No Orders Yet</h2>
						<p class="mb-6 text-gray-600">Looks like you haven't placed any orders yet.</p>
						<Button href="/">Start Shopping</Button>
					</div>
				{:else}
					<!-- Orders List -->
					<div class="space-y-4">
						{#each orders.data as order}
							<div class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
								<!-- Order Header -->
								<div class="border-b border-gray-200 bg-gray-50 p-4">
									<div class="flex flex-wrap items-center justify-between gap-4">
										<div class="flex gap-3">
											<!-- <div class="bg-gray-100 rounded-full p-2 hidden sm:flex">
										<ShoppingBag class="h-5 w-5 text-gray-500" />
									</div> -->
											<div>
												<div class="flex items-center gap-1.5">
													<p class="text-sm font-medium text-gray-800">
														Order <span class="font-semibold text-gray-900">#{order.orderNo || '_'}</span>
													</p>
													<Button
														variant="ghost"
														size="sm"
														class="-mr-2 ml-auto flex h-7 items-center gap-1 px-2"
														href="/my/orders/{order.parentOrderNo}"
													>
														<span class="text-xs text-indigo-600">Details</span>
														<ChevronRight class="h-3.5 w-3.5 text-indigo-600" />
													</Button>
												</div>
												<div class="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
													<Calendar class="h-3.5 w-3.5" />
													<span>{date(order.createdAt)}</span>
												</div>
											</div>
										</div>
										<div class="sm:text-right">
											<div class="mb-1 flex items-center justify-end gap-2">
												<!-- <DollarSign class="h-3.5 w-3.5 text-gray-500" /> -->
												<p class="font-medium text-gray-900">
													{formatPrice(
														order.lineItems.reduce((acc: number, item: any) => acc + item.total, 0),
														page?.data?.store?.currency?.code
													)}
												</p>
											</div>
											<div class="flex flex-wrap items-center justify-end gap-2">
												<span
													class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium uppercase {order.paymentStatus ===
													'paid'
														? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20'
														: order.paymentStatus === 'pending'
															? 'bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-600/20'
															: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20'}"
												>
													{#if order.paymentStatus}
														<span class="relative mr-1 flex h-1.5 w-1.5">
															<span
																class="absolute inline-flex h-full w-full animate-ping rounded-full {order.paymentStatus === 'paid'
																	? 'bg-green-400'
																	: order.paymentStatus === 'pending'
																		? 'bg-yellow-400'
																		: 'bg-red-400'} opacity-75"
															></span>
															<span
																class="relative inline-flex h-1.5 w-1.5 rounded-full {order.paymentStatus === 'paid'
																	? 'bg-green-500'
																	: order.paymentStatus === 'pending'
																		? 'bg-yellow-500'
																		: 'bg-red-500'}"
															></span>
														</span>
													{/if}
													{order.paymentStatus}
												</span>

												<span
													class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium uppercase {order.status === 'delivered'
														? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20'
														: order.status === 'shipped'
															? 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20'
															: order.status === 'processing'
																? 'bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-600/20'
																: order.status === 'cancelled'
																	? 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20'
																	: 'bg-gray-50 text-gray-700 ring-1 ring-inset ring-gray-600/20'}"
												>
													{#if order.status}
														<span class="relative mr-1 flex h-1.5 w-1.5">
															<span
																class="absolute inline-flex h-full w-full animate-ping rounded-full {order.status === 'delivered'
																	? 'bg-green-400'
																	: order.status === 'shipped'
																		? 'bg-blue-400'
																		: order.status === 'processing'
																			? 'bg-yellow-400'
																			: order.status === 'cancelled'
																				? 'bg-red-400'
																				: 'bg-gray-400'} opacity-75"
															></span>
															<span
																class="relative inline-flex h-1.5 w-1.5 rounded-full {order.status === 'delivered'
																	? 'bg-green-500'
																	: order.status === 'shipped'
																		? 'bg-blue-500'
																		: order.status === 'processing'
																			? 'bg-yellow-500'
																			: order.status === 'cancelled'
																				? 'bg-red-500'
																				: 'bg-gray-500'}"
															></span>
														</span>
													{/if}
													{order.status}
												</span>
											</div>
										</div>
									</div>
								</div>

								<!-- Order Items -->
								<div class="divide-y divide-gray-200">
									{#each order.lineItems as item}
										<div class="flex items-start gap-4 p-4">
											<a href="/my/orders/{order.parentOrderNo}" class="shrink-0">
												{#if item.thumbnail}
													<LazyImg src={item.thumbnail} alt=" " width="56" class="h-14 w-14 border border-gray-100 object-contain object-top" />
												{:else}
													<div class="flex h-14 w-14 flex-col items-center justify-center rounded bg-gray-100 p-2 text-center text-xs text-gray-500">
														<svg
															xmlns="http://www.w3.org/2000/svg"
															fill="none"
															viewBox="0 0 24 24"
															stroke-width="1.5"
															stroke="currentColor"
															class="h-5 w-5"
														>
															<path
																stroke-linecap="round"
																stroke-linejoin="round"
																d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
															></path>
														</svg>

														<span>No Image</span>
													</div>
												{/if}
											</a>
											<div class="flex-1 space-y-1">
												<div class="flex items-start justify-between">
													<div>
														<a href="/my/orders/{order.parentOrderNo}" class="hover:text-indigo-600 hover:underline">
															<h3 class="line-clamp-2 text-sm font-medium text-gray-900">
																{item.title || '_'}
															</h3>
														</a>
														<p class="flex items-center gap-1 text-xs text-gray-500">
															<Tag class="h-3 w-3" />
															Qty: {item.qty || '_'}
														</p>
													</div>
													<p class="font-medium text-gray-900">
														{formatPrice(item.total, page?.data?.store?.currency?.code)}
													</p>
												</div>
											</div>
										</div>
									{/each}
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	{/snippet}
</MyOrdersRenderer>

