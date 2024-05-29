import * as misiki from '$lib/themes/misiki'
import * as prodexa from '$lib/themes/prodexa'
import { env } from '$env/dynamic/public'
// import * as fashion from '$lib/themes/fashion'
// import * as varni from '$lib/themes/varni'
// import * as varni_ace from '$lib/themes/varni-ace'

const selectedThemeName = env.PUBLIC_SELECTED_THEME || 'misiki'

const theme = {
	'misiki': misiki,
	'prodexa': prodexa
}[selectedThemeName]

export const {
	CategoriesHome,
	CategoriesMobile,
	CategoriesMobile2,
	CategoriesSlider,
	CategoryPoolButtons,
	CollectionsGeneral,
	CollectionsHome,
	CollectionsHome2,
	CustomBanners,
	CustomerFeedback,
	Deals,
	DeliveryOptions,
	Footer,
	FrequentlyBoughtProduct,
	Hero,
	HeroBanners,
	Home,
	MegamenuHorizontal,
	MegamenuVertical,
	Nav,
	PickedBanners,
	ProductAttributes,
	ProductDetails,
	ProductListingSearchPage,
	ProductsListingPage,
	SimilarProductsFromCategorySlug,
	TrendingProductsHome,

	Pricesummary
} = theme

// export * from '$lib/themes/misiki'
// export * from '$lib/themes/fashion'
// export * from '$lib/themes/varni'
// export * from '$lib/themes/varni-ace'
