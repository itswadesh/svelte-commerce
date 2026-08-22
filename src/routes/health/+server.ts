import type { RequestHandler } from '@sveltejs/kit'
import { env } from '$env/dynamic/public'

// Readiness probe for the container orchestrator. It answers "is this process up AND configured
// well enough to serve?" — NOT "is the backend healthy?". It deliberately does NOT call the upstream
// API, because a transient backend blip should not take the whole site out of rotation.
//
// But a container missing its required PUBLIC_ env is misconfigured from boot: every SSR page fails
// (service calls throw "PUBLIC_LITEKART_API_URL is not configured", and store resolution throws
// "Invalid URL" without PUBLIC_LITEKART_DOMAIN / STORE_ID). That state never recovers on its own, so
// the probe MUST fail — otherwise the container reports healthy, the orchestrator's start-first
// rollout routes traffic to it, and it replaces a working container with one that fails every page.
// Failing here makes that deploy roll back instead.
//
// Which env is required depends on the active connector (kitcommerce.config.ts). The override
// modules in src/lib/core/connectors export a `connectorName` marker; the raw litekart connector
// has none and needs the Litekart trio.
const CONNECTOR_REQUIRED_ENV: Record<string, readonly string[]> = {
	vendure: ['PUBLIC_VENDURE_API_URL'],
	medusa: ['PUBLIC_MEDUSA_API_URL'],
	saleor: ['PUBLIC_SALEOR_API_URL']
}
const LITEKART_REQUIRED_ENV = ['PUBLIC_LITEKART_API_URL', 'PUBLIC_LITEKART_STORE_ID', 'PUBLIC_LITEKART_DOMAIN'] as const

export const GET: RequestHandler = async () => {
	const { services } = await import('kitcommerce.config')
	const connectorName = (services as { connectorName?: string }).connectorName
	const required = (connectorName && CONNECTOR_REQUIRED_ENV[connectorName]) || LITEKART_REQUIRED_ENV
	const missing = required.filter((key) => !env[key as `PUBLIC_${string}`])
	if (missing.length > 0) {
		return new Response(`misconfigured: missing required env ${missing.join(', ')}`, {
			status: 503,
			headers: { 'cache-control': 'no-store' }
		})
	}
	return new Response('ok', {
		status: 200,
		headers: { 'cache-control': 'no-store' }
	})
}
