<script context="module" lang="ts">
import SEO from '$lib/components/SEO/index.svelte'

export async function load({ url, params, fetch }) {
	return { props: { id: url.searchParams.get('id') } }
}
</script>

<script>
import { currency, date } from '$lib/util'
import { onMount } from 'svelte'

import OrderAddressDetails from './_OrderAddressDetails.svelte'
import OrderSuccessSkeleton from './_OrderSuccessSkeleton.svelte'
import { GQL_myOrders, GQL_paySuccessPageHit } from '$houdini'
import { browser } from '$app/env'
export let id
$: browser && GQL_paySuccessPageHit.fetch()

onMount(() => {
	refresh()
})
let order = null,
	loading = false
async function refresh() {
	try {
		loading = true
		order = (await GQL_paySuccessPageHit.mutate({ variables: { orderId: id } })).data
			.paySuccessPageHit
	} catch (e) {
	} finally {
		loading = false
	}
}
const seoProps = {
	title: 'Payment-Success',
	metadescription: 'Payment is successfully completed'
}
</script>

<SEO {...seoProps} />

<div class="container mx-auto rounded-lg bg-white">
	<div class="h-full max-w-full p-2 sm:p-3 lg:p-8">
		<div class="flex flex-col">
			<div class="p-2 sm:p-4 lg:mt-12 lg:p-12">
				<div class="">
					<div class="flex items-center justify-center rounded-full lg:-mt-28">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="text-secondary-200 h-24 w-24 md:h-28 md:w-28"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
							></path>
						</svg>
					</div>
					{#if order}
						<h2 class="text-center text-3xl font-bold">
							Paid:
							{currency(order.amount.total)}
						</h2>
						<h3
							class="
                pt:mt-0 flex
                flex-row
                justify-center
                pt-4
                lg:justify-between
              ">
							<div class="text-2xl font-medium text-gray-700">Thanks for your Order!!</div>
						</h3>
					{/if}
					{#if !order && loading}
						<OrderSuccessSkeleton />
					{:else if order}
						<div>
							<h3
								class="
                  mt-1 flex
                  flex-row
                  justify-center
                  font-medium
                  lg:justify-start
                ">
								<div class="text-gray-500 me-2">Order Number:</div>
								<div class="underline-secondary-500 text-secondary-500 underline">
									{order.orderNo}
								</div>
							</h3>
							<div
								class="
                  flex w-full
                  flex-col
                  justify-center
                  py-7
                  lg:flex-row
                  lg:justify-between
                ">
								<div
									class="
                    w-full
                    text-center
                    text-sm
                    font-light text-gray-500
                    lg:w-3/5
                    lg:text-start
                  ">
									Your Order was place on <b>{date(order.createdAt)}</b> . A Confirmation e-mail will
									be sent to the e-mail Address(es) that you specified in Order details.
								</div>
								<div class="mt-6 flex flex-row justify-center text-sm lg:mt-0">
									<a
										href="/my/orders"
										class="
                        transform
                        rounded
                        border
                        border-primary-500 bg-primary-500
                        p-2
                        px-4
                        text-white
                        shadow
                        transition
                        duration-200
                        ease-in-out
                        hover:-translate-y-0.5
                        focus:outline-none
                        focus:ring
                        focus:ring-primary-500
                        focus:ring-opacity-50
                        focus:ring-offset-2
                        lg:p-2
                        lg:px-3
                      ">
										View Order Details
									</a>
									<a
										href="/"
										class="
                        text-secondary-200
                        border-secondary-200
                        hover:opacity-8
                        my-auto
                        transform rounded
                        border
                        p-2
                        px-4
                        shadow
                        transition
                        duration-200
                        ease-in-out
                        ms-4
                        hover:-translate-y-0.5
                        focus:outline-none
                        focus:ring
                        focus:ring-green-500
                        focus:ring-opacity-50
                        focus:ring-offset-2
                        md:py-2 lg:p-2 lg:px-3
                      ">
										Continue Shopping
									</a>
								</div>
							</div>
							<div>
								<div class="my-4 font-medium text-gray-700">Item Details</div>
								{#each order.items as item}
									<div class="flex w-full flex-row justify-between pb-6 lg:pb-0">
										<div class="my-3 flex w-full flex-row">
											<a href="{`/${item?.slug}?id=${item?.pid}`}" class="">
												<img src="{item?.imgCdn}" alt="" class="w-28 border object-cover" />
											</a>
											<div class="relative flex w-4/5 flex-col ms-3 lg:w-10/12">
												<a
													href="{`/${item?.slug}?id=${item?.pid}`}"
													class="truncate text-base font-normal text-gray-600">
													{item?.name}
												</a>
												<div
													class="
                          mt-2
                          flex
                          w-full
                          items-center
                          justify-start
                          text-sm
                          font-medium
                          text-gray-500
                        ">
													<div class="me-4">Qty: {item?.qty}</div>
													<div
														class="
                            flex flex-row
                            justify-self-end
                            text-base
                            font-medium
                            md:my-auto
                          ">
														<div class="font-light text-gray-400 me-1">Price:</div>
														<div class="text-secondary-200">
															{currency(item?.price)}
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								{/each}
							</div>
						</div>
					{/if}
					<OrderAddressDetails order="{order}" />
				</div>
			</div>
		</div>
	</div>
</div>
