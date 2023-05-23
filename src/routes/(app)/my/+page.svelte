<script>
import { MobileFooter } from '$lib/components'
import SEO from '$lib/components/SEO/index.svelte'
import UserDashboard from './_UserDashboard.svelte'

const seoProps = {
	title: 'Dashboard',
	metadescription: 'Dashboard'
}

export let data
// console.log('zzzzzzzzzzzzzzzzzz', data)
</script>

<SEO {...seoProps} />

<div>
	<div class="mb-14 sm:mb-0">
		<UserDashboard
			me="{data.me}"
			myOrders="{data.orders}"
			myWishlist="{data.wishlists}"
			myReviews="{data.reviews}" />
	</div>

	<!-- MOBILE FOOTER -->

	<div class="block lg:hidden">
		<MobileFooter />
	</div>
</div>
