<script lang="ts">
	import { SeoHeader as CoreSeoHeader } from '$lib/core/components/index.js'
	import { page } from '$app/state'

	// The vendored SeoHeader declares `image = ''` with no fallback, so every call site that omits
	// it — and most did — shipped an empty og:image/twitter:image. Links to those pages render as
	// a bare grey card on every social network and chat app. Defaulting here fixes the whole app at
	// once, including call sites added later, instead of repeating the fallback at each one.
	// Explicit `image` props still win; the `||` only fills in empty strings and nullish values.
	const props: Record<string, unknown> = $props()
</script>

<CoreSeoHeader {...props} image={props.image || page.data?.store?.logo || ''} />
