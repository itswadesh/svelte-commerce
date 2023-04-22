<script>
import { currency, date } from '$lib/utils'
import { onMount } from 'svelte'
import { page } from '$app/stores'
import BackButton from '$lib/ui/BackButton.svelte'
import dayjs from 'dayjs'
import LazyImg from '$lib/components/Image/LazyImg.svelte'
import noAddToCartAnimate from '$lib/assets/no/add-to-cart-animate.svg'
import OrderListSkeleton from '../_OrderListSkeleton.svelte'
import OrderTracking from '../_OrderTracking.svelte'
import PrimaryButton from '$lib/ui/PrimaryButton.svelte'
import productNonVeg from '$lib/assets/product/non-veg.png'
import productVeg from '$lib/assets/product/veg.png'
import ReturnTracking from '../_ReturnTracking.svelte'
import SEO from '$lib/components/SEO/index.svelte'
import TransparentButton from '../_TransparentButton.svelte'

// let deliveryBy = null
let now = null
let selectedProduct = null
let showDemoScheduler = false
let loading = false

export let data

let clazz
export { clazz as class }

const seoProps = {
	title: 'Details ',
	metadescription: 'Details '
}

function head() {
	return {
		title: 'Order Details'
	}
}

onMount(() => {
	// deliveryBy = dayjs().add(7, 'day').format('dddd, MMM D, YYYY')
	now = dayjs()
})
</script>

<SEO {...seoProps} />

