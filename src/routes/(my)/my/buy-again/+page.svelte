<script>
	import LazyImg from '$lib/core/components/image/lazy-img.svelte'
	import Button from '$lib/components/ui/button/button.svelte'
	import { getCartState } from '$lib/core/stores/cart.svelte'
	import { formatPrice } from '$lib/core/utils'
	const cartState = getCartState()

	let data = $state([])

	import { onMount } from 'svelte'
	import { Plus } from 'lucide-svelte'
	import { page } from '$app/state'
	import { orderService } from '$lib/core/services'

	onMount(async () => {
		data = await orderService.buyAgain()
	})
</script>

<svelte:head>
	<title>Buy Again</title>
</svelte:head>
<section class="flex flex-col gap-10">
	<h3 class="capitalize">Orders</h3>
	<div class="grid grid-cols-1 divide-y lg:grid-cols-2 lg:divide-x lg:divide-y-0">
		<div class="col-span-2 flex flex-col divide-y">
			{#if data.length > 0}
				{#each data as item}
					<!-- Desktop View -->
					<div class="hidden gap-2 p-5 md:flex lg:gap-5">
						<a href={`/product/${item.slug}?variant_id=${item.variantId || ''}`} aria-label="Click to view the product details" class="shrink-0">
							<LazyImg src={item.img} alt=" " width="56" class="h-auto w-14 object-contain object-top" />
						</a>

						<div class="ml-4 flex w-full flex-1 flex-col gap-0.5 pl-4 pr-4">
							<div class="flex justify-between gap-2 sm:gap-4">
								<a
									href={`/product/${item.slug}?variant_id=${item.variantId || ''}`}
									aria-label="Click to view the product details"
									class="flex-1 hover:underline"
								>
									<p>
										{item.title}
									</p>
								</a>
							</div>

							{#if item.qty}
								<span>
									Qty :

									<span class="font-semibold">
										{item.qty}
									</span>
								</span>
							{/if}

							<div class="flex flex-wrap items-center gap-1">
								Total :

								<span class="text-primary-700 whitespace-nowrap font-bold">
									{formatPrice(item.price, page?.data?.store?.currency?.code)}
								</span>
							</div>

							<div
								class="relative z-10 flex w-full items-center justify-center p-0 opacity-100 duration-300 laptop:absolute laptop:bottom-0 laptop:translate-y-full laptop:transform laptop:opacity-0 laptop:transition-all laptop:group-hover:translate-y-0 laptop:group-hover:opacity-100"
							>
								{#if cartState.cart?.lineItems?.some((item1) => item1.productId === item.productId)}
									<div>Item already in cart</div>
								{:else}
									<Button
										disabled={!!cartState.isUpdatingCart}
										variant="outline"
										class="w-full rounded-none border-gray-300 text-gray-900 transition-colors duration-300 dark:border-gray-500 dark:text-gray-100"
										onclick={() => {
											cartState.add({
												qty: item.qty,
												productId: item.productId,
												variantId: item.variantId
											})
										}}
									>
										<Plus class="mr-2 max-h-4 max-w-4 hover:animate-spin" />
										Add to cart
									</Button>
								{/if}
							</div>
						</div>

						<!-- Mobile View -->
						<div class="block gap-2 p-5 md:hidden lg:gap-5">
							<div class="flex items-center justify-between">
								<div>
									<a href={`/product/${item.slug}?variant_id=${item.variantId || ''}`} aria-label="Click to view the product details" class="shrink-0">
										<LazyImg src={item.img} alt=" " width="56" class="h-auto w-14 object-contain object-top" />
									</a>
								</div>
								<div class="mt-2 flex w-full flex-1 flex-col items-center justify-between gap-0.5 pt-1 xl:pl-4 xl:pr-4">
									<div class="flex justify-between gap-2 sm:gap-4">
										<a
											href={`/product/${item.slug}?variant_id=${item.variantId || ''}`}
											aria-label="Click to view the product details"
											class="flex-1 hover:underline"
										>
											<p>
												{item.title}
											</p>
										</a>
									</div>

									{#if item.qty}
										<span>
											Qty :

											<span class="font-semibold">
												{item.qty}
											</span>
										</span>
									{/if}

									<div class="flex flex-wrap items-center gap-1">
										Total :

										<span class="text-primary-700 whitespace-nowrap font-bold">
											{formatPrice(item.price, page?.data?.store?.currency?.code)}
										</span>
									</div>

									<div
										class="relative z-10 flex w-full items-center justify-center p-0 opacity-100 duration-300 laptop:absolute laptop:bottom-0 laptop:translate-y-full laptop:transform laptop:opacity-0 laptop:transition-all laptop:group-hover:translate-y-0 laptop:group-hover:opacity-100"
									>
										{#if cartState.cart?.lineItems?.some((item1) => item1.productId === item.productId)}
											<div>Item already in cart</div>
										{:else}
											<Button
												disabled={!!cartState.isUpdatingCart}
												variant="outline"
												class="w-full rounded-none border-gray-300 text-gray-900 transition-colors duration-300 dark:border-gray-500 dark:text-gray-100"
												onclick={() => {
													cartState.add({
														qty: item.qty,
														productId: item.productId,
														variantId: item.variantId
													})
												}}
											>
												<Plus class="mr-2 max-h-4 max-w-4 hover:animate-spin" />
												Add to cart
											</Button>
										{/if}
									</div>
								</div>
							</div>
						</div>
					</div>
				{/each}
			{:else}
				<p>No orders found</p>
			{/if}
		</div>
	</div>
</section>

<style>
	.track {
		border-radius: 25px;
		font-size: 11px;
	}
</style>
