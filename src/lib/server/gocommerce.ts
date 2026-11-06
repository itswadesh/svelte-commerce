import { env } from '$env/dynamic/public'
import { services } from 'kitcommerce.config'

type StoreRules = {
	connectorName?: string
	storeForHost?: (host: string | undefined, baseDomain: string | undefined) => string | undefined
	ownDomain?: (host: string | undefined, baseDomain: string | undefined) => string | undefined
}

const connector = services as unknown as StoreRules

/** The engine's address on this server, when the connector in use is GoCommerce's. */
export const gocommerceEngine = () => (connector.connectorName === 'gocommerce' ? env.PUBLIC_GOCOMMERCE_API_URL || undefined : undefined)

/** The store a host belongs to, by the rule the connector's own calls use (BaseService.store). */
export function gocommerceStore(host: string): string | undefined {
	const base = env.PUBLIC_GOCOMMERCE_BASE_DOMAIN || undefined
	return connector.storeForHost?.(host, base) ?? (env.PUBLIC_GOCOMMERCE_STORE || undefined) ?? connector.ownDomain?.(host, base)
}
