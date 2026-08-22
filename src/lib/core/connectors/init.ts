import { env } from '$env/dynamic/public'
// Static import, not `await import('kitcommerce.config')`: in the browser the dynamic form
// compiles to a raw fetch of /kitcommerce.config.ts that Vite dev doesn't serve as a module, so
// client init silently failed and setBaseUrl never ran (worked locally only because the default
// base URL matched). The config module is in the client bundle anyway via the services shim.
import { services } from 'kitcommerce.config'

// Loose view of whatever connector kitcommerce.config.ts exports. The static type follows the
// active connector, so env-driven setup reads it through this shape instead. `connectorName` is
// the marker each override module in this directory exports — it lets init fail loudly when a
// PUBLIC_<CONNECTOR>_* env is set while a different connector is active, instead of silently
// writing that connector's statics onto the wrong BaseService.
type ActiveServices = {
	connectorName?: string
	BaseService?: Record<string, string | undefined>
	storeService?: { setBaseUrl?: (url: string) => unknown }
}

const active = services as unknown as ActiveServices

const wrongConnector = (envName: string, connector: string) =>
	new Error(`${envName} is set but the ${connector} connector is not active in kitcommerce.config.ts`)

// Shared by src/hooks.server.ts and src/hooks.client.ts: SSR and the browser both need the
// backend URL applied (in production the browser must reach the public API URL).
export const initActiveConnector = async () => {
	if (env.PUBLIC_MEDUSA_API_URL) {
		if (active.connectorName !== 'medusa' || !active.BaseService)
			throw wrongConnector('PUBLIC_MEDUSA_API_URL', 'medusa')
		active.BaseService.PUBLISHABLE_KEY = env.PUBLIC_MEDUSA_PUBLISHABLE_API_KEY
		active.BaseService.BASE_URL = env.PUBLIC_MEDUSA_API_URL
		active.BaseService.REGION_ID = env.PUBLIC_MEDUSA_REGION_ID
	}

	if (env.PUBLIC_SALEOR_API_URL) {
		if (active.connectorName !== 'saleor' || !active.BaseService)
			throw wrongConnector('PUBLIC_SALEOR_API_URL', 'saleor')
		active.BaseService.SALEOR_API_URL = env.PUBLIC_SALEOR_API_URL
	}

	if (env.PUBLIC_VENDURE_API_URL) {
		if (active.connectorName !== 'vendure' || typeof active.storeService?.setBaseUrl !== 'function')
			throw wrongConnector('PUBLIC_VENDURE_API_URL', 'vendure')
		// setBaseUrl writes the static shared by every service; the underlying `_baseUrl` is private.
		active.storeService.setBaseUrl(env.PUBLIC_VENDURE_API_URL)
	}
}
