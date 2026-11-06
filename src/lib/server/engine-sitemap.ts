import { env } from '$env/dynamic/public'
import type { RequestEvent } from '@sveltejs/kit'

// The connector's rule for which store a host sells for: acme.<base domain> is acme, and the
// configured store has any other host. Failing both the host itself goes, which the engine reads
// as a store's verified domain.
function storeFor(hostname: string) {
	const suffix = env.PUBLIC_GOCOMMERCE_BASE_DOMAIN ? `.${env.PUBLIC_GOCOMMERCE_BASE_DOMAIN}` : ''
	if (suffix && hostname.endsWith(suffix)) {
		const slug = hostname.slice(0, -suffix.length)
		if (!slug.includes('.')) return slug
	}
	return env.PUBLIC_GOCOMMERCE_STORE || hostname
}

/**
 * A sitemap file from the GoCommerce engine, or null when this storefront runs on another backend.
 *
 * It has to reach the shopper's host rather than the engine's, because a search engine trusts a
 * sitemap only for the host it came from. X-Forwarded-Host is what makes the engine write its links
 * to the other files on this host, which /x/sitemaps/[file] then serves.
 */
export async function engineSitemap(event: RequestEvent, file: string): Promise<Response | null> {
	const engine = env.PUBLIC_GOCOMMERCE_API_URL
	if (!engine) return null

	const headers = new Headers({
		accept: 'application/xml',
		'x-store': storeFor(event.url.hostname),
		'x-forwarded-host': event.url.host,
		'x-forwarded-proto': event.url.protocol.replace(':', '')
	})
	try {
		const answer = await fetch(`${engine.replace(/\/+$/, '')}/x/sitemaps/${file}`, { headers })
		return new Response(answer.body, {
			status: answer.status,
			headers: {
				'content-type': answer.headers.get('content-type') ?? 'application/xml; charset=utf-8',
				// Short, so a new product shows soon. An error is never kept.
				'cache-control': answer.ok ? 'public, max-age=3600' : 'no-store'
			}
		})
	} catch (error) {
		console.error('Failed to fetch sitemap:', error)
		return new Response('Sitemap unavailable', { status: 502, headers: { 'cache-control': 'no-store' } })
	}
}
