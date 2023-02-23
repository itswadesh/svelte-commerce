<script>
import { fly } from 'svelte/transition'
import dashboardMyOrders from '$lib/assets/dashboard/my-orders.png'
import dashboardProfile from '$lib/assets/dashboard/profile.png'
import dashboardReviews from '$lib/assets/dashboard/reviews.png'
import dashboardWishlist from '$lib/assets/dashboard/wishlist.png'

export let me, myOrders, myWishlist, myReviews
</script>

<section class="h-full w-full tracking-wide">
	<div class="mb-5 flex items-end">
		<h1 class="mr-1 text-xl font-semibold sm:text-3xl">Hi</h1>

		<h2 class="mr-1 font-semibold first-letter:text-xl">
			{me?.firstName || me?.email}
			{me?.lastName || ''}
		</h2>
	</div>

	<div
		class="mt-2 space-y-4 lg:mt-5 lg:flex lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:space-y-0">
		<a
			href="/my/orders?sort=-updatedAt"
			aria-label="Click to route my orders"
			class="relative flex items-end justify-between overflow-hidden rounded-lg bg-gradient-to-r from-primary-500 to-fuchsia-600 p-4 text-white shadow-lg shadow-orange-500/30 sm:p-6 lg:w-1/2">
			<div class="flex-1" in:fly="{{ y: 20, duration: 1000, delay: 500 }}">
				<h3 class="mt-2 text-xl font-bold sm:text-2xl">Orders</h3>

				<div class="mt-2 flex items-center">
					<h6 class="mr-2 text-sm">Total orders</h6>

					<span class="font-semibold">{myOrders?.count}</span>
				</div>
			</div>

			<div class="absolute right-0 bottom-0 -m-5 overflow-hidden lg:-m-7">
				<img src="{dashboardMyOrders}" alt="" class="h-28 w-28 opacity-50 lg:h-32 lg:w-32" />
			</div>
		</a>

		<a
			href="/my/wishlist?sort=-updatedAt"
			aria-label="Click to route my wishlist"
			class="relative flex items-end justify-between overflow-hidden rounded-lg bg-gradient-to-r from-fuchsia-600 to-pink-600 p-4 text-white shadow-lg shadow-fuchsia-500/30 sm:p-6 lg:w-1/2">
			<div class="flex-1" in:fly="{{ y: 20, duration: 1000, delay: 700 }}">
				<h3 class="mt-2 text-xl font-bold sm:text-2xl">Wishlist</h3>

				<div class="mt-2 flex items-center">
					<h6 class="mr-2 text-sm">Wishlisted items</h6>

					<span class="font-semibold">{myWishlist?.count}</span>
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
			aria-label="Click to route my reviews"
			class="relative flex items-end justify-between overflow-hidden rounded-lg bg-gradient-to-r from-secondary-500 to-cyan-600 p-4 text-white shadow-lg shadow-purple-500/30 sm:p-6 lg:w-1/2">
			<div class="flex-1" in:fly="{{ y: 20, duration: 1000, delay: 900 }}">
				<h3 class="mt-2 text-xl font-bold sm:text-2xl">Reviews</h3>

				<div class="mt-2 flex items-center">
					<h6 class="mr-2 text-sm">Total reviews</h6>

					<span class="font-semibold">{myReviews?.count}</span>
				</div>
			</div>

			<div class="absolute right-0 bottom-0 -m-5 overflow-hidden lg:-m-7">
				<img src="{dashboardReviews}" alt="" class="h-28 w-28 opacity-50 lg:h-32 lg:w-32" />
			</div>
		</a>

		<a
			href="/my/profile"
			aria-label="Click to route my profile"
			class="relative flex items-end justify-between overflow-hidden rounded-lg bg-gradient-to-r from-cyan-600 to-emerald-600 p-4 text-white shadow-lg shadow-cyan-500/30 sm:p-6 lg:w-1/2">
			<div class="flex-1" in:fly="{{ y: 20, duration: 1000, delay: 1100 }}">
				<h3 class="mt-2 text-xl font-bold sm:text-2xl">Profile</h3>

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
