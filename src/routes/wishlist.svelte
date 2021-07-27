<script>
import SEO from '$lib/components/SEO/index.svelte'
import WishlistProducts from '$lib/WishlistProducts.svelte'

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
		<span>2 items</span>
	</div>
	<div class="mt-5">
		<WishlistProducts />
	</div>
</section>
