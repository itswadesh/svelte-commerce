import dotenv from 'dotenv'
dotenv.config()
export const HTTP_ENDPOINT = process.env.HTTP_ENDPOINT || 'https://api.misiki.io'
export const WWW_URL = process.env.WWW_URL || 'https://kitcommerce.tech'
