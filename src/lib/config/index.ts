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
export const WWW_URL = import.meta.env.VITE_WWW_URL || 'https://kitcommerce.tech'
export const HTTP_ENDPOINT = import.meta.env.VITE_HTTP_ENDPOINT || 'https://api.misiki.in'
export const IMAGE_CDN_URL = 'https://ik.imagekit.io/3wzatecz51w3i/misiki'
export const host = '' //'https://atozzones.com'
export const DOMAIN = import.meta.env.VITE_DOMAIN
export const pageSize = 20
export const stripePublishableKey =
	import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
	'pk_test_51HXxXqXqXqXqXqXqXqXqXqXqXqXqXqXqXqXqXqXqXqXqXqXqXqXqXqXqXqXqXq'
export const VITE_IMAGE_UPLOAD_API = import.meta.env.VITE_IMAGE_UPLOAD_API
export const VITE_IMAGE_UPLOAD_TOKEN = import.meta.env.VITE_IMAGE_UPLOAD_TOKEN
export const contactEmail = 'swadesh@misiki.in'
export const facebookPage = `https://www.facebook.com/codenx`
export const VITE_PINCODES_API = import.meta.env.VITE_PINCODES_API
export * from './website'
