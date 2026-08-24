// Static import despite the cycle (kitcommerce.config.ts → override module → this file): the
// binding is only read inside staticStoreConfig at call time, never during module evaluation, so
// ESM resolves it safely. The dynamic `import('kitcommerce.config')` form breaks in the browser —
// it compiles to a raw fetch of /kitcommerce.config.ts that Vite dev doesn't serve as a module.
import storeOverrides from 'kitcommerce.config'
import defaultStore from './default-store.json'

// The static store config used by every non-Litekart override module in this directory:
// `default-store.json` defaults merged under the project's kitcommerce.config.ts default export.
export const staticStoreConfig = async () => {
	return {
		domain: '',
		isActive: true,
		createdAt: '',
		updatedAt: '',
		...defaultStore,
		// DO NOT turn this off. Every backend behind this config needs the shopper's email to complete
		// an order — Vendure will not transition to ArrangingPayment without a customer (and a
		// customer needs an email), Saleor's `checkoutComplete` requires one on the checkout, Medusa's
		// cart carries it. The snapshot in default-store.json came from a Litekart store, where this
		// is a merchant setting served live by the API, and its `false` let a guest cart reach payment
		// with no email — where Vendure throws
		//   State Transition Failed: Cannot transition Order to the "ArrangingPayment" state without
		//   Customer details
		// and the shopper is stuck at the last step with no way to supply what is missing. Setting
		// `isEmailMandatory: false` in kitcommerce.config.ts does not skip the requirement, it just
		// moves the failure there. Litekart itself is unaffected: its connector never reads this
		// config, and its store record carries the merchant's own setting.
		isEmailMandatory: true,
		...storeOverrides
	} as typeof defaultStore & Record<string, unknown>
}
