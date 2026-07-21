export * from '@misiki/kitcommerce-core/types'

// Domain model types (Product, Cart, Page, Vendor, StoreData, ...) are declared in the
// connector. Re-export them type-only so `$lib/core/types` stays the single type barrel
// without pulling the connector's runtime services into the bundle.
export type * from '@misiki/litekart-connector'
