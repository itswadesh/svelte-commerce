<style>
.track {
	border-radius: 25px;
	font-size: 11px;
}
</style>

<script>
import { currency, date } from '$lib/utils'
import { goto } from '$app/navigation'
import { LazyImg, Pagination } from '$lib/components'
import { page } from '$app/stores'
import { PrimaryButton, WhiteButton } from '$lib/ui'
import noAddToCartAnimate from '$lib/assets/no/add-to-cart-animate.svg'
import OrderListSkeleton from './_OrderListSkeleton.svelte'
import productNonVeg from '$lib/assets/product/non-veg.png'
import productVeg from '$lib/assets/product/veg.png'
import { onMount } from 'svelte'
import { browser } from '$app/environment'
// import { storeStore } from '$lib/store/store'

export let orders
// console.log('zzzzzzzzzzzzzzzzzz', orders)

let clazz = ''
export { clazz as class }

// let store = {}
$: store = $page.data?.store

// onMount(() => {
// 	if (browser) {
// 		storeStore.subscribe((value) => (store = value))
// 	}
// })
</script>

<div class="w-full {clazz}">
	{#if orders.count}
		<div>
			<header class="mb-5 flex flex-wrap items-start justify-between gap-4">
				<h1>
					Orders {#if orders.count}({orders.count}){/if}
				</h1>

				<!--  Back button -->

				<div class="flex flex-wrap items-center gap-2">
					<a href="/my" class="block">
						<WhiteButton hideLoading class="group text-xs">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="h-5 w-5 transform transition duration-300 group-hover:-translate-x-2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"
								></path>
							</svg>

							<div class="flex flex-col gap-0.5 text-left">
								<span class="hidden text-xs font-normal text-zinc-500 sm:block"> Prev </span>

								<span>Dashboard</span>
							</div>
						</WhiteButton>
					</a>
				</div>
			</header>

			<ul>
				{#each orders.data as order}
					{#if order?.items?.length}
						<!-- Desktop UI of order -->

						<li class="mb-4 hidden sm:mb-10 xl:block">
							<div class="mb-3 flex items-center justify-between text-zinc-500 sm:mb-4">
								<p>Order No : #{order.orderNo || '_'}</p>

								<p>Order Date : {date(order.createdAt)}</p>
							</div>

							<table
								class="group min-w-full divide-y divide-zinc-200 rounded border border-zinc-200 shadow-md"
								on:click="{() => goto(`/my/orders/${order.orderNo}`)}">
								<thead class="whitespace-nowrap rounded-t-md bg-zinc-100 text-xs uppercase">
									<tr>
										<!-- <th class="px-5 py-3 text-zinc-500"> # </th> -->

										<th class="p-3 text-zinc-500"> Image </th>

										<th class="p-3 text-zinc-500"> Vendor </th>

										<th class="p-3 text-zinc-500"> Name </th>

										<th class="p-3 text-zinc-500"> Qty </th>

										<th class="p-3 text-zinc-500"> Size </th>

										<th class="p-3 text-zinc-500"> Price </th>

										<th class="p-3 text-zinc-500"> Shipping Charges </th>

										<th class="p-3 text-zinc-500"> Total </th>

										<th class="p-3 text-zinc-500"> Status </th>
									</tr>
								</thead>

								<tbody
									class="cursor-pointer divide-y divide-zinc-200 rounded-b-md bg-white text-sm transition duration-300 group-hover:bg-primary-50">
									{#each order.items as item}
										<tr>
											<td class="p-3">
												<div class="shrink-0">
													{#if item.isCustomized}
														<img
															src="{item.customizedImg}"
															alt="customizedImg"
															class="h-auto w-14 object-contain object-top" />
													{:else if item.img}
														<LazyImg
															src="{item.img}"
															alt=" "
															width="56"
															class="h-auto w-14 object-contain object-top" />
													{:else}
														<div
															class="w-20 h-20 rounded bg-zinc-200 flex items-center flex-col justify-center p-2 text-center text-xs text-zinc-500">
															<svg
																xmlns="http://www.w3.org/2000/svg"
																fill="none"
																viewBox="0 0 24 24"
																stroke-width="1.5"
																stroke="currentColor"
																class="w-5 h-5">
																<path
																	stroke-linecap="round"
																	stroke-linejoin="round"
																	d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
																></path>
															</svg>

															<span>No Image</span>
														</div>
													{/if}
												</div>
											</td>

											<td class="p-3">
												{item.vendorBusinessName || '_'}
											</td>

											<td class="p-3">
												<div class="flex w-60 items-center gap-2">
													<span>{item.name || '_'}</span>

													{#if store?.isFnb && item.foodType}
														<div class="shrink-0">
															{#if item.foodType === 'veg'}
																<img src="{productVeg}" alt="veg" class="h-5 w-5" />
															{:else if item.foodType === 'nonveg'}
																<img src="{productNonVeg}" alt="non veg" class="h-5 w-5" />
															{/if}
														</div>
													{/if}
												</div>
											</td>

											<td class="whitespace-nowrap p-3">
												{item.qty || '_'}
											</td>

											<td class="whitespace-nowrap p-3">
												{item.size || '_'}
											</td>

											<td class="whitespace-nowrap p-3">
												{currency(item.price, store?.currencySymbol)}
											</td>

											<td class="whitespace-nowrap p-3">
												{currency(item.shippingCharges, store?.currencySymbol)}
											</td>

											<td class="whitespace-nowrap p-3">
												{currency(item.total, store?.currencySymbol)}
											</td>

											<td class="p-3">
												<span class="whitespace-nowrap font-semibold capitalize">
													{item.status || '_'}
												</span>
											</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</li>

						<!-- Mobile UI of order -->

						<li class="block xl:hidden">
							<div class="mb-3 flex items-center justify-between sm:mb-4 text-zinc-500">
								<p>
									Order No :
									{order.orderNo || '_'}
								</p>

								<p>
									{date(order.createdAt)}
								</p>
							</div>

							<a
								href="/my/orders/{order.orderNo}"
								aria-label="orders"
								class="mb-4 block w-full divide-y rounded border bg-white text-sm shadow transition duration-300 hover:bg-primary-50 sm:mb-10">
								{#each order.items as item}
									<div class="flex items-start gap-2 p-4 sm:gap-5">
										<div class="shrink-0">
											{#if item.isCustomized}
												<img
													src="{item.customizedImg}"
													alt=" "
													class="h-auto w-14 object-contain object-top" />
											{:else}
												<LazyImg
													src="{item.img}"
													alt=" "
													width="56"
													class="h-auto w-14 object-contain object-top" />
											{/if}
										</div>

										<div class="w-full flex-1">
											<!-- {#if item.vendor}
													<a href="/vendor/${item.vendor?.slug}" aria-label="Click to visit vendor's profile">
														 {#if store.isFnb && item.vendorBusinessName}
															 <b class="mb-2">
																 {item.vendorBusinessName}
															</b>
														{/if}
													</a>
												{/if} -->

											<div class="mb-2 flex items-start justify-between">
												<p class="flex-1">{item.name || '_'}</p>

												{#if $page?.data?.store?.isFnb && item.foodType}
													<div>
														{#if item.foodType === 'veg'}
															<img src="/product/veg.png" alt="veg" class="h-5 w-5" />
														{:else if item.foodType === 'nonveg'}
															<img src="/product/non-veg.png" alt="non veg" class="h-5 w-5" />
														{/if}
													</div>
												{/if}
											</div>

											<div class="flex flex-wrap gap-y-1 gap-x-3">
												<div class="flex items-center gap-2">
													<p>Price :</p>

													<b>
														{currency(item.price, store?.currencySymbol)}
													</b>
												</div>

												<div class="flex items-center gap-2">
													<p>Qty :</p>

													<b>
														{item.qty || '_'}
													</b>
												</div>

												{#if item.size}
													<div class="flex items-center gap-2">
														<p>Size :</p>

														<b>
															{item.size || '_'}
														</b>
													</div>
												{/if}

												{#if item.shippingCharges}
													<div class="flex items-center gap-2">
														<p>Shipping Charges :</p>

														<b>
															{currency(item.shippingCharges, store?.currencySymbol)}
														</b>
													</div>
												{/if}

												<div class="flex items-center gap-2">
													<p>Total :</p>

													<b>
														{currency(item.total, store?.currencySymbol)}
													</b>
												</div>

												<div class="flex items-center gap-2">
													<p>Status :</p>

													<b class="capitalize">
														{item.status || '_'}
													</b>
												</div>
											</div>
										</div>
									</div>
								{/each}
							</a>
						</li>
					{/if}
				{/each}
			</ul>

			<Pagination
				count="{Math.ceil((orders.count || 1) / orders.pageSize)}"
				current="{orders.currentPage || 1}" />
		</div>
	{:else}
		<div class="flex h-[70vh] flex-col items-center justify-center text-center">
			<img src="{noAddToCartAnimate}" alt="empty wishlist" class="mb-5 h-60 object-contain" />

			<h2 class="mb-2">You have't Ordered Yet!!</h2>

			<p class="mb-5">There's no order placed, start adding items to your cart.</p>

			<a href="/" aria-label="Click to visit home" data-sveltekit-preload-data>
				<PrimaryButton class="w-40 py-2 text-sm">Shop Now</PrimaryButton>
			</a>
		</div>
	{/if}
</div>
