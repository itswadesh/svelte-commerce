<script context="module" lang="ts">
export async function load({ url, fetch, session }) {
	if (!session?.me) {
		return {
			redirect: `/login?ref=${url.pathname}`,
			status: 302
		}
	}

	try {
		await GQL_myWishlist.fetch({
			fetch,
			variables: { store: store.id },
			settings: { cacheMs: 0 }
		})
	} catch (e) {}
	return { props: {} }
}
</script>

<script>
import SEO from '$lib/components/SEO/index.svelte'
import { GQL_myWishlist, GQL_toggleWishlist } from '$houdini'
import WishlistProducts from '$lib/WishlistProducts.svelte'
import { delay, store } from '$lib/util'
import ImageLoader from '$lib/components/Image/ImageLoader.svelte'
import { browser } from '$app/env'
export let wishlist
const seoProps = {
	title: 'Wishlist',
	metadescription: 'Products you have wishlisted'
}
$: browser && GQL_myWishlist.fetch()

$: myWishlist = $GQL_myWishlist.data?.myWishlist
async function toggleWishlist(detail) {
	const product = detail.detail

	try {
		await GQL_toggleWishlist.mutate({
			variables: {
				product: product.id,
				variant: product.id
			}
		})
		delay(1000)
		refreshData()
	} catch (e) {
	} finally {
	}
}

async function refreshData() {
	try {
		await GQL_myWishlist.fetch({
			fetch,
			variables: { store: store.id },
			settings: { cacheMs: 0 }
		})
	} catch (e) {
	} finally {
	}
}
</script>

<SEO {...seoProps} />
<section class="container mx-auto min-h-screen w-full max-w-6xl p-3 py-5 text-gray-800 sm:p-10 ">
	<div class="mb-5 flex items-center space-x-2 text-lg sm:mb-10">
		<h4 class="text-xl font-bold">Wishlist</h4>

		<span class="text-sm">({myWishlist?.count || 0}) Items</span>
	</div>
	{#if myWishlist?.count > 0}
		<!-- <div
			class="grid w-full grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 lg:grid-cols-5"> -->
		<!-- {#each myWishlist.data as wishlist} -->
		<WishlistProducts
			wishlist="{myWishlist?.data}"
			on:remove="{({ detail }) => toggleWishlist({ detail })}" />
		<!-- {/each} -->
		<!-- </div> -->
	{:else}
		<div class="h-rem-empty flex flex-col items-center justify-center text-center">
			<div>
				<ImageLoader
					src="/no/empty-wishlist.svg"
					alt="empty room"
					class="mb-10 h-80 object-contain" />
			</div>

			<span class="mb-3 text-xl font-medium md:text-3xl">No Wishlist Item Found!!</span>

			<span class="mb-5 text-xs"> We didn't find any wishlist item, shop more </span>
		</div>
	{/if}
</section>