<div class="{clazz}">
	{#if loading}
		<OrderListSkeleton />
	{:else if data.order}
		<section>
			<BackButton to="/my/orders?sort=-updatedAt" class="mb-2" />

			<div class="mb-5 overflow-hidden rounded border sm:mb-10">
				<div
					class="flex flex-wrap items-center justify-between border-b bg-zinc-200 px-5 py-2 text-sm">
					<h5><b>Order No :</b> #{data.order?.orderNo}</h5>

					<h5><b>Order Date </b>: {date(data.order?.createdAt)}</h5>
				</div>

				<!-- Order detail  -->

				<div class="grid grid-cols-1 divide-y lg:grid-cols-2 lg:divide-y-0 lg:divide-x">
					<div class="col-span-1 flex flex-col divide-y divide-dashed">
						{#if data.order?.items}
							{#each data.order?.items as item}
								<div class="flex gap-2 p-5 lg:gap-5">
									<a
										href="{`/product/${item.slug}`}"
										aria-label="Click to view the product details"
										class="shrink-0">
										{#if item.isCustomized}
											<LazyImg
												src="{item.customizedImg}"
												alt=""
												width="96"
												class="h-auto w-24 object-contain object-top" />
										{:else}
											<LazyImg
												src="{item.img}"
												alt=""
												width="96"
												class="h-auto w-24 object-contain object-top" />
										{/if}
									</a>

									<div class="flex w-full flex-1 flex-col gap-1 text-sm xl:pr-4">
										<div class="mb-1 flex justify-between gap-2 sm:gap-4">
											<a
												href="{`/product/${item.slug}`}"
												aria-label="Click to view the product details"
												class="flex-1 text-base font-semibold hover:underline">
												{item.name}
											</a>

											{#if $page?.data?.store?.isFnb && item.foodType}
												<div>
													{#if item.foodType === 'veg'}
														<img src="{productVeg}" alt="veg" class="h-5 w-5" />
													{:else if item.foodType === 'nonveg'}
														<img src="{productNonVeg}" alt="non veg" class="h-5 w-5" />
													{/if}
												</div>
											{/if}
										</div>

										{#if item.brandName}
											<span>
												<b>Brand :</b>

												{item.brandName}
											</span>
										{/if}

										<div class="flex flex-wrap gap-1 items-center">
											{#if item.size}
												<span>
													<b>Size :</b>

													{item.size}
												</span>
											{/if}

											{#if item.color}
												<span>
													<b>Color : </b>

													{item.color}
												</span>
											{/if}
										</div>

										{#if item.vendor}
											<span>
												<b>Seller :</b>

												<a
													href="{`/vendor/${item.vendor?.slug}`}"
													aria-label="Click to view the vendor's profile"
													class="font-medium">
													{item.vendor?.businessName}
												</a>
											</span>
										{/if}

										{#if item?.usedOptions?.length}
											<div class="mt-2 flex flex-col gap-2 text-xs">
												{#each item?.usedOptions as option}
													{#if option?.val?.length && option?.val !== undefined && option?.val != ''}
														<div class="flex flex-wrap gap-2">
															<h6>{option.name}:</h6>

															{#if option.val}
																{#each option.val as v}
																	{#if v}
																		<div class="font-bold">
																			{v}
																		</div>
																	{/if}
																{/each}
															{/if}
														</div>
													{/if}
												{/each}
											</div>
										{/if}

										<div class="flex flex-wrap items-center gap-2">
											<span class="whitespace-nowrap text-base font-bold">
												{currency(item.price, $page.data.store.currencySymbol)}
											</span>

											{#if item.mrp > item.price}
												<span class="whitespace-nowrap text-zinc-500 line-through">
													{currency(item.mrp, $page.data.store.currencySymbol)}
												</span>

												{#if Math.floor(((item.mrp - item.price) / item.mrp) * 100) > 0}
													<span class="whitespace-nowrap text-green-600">
														({Math.floor(((item.mrp - item.price) / item.mrp) * 100)}% off)
													</span>
												{/if}
											{/if}
										</div>

										{#if item?.status === 'delivered'}
											<div class="mt-2 xl:mt-0 xl:w-1/3">
												<a
													href="/my/reviews/create?pid={item?.pid}&oid={item?.orderItemId}&ref=/product/{item?.slug}"
													aria-label="Click to visit rate & review product"
													class="whitespace-nowrap font-semibold text-indigo-500 focus:outline-none hover:underline">
													Rate & Review Product
												</a>
											</div>
										{/if}
									</div>
								</div>
							{/each}
						{/if}
					</div>

					<div class="col-span-1 flex flex-col gap-5 p-5 lg:gap-10">
						<div>
							<h4 class="mb-2 font-semibold">Delivery Address</h4>

							<p class="flex flex-col text-sm font-light text-zinc-500">
								<span>
									{data.order?.userFirstName}
									{data.order?.userLastName}

									<br />

									{data.order?.address?.address}, {data.order?.address?.city},
									{data.order?.address?.country}, {data.order?.address?.state}

									<br />

									{data.order?.address?.zip}
								</span>
							</p>

							{#if data.order?.userPhone}
								<h6 class="mt-1 text-sm">
									Phone No: <span> {data.order?.userPhone}</span>
								</h6>
							{/if}
						</div>

						<div>
							<h4 class="mb-2 font-semibold">Billing Address</h4>

							<p class="flex flex-col text-sm font-light text-zinc-500">
								<span>
									{data.order?.billingAddress?.firstName}
									{data.order?.billingAddress?.lastName}

									<br />

									{data.order?.billingAddress?.address}, {data.order?.billingAddress?.city},
									{data.order?.billingAddress?.country}, {data.order?.billingAddress?.state}

									<br />

									{data.order?.billingAddress?.zip}
								</span>
							</p>

							{#if data.order?.userPhone}
								<h6 class="mt-1 text-sm">
									Phone No: <span> {data.order?.userPhone}</span>
								</h6>
							{/if}
						</div>

						<!-- <div>
							<h4 class="mb-2 font-semibold">Vendor Details :</h4>

							<p class="flex flex-col text-sm font-light text-zinc-500">
								<span>
									{data.order?.vendorBusinessName},

									{data.order?.vendorAddress?.address}, {data.order?.vendorAddress?.town},

									{data.order?.vendorAddress?.city}, {data.order?.vendorAddress?.state}</span>

								<span>{data.order?.vendorAddress?.zip}</span>
							</p>

							{#if data.order?.vendorPhone}
								<h6 class="mt-2 text-sm">
									Phone number: <span> {data.order?.vendorPhone}</span>
								</h6>
							{/if}
						</div> -->
					</div>
				</div>
			</div>

			<!-- Order Tracker -->

			<div>
				{#if !!data.order?.foodType && data.order?.status !== 'delivered' && data.order?.expectedDeliveryDate}
					<h4 class="mb-5">
						<span class="font-medium">Expected Delivery Date : </span>

						<span class="text-sm font-light text-zinc-500">
							{date(data.order?.expectedDeliveryDate)}
						</span>
					</h4>
				{/if}

				<div class="mt-5 sm:mt-10 flex flex-wrap gap-10">
					{#if data.orderTracking?.length}
						<OrderTracking tracks="{data.orderTracking}" />
					{/if}

					<!-- {#if !data.order?.isReplaceOrReturn}
					{:else}
						<ReturnTracking order="{data.order}" />
					{/if} -->

					<div class="flex flex-col gap-2">
						{#if data.order?.invoiceLink}
							<a
								href="{data.order?.invoiceLink}"
								aria-label="Click to download invoice"
								target="blank"
								class="block">
								<PrimaryButton class="w-48" type="button">Download Invoice</PrimaryButton>
							</a>
						{/if}

						{#if data.order?.replaceValidTill != null && now <= data.order?.replaceValidTill && !data.order?.isReplaceOrReturn}
							<a
								href="/my/exchange?orderId=${data.order?.orderId}&itemId=${data.order?.itemId}"
								aria-label="Click to visit exchange"
								class="block">
								<TransparentButton class="w-48" type="button" border>Exchange</TransparentButton>
							</a>
						{/if}

						<!-- {#if data.order?.returnValidTill != null && now <= data.order?.returnValidTill && !data.order?.isReplaceOrReturn}
							<a
								href="/my/return?orderId=${data.order?.orderId}&itemId=${data.order?.itemId}"
								aria-label="Click to visit return"
								class="block">
								<TransparentButton class="w-48" type="button" border>Return</TransparentButton>
							</a>
						{/if} -->
					</div>
				</div>
			</div>
		</section>
	{:else}
		<div class="flex flex-col items-center justify-center text-center">
			<img src="{noAddToCartAnimate}" alt="empty cart" class="mb-5 h-60 object-contain" />

			<span class="mb-3 text-xl font-medium md:text-3xl"> Your have't ordered yet !!</span>

			<span class="mb-4 text-xs">Add items to it now</span>

			<a href="/" aria-label="Click to visit home" data-sveltekit-preload-data>
				<PrimaryButton class="w-40 py-2 text-sm">Shop Now</PrimaryButton>
			</a>
		</div>
	{/if}
</div>
