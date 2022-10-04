import {
	PUBLIC_DOMAIN,
	PUBLIC_HTTP_ENDPOINT,
	PUBLIC_PINCODES_API,
	PUBLIC_WWW_URL
} from '$env/static/public'

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
	{ name: 'Latest First', val: '-updatedAt' },
	{ name: 'Highest Rated', val: '-ratings' },
	{ name: 'Most Viewed', val: '-views' }
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
export const WWW_URL = PUBLIC_WWW_URL || 'https://kitcommerce.tech'
export const HTTP_ENDPOINT = PUBLIC_HTTP_ENDPOINT || 'https://api.misiki.in'
export const IMAGE_CDN_URL = 'https://ik.imagekit.io/3wzatecz51w3i/misiki'
export const host = '' //'https://atozzones.com'
export const DOMAIN = PUBLIC_DOMAIN
export const pageSize = 20
export const stripePublishableKey =
	'pk_test_51HXxXqXqXqXqXqXqXqXqXqXqXqXqXqXqXqXqXqXqXqXqXqXqXqXqXqXqXqXqXq'
export const contactEmail = 'swadesh@misiki.in'
export const facebookPage = `https://www.facebook.com/codenx`
export const PINCODES_API = PUBLIC_PINCODES_API
export const GOOGLE_CLIENT_ID =
	'414060469322-n4raqj2rdbjhegvrtdk6mhbdm4sd0oc7.apps.googleusercontent.com'
export const GOOGLE_ANALYTICS_ID = 'G-ZMZXZWG90W'
export * from './website'
