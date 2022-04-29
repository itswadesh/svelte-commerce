import { KitQLClient } from '@kitql/client'
const DOMAIN = import.meta.env.VITE_WWW_URL || 'http://localhost:3000'

export const kitQLClient = new KitQLClient({
	url: `${DOMAIN}/graphql`,
	credentials: 'omit',
	headersContentType: 'application/json',
	logType: ['client', 'server', 'operationAndvariables']
})
