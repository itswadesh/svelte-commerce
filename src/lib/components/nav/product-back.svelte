<script lang="ts">
	import { ArrowLeft } from '@lucide/svelte'
	import { page } from '$app/state'
	import { mainInTree, mainOfTrail, type MainCategory } from '$lib/components/common/main-category'

	// The product page's back arrow, in the header in place of the menu (nav.svelte decides where it
	// shows). With an earlier page of this store behind it, it goes back; a product opened from
	// outside (a shared link, the app's first screen) goes to its main category instead, or home,
	// so it never takes the shopper out of the store.
	let { canGoBack }: { canGoBack: boolean } = $props()

	const categorySlug = $derived(page.data?.product?.category?.slug || page.data?.product?.categoryHierarchy?.at(-1)?.slug || '')
	// The category tree knows a subcategory's parent; the product's own trail may hold only the leaf.
	let fromTree = $state<MainCategory | null>(null)
	$effect(() => {
		const slug = categorySlug
		let live = true
		fromTree = null
		Promise.resolve(page.data?.store?.megamenu)
			.then((tree) => live && (fromTree = mainInTree(tree, slug)))
			.catch(() => {})
		return () => (live = false)
	})
	const fallback = $derived(
		fromTree ??
			mainInTree(page.data?.store?.menu?.find?.((m: { menuId?: string }) => m?.menuId === 'header')?.items, categorySlug) ??
			mainOfTrail(page.data?.product?.categoryHierarchy)
	)

	function goBack(event: MouseEvent) {
		if (!canGoBack) return
		event.preventDefault()
		history.back()
	}
</script>

<a
	href={fallback ? `/${fallback.slug}` : '/'}
	onclick={goBack}
	aria-label={canGoBack ? 'Back' : `Back to ${fallback?.name ?? 'home'}`}
	class="product-back -ml-3 size-11 shrink-0 place-items-center rounded-full text-foreground transition-[transform,background-color] duration-fast ease-standard motion-safe:active:scale-[0.92] [@media(hover:hover)]:hover:bg-muted"
	data-testid="product-back"
>
	<ArrowLeft class="size-5" aria-hidden="true" />
</a>
