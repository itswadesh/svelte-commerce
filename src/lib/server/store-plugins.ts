import { services } from 'kitcommerce.config'

type Flag = { active?: unknown } | undefined
export type StoreSwitches = { isGuestCheckout?: Flag; signInToShop?: Flag }

// The store's own switches, from the record the connector already keeps for every request (the
// closed-store gate reads the same one). Read structurally, as store-lock.ts does: a connector
// that predates a switch leaves it out, and a missing switch means today's behaviour.
export async function storeSwitches(): Promise<StoreSwitches> {
	const stores = Reflect.get(services, 'storeService') as
		| { getStoreByIdOrDomain?: () => Promise<{ plugins?: StoreSwitches } | null | undefined> }
		| undefined
	try {
		return (await stores?.getStoreByIdOrDomain?.())?.plugins ?? {}
	} catch {
		return {}
	}
}

// Whether the store runs the shop assistant. Its engine module registers the `shop-assistant` plugin,
// so an engine without the module (hosted stores) or a store with it off has no such key, and asking
// the module's status route there only put a 404 in every shopper's console. The connector keeps
// this list a minute, and the store record already read it for this request.
export async function shopAssistantOn(): Promise<boolean> {
	// A connector with no assistant service (Litekart's) is not asked for its plugin list at all.
	if (!Reflect.get(services, 'shopAssistantService')) return false
	const plugins = Reflect.get(services, 'pluginsService') as
		| { list?: () => Promise<{ data?: Array<{ key?: string }> } | null | undefined> }
		| undefined
	try {
		return !!(await plugins?.list?.())?.data?.some((p) => p?.key === 'shop-assistant')
	} catch {
		return false
	}
}

// The storefront's own sign-in marker: the connector sets `connect.sid` beside the session it keeps
// in the browser, and the server never sees the session itself.
export const hasSession = (cookies: { get(name: string): string | undefined }) => !!cookies.get('connect.sid')
