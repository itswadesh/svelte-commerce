import { staticStoreConfig } from './static-store'
import type { LocalResolver } from './no-litekart-rest'

// The storefront ships static data for a handful of things a non-Litekart backend has no endpoint
// for — menus, the country list the address form offers, currencies, plugin toggles, the payment and
// shipping options recorded with the store. When a connector reaches for the Litekart REST path that
// used to serve one of those, answer it from `default-store.json` + the kitcommerce.config.ts
// overrides instead of returning nothing: the data is right here, and an empty country dropdown or a
// missing menu is a worse answer than the one we already hold.
//
// Anything not listed falls through to the empty/throw behaviour in no-litekart-rest.ts.

const listShape = (data: unknown[]) => ({
	data,
	count: data.length,
	pageSize: data.length,
	noOfPage: 1,
	page: 1
})

/** Path prefix → what to serve for it, given the merged static store config. */
const LOCAL_SOURCES: Array<{ prefix: string; from: (store: Record<string, any>) => unknown }> = [
	// The store record itself: name, logo, currency, menus, plugin toggles, theme variables. The
	// connector asks for this before anything else can render, so it must resolve even when the
	// installed connector is too old to accept the injected provider.
	{ prefix: '/api/stores/public-details', from: (store) => store },
	// The nav reads `response.data` and filters on `menuId`.
	{ prefix: '/api/menu', from: (store) => ({ data: store.menu ?? [] }) },
	{ prefix: '/api/countries/all', from: (store) => listShape(store.countries ?? []) },
	{ prefix: '/api/countries', from: (store) => listShape(store.countries ?? []) },
	// No state list ships with the store record; the address form takes free text.
	{ prefix: '/api/currencies', from: (store) => listShape(store.currency ? [store.currency] : []) },
	{ prefix: '/api/plugins', from: (store) => listShape(store.plugins ?? []) },
	{ prefix: '/api/settings', from: (store) => ({ data: store }) },
	{ prefix: '/api/payment-methods', from: (store) => listShape(store.paymentMethods ?? []) },
	{ prefix: '/api/shipping-zones', from: (store) => listShape(store.shippingZones ?? []) }
]

export const localStoreData: LocalResolver = async (url: string) => {
	const path = url.split('?')[0]
	const source = LOCAL_SOURCES.find((entry) => path.startsWith(entry.prefix))
	if (!source) return undefined

	const store = (await staticStoreConfig()) as unknown as Record<string, any>
	return source.from(store)
}
