<style></style>

<script>
import { onMount } from 'svelte'

import { currency, store, date } from '$lib/util'
import OrderTracking from './_OrderTracking.svelte'
import { GQL_myOrderItems, GQL_orderItem } from '$houdini'
import OrderListSkeleton from './_OrderListSkeleton.svelte'
import { page } from '$app/stores'
import PrimaryButtonRounded from '$lib/components/buttons/PrimaryButtonRounded.svelte'
import TransparentButton from '$lib/components/buttons/TransparentButton.svelte'
import dayjs from 'dayjs'

let order,
	deliveryBy = null,
	now = null,
	selectedProduct = null,
	showDemoScheduler = false,
	loading = false
let clazz
export { clazz as class }
function head() {
	return {
		title: 'Order Details'
	}
}

onMount(() => {
	getData()
	deliveryBy = dayjs().add(7, 'day').format('dddd, MMM D, YYYY')
	now = dayjs()
})

async function getData() {
	loading = true
	try {
		order = (
			await GQL_orderItem.fetch({
				variables: { id: $page.url.searchParams.get('itemId') }
			})
		).data?.orderItem
	} catch (e) {
	} finally {
		loading = false
	}
}
function populateDemoScheduler(p) {
	selectedProduct = { id: p.id, name: p.name }
	showDemoScheduler = true
}
function isReplaceOrReturn() {
	// return order.status === 'Return' || order.status === 'Pickup' || order.status === 'Refund'
}
</script>

<div class="{clazz}">
	{#if $GQL_orderItem.isFetching}
		<OrderListSkeleton />
	{:else if order}
		<section class="text-gray-800">
			<div
				class="
					mb-4
					flex
					flex-wrap
					items-center
					justify-between
					bg-gray-200
					px-4 pt-2
					pb-1
					text-sm
					tracking-wide">
				<h5 class="pb-1 me-4"><b>Order No :</b> {order.orderNo}</h5>
				<h5 class="pb-1"><b>Order Date </b>: {date(+order.createdAt)}</h5>
			</div>

			<!-- Order detail  -->

			<div class="mb-4 border-b border-gray-300 sm:flex sm:justify-between">
				<div
					class="
						flex space-x-2 pb-4
						sm:w-1/2
						sm:space-x-4
						sm:border-r sm:border-gray-300
						sm:pe-4
						">
					<a href="{`/${order.slug}`}">
						<img
							src="{`${order.imgCdn}?tr=w-160,fo-auto`}"
							alt=""
							class="w-14 object-contain object-top sm:w-20" />
					</a>

					<div class="flex w-full flex-1 flex-col text-sm xl:pe-4">
						{#if store.isFnb && order.vendor.businessName}
							<div class="mb-1 text-base font-semibold capitalize">
								{order.vendor.businessName}
							</div>
						{:else if order.brandName}
							<h4 class="mb-1 font-semibold capitalize">
								{order.brandName}
							</h4>
						{/if}

						<div class="mb-2 flex items-center justify-between">
							<a
								href="{`/${order.slug}`}"
								class="truncate text-gray-500 me-3 hover:text-primary-500">
								{order.name}
							</a>
							{#if store.isFnb}
								<div>
									{#if order.foodType === 'V'}
										<img src="{`/img/veg.png`}" alt="veg" class="h-5 w-5" />
									{:else if order.foodType === 'N' || order.foodType === 'E'}
										<img src="{`/img/non-veg.png`}" alt="non veg" class="h-5 w-5" />
									{:else}
										<img src="{`/img/other.png`}" alt="other" class="h-5 w-5" />
									{/if}
								</div>
							{/if}
						</div>

						<div class="flex flex-wrap items-center whitespace-nowrap">
							{#if order.size !== null && ''}
								<h6 class="mb-2 me-4">
									Size :
									<span class="font-medium">{order.size}</span>
								</h6>
							{/if}
							{#if order.color !== null && ''}
								<h6 class="mb-2">
									Color :
									<span class="font-medium">{order.color}</span>
								</h6>
							{/if}
						</div>
						{#if order.vendor}
							<h6 class="mb-2">
								Seller : {order.vendor.businessName}
							</h6>
						{/if}

						<h4 class="font-semibold">
							{order.formattedPrice}
						</h4>
					</div>
				</div>

				<div
					class="
          border-t border-dashed border-gray-300
          py-5
          sm:w-1/2
          sm:border-t-0 sm:px-5 sm:pt-0
          lg:px-10
        ">
					<h4 class="font-semibold">Delivery Address</h4>

					<p class="mt-2 flex flex-col text-sm font-light text-gray-500">
						<span>
							{order.userFirstName}
							{order.userLastName},
							{order.address.address}, {order.address.town},
							{order.address.city}, {order.address.state}</span>
						<span>{order.address.zip}</span>
					</p>
					{#if order.userPhone}
						<h6 class="mt-2 text-sm">
							Phone number: <span> {order.userPhone}</span>
						</h6>
					{/if}
				</div>
			</div>

			<!-- Order Tracker -->

			<div>
				{#if store.isFnb && order.status !== 'Delivered'}
					<h4 class="my-5 flex-1 xl:w-2/3">
						<span class="font-medium">Expected Delivery Date : </span>

						<span class="text-sm font-light text-gray-500">{+order.expectedDeliveryDate}</span>
					</h4>
				{/if}
				{#if order.status === 'Delivered'}
					<div class="mt-2 xl:mt-0 xl:w-1/3">
						<a
							href="/rate-this-product?id=${order.pid}"
							class="
            whitespace-nowrap
            text-primary-500
            hover:underline
            focus:outline-none
          ">
							Rate & Review Product
						</a>
					</div>
				{/if}

				<div class="mt-5 xl:flex xl:items-center xl:justify-between">
					<OrderTracking order="{order}" />

					<div class="mt-10 mb-4 xl:mb-0 xl:mt-0 xl:w-1/3">
						<div class="flex flex-col xl:items-center xl:justify-center">
							{#if order.invoiceLink}
								<a href="{order.invoiceLink}" target="blank" class="mb-4">
									<PrimaryButtonRounded class="w-48" type="button">
										Download Invoice
									</PrimaryButtonRounded>
								</a>
							{/if}
							{#if order.replaceValidTill != null && now <= order.replaceValidTill && !order.isReplaceOrReturn}
								<a href="/my/exchange?orderId=${order.orderId}&itemId=${order.itemId}" class="mb-4">
									<TransparentButton class="w-48" type="button" border>Exchange</TransparentButton>
								</a>
							{/if}
							{#if order.returnValidTill != null && now <= order.returnValidTill && !order.isReplaceOrReturn}
								<a href="/my/return?orderId=${order.orderId}&itemId=${order.itemId}">
									<TransparentButton class="w-48" type="button" border>Return</TransparentButton>
								</a>
							{/if}
						</div>
					</div>
				</div>
			</div>
		</section>
	{:else if order}
		<div class="flex flex-col items-center justify-center text-center">
			<img
				src="{`/no/empty-animate.svg?tr=h-320,fo-auto`}"
				alt="empty orders"
				class="mb-10 h-80 object-contain" />

			<span class="mb-3 text-xl font-medium md:text-3xl"> Your have't ordered yet !!</span>

			<span class="mb-4 text-xs">Add items to it now</span>

			<a href="/)">
				<PrimaryButtonRounded class="w-40 py-2 text-sm">Shop Now</PrimaryButtonRounded>
			</a>
		</div>
	{/if}
</div>
