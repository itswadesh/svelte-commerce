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

// The storefront's own sign-in marker: the connector sets `connect.sid` beside the session it keeps
// in the browser, and the server never sees the session itself.
export const hasSession = (cookies: { get(name: string): string | undefined }) => !!cookies.get('connect.sid')
