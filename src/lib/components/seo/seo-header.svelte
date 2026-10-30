<script lang="ts">
	import { SeoHeader as CoreSeoHeader } from '$lib/core/components/index.js'
	import { page } from '$app/state'
	import { cleanSchemaText } from './schema.js'

	// The vendored SeoHeader declares `image = ''` with no fallback, so every call site that omits
	// it — and most did — shipped an empty og:image/twitter:image. Links to those pages render as
	// a bare grey card on every social network and chat app. Defaulting here fixes the whole app at
	// once, including call sites added later, instead of repeating the fallback at each one.
	// Explicit `image` props still win; the `||` only fills in empty strings and nullish values.
	const props: Record<string, unknown> = $props()

	// The vendored default canonical is origin + pathname, which folds /products?page=7 into
	// /products and gets every deep listing page dropped as a duplicate of page 1. A paginated page
	// keeps its own `?page=N`; sort, filter and tracking parameters are still dropped, because those
	// views belong on page 1's canonical. An explicit `canonicalUrl` still wins.
	const pageNumber = $derived(Math.floor(Number(page.url.searchParams.get('page'))) || 1)
	const canonicalUrl = $derived((props.canonicalUrl as string | undefined) || page.url.origin + page.url.pathname + (pageNumber > 1 ? `?page=${pageNumber}` : ''))

	// A page with no description of its own (a category without SEO fields) falls back to the
	// store's. The vendored fallback passes that through its `parseHTMLToText`, which returns the
	// HTML unchanged, so the description shipped the store's literal markup; it is cleaned here.
	const metaDescription = $derived((props.metaDescription as string | undefined) || cleanSchemaText(page.data?.store?.description))
</script>

<CoreSeoHeader {...props} {canonicalUrl} {metaDescription} image={props.image || page.data?.store?.logo || ''} />
