<script>
import MobileFooter from '$lib/MobileFooter.svelte'
import SEO from '$lib/components/SEO/index.svelte'
import Wishlist from './_Wishlist.svelte'

export let data

// console.log('zzzzzzzzzzzzzzzzzz', data)

let seoProps = {
	title: `Wishlist`,
	description: `Wishlist`
}
</script>

<SEO {...seoProps} />

<div>
	<div class="mb-20">
		<Wishlist wishlistedProducts="{data.wishlistedProducts}" />
	</div>

	<!-- MOBILE FOOTER -->

	<div class="block lg:hidden">
		<MobileFooter />
	</div>
</div>
