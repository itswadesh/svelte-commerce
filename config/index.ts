import { amp, browser, dev } from '$app/env'
const HTTP_ENDPOINT = 'https://api.litekart.in'
const WWW_URL = dev ? 'http://localhost:3000' : 'https://svelte-commerce.litekart.in'
const CDN_URL = 'https://ik.imagekit.io/3wzatecz51w3i/images'
export const typingTimeout = 0 // After this delay the search api will be fired
const currency = { symbol: '₹', code: 'INR' }
const tokenExpiry = 60 * 60 * 24 * 365 // Login validity in seconds
const ANALYTICS_TRACKING_ID = 'UA-49421899-5'
const sorts = [
	{ name: 'Relevance', val: null },
	{ name: 'Whats New', val: '-createdAt' },
	{ name: 'Price low to high', val: 'localPrice' },
	{ name: 'Price high to low', val: '-localPrice' },
]
const authorInfo = {
	author: 'Swadesh Behera',
	entity: 'Misiki',
	ogLanguage: 'en_US',
	siteLanguage: 'en-US',
	siteTitle: 'SvelteKit based ecommerce store front',
	siteShortTitle: 'SvelteKit Storefront', // used as SchemaOrg siteTitleAlt
	contactEmail: 'swadesh@litekart.in',
	facebookAuthorPage: `https://www.facebook.com/codenx`,
	facebookPage: `https://www.facebook.com/codenx`,
	facebookPageName: 'codenx',
	githubPage: 'itswadesh',
	linkedinProfile: 'itswadesh',
	telegramUsername: 'itswadesh',
	twitterUsername: 'itswadesh',
}
export {
	sorts,
	CDN_URL,
	currency,
	tokenExpiry,
	HTTP_ENDPOINT,
	WWW_URL,
	ANALYTICS_TRACKING_ID,
	authorInfo,
}
