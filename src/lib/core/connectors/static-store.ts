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
		...storeOverrides
	} as typeof defaultStore & Record<string, unknown>
}
