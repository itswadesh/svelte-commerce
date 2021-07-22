<script>
import SidebarDashboard from './_SidebarDashboard.svelte'
import SummaryDashboard from './_SummaryDashboard.svelte'
import OrdersDashboard from './_OrdersDashboard.svelte'
</script>

<section class="h-screen bg-gray-100 text-gray-800 flex">
	<div class="w-4/5 p-6 flex">
		<div class="w-40">
			<SidebarDashboard />
		</div>

		<div class="w-full">
			<SummaryDashboard />
		</div>
	</div>
	<div class="w-1/5">
		<OrdersDashboard />
	</div>
</section>
