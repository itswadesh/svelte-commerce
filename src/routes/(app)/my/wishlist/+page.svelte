<script>
import { MobileFooter } from '$lib/components'
import SEO from '$lib/components/SEO/index.svelte'
import Wishlist from './_Wishlist.svelte'

export let data

let seoProps = {
	title: `Wishlist`,
	description: `Wishlist`
}
</script>

<SEO {...seoProps} />

<section>
	<div class="mb-20">
		<Wishlist wishlistedProducts="{data.data}" />
	</div>

	<!-- MOBILE FOOTER -->

	<div class="block lg:hidden">
		<MobileFooter />
	</div>
</section>
