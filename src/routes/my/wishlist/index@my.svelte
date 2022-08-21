<script lang="ts">
import { onMount } from 'svelte'
import SEO from '$lib/components/SEO/index.svelte'
import { date, currency } from '$lib/util'
import { GQL_MyWishlist } from '$houdini'
import WishlistProducts from '$lib/WishlistProducts.svelte'

const seoProps = {
	title: 'Wishlists',
	metadescription: 'All wishlists details'
}
let wishlists
let open = false
function toggle() {
	open = !open
}

onMount(() => {
	getWishlists()
})
async function getWishlists() {
	wishlists = (await GQL_MyWishlist.fetch()).data?.myWishlist
}
</script>

<SEO {...seoProps} />

<section class="h-full w-full pl-2 tracking-wide text-gray-800 sm:pl-8 sm:pr-2 ">
	<h1 class="text-lg  font-bold sm:text-xl">
		<span class="mr-1">My wishlist</span>( {wishlists?.count} )
	</h1>

	{#if wishlists?.count > 0}
		<!-- {#each wishlists?.data as wishlist} -->
		<div
			class=" bwishlist-t bwishlist-gray-300 bwishlist relative my-2 rounded-md bg-white p-4 transition duration-300 sm:my-5 md:shadow-md ">
			<WishlistProducts wishlist="{wishlists.data}" />
		</div>
		<!-- {/each} -->
	{:else}
		<div class="my-10 flex flex-col items-center justify-center ">
			<h4 class="font-semibold mb-5 text-center">There are no items in wishlist yet</h4>

			<img src="/no/empty-animate.svg" alt="" class="h-80 md:h-96 mb-10" />

			<a
				href="/"
				class="bg-white hover:bg-primary-500 rounded-md shadow hover:shadow-md py-2 px-8 font-semibold text-sm text-primary-500 hover:text-white bwishlist hover:bwishlist-white bwishlist-primary-500 focus:outline-none mx-auto focus:ring-primary-500 ring-opacity-50">
				Shop Now
			</a>
		</div>
	{/if}
</section>
