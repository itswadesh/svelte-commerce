import dotenv from 'dotenv'
dotenv.config()
export const HTTP_ENDPOINT = process.env.HTTP_ENDPOINT || 'https://api.misiki.in'
