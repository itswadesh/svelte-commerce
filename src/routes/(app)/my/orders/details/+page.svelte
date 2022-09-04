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

let deliveryBy = null,
	now = null,
	selectedProduct = null,
	showDemoScheduler = false,
	loading = false

export let data

// console.log('data', data)

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
	deliveryBy = dayjs().add(7, 'day').format('dddd, MMM D, YYYY')
	now = dayjs()
})
</script>

<SEO {...seoProps} />

<div class="{clazz}">
	{#if loading}
		<OrderListSkeleton />
	{:else if data.order}
		<section class="text-gray-800">
			<BackButton to="/my/orders?sort=-updatedAt" class="mb-2" />

			<div class="border">
				<div
					class="flex flex-wrap items-center justify-between bg-gray-200 px-4 pt-2 pb-1 text-sm tracking-wide">
					<h5 class="mr-4 pb-1"><b>Order No :</b> #{data.order?.orderNo}</h5>

					<h5 class="pb-1"><b>Order Date </b>: {date(data.order?.createdAt)}</h5>
				</div>

				<!-- Order detail  -->

				<div class="mb-4 grid grid-cols-1 lg:grid-cols-2 lg:divide-x">
					<div class="col-span-1 flex gap-2 py-5 lg:gap-4 lg:pr-5">
						<a
							href="{`/products/${data.order?.slug}`}"
							aria-label="Click to view the product details"
							class="flex-shrink-0">
							<LazyImg
								src="{data.order?.imgCdn}"
								alt=""
								width="144"
								class="w-24 object-contain object-top sm:w-36" />
						</a>

						<div class="flex w-full flex-1 flex-col text-sm xl:pr-4">
							<div class="mb-1 flex justify-between gap-2 sm:gap-4">
								<a
									href="{`/products/${data.order?.slug}`}"
									aria-label="Click to view the product details"
									class="flex-1 text-base font-semibold hover:underline">
									{data.order?.name}
								</a>

								{#if data.order?.foodType}
									<div>
										{#if data.order?.foodType === 'V'}
											<LazyImg
												src="/product/veg.png"
												alt="veg"
												width="20"
												height="20"
												class="h-5 w-5" />
										{:else if data.order?.foodType === 'N' || data.order?.foodType === 'E'}
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
								{/if}
							</div>

							{#if data.order?.brandName}
								<h4 class="mb-2 capitalize">
									{data.order?.brandName}
								</h4>
							{/if}

							<div class="flex flex-wrap items-center whitespace-nowrap">
								{#if data.order?.size}
									<h6 class="mr-4 mb-2">
										Size :

										<span class="font-medium">{data.order?.size}</span>
									</h6>
								{/if}

								{#if data.order?.color}
									<h6 class="mb-2">
										Color :

										<span class="font-medium">{data.order?.color}</span>
									</h6>
								{/if}
							</div>

							{#if data.order?.vendor}
								<h6 class="mb-2">
									Seller :
									<a
										href="{`/vendor/${data.order?.vendor?.id}`}"
										aria-label="Click to view the vendor's profile"
										class="font-medium">
										{data.order?.vendor?.businessName}
									</a>
								</h6>
							{/if}

							<div class="flex flex-wrap items-center gap-2">
								<span class="text-base">
									<b>
										{data.order?.formattedPrice}
									</b>
								</span>

								{#if data.order?.formattedMrp > data.order?.formattedPrice}
									<span class="text-gray-500">
										<strike>
											{data.order?.formattedMrp}
										</strike>
									</span>
								{/if}

								{#if data.order?.discount > 0}
									<span class="text-green-500">
										({data.order?.discount}%)
									</span>
								{/if}
							</div>
						</div>
					</div>

					<div class="col-span-1 border-t border-dashed border-gray-300 py-5 lg:border-t-0 lg:px-5">
						<div class="mb-4">
							<h4 class="font-semibold">Delivery Address</h4>

							<p class="mt-2 flex flex-col text-sm font-light text-gray-500">
								<span>
									{data.order?.userFirstName}

									{data.order?.userLastName},

									{data.order?.address?.address}, {data.order?.address?.town},

									{data.order?.address?.city}, {data.order?.address?.state}</span>

								<span>{data.order?.address?.zip}</span>
							</p>

							{#if data.order?.userPhone}
								<h6 class="mt-2 text-sm">
									Phone number: <span> {data.order?.userPhone}</span>
								</h6>
							{/if}
						</div>

						<div class="mb-4">
							<h4 class="font-semibold">Billing Address</h4>

							<p class="mt-2 flex flex-col text-sm font-light text-gray-500">
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
									Phone number: <span> {data.order?.userPhone}</span>
								</h6>
							{/if}
						</div>

						<div class="mb-4">
							<h4 class="font-semibold">Vendor Details</h4>

							<p class="mt-2 flex flex-col text-sm font-light text-gray-500">
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
						</div>
					</div>
				</div>
			</div>

			<!-- Order Tracker -->

			<div>
				{#if !!data.order?.foodType && data.order?.status !== 'Delivered' && data.order?.expectedDeliveryDate}
					<h4 class="my-5 flex-1 xl:w-2/3">
						<span class="font-medium">Expected Delivery Date : </span>

						<span class="text-sm font-light text-gray-500">
							{date(data.order?.expectedDeliveryDate)}
						</span>
					</h4>
				{/if}

				{#if data.order?.status === 'Delivered'}
					<div class="mt-2 xl:mt-0 xl:w-1/3">
						<a
							href="/rate-this-product?id=${data.order?.pid}"
							aria-label="Click to route rate & review product"
							class="whitespace-nowrap text-primary-500 hover:underline focus:outline-none">
							Rate & Review Product
						</a>
					</div>
				{/if}

				<div class="mt-5 sm:mt-10 xl:flex xl:items-center xl:justify-between">
					{#if !data.order?.isReplaceOrReturn}
						<OrderTracking order="{data.order}" />
					{:else}
						<ReturnTracking order="{data.order}" />
					{/if}

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

							{#if data.order?.returnValidTill != null && now <= data.order?.returnValidTill && !data.order?.isReplaceOrReturn}
								<a
									href="/my/return?orderId=${data.order?.orderId}&itemId=${data.order?.itemId}"
									aria-label="Click to route return">
									<TransparentButton class="w-48" type="button" border>Return</TransparentButton>
								</a>
							{/if}
						</div>
					</div>
				</div>
			</div>
		</section>
	{:else}
		<div class="flex flex-col items-center justify-center text-center">
			<LazyImg
				src="/no/add-to-cart-animate.svg"
				alt="empty cart"
				height="240"
				class="mb-5 h-60 object-contain" />

			<span class="mb-3 text-xl font-medium md:text-3xl"> Your have't ordered yet !!</span>

			<span class="mb-4 text-xs">Add items to it now</span>

			<a href="/" aria-label="Click to route home" sveltekit:prefetch>
				<PrimaryButton class="w-40 py-2 text-sm">Shop Now</PrimaryButton>
			</a>
		</div>
	{/if}
</div>
