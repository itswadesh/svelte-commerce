<script>
import SummaryDashboard from './_SummaryDashboard.svelte'
import SEO from '$lib/components/SEO/index.svelte'

const seoProps = {
	title: 'Dashboard',
	metadescription: 'Track your all process',
}
</script>

<SEO {...seoProps} />

<SummaryDashboard />
