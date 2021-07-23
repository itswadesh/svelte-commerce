<script context="module" lang="ts">
import type { Load } from '@sveltejs/kit'
export const load: Load = async ({ session }) => {
	if (!session.user) {
		return {
			redirect: '/login',
			status: 302,
		}
	}
	return {}
}
</script>

<script>
import SidebarDashboard from './_SidebarDashboard.svelte'
import SummaryDashboard from './_SummaryDashboard.svelte'
import OrdersDashboard from './_OrdersDashboard.svelte'
</script>

<section
	class="container mx-auto justify-center flex lg:h-screen  overflow-hidden md:pt-5 lg:pt-0 ">
	<div class="lg:h-screen lg:w-4/5 p-2 sm:p-6 flex items-start ">
		<div>
			<SidebarDashboard />
		</div>

		<div class="w-full">
			<SummaryDashboard />
		</div>
	</div>
	<!-- <div class="lg:w-1/5">
		<OrdersDashboard />
	</div> -->
</section>
