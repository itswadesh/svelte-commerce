<script lang="ts">
import { onMount } from 'svelte'
import { get } from '../../../util/api'
import SEO from '$lib/components/SEO/index.svelte'
import { each } from 'svelte/internal'
import { date, currency } from './../../../util'

const seoProps = {
	title: 'Orders',
	metadescription: 'All orders details',
}
let orders
let opened = true
onMount(() => {
	getOrders()
})
async function getOrders() {
	orders = await get(`orders/my`)
}
</script>

<SEO {...seoProps} />

<h1 class="text-2xl  font-bold">My orders</h1>
{#if orders?.data?.length}
	{#each orders?.data as order}
		<div
			class="
                  p-4
                  my-5
                  transition
                  duration-300
                  bg-white
                  border-t border-gray-400
                  sm:rounded-sm sm:shadow-md sm:border
                  hover:bg-indigo-50
                ">
			<div class="flex justify-between py-2">
				<div class="flex">
					<div class="mx-4 -mt-1">
						<a
							href="{`/orders/${order._id}`}"
							class="
                          text-lg
                          font-semibold
                          tracking-wider
                          text-gray-800
                          cursor-pointer
                          md:text-2xl
                        ">
							{order.orderNo}
							{date(order.createdAt)}
						</a>

						<div class="mt-1 sm:flex">
							<div class="relative inline-block text-left">
								{#if opened}
									<div
										class="
                              absolute
                              right-0
                              mt-2
                              origin-top-right
                              bg-white
                              shadow-lg
                              w-52
                              ring-1 ring-black ring-opacity-5
                              focus:outline-none
                            "
										role="menu"
										aria-orientation="vertical"
										aria-labelledby="menu-button"
										tabindex="-1">
										<div class="" role="none">
											{orders.status}
										</div>
									</div>
								{/if}
							</div>
							<div class="my-1">
								<span
									class="
                            text-sm text-blue-500
                            cursor-pointer
                            hover:text-blue-800
                          ">
									{order.usermail}
								</span>
							</div>
							<div class="flex my-2 text-sm cursor-pointer item-center">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="w-5 h-5 text-blue-500"
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
								<span class="ml-2">Pay by {order.paymentMode}</span>
							</div>
							<div class="flex my-6 cursor-default">
								<div class="flex w-full text-xs">
									{#each order.items as item}
										<div class="flex w-full text-xs">
											<a href="{`/orders/${order.id}`}">
												{#if item.img}
													<img src="{item.img}" class="w-10 h-10" alt="" />
												{/if}
											</a>
											<div class="flex-1 ml-2">
												<div class="flex">
													<a href="{`/orders/${order.id}`}">
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
					</div>
					<div class="flex">
						<div>
							<div class="xl:flex">
								<div
									class="
                            flex
                            items-center
                            justify-end
                            mb-2
                            text-base
                            font-bold
                            text-gray-800
                            md:text-xl
                            xl:mb-0
                          ">
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
						<div class="my-auto">
							<a href="{`/orders/${order.id}`}" class="hidden cursor-pointer md:block">
								<svg
									class="
                            w-6
                            h-6
                            ml-4
                            text-gray-500
                            transform
                            hover:text-blue-800 hover:translate-x-1
                          "
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
					</div>
				</div>
			</div>
		</div>
	{/each}
{/if}
