<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import LazyImg from '$lib/core/components/image/lazy-img.svelte'
	import {
		ChevronRight,
		ShoppingBag,
		Calendar,
		Tag,
		Package,
		CreditCard,
		ArrowRight,
		CheckCircle2,
		Clock,
		Truck,
		XCircle,
		AlertCircle,
		LoaderCircle
	} from '@lucide/svelte'
	import { page } from '$app/state'
	import { date, formatPrice } from '$lib/core/utils'
	import { MyOrdersRenderer } from '$lib/core/composables/index.js'
	import { fade, fly } from 'svelte/transition'

	const getStatusStyles = (status: string) => {
		switch (status?.toLowerCase()) {
			case 'delivered':
				return { bg: 'bg-green-50', text: 'text-green-700', ring: 'ring-green-600/20', dot: 'bg-green-500', icon: CheckCircle2 }
			case 'shipped':
				return { bg: 'bg-blue-50', text: 'text-blue-700', ring: 'ring-blue-600/20', dot: 'bg-blue-500', icon: Truck }
			case 'processing':
				return { bg: 'bg-yellow-50', text: 'text-yellow-700', ring: 'ring-yellow-600/20', dot: 'bg-yellow-500', icon: Clock }
			case 'cancelled':
				return { bg: 'bg-red-50', text: 'text-red-700', ring: 'ring-red-600/20', dot: 'bg-red-500', icon: XCircle }
			default:
				return { bg: 'bg-gray-50', text: 'text-gray-700', ring: 'ring-gray-600/20', dot: 'bg-gray-500', icon: Package }
		}
	}

	const getPaymentStatusStyles = (status: string) => {
		switch (status?.toLowerCase()) {
			case 'paid':
				return { bg: 'bg-green-50', text: 'text-green-700', ring: 'ring-green-600/20', dot: 'bg-green-500' }
			case 'pending':
				return { bg: 'bg-yellow-50', text: 'text-yellow-700', ring: 'ring-yellow-600/20', dot: 'bg-yellow-500' }
			default:
				return { bg: 'bg-red-50', text: 'text-red-700', ring: 'ring-red-600/20', dot: 'bg-red-500' }
		}
	}
</script>

<svelte:head>
	<title>My Orders | Svelte Commerce</title>
</svelte:head>

<MyOrdersRenderer>
	{#snippet content({ loading, orders })}
		<div class="mx-auto max-w-5xl px-4 py-8 md:py-12">
			<!-- Header -->
			<div class="mb-10">
				<h1 class="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">Order History</h1>
				<p class="mt-2 text-lg text-gray-500">Check the status of recent orders and manage returns.</p>
			</div>

			{#if loading}
				<div class="flex min-h-[400px] items-center justify-center">
					<LoaderCircle class="h-8 w-8 animate-spin text-primary" />
				</div>
			{:else if orders.data?.length === 0}
				<div in:fade class="flex flex-col items-center justify-center py-20 text-center">
					<div class="relative mb-6">
						<div class="absolute inset-0 scale-150 animate-pulse rounded-full bg-gray-50"></div>
						<div class="relative flex h-24 w-24 items-center justify-center rounded-full border border-gray-100 bg-white shadow-sm">
							<ShoppingBag class="h-10 w-10 text-gray-300" />
						</div>
					</div>
					<h2 class="text-2xl font-bold text-gray-900">No orders yet</h2>
					<p class="mt-2 max-w-xs text-gray-500">Looks like you haven't placed any orders yet. Start shopping to see your history here.</p>
					<div class="mt-8">
						<Button href="/products" class="h-12 px-8 font-semibold shadow-lg transition-all hover:scale-105 active:scale-95">
							Start Shopping
							<ArrowRight class="ml-2 h-4 w-4" />
						</Button>
					</div>
				</div>
			{:else}
				<div class="space-y-8">
					{#each orders.data as order, i}
						{@const status = getStatusStyles(order.status)}
						{@const payment = getPaymentStatusStyles(order.paymentStatus)}

						<div
							in:fly={{ y: 20, duration: 400, delay: i * 50 }}
							class="overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:border-gray-200"
						>
							<!-- Order Header -->
							<div class="border-b border-gray-100 bg-gray-50/30 p-6">
								<div class="flex flex-wrap items-center justify-between gap-6">
									<div class="flex items-center gap-8">
										<div>
											<p class="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Order Number</p>
											<p class="mt-1.5 text-sm font-bold text-gray-900">#{order.orderNo || '_'}</p>
										</div>
										<div class="h-10 w-px bg-gray-200"></div>
										<div>
											<p class="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Date Placed</p>
											<p class="mt-1.5 text-sm font-bold text-gray-900">{date(order.createdAt)}</p>
										</div>
										<div class="hidden h-10 w-px bg-gray-200 sm:block"></div>
										<div class="hidden sm:block">
											<p class="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Total Amount</p>
											<p class="mt-1.5 text-sm font-bold text-gray-900">
												{formatPrice(
													order.lineItems.reduce((acc: number, item: any) => acc + item.total, 0),
													page?.data?.store?.currency?.code
												)}
											</p>
										</div>
									</div>

									<div class="flex items-center gap-3">
										<Button
											variant="outline"
											size="sm"
											href="/my/orders/{order.parentOrderNo}"
											class="h-10 rounded-full border-gray-200 bg-white px-6 text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-black hover:text-white hover:border-black active:scale-95"
										>
											View Details
										</Button>
									</div>
								</div>

								<!-- Status Badges Mobile/Small -->
								<div class="mt-6 flex flex-wrap gap-3">
									<span
										class="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest {status.bg} {status.text} ring-1 ring-inset {status.ring}"
									>
										<status.icon class="h-3.5 w-3.5" />
										{order.status}
									</span>
									<span
										class="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest {payment.bg} {payment.text} ring-1 ring-inset {payment.ring}"
									>
										<CreditCard class="h-3.5 w-3.5" />
										Payment: {order.paymentStatus}
									</span>
								</div>
							</div>

							<!-- Order Items -->
							<div class="divide-y divide-gray-100 bg-white">
								{#each order.lineItems as item}
									<div class="group flex items-center gap-8 p-6 transition-colors hover:bg-gray-50/30">
										<a
											href="/my/orders/{order.parentOrderNo}"
											class="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50 transition-transform duration-500 group-hover:scale-105"
										>
											{#if item.thumbnail}
												<LazyImg src={item.thumbnail} alt={item.title} class="h-full w-full object-cover" />
											{:else}
												<div class="flex h-full w-full items-center justify-center bg-gray-100">
													<ShoppingBag class="h-8 w-8 text-gray-200" />
												</div>
											{/if}
										</a>

										<div class="flex flex-1 flex-col">
											<div class="flex items-start justify-between gap-4">
												<div>
													<h3 class="text-sm font-bold uppercase tracking-wider text-gray-900 md:text-base">
														<a href="/my/orders/{order.parentOrderNo}" class="transition-colors hover:text-gray-500">
															{item.title || '_'}
														</a>
													</h3>
													<div class="mt-2 flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-gray-400">
														<span class="flex items-center gap-1.5">
															<Tag class="h-3.5 w-3.5" />
															Qty: {item.qty || '_'}
														</span>
														{#if item.variantTitle}
															<span class="h-1 w-1 rounded-full bg-gray-300"></span>
															<span>{item.variantTitle}</span>
														{/if}
													</div>
												</div>
												<p class="text-sm font-bold text-gray-900 md:text-base">
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
	{/snippet}
</MyOrdersRenderer>

<style>
	:global(body) {
		background-color: #fafafa;
	}
</style>
