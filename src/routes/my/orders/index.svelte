<script lang="ts">
import { onMount } from 'svelte'
import SEO from '$lib/components/SEO/index.svelte'
import { date, currency, store } from './../../../util'
import { KQL_MyOrders } from '$lib/graphql/_kitql/graphqlStores'
import { stringify } from 'postcss'

const seoProps = {
	title: 'Orders',
	metadescription: 'All orders details'
}
let orders
let open = false
function toggle() {
	open = !open
}

onMount(() => {
	getOrders()
})
async function getOrders() {
	orders = (await KQL_MyOrders.query({ variables: { store: store.id } })).data?.myOrders
}
</script>

<SEO {...seoProps} />

<section class="w-full h-full pl-2 sm:pl-8 sm:pr-2 text-gray-800 tracking-wide ">
	<h1 class="font-bold  text-lg sm:text-xl">
		<span class="mr-1">My orders</span>{#if orders?.count}( {orders?.count} ){/if}
	</h1>
	{#if !$KQL_MyOrders.isFetching && orders?.count > 0}
		{#each orders?.data as order}
			<div
				class=" relative p-4 my-2 sm:my-5 transition duration-300 bg-white border-t border-gray-300 rounded-md md:shadow-md border ">
				<div class="flex justify-between items-center">
					<div class="sm:ml-4">
						<div class="">
							<span class="text-lg font-semibold tracking-wider md:text-2xl"> {order.orderNo}</span>
						</div>
						<div class="text-gray-400 text-sm">
							{date(+order.createdAt)}
						</div>
						<div class="flex my-2 text-sm item-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="w-5 h-5 text-primary-500"
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
						<div class="flex my-6">
							<div class="flex w-full text-xs">
								{#each order.orderItems as item}
									<div class="flex w-full text-xs">
										<a href="{`/my/orders/details?itemId=${item.id}`}">
											{#if item.imgCdn}
												<img src="{item.imgCdn}" class="w-10 h-10" alt="" />
											{/if}
										</a>
										<div class="flex-1 ml-2">
											<div class="flex">
												<a href="{`/my/orders/details?itemId=${item.id}`}">
													<h4 class="font-semibold text-gray-800">
														{item.name}
													</h4>
												</a>
											</div>
											<div class="flex my-1">
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
									class=" flex items-center justify-end mb-2 text-base font-bold text-gray-800 md:text-xl xl:mb-0">
									<span class="text-gray-800"> </span>
									{#if order && order.amount}
										<span class="">
											{currency(order.amountotal)}
										</span>
									{/if}
								</div>

								<div class="items-center hidden md:ml-4 sm:block md:flex">
									<div class="mb-2 md:mb-0"></div>
								</div>
							</div>
						</div>

						<!-- Chevron right icon div start -->
						<div class="hidden sm:block my-auto">
							<a href="{`/orders/${order.id}`}">
								<svg
									class=" w-6 h-6 ml-4 text-gray-500 transform hover:text-primary-500 hover:translate-x-1"
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
			<h4 class="font-semibold mb-5 text-center">There are no orders yet</h4>

			<img src="/no/empty-animate.svg" alt="" class="h-80 md:h-96 mb-10" />

			<a
				href="/"
				class="bg-white hover:bg-primary-500 rounded-md shadow hover:shadow-md py-2 px-8 font-semibold text-sm text-primary-500 hover:text-white border hover:border-white border-primary-500 focus:outline-none mx-auto focus:ring-primary-500 ring-opacity-50">
				Shop Now
			</a>
		</div>
	{:else}
		Loading Orders
	{/if}
</section>
