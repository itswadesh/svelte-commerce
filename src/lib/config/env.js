import { PUBLIC_HTTP_ENDPOINT } from '$env/static/public'
import 'dotenv/config'
export const HTTP_ENDPOINT = PUBLIC_HTTP_ENDPOINT || 'https://staging.zapvi.in'
