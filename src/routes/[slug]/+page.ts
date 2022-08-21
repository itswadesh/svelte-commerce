
import { lazyload } from './../../actions/lazyload'
import { authorInfo, CDN_URL, WWW_URL } from '$lib/config'
import { currency, store, toast } from '$lib/util'
import { goto } from '$app/navigation'
import SEO from '$lib/components/SEO/index.svelte'
export async function load({ url, params, fetch }) {
try {
	const id = url.searchParams.get('id')
	const slug = params.slug
	if (!id && !slug) throw Error('Invalid product url')
	await GQL_productSlug.fetch({ fetch, variables: { slug } })
	return {}
} catch (e) {
	throw Error(e)
}
}
