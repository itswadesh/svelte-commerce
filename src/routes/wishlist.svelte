<script context="module" lang="ts">
export async function load({ page: { host, path, params, query }, fetch }) {
	let wishlist = []
	try {
		wishlist = await get(`wishlists/my`)
	} catch (e) {}
	return { props: { wishlist } }
}
</script>

<script>
import { get } from '../util/api'
import SEO from '$lib/components/SEO/index.svelte'
import WishlistProducts from '$lib/WishlistProducts.svelte'
export let wishlist
const seoProps = {
	title: 'Wishlist',
	metadescription: 'Products you have wishlisted',
}
</script>

<SEO {...seoProps} />
<!-- Whole section start  -->
<section
	class="container min-h-screen w-full mx-auto max-w-6xl px-2 sm:px-10 pb-10 py-5 md:py-10 text-gray-800 ">
	<div class="text-lg flex items-center space-x-2">
		<h4 class="font-semibold ">My wishlist</h4>
		<span>{wishlist.count} items</span>
	</div>
	<div class="mt-5">
		<WishlistProducts wishlist="{wishlist?.data}" />
	</div>
</section>
