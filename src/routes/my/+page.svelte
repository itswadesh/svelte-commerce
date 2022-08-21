<script>
import SummaryDashboard from './_SummaryDashboard.svelte'
import SEO from '$lib/components/SEO/index.svelte'
export let data
let { me } = data
$: ({ me } = data)
const seoProps = {
	title: 'Dashboard',
	metadescription: 'Track your all process'
}
</script>

<SEO {...seoProps} />

<SummaryDashboard me="{me}" />
