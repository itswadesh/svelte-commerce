import SEO from '$lib/components/SEO/index.svelte'

export async function load({ url, params, fetch }) {
return { id: url.searchParams.get('id') }
}
