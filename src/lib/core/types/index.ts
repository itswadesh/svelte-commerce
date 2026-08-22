export * from '@misiki/kitcommerce-core/types'

// Domain model types (Product, Cart, Page, Vendor, StoreData, ...) are declared in the
// connector. Re-export them type-only so `$lib/core/types` stays the single type barrel
// without pulling the connector's runtime services into the bundle.
//
// This is the one place that still names a connector package: `export type *` needs a literal
// specifier, and the `services` namespace from kitcommerce.config carries no domain types. It is
// erased at build time, so it never affects bundling — but if you swap
// @misiki/litekart-connector for your backend's connector, repoint this line at it too or
// `npm run check` will fail on the missing package.
export type * from '@misiki/litekart-connector'
