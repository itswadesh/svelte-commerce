<script>
import SEO from '$lib/components/SEO/index.svelte'
import { onMount } from 'svelte'
import dayjs from 'dayjs'
import { currency, date } from '$lib/util'
import OrderTracking from '../_OrderTracking.svelte'
import ReturnTracking from '../_ReturnTracking.svelte'
import TransparentButton from '../_TransparentButton.svelte'
import OrderListSkeleton from '../_OrderListSkeleton.svelte'
import { page } from '$app/stores'
import BackButton from '$lib/ui/BackButton.svelte'
import PrimaryButton from '$lib/ui/PrimaryButton.svelte'
import LazyImg from '$lib/components/Image/LazyImg.svelte'
import { getAPI } from '$lib/util/api'

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

			<div class="mb-5 overflow-hidden rounded-md border sm:mb-10">
				<div
					class="flex flex-wrap items-center justify-between border-b bg-gray-200 px-5 py-2 text-sm">
					<h5><b>Order No :</b> #{data.order?.orderNo}</h5>

					<h5><b>Order Date </b>: {date(data.order?.createdAt)}</h5>
				</div>

				<!-- Order detail  -->

				<div class="grid grid-cols-1 divide-y lg:grid-cols-2 lg:divide-y-0 lg:divide-x">
					<div class="col-span-1 flex flex-col divide-y divide-dashed">
						{#each data.order?.items as item}
							<div class="flex gap-2 p-5 lg:gap-5">
								<a
									href="{`/product/${item.slug}`}"
									aria-label="Click to view the product details"
									class="flex-shrink-0">
									<LazyImg
										src="{item.imgCdn}"
										alt=""
										width="96"
										class="w-24 object-contain object-top" />
								</a>

								<div class="flex w-full flex-1 flex-col text-sm xl:pr-4">
									<div class="mb-1 flex justify-between gap-2 sm:gap-4">
										<a
											href="{`/product/${item.slug}`}"
											aria-label="Click to view the product details"
											class="flex-1 text-base font-semibold hover:underline">
											{item.name}
										</a>
										<!-- {#if item.foodType}
									<div>
										{#if item.foodType === 'V'}
											<LazyImg
												src="/product/veg.png"
												alt="veg"
												width="20"
												height="20"
												class="h-5 w-5" />
										{:else if item.foodType === 'N' || item.foodType === 'E'}
											<LazyImg
												src="/product/non-veg.png"
												alt="non veg"
												width="20"
												height="20"
												class="h-5 w-5" />
										{:else}
											<LazyImg
												src="/product/other.png"
												alt="other"
												width="20"
												height="20"
												class="h-5 w-5" />
										{/if}
									</div>
								{/if} -->
									</div>

									{#if item.brandName}
										<h4 class="mb-2 capitalize">
											{item.brandName}
										</h4>
									{/if}

									<div class="flex flex-wrap items-center whitespace-nowrap">
										{#if item.size}
											<h6 class="mr-4 mb-2">
												Size :

												<span class="font-medium">{item.size}</span>
											</h6>
										{/if}

										{#if item.color}
											<h6 class="mb-2">
												Color :

												<span class="font-medium">{item.color}</span>
											</h6>
										{/if}
									</div>

									{#if item.vendor}
										<h6 class="mb-2">
											Seller :
											<a
												href="{`/vendor/${item.vendor?.id}`}"
												aria-label="Click to view the vendor's profile"
												class="font-medium">
												{item.vendor?.businessName}
											</a>
										</h6>
									{/if}

									<div class="flex flex-wrap items-center gap-2">
										<span class="text-base font-bold whitespace-nowrap">
											{currency(item.price)}
										</span>

										{#if item.mrp > item.price}
											<span class="text-gray-500 line-through whitespace-nowrap">
												{currency(item.mrp)}
											</span>

											{#if Math.floor(((item.mrp - item.price) / item.mrp) * 100) > 0}
												<span class="text-green-600 whitespace-nowrap">
													({Math.floor(((item.mrp - item.price) / item.mrp) * 100)}% off)
												</span>
											{/if}
										{/if}
									</div>
								</div>
							</div>
						{/each}
					</div>

					<div class="col-span-1 flex flex-col gap-5 lg:gap-10 p-5">
						<div>
							<h4 class="mb-2 font-semibold">Delivery Address</h4>

							<p class="flex flex-col text-sm font-light text-gray-500">
								<span>
									{data.order?.userFirstName}

									{data.order?.userLastName},

									{data.order?.address?.address}, {data.order?.address?.town},

									{data.order?.address?.city}, {data.order?.address?.state}</span>

								<span>{data.order?.address?.zip}</span>
							</p>

							{#if data.order?.userPhone}
								<h6 class="mt-2 text-sm">
									Phone No: <span> {data.order?.userPhone}</span>
								</h6>
							{/if}
						</div>

						<div>
							<h4 class="mb-2 font-semibold">Billing Address</h4>

							<p class="flex flex-col text-sm font-light text-gray-500">
								<span>
									{data.order?.billingAddress.firstName}

									{data.order?.billingAddress.lastName},

									{data.order?.billingAddress.address}, {data.order?.billingAddress.town},

									{data.order?.billingAddress.city}, {data.order?.billingAddress.state}
								</span>

								<span>{data.order?.billingAddress.zip}</span>
							</p>

							{#if data.order?.userPhone}
								<h6 class="mt-2 text-sm">
									Phone No: <span> {data.order?.userPhone}</span>
								</h6>
							{/if}
						</div>

						<!-- <div>
							<h4 class="mb-2 font-semibold">Vendor Details :</h4>

							<p class="flex flex-col text-sm font-light text-gray-500">
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
				{#if !!data.order?.foodType && data.order?.status !== 'Delivered' && data.order?.expectedDeliveryDate}
					<h4 class="mb-5">
						<span class="font-medium">Expected Delivery Date : </span>

						<span class="text-sm font-light text-gray-500">
							{date(data.order?.expectedDeliveryDate)}
						</span>
					</h4>
				{/if}

				<h4 class="mb-5">
					<span class="font-medium">Expected Delivery Date : </span>

					<span class="text-sm font-light text-gray-500"> 10.02.2022 </span>
				</h4>

				{#if data.order?.status === 'Delivered'}
					<div class="mt-2 xl:mt-0 xl:w-1/3">
						<a
							href="/my/reviews/create?product={data.order?.pid}&ref=/product/{data.order?.slug}"
							aria-label="Click to route rate & review product"
							class="whitespace-nowrap font-semibold text-indigo-500 focus:outline-none hover:underline">
							Rate & Review Product
						</a>
					</div>
				{/if}

				<div class="mt-5 sm:mt-10 xl:flex xl:items-center xl:justify-between">
					{#if data.orderTracking?.data?.length}
						<OrderTracking order="{data.orderTracking}" />
					{/if}

					<!-- {#if !data.order?.isReplaceOrReturn}
					{:else}
						<ReturnTracking order="{data.order}" />
					{/if} -->

					<div class="mt-10 mb-4 xl:mb-0 xl:mt-0 xl:w-1/3">
						<div class="flex flex-col xl:items-center xl:justify-center">
							{#if data.order?.invoiceLink}
								<a
									href="{data.order?.invoiceLink}"
									aria-label="Click to download invoice"
									target="blank"
									class="mb-4">
									<PrimaryButton class="w-48" type="button">Download Invoice</PrimaryButton>
								</a>
							{/if}

							{#if data.order?.replaceValidTill != null && now <= data.order?.replaceValidTill && !data.order?.isReplaceOrReturn}
								<a
									href="/my/exchange?orderId=${data.order?.orderId}&itemId=${data.order?.itemId}"
									aria-label="Click to route exchange"
									class="mb-4">
									<TransparentButton class="w-48" type="button" border>Exchange</TransparentButton>
								</a>
							{/if}

							<!-- {#if data.order?.returnValidTill != null && now <= data.order?.returnValidTill && !data.order?.isReplaceOrReturn}
								<a
									href="/my/return?orderId=${data.order?.orderId}&itemId=${data.order?.itemId}"
									aria-label="Click to route return">
									<TransparentButton class="w-48" type="button" border>Return</TransparentButton>
								</a>
							{/if} -->
						</div>
					</div>
				</div>
			</div>
		</section>
	{:else}
		<div class="flex flex-col items-center justify-center text-center">
			<img src="/no/add-to-cart-animate.svg" alt="empty cart" class="mb-5 h-60 object-contain" />

			<span class="mb-3 text-xl font-medium md:text-3xl"> Your have't ordered yet !!</span>

			<span class="mb-4 text-xs">Add items to it now</span>

			<a href="/" aria-label="Click to route home" data-sveltekit-prefetch>
				<PrimaryButton class="w-40 py-2 text-sm">Shop Now</PrimaryButton>
			</a>
		</div>
	{/if}
</div>
