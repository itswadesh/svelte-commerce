<script context="module" lang="ts">
import type { Load } from '@sveltejs/kit'
export const load: Load = async ({ url, fetch, session }) => {
	let me = session.me
	let store = session.store
	if (!me) {
		return {
			redirect: `/login?ref=${url.pathname}`,
			status: 302
		}
	}
	return { me, store, q: '' }
}
</script>

<script>
import SEO from '$lib/components/SEO/index.svelte'
import SidebarDashboard from './my/_SidebarDashboard.svelte'
import Nav from '$lib/Nav.svelte'
export let me, store, q
const seoProps = {
	title: 'Dashboard',
	metadescription: 'Track your all process'
}
</script>

<SEO {...seoProps} />

<section class="w-full md:pt-5 lg:min-h-screen lg:pt-0">
	<div class="flex w-full items-start p-2 sm:p-6 ">
		<div>
			<SidebarDashboard />
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
