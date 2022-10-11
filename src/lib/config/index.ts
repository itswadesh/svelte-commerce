import { PUBLIC_HTTP_ENDPOINT, PUBLIC_PINCODES_API } from '$env/static/public'

export const authorInfo = {
	author: 'Swadesh Behera',
	facebookAuthorPage: `https://www.facebook.com/codenx`,
	facebookPageName: 'codenx',
	githubPage: 'itswadesh',
	linkedinProfile: 'itswadesh',
	telegramUsername: 'itswadesh',
	twitterUsername: 'itswadesh'
}
export const sorts = [
	{ name: 'Recomended', val: null },
	{ name: `What's New`, val: '-updatedAt' },
	{ name: 'Price: High to Low ', val: '-price' },
	{ name: 'Price: Low to High ', val: 'price' },
	{ name: 'Discount: High to Low ', val: '-discount' },
	{ name: 'Discount: Low to High ', val: 'discount' },
	{ name: `Name: Asc`, val: 'name' },
	{ name: `Name: Desc`, val: '-name' }
	// { name: 'Most Viewed', val: '-views' }
]

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
export const currency = { symbol: '₹', code: 'INR' }
export const HTTP_ENDPOINT = PUBLIC_HTTP_ENDPOINT || 'https://api.misiki.io'
export const IMAGE_CDN_URL = 'https://ik.imagekit.io/3wzatecz51w3i/zapvi'
export const PINCODES_API = PUBLIC_PINCODES_API

export const entity = 'KitCommerce'
export const siteTitle = 'KitCommerce'
export const siteShortTitle = 'KitCommerce' // used as SchemaOrg siteTitleAlt
export * from './website'
