<script lang="ts">
import { onMount } from 'svelte'
import SEO from '$lib/components/SEO/index.svelte'
import { date, currency, store } from '$lib/util'
import { GQL_myOrders } from '$houdini'

const seoProps = {
	title: 'Orders',
	metadescription: 'All orders details'
}
let open = false
function toggle() {
	open = !open
}

onMount(() => {
	getOrders()
})
async function getOrders() {
	await GQL_myOrders.fetch({ variables: { store: store.id } })
}
$: orders = $GQL_myOrders.data?.myOrders
</script>

<SEO {...seoProps} />

<section class="h-full w-full pl-2 tracking-wide text-gray-800 sm:pl-8 sm:pr-2 ">
	<h1 class="text-lg  font-bold sm:text-xl">
		<span class="mr-1">My orders</span>{#if orders?.count}( {orders?.count} ){/if}
	</h1>
	{#if $GQL_myOrders.isFetching}
		Finding your Orders...
	{:else if orders?.count}
		{#each orders?.data as order}
			<div
				class=" relative my-2 rounded-md border border-t border-gray-300 bg-white p-4 transition duration-300 sm:my-5 md:shadow-md ">
				<div class="flex items-center justify-between">
					<div class="sm:ml-4">
						<div class="">
							<span class="text-lg font-semibold tracking-wider md:text-2xl"> {order.orderNo}</span>
						</div>
						<div class="text-sm text-gray-400">
							{date(+order.createdAt)}
						</div>
						<div class="item-center my-2 flex text-sm">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 text-primary-500"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
								></path>
							</svg>
							<span class="ml-2">
								Pay by
								<span class="font-semibold">{order.paymentMode}</span>
							</span>
						</div>
						<div class="my-6 flex">
							<div class="flex w-full text-xs">
								{#each order.orderItems as item}
									<div class="flex w-full text-xs">
										<a href="{`/my/orders/details?itemId=${item.id}`}">
											{#if item.imgCdn}
												<img src="{item.imgCdn}" class="h-10 w-10" alt="" />
											{/if}
										</a>
										<div class="ml-2 flex-1">
											<div class="flex">
												<a href="{`/my/orders/details?itemId=${item.id}`}">
													<h4 class="font-semibold text-gray-800">
														{item.name}
													</h4>
												</a>
											</div>
											<div class="my-1 flex">
												<h5 class="text-gray-500">
													{item.status}:
												</h5>
											</div>
											<h6 class="my-1 text-gray-800">
												{item.qty} × {currency(item.price)}
											</h6>
										</div>
									</div>
								{/each}
							</div>
						</div>
					</div>
					<div class="flex">
						<div>
							<div class="xl:flex">
								<div
									class=" mb-2 flex items-center justify-end text-base font-bold text-gray-800 md:text-xl xl:mb-0">
									<span class="text-gray-800"> </span>
									{#if order && order.amount}
										<span class="">
											{currency(order.amount)}
										</span>
									{/if}
								</div>

								<div class="hidden items-center sm:block md:ml-4 md:flex">
									<div class="mb-2 md:mb-0"></div>
								</div>
							</div>
						</div>

						<!-- Chevron right icon div start -->
						<div class="my-auto hidden sm:block">
							<a href="{`/my/orders/details?itemId=${order.id}`}">
								<svg
									class=" ml-4 h-6 w-6 transform text-gray-500 hover:translate-x-1 hover:text-primary-500"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 5l7 7-7 7"></path>
								</svg>
							</a>
						</div>
						<!-- Chevron right icon div start -->
					</div>
				</div>
			</div>
		{/each}
	{:else if orders?.count < 1}
		<div class="my-10 flex flex-col items-center justify-center ">
			<h4 class="mb-5 text-center font-semibold">There are no orders yet</h4>

			<img src="/no/empty-animate.svg" alt="" class="mb-10 h-80 md:h-96" />

			<a
				href="/"
				class="mx-auto rounded-md border border-primary-500 bg-white py-2 px-8 text-sm font-semibold text-primary-500 shadow ring-opacity-50 hover:border-white hover:bg-primary-500 hover:text-white hover:shadow-md focus:outline-none focus:ring-primary-500">
				Shop Now
			</a>
		</div>
	{:else}
		<div class="flex items-center justify-center">No order found.</div>
	{/if}
</section>
