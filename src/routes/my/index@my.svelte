<script context="module" lang="ts">
export async function load({ url, params, fetch, session, context }) {
	let search, sort, query, banners, errors, currentPage, count, me
	return {
		props: { me: session.me }
	}
}
</script>

<script>
import SummaryDashboard from './_SummaryDashboard.svelte'
import SEO from '$lib/components/SEO/index.svelte'
export let me
const seoProps = {
	title: 'Dashboard',
	metadescription: 'Track your all process'
}
</script>

<SEO {...seoProps} />

<SummaryDashboard me="{me}" />
