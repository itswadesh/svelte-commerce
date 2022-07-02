const QrCode = 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data='
const HTTP_ENDPOINT_AUTOMATION = 'https://misiki.in'
const WWW_URL = import.meta.env.VITE_WWW_URL || 'http://localhost:3000'
const DOMAIN = import.meta.env.VITE_DOMAIN
const GOOGLE_MAPS_KEY = import.meta.env.GOOGLE_MAPS_KEY || 'AIzaSyBIG0jd-iPEfUhwt8tD-Tjxt-yrPFgfRXc'
const CDN_URL = 'https://ik.imagekit.io/3wzatecz51w3i'
export const typingTimeout = 0 // After this delay the search api will be fired
const currency = { symbol: '₹', code: 'INR' }
const tokenExpiry = 60 * 60 * 24 * 365 // Login validity in seconds
const ANALYTICS_TRACKING_ID = 'UA-49421899-5'
const sorts = [
	{ name: 'Relevance', val: null },
	{ name: 'Whats New', val: '-createdAt' },
	{ name: 'Price low to high', val: 'price' },
	{ name: 'Price high to low', val: '-price' }
]
const authorInfo = {
	author: 'Swadesh Behera',
	entity: 'Misiki',
	ogLanguage: 'en_US',
	siteLanguage: 'en-US',
	siteTitle: ' - Svelte Commerce',
	siteShortTitle: ' - Svelte Commerce', // used as SchemaOrg siteTitleAlt
	contactEmail: 'swadesh@misiki.in',
	facebookAuthorPage: `https://www.facebook.com/itswadesh`,
	facebookPage: `https://www.facebook.com/codenx`,
	facebookPageName: 'codenx',
	githubPage: 'itswadesh',
	linkedinProfile: 'itswadesh',
	telegramUsername: 'itswadesh',
	twitterUsername: 'itswadesh'
}
const host = 'https://misiki.io'
export {
	sorts,
	CDN_URL,
	currency,
	tokenExpiry,
	WWW_URL,
	DOMAIN,
	HTTP_ENDPOINT_AUTOMATION,
	ANALYTICS_TRACKING_ID,
	GOOGLE_MAPS_KEY,
	authorInfo,
	host,
	QrCode
}
