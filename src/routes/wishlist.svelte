<script context="module" lang="ts">
export async function load({ url, fetch }) {
	const me = (await KQL_Me.query({ fetch })).data?.me
	if (!me) {
		return {
			redirect: `/login?ref=${url.pathname}`,
			status: 302
		}
	}
	let wishlist = {}
	try {
		wishlist = (await KQL_MyWishlist.query()).data?.myWishlist
	} catch (e) {}
	return { props: { wishlist } }
}
</script>

<script>
import SEO from '$lib/components/SEO/index.svelte'
import { KQL_Me, KQL_MyWishlist } from '$lib/graphql/_kitql/graphqlStores'
import WishlistProducts from '$lib/WishlistProducts.svelte'
export let wishlist
const seoProps = {
	title: 'Wishlist',
	metadescription: 'Products you have wishlisted'
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
