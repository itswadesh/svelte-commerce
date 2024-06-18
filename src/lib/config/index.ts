import { env } from '$env/dynamic/public'
export * from './website'
export const adminUrl = 'https://admin.litekart.in'
export const alert = 'The High Performance and Scalable Ecommerce'
export const authorInfo = {
	author: 'Swadesh Behera',
	facebookAuthorPage: `https://www.facebook.com/codenx`,
	facebookPageName: 'codenx',
	githubPage: 'itswadesh',
	linkedinProfile: 'itswadesh',
	twitterUsername: 'itswadesh',
	telegramUsername: 'itswadesh',
	Whatsapp: '+918249028220',
	Website: 'http://litekart.in'
}
export const currency = { symbol: '$', code: 'USD' }
export const currencyCode = 'USD'
export const currencySymbol = '$'
export const dimentionUnit = 'cm'
export const DOMAIN = env.PUBLIC_LITEKART_DOMAIN // Never add any default value here, it will break SaaS working
export const entity = 'Misiki'
export const HTTP_ENDPOINT = env.PUBLIC_LITEKART_API_URL || 'https://api.litekart.in'
export const IMAGE_CDN_URL = 'https://ik.imagekit.io/3wzatecz51w3i'
export const IS_DEV = env.PUBLIC_IS_DEV == 'true'
export const listOfPagesWithoutBackButton = [
	'/',
	'/categories',
	'/new-arrivals',
	'/my/wishlist',
	'/my',
	'/payment/success',
	'/my/reviews/create',
	'/__data.json'
]
export const loginUrl = '/auth/login'
export const mediaqueries = {
	xs: '(min-width: 480px)',
	sm: '(min-width: 640px)',
	md: '(min-width: 768px)',
	lg: '(min-width: 1024px)',
	xl: '(min-width: 1280px)',
	'2xl': '(min-width: 1536px)',
	landscape: '(orientation: landscape) and (max-height: 499px)',
	tiny: '(orientation: portrait) and (max-height: 599px)',
	dark: '(prefers-color-scheme: dark)',
	noanimations: '(prefers-reduced-motion: reduce)'
}
// export const provider = env.PUBLIC_API_PROVIDER || 'Litekart' // 'Medusa' 'Woocommerce' 'Bigcommerce'
export const searchbarText = 'Search for brands categories & more'
export const SHOPIFY_BASE_URL = `https://api.shopify.com`
export const siteShortTitle = 'Litekart' // used as SchemaOrg siteTitleAlt
export const siteTitle = 'Litekart'
export const sorts = [
	{ name: 'Recomended', val: null },
	{ name: `What's New`, val: '-updatedAt' },
	{ name: 'Price: High to Low ', val: '-price' },
	{ name: 'Price: Low to High ', val: 'price' },
	{ name: 'Discount: High to Low ', val: '-discount' },
	{ name: 'Discount: Low to High ', val: 'discount' },
	{ name: `Name: Asc`, val: 'name' },
	{ name: `Name: Desc`, val: '-name' } // { name: 'Most Viewed', val: '-views' }
]
export const weightUnit = 'g'
export const WWW_URL = env.PUBLIC_WWW_URL || env.PUBLIC_LITEKART_DOMAIN
export const SENTRY_DSN = env.PUBLIC_SENTRY_DSN

export const MEDUSAJS_BASE_URL = `${env.PUBLIC_MEDUSAJS_API_URL}/store`
// export const MEDUSAJS_BASE_URL = `http://localhost:3000/store`

export const BIG_COMMERCE_STORE_HASH = env.PUBLIC_BIG_COMMERCE_STORE_HASH || 'ftelcymxrh'
export const BIG_COMMERCE_ACCESS_TOKEN =
	env.PUBLIC_BIG_COMMERCE_ACCESS_TOKEN || 'evgagyg76wcxcg9uauodegpc1eybfzx'
export const BIG_COMMERCE_BASE_URL = `https://api.bigcommerce.com/stores/${BIG_COMMERCE_STORE_HASH}/v3/catalog`
// export const BIG_COMMERCE_CLIENT_ID =
// 	env.PUBLIC_BIG_COMMERCE_CLIENT_ID || 'nybaukoetx98bdjo5vshh0edr3xsz42'
// export const BIG_COMMERCE_CLIENT_SECRET =
// 	env.PUBLIC_BIG_COMMERCE_CLIENT_SECRET ||
// 	'09c194121a7dbf059735671991015c2e208cdfe8dfa1f74f63edc9b2353e9720'
export const bigcommerceHeaders = {
	'X-Auth-Token': BIG_COMMERCE_ACCESS_TOKEN,
	'Content-Type': 'application/json',
	Accept: 'application/json'
}

export const WOO_COMMERCE_KEY =
	env.PUBLIC_WOO_COMMERCE_KEY || 'ck_22a412b11bc3045bders7ederrda24d5b6d5245'
export const WOO_COMMERCE_SECRET =
	env.PUBLIC_WOO_COMMERCE_SECRET || 'cs_98fcss4a9feaf84908197d1fdere30786c38749'
export const WOO_COMMERCE_STORE_LINK =
	env.PUBLIC_WOO_COMMERCE_STORE_LINK || 'https://test.litekart.in'
export const woocommerceHeaders = {
	username: WOO_COMMERCE_KEY,
	password: WOO_COMMERCE_SECRET,
	'Content-Type': 'application/json',
	Accept: 'application/json'
}

// Design config of svelte commerce
export const slotMarginGeneral = 'mt-14 sm:mt-20'
export const slotMarginGeneralWithHelloBar = 'mt-[88px] sm:mt-28'
export const slotMarginGeneralWithHelloBarAndHyperLocal = 'mt-[114px] sm:mt-[206px]'
export const slotMarginGeneralWithHyperLocal = 'mt-20 sm:mt-[104px]'
export const slotMarginProduct = 'lg:mt-20'
