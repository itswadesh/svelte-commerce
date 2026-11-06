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
 * It has to answer on the shopper's host, because a search engine trusts a sitemap only for the
 * host it came from. The engine writes its links to the other files on whatever host it thinks it
 * was asked at, and a proxy between here and there may overwrite X-Forwarded-Host with its own, as
 * production's does. So those links are put on this host here, where /x/sitemaps/[file] serves them.
 */
export async function engineSitemap(event: RequestEvent, file: string): Promise<Response | null> {
	const engine = env.PUBLIC_GOCOMMERCE_API_URL
	if (!engine) return null

	const headers = new Headers({
		accept: 'application/xml',
		'x-store': storeFor(event.url.hostname)
	})
	try {
		const answer = await fetch(`${engine.replace(/\/+$/, '')}/x/sitemaps/${file}`, { headers })
		const body = (await answer.text()).replace(
			/(<loc>)https?:\/\/[^/<]+(\/x\/sitemaps\/)/g,
			`$1${event.url.origin}$2`
		)
		return new Response(body, {
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
