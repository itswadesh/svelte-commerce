<script>
import { fly } from 'svelte/transition'
import { MobileFooter } from '$lib/components'
import dashboardMyOrders from '$lib/assets/dashboard/my-orders.png'
import dashboardProfile from '$lib/assets/dashboard/profile.png'
import dashboardReviews from '$lib/assets/dashboard/reviews.png'
import dashboardWishlist from '$lib/assets/dashboard/wishlist.png'
import SEO from '$lib/components/SEO/index.svelte'
import Skeleton from '$lib/ui/Skeleton.svelte'

const seoProps = {
	title: 'Dashboard',
	metaDescription: 'Dashboard'
}

export let data
// console.log('zzzzzzzzzzzzzzzzzz', data)
</script>

<SEO {...seoProps} />

<div>
	<div class="mb-14 sm:mb-0">
		<section class="h-full w-full tracking-wide">
			<div class="mb-5 flex items-baseline">
				<h1 class="mr-1 text-xl font-semibold sm:text-3xl">Hi</h1>

				<span class="mr-1 first-letter:text-xl">
					{data.me?.firstName || data.me?.email}
					{data.me?.lastName || ''}
				</span>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-5">
				{#await data.streamed?.orders}
					<Skeleton />
				{:then orders}
					<a
						href="/my/orders?sort=-updatedAt"
						aria-label="Click to visit my orders"
						class="col-span-1 relative flex items-end justify-between overflow-hidden rounded-lg bg-gradient-to-r from-primary-500 to-fuchsia-600 p-5 text-white shadow shadow-orange-500/30">
						<div class="flex-1" in:fly="{{ y: 20, duration: 1000, delay: 500 }}">
							<h3 class="mt-2 text-xl font-bold sm:text-2xl">Orders</h3>

							<div class="mt-2 flex items-baseline flex-wrap gap-2">
								<span class="text-xl font-semibold">{orders?.count}</span>

								<span class="text-sm">
									Total {#if orders?.count > 1} orders {:else} order {/if}
								</span>
							</div>
						</div>

						<div class="absolute right-0 bottom-0 -m-5 overflow-hidden lg:-m-7">
							<img src="{dashboardMyOrders}" alt="" class="h-28 w-28 opacity-50 lg:h-32 lg:w-32" />
						</div>
					</a>
				{/await}

				{#await data.streamed?.wishlists}
					<Skeleton />
				{:then wishlists}
					<a
						href="/my/wishlist?sort=-updatedAt"
						aria-label="Click to visit my wishlist"
						class="col-span-1 relative flex items-end justify-between overflow-hidden rounded-lg bg-gradient-to-r from-fuchsia-600 to-pink-600 p-5 text-white shadow shadow-fuchsia-500/30">
						<div class="flex-1" in:fly="{{ y: 20, duration: 1000, delay: 700 }}">
							<h3 class="mt-2 text-xl font-bold sm:text-2xl">Wishlist</h3>

							<div class="mt-2 flex items-baseline flex-wrap gap-2">
								<span class="text-xl font-semibold">{wishlists?.length}</span>

								<span class="text-sm">
									Wishlisted {#if wishlists?.length > 1} items {:else} item {/if}
								</span>
							</div>
						</div>

						<div class="absolute right-0 bottom-0 -mr-2 -mb-5 overflow-hidden lg:-mb-7">
							<img src="{dashboardWishlist}" alt="" class="h-28 w-28 opacity-50 lg:h-32 lg:w-32" />
						</div>
					</a>
				{/await}

				{#await data.streamed?.reviews}
					<Skeleton />
				{:then reviews}
					<a
						href="/my/reviews?sort=-updatedAt"
						aria-label="Click to visit my reviews"
						class="col-span-1 relative flex items-end justify-between overflow-hidden rounded-lg bg-gradient-to-r from-secondary-500 to-cyan-600 p-5 text-white shadow shadow-purple-500/30">
						<div class="flex-1" in:fly="{{ y: 20, duration: 1000, delay: 900 }}">
							<h3 class="mt-2 text-xl font-bold sm:text-2xl">Reviews</h3>

							<div class="mt-2 flex items-baseline flex-wrap gap-2">
								<span class="text-xl font-semibold">{reviews?.count}</span>

								<span class="text-sm">
									Total {#if reviews?.count > 1} reviews {:else} review {/if}
								</span>
							</div>
						</div>

						<div class="absolute right-0 bottom-0 -m-5 overflow-hidden lg:-m-7">
							<img src="{dashboardReviews}" alt="" class="h-28 w-28 opacity-50 lg:h-32 lg:w-32" />
						</div>
					</a>
				{/await}

				<a
					href="/my/profile"
					aria-label="Click to visit my profile"
					class="col-span-1 relative flex items-end justify-between overflow-hidden rounded-lg bg-gradient-to-r from-cyan-600 to-emerald-600 p-5 text-white shadow shadow-cyan-500/30">
					<div class="flex-1" in:fly="{{ y: 20, duration: 1000, delay: 1100 }}">
						<h3 class="mt-2 text-xl font-bold sm:text-2xl">Profile</h3>

						<div class="mt-2 flex items-center text-sm font-semibold">
							{#if data.me?.phone}
								{data.me?.phone}
							{/if}

							{#if data.me?.phone && data.me?.email}
								/
							{/if}

							{#if data.me?.email}
								{data.me?.email}
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
	</div>

	<!-- MOBILE FOOTER -->

	<div class="block lg:hidden">
		<MobileFooter />
	</div>
</div>
