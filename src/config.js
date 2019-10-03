const REMOTE_API_URL = 'https://api.litekart.in'
const LOCAL_API_URL = 'https://api.litekart.in'
// const LOCAL_API_URL = 'http://localhost:9006'
const REMOTE_STORE_URL = 'https://laptops.hopyshopy.com'
const LOCAL_STORE_URL = 'http://localhost:4400'
const apiUrl = (process.env.NODE_ENV === 'production') ? REMOTE_API_URL : LOCAL_API_URL
const storeUrl = (process.env.NODE_ENV === 'production') ? REMOTE_STORE_URL : LOCAL_STORE_URL
const sorts = [
    { name: "Relevance", val: null },
    { name: "Whats New", val: "-createdAt" },
    { name: "Price low to high", val: "variants.price" },
    { name: "Price high to low", val: "-variants.price" }
]
export const typingTimeout = 0 // After this delay the search api will be fired
const HOST = 'https://laptops.hopyshopy.com'

const currency = {
    symbol: '₹',
    code: 'INR'
}
const tokenExpiry = 60 * 60 * 24 * 365 // Login validity in seconds
const ANALYTICS_TRACKING_ID = 'UA-131207633-1'
export { sorts, HOST, currency, tokenExpiry, apiUrl, storeUrl, ANALYTICS_TRACKING_ID }