<script>
import SEO from '$lib/components/SEO/index.svelte'
import MobileFooter from '$lib/MobileFooter.svelte'
import UserDashboard from './_UserDashboard.svelte'

const seoProps = {
	title: 'Dashboard',
	metadescription: 'Dashboard'
}

export let data
</script>

<SEO {...seoProps} />

<div>
	<div class="mb-20">
		<UserDashboard
			me="{data.me}"
			myOrders="{data.myOrders}"
			myWishlist="{data.myWishlist}"
			myReviews="{data.myReviews}" />
	</div>

	<!-- MOBILE FOOTER -->

	<div class="block sm:hidden">
		<MobileFooter />
	</div>
</div>
