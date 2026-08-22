export * from '@misiki/kitcommerce-core/types'

// Domain model types (Product, Cart, Page, Vendor, StoreData, ...) are declared in the connector.
// Re-export them type-only so `$lib/core/types` stays the single type barrel without pulling the
// connector's runtime services into the bundle.
//
// `export type *` cannot take anything but a literal specifier, so this names the stock connector.
// It is erased at build time and never affects bundling, and it does NOT pin the storefront to
// Litekart: on a swapped install, sync-connector-types.js (run by `npm run check`) generates an
// ambient declaration redirecting this specifier onto the installed connector — the type-layer
// counterpart of the resolver plugin in vite.config.ts. @misiki/kitcommerce-core's own
// dist/services/types/index.d.ts names the same package and is redirected by the same shim.
export type * from '@misiki/litekart-connector'
