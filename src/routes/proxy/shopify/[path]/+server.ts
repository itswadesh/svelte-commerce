import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { env } from '$env/dynamic/private'
import { env as publicEnv } from '$env/dynamic/public'
import base32 from 'hi-base32'

export const fallback: RequestHandler = async ({ request, params, url }) => {
	const indetenedUrl = base32.decode(params.path)
	const shopifyApiType = request.headers.get('X-Shopify-Api-Type')
	const isAdminApiCall = shopifyApiType === 'admin'
	const path = params.path
	const searchParams = url.searchParams.toString()

	const shopifyStoreDomain = publicEnv.PUBLIC_SHOPIFY_STORE_DOMAIN
	const shopifyAccessToken = env.SHOPIFY_ADMIN_ACCESS_TOKEN

	if (!shopifyStoreDomain || !shopifyAccessToken) {
		console.error('Shopify Proxy Error: Missing credentials in environment variables')
		return json({ error: 'Shopify credentials not configured on server' }, { status: 500 })
	}

	// Ensure path doesn't have double .json and handle both REST and GraphQL if needed
	// But primarily focusing on the Admin REST API as requested
	const cleanPath = path.endsWith('.json') ? path.substring(0, path.length - 5) : path
	const shopifyUrl = isAdminApiCall
		? `https://${shopifyStoreDomain}/admin/api/2026-01/${indetenedUrl}`
		: `https://${shopifyStoreDomain}/api/2026-01/graphql.json`

	const headers = new Headers()
	if (isAdminApiCall) headers.set('X-Shopify-Access-Token', shopifyAccessToken)
	else headers.set('X-Shopify-Storefront-Access-Token', publicEnv.PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN)

	headers.set('Content-Type', 'application/json')

	const options: RequestInit = {
		method: request.method,
		headers
	}

	if (request.method !== 'GET' && request.method !== 'HEAD') {
		try {
			options.body = await request.text()
		} catch (e) {
			// Body might be empty or unreadable
		}
	}

	try {
		const response = await fetch(shopifyUrl, options)

		const contentType = response.headers.get('content-type')
		let data

		if (contentType && contentType.includes('application/json')) {
			data = await response.json()
		} else {
			data = await response.text()
		}
		if (!response.ok) {
			console.error(data)
		}
		return json(data, {
			status: response.status,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Cache-Control': 'no-cache'
			}
		})
	} catch (error: any) {
		console.error('Shopify Proxy Fetch Error:', error)
		return json({ errors: error.message }, { status: 500 })
	}
}
