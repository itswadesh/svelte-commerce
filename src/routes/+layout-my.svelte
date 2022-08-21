<script>
import SEO from '$lib/components/SEO/index.svelte'
import SidebarDashboard from './my/_SidebarDashboard.svelte'
import Nav from '$lib/Nav.svelte'
import PreloadingIndicator from '$lib/PreloadingIndicator.svelte'
import { navigating } from '$app/stores'

export let data
let { url, me, isHome, store } = data
$: ({ url, me, isHome, store } = data)

const seoProps = {
	title: 'Dashboard',
	metadescription: 'Track your all process'
}
</script>

{#if $navigating}
	<PreloadingIndicator />
{/if}

<SEO {...seoProps} />
<section class="w-full md:pt-5 lg:min-h-screen lg:pt-0">
	<div class="flex w-full items-start p-2 sm:p-6 ">
		<div>
			<SidebarDashboard section="my" />
		</div>

		<div class="w-full">
			<Nav me="{me}" store="{store}" q="{q}" />

			<slot />
		</div>
	</div>

	<!-- <div class="lg:w-1/5">
		<OrdersDashboard />
	</div> -->
</section>
