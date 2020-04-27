// process.env.api_url comes from rollup.config.js line 30,31
const server_ip = 'https://api.litekart.in'
const www_ip = 'https://www.hopyshopy.com'
const api_url =
  process.env.NODE_ENV === 'production'
    ? server_ip
    : process.env.api_url || server_ip
const host =
  process.env.NODE_ENV === 'production' ? www_ip : process.env.api_url || www_ip
const CDN = 'https://ik.imagekit.io/3wzatecz51w3i/hopyshopy'
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
export {
  sorts,
  CDN,
  currency,
  tokenExpiry,
  api_url,
  host,
  ANALYTICS_TRACKING_ID,
}
