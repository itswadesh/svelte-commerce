<script>
import { fly } from 'svelte/transition'
import dashboardMyOrders from '$lib/assets/dashboard/my-orders.png'
import dashboardProfile from '$lib/assets/dashboard/profile.png'
import dashboardReviews from '$lib/assets/dashboard/reviews.png'
import dashboardWishlist from '$lib/assets/dashboard/wishlist.png'

export let me
export let myOrders
export let myReviews
export let myWishlist
</script>

<section class="h-full w-full tracking-wide">
	<div class="mb-5 flex items-end">
		<h1 class="mr-2">Hi</h1>

		<h2>
			{me?.firstName || me?.email}
			{me?.lastName || ''}
		</h2>
	</div>

	<div
		class="mt-2 space-y-4 lg:mt-5 lg:flex lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:space-y-0">
		<a
			href="/my/orders?sort=-updatedAt"
			aria-label="Click to visit my orders"
			class="relative flex items-end justify-between overflow-hidden rounded-lg bg-gradient-to-r from-primary-500 to-fuchsia-600 p-4 text-white shadow-lg shadow-orange-500/30 sm:p-6 lg:w-1/2">
			<div class="flex-1" in:fly="{{ y: 20, duration: 1000, delay: 500 }}">
				<h2 class="mt-2">Orders</h2>

				<div class="mt-2 flex items-baseline flex-wrap gap-2">
					<h2>{myOrders?.count}</h2>

					<span class="text-sm">Total orders</span>
				</div>
			</div>

			<div class="absolute right-0 bottom-0 -m-5 overflow-hidden lg:-m-7">
				<img src="{dashboardMyOrders}" alt="" class="h-28 w-28 opacity-50 lg:h-32 lg:w-32" />
			</div>
		</a>

		<a
			href="/my/wishlist?sort=-updatedAt"
			aria-label="Click to visit my wishlist"
			class="relative flex items-end justify-between overflow-hidden rounded-lg bg-gradient-to-r from-fuchsia-600 to-pink-600 p-4 text-white shadow-lg shadow-fuchsia-500/30 sm:p-6 lg:w-1/2">
			<div class="flex-1" in:fly="{{ y: 20, duration: 1000, delay: 700 }}">
				<h2 class="mt-2">Wishlist</h2>

				<div class="mt-2 flex items-baseline flex-wrap gap-2">
					<h2>{myWishlist?.count || 0}</h2>

					<span class="text-sm">Wishlisted items</span>
				</div>
			</div>

			<div class="absolute right-0 bottom-0 -mr-2 -mb-5 overflow-hidden lg:-mb-7">
				<img src="{dashboardWishlist}" alt="" class="h-28 w-28 opacity-50 lg:h-32 lg:w-32" />
			</div>
		</a>
	</div>

	<div
		class="mt-4 space-y-4 lg:mt-8 lg:flex lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:space-y-0">
		<a
			href="/my/reviews?sort=-updatedAt"
			aria-label="Click to visit my reviews"
			class="relative flex items-end justify-between overflow-hidden rounded-lg bg-gradient-to-r from-secondary-500 to-cyan-600 p-4 text-white shadow-lg shadow-purple-500/30 sm:p-6 lg:w-1/2">
			<div class="flex-1" in:fly="{{ y: 20, duration: 1000, delay: 900 }}">
				<h2 class="mt-2">Reviews</h2>

				<div class="mt-2 flex items-baseline flex-wrap gap-2">
					<h2>{myReviews?.count || 0}</h2>

					<span class="text-sm">Total reviews</span>
				</div>
			</div>

			<div class="absolute right-0 bottom-0 -m-5 overflow-hidden lg:-m-7">
				<img src="{dashboardReviews}" alt="" class="h-28 w-28 opacity-50 lg:h-32 lg:w-32" />
			</div>
		</a>

		<a
			href="/my/profile"
			aria-label="Click to visit my profile"
			class="relative flex items-end justify-between overflow-hidden rounded-lg bg-gradient-to-r from-cyan-600 to-emerald-600 p-4 text-white shadow-lg shadow-cyan-500/30 sm:p-6 lg:w-1/2">
			<div class="flex-1" in:fly="{{ y: 20, duration: 1000, delay: 1100 }}">
				<h2 class="mt-2">Profile</h2>

				<div class="mt-2 flex items-center text-sm font-semibold">
					{#if me.phone}
						{me.phone}
					{/if}

					{#if me.phone && me.email}
						/
					{/if}

					{#if me.email}
						{me.email}
					{/if}
				</div>
			</div>

			<div class="absolute right-0 bottom-0 -m-5 overflow-hidden lg:-m-7">
				<img
					src="{dashboardProfile}"
					alt=""
					class="h-28 w-28 opacity-50 lg:h-32 lg:w-32 object-contain object-center" />
			</div>
		</a>
	</div>
</section>
