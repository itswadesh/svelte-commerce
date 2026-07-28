<script lang="ts">
	import { page as sveltePage } from '$app/state'
	import { fly } from 'svelte/transition'
	import { X } from '@lucide/svelte'
	import { Button } from '$lib/components/ui/button'
	import {
		GoogleStructuredDataOrganization,
		GoogleStructuredDataProductsList,
		GoogleStructuredDataWebsite,
		SeoHeader
	} from '$lib/core/components/index.js'
	import { HomepageModule } from '$lib/core/composables/index.js'
	import { setCollectionState } from '$lib/core/stores/collection.svelte.js'
	import { timestampToAgo } from '$lib/core/utils/index.js'
	import { resolveThemeContent } from '$lib/theme/index.js'
	import { themeHomepages } from '$lib/theme/homepages.js'
	import ThemeSections from '$lib/theme/ThemeSections.svelte'
	import ProductCard from '$lib/components/product-catalogue/product-card.svelte'

	let { data } = $props()

	const PUBLIC_LITEKART_DOMAIN = $derived(sveltePage.url.origin)
	const [aspectWidth, aspectHeight] = $derived(
		data?.store?.productImageAspectRatio?.split(':') || ['1', '1']
	)

	setCollectionState()

	interface ExtendedPage {
		metaTitle?: string
		metaDescription?: string
		metaKeywords?: string
		logo?: string
		desktopBanners?: any[]
		mobileBanners?: any[]
		sections?: any[]
	}

	const page = (data?.page || {}) as ExtendedPage
	const homepageModule = new HomepageModule()
	const activeTheme = $derived(data?.theme?.name || 'default')
	const ThemeHomepage = $derived(themeHomepages[activeTheme] || themeHomepages['default'])
	// Hardcoded theme content, with the store's admin-provided themeContent (store.theme.content)
	// merged over it section by section (falls back to the theme defaults for anything unset).
	const themeContent = $derived(resolveThemeContent(activeTheme, data?.store))
	// The store's own name wins; a theme's brandName is demo copy for previewing the theme.
	const brandName = $derived(data?.store?.name || themeContent.brandName || 'Store')
	const themeDescription = $derived(themeContent.description || page?.metaDescription || '')

	const featuredCategories = $derived(homepageModule.featuredCategories || [])
	const featuredProducts = $derived(homepageModule.featuredProducts || [])

	// Section-driven themes ship their homepage as data (`themeLayout` from the API) and are
	// rendered with the shared section library. Themes that still have a bespoke component fall
	// back to it, so both kinds work side by side while themes are migrated.
	const themeLayout = $derived(data?.store?.themeLayout)
	const sectionContext = $derived({
		content: themeContent,
		brandName,
		currencyCode: data?.store?.currency?.code,
		aspectWidth,
		aspectHeight,
		featuredProducts,
		featuredCategories,
		loading: homepageModule.loading,
		ProductCard
	})
	const filterButtons = $derived([
		'All',
		...featuredCategories
			.map((category: any) => category?.name || category?.title)
			.filter(Boolean)
			.slice(0, 6)
	])

</script>

<GoogleStructuredDataProductsList products={homepageModule.featuredProductsStructuredData} />

<GoogleStructuredDataOrganization
	name={brandName}
	url={`https://${PUBLIC_LITEKART_DOMAIN}`}
	logo={data?.store?.logo}
	description={themeDescription}
	sameAs={data?.store?.socialSharing?.active
		? (Object.values(data?.store?.socialSharing || {}).filter(
				(link: any) => typeof link === 'string' && link.startsWith('http')
			) as string[])
		: []}
	address={data?.store?.address
		? {
				streetAddress: data?.store?.address?.street,
				addressLocality: data?.store?.address?.city,
				addressRegion: data?.store?.address?.state,
				postalCode: data?.store?.address?.pincode,
				addressCountry: data?.store?.address?.country
			}
		: undefined}
	contactPoint={data?.store?.contact?.phone
		? {
				telephone: data?.store?.contact?.phone,
				email: data?.store?.contact?.email,
				contactType: 'customer service'
			}
		: undefined}
/>

<GoogleStructuredDataWebsite />

<SeoHeader
	metaTitle={themeContent.seoTitle || page?.metaTitle || brandName}
	metaDescription={themeDescription}
	metaKeywords={page?.metaKeywords}
	image={themeContent.seoImage || page?.logo || data?.store?.logo}
/>

{#if themeLayout?.sections?.length}
	<ThemeSections layout={themeLayout} ctx={sectionContext} />
{:else}
	<svelte:component
		this={ThemeHomepage}
		{themeContent}
		{brandName}
		{themeDescription}
		storeLogo={data?.store?.logo}
		storeName={data?.store?.name}
		storeDescription={data?.store?.description}
		{aspectWidth}
		{aspectHeight}
		{featuredCategories}
		{featuredProducts}
		{filterButtons}
		{homepageModule}
		loading={homepageModule.loading}
		desktopBanners={page?.desktopBanners}
		mobileBanners={page?.mobileBanners}
		pageSections={page?.sections}
		currencyCode={data?.store?.currency?.code}
	/>
{/if}

<!-- The theme owns the homepage design, so the admin `home` page record never replaces a section.
     The editorial theme inherits two things from it and only when the merchant has filled them in:
     the banner slider (into the hero) and the banner sections (as tile bands) — see
     $lib/theme/default/page-inheritance.ts. Both are switchable per device on the admin Theme page.
     The typed block designer (page.layouts) still has no storefront renderer. -->

{#if homepageModule.showRecentOrderPopup}
	<div transition:fly={{ x: 50, duration: 150 }} class="fixed bottom-20 right-4 z-50">
		<div class="flex max-w-[320px] gap-3 border-l-4 border-primary bg-white p-3.5 shadow-lg">
			<a href="/products/{homepageModule.selectedRecentOrder?.slug || ''}" class="flex gap-3 text-foreground">
				<img
					src={homepageModule.selectedRecentOrder?.image ||
						homepageModule.selectedRecentOrder?.img ||
						homepageModule.selectedRecentOrder?.thumbnail}
					alt={homepageModule.selectedRecentOrder?.title || 'Product'}
					class="h-[58px] w-[58px] object-cover"
				/>
				<div>
					<p class="text-xs text-gray-500">
						{homepageModule.selectedRecentOrder?.first_name || 'Someone'} from {homepageModule.selectedRecentOrder?.city || 'nearby'}
					</p>
					<strong class="block text-sm text-primary">{homepageModule.selectedRecentOrder?.title || 'a menu item'}</strong>
					<span class="text-xs text-gray-500">
						{timestampToAgo(
							homepageModule.selectedRecentOrder?.created_at ||
								homepageModule.selectedRecentOrder?.createdAt ||
								''
						)}
					</span>
				</div>
			</a>
			<Button
				variant="ghost"
				size="icon"
				class="h-7 w-7 self-start"
				onclick={() => (homepageModule.showRecentOrderPopup = false)}
				aria-label="Close recent order"
			>
				<X class="h-4 w-4" />
			</Button>
		</div>
	</div>
{/if}
