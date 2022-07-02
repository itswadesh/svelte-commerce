<script>
import {
	KQL_MyOrderItems,
	KQL_MyOrders,
	KQL_MyWishlist,
	KQL_Reviews
} from '$lib/graphql/_kitql/graphqlStores'
import { store } from '$lib/util'
import { onMount } from 'svelte'
export let me
$: myOrderItems = $KQL_MyOrderItems.data?.myOrderItems
$: myWishlist = $KQL_MyWishlist.data?.myWishlist
$: myReviews = $KQL_Reviews.data?.reviews
onMount(() => {
	KQL_MyOrderItems.queryLoad({ variables: { store: store.id } })
	KQL_Reviews.queryLoad({ variables: { store: store.id } })
	KQL_MyWishlist.queryLoad({ variables: { store: store.id } })
})
</script>

<section class="h-full w-full pl-2 tracking-wide text-gray-800 sm:pl-8 sm:pr-2 ">
	<h1 class=" ">
		<span class="mr-1  text-lg font-bold sm:text-xl">Hi!</span>
		<span class="text-sm text-gray-500 sm:text-base">{me?.firstName}</span>
	</h1>
	{#if $KQL_MyOrderItems.isFetching}
		Loading
	{:else if myOrderItems}
		<div
			class="mt-2 md:mt-5 md:flex md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-8">
			<a
				href="/my/orders"
				class="md:w-1/2 overflow-hidden  rounded-lg shadow-lg relative bg-gradient-to-r from-yellow-500 to-pink-500 p-6 text-white flex items-end justify-between">
				<div class="font-semibold">
					<h6 class="text-sm uppercase">My Orders</h6>
					<h3 class="mt-2 font-bold text-2xl">{myOrderItems?.count}</h3>
					<div class="mt-2 flex items-center space-x-1"></div>
				</div>

				<div class="absolute right-0 bottom-0 -m-5 lg:-m-7 overflow-hidden">
					<img
						src="/landing/wallet-white.png"
						alt=""
						class="h-28 w-28 lg:h-32 lg:w-32 opacity-50" />
				</div>
			</a>

			<a
				href="/my/wishlist"
				class="md:w-1/2 overflow-hidden rounded-lg shadow-lg relative bg-gradient-to-r from-purple-500 to-blue-500 p-6 text-white flex items-end justify-between">
				<div class="font-semibold">
					<h6 class="text-sm uppercase">My Wishlist</h6>
					<h3 class="mt-2 font-bold text-2xl">{myWishlist?.count}</h3>
					<!-- <h6 class="mt-2 text-sm ">$ 5,000.00 From Last Month</h6> -->
				</div>

				<div class="absolute right-0 bottom-0 -m-5 lg:-m-7 overflow-hidden">
					<img
						src="/landing/invoice-white.png"
						alt=""
						class="h-28 w-28 lg:h-32 lg:w-32 opacity-50" />
				</div>
			</a>
		</div>

		<div
			class="mt-4 md:mt-8 md:flex md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-8">
			<a
				href="/my/reviews"
				class="md:w-1/2 overflow-hidden rounded-lg shadow-lg relative bg-gradient-to-r from-green-500 to-indigo-500 p-6 text-white flex items-end justify-between">
				<div class="font-semibold">
					<h6 class="text-sm uppercase">Reviews</h6>
					<h3 class="mt-2 font-bold text-2xl">{myReviews?.count}</h3>
					<div class="mt-2 flex items-center space-x-10"></div>
				</div>

				<div class="absolute right-0 bottom-0 -m-5 lg:-m-7 overflow-hidden">
					<img src="/landing/team-white.png" alt="" class="h-28 w-28 lg:h-32 lg:w-32 opacity-50" />
				</div>
			</a>

			<a
				href="/my/profile"
				class="md:w-1/2 overflow-hidden rounded-lg shadow-lg relative bg-gradient-to-r from-pink-500 to-purple-500 p-6 text-white flex items-end justify-between">
				<div class="font-semibold">
					<h6 class="text-sm uppercase">My Profile</h6>
					<h3 class="mt-2 font-bold text-2xl">&nbsp;</h3>
					<div class="mt-2 flex items-center space-x-10"></div>
				</div>

				<div class="absolute right-0 bottom-0 -m-5 lg:-m-7 overflow-hidden">
					<img
						src="/landing/rating-circled-white.png"
						alt=""
						class="h-28 w-28 lg:h-32 lg:w-32 opacity-50" />
				</div>
			</a>
		</div>
	{/if}
	<div
		class="mt-4 space-y-4 md:mt-11 md:flex md:items-center md:justify-between md:space-y-0 md:space-x-8">
		<div class="h-36 rounded-lg border bg-white shadow-lg md:w-1/2 lg:h-48 xl:h-56 2xl:h-60"></div>
		<div class="h-36 rounded-lg border bg-white shadow-lg md:w-1/2 lg:h-48 xl:h-56 2xl:h-60"></div>
	</div>
</section>
