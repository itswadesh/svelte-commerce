/**
 * The active commerce connector, whichever package that is.
 *
 * `$connector` is an alias resolved in vite.config.ts to the one @misiki/*-connector this project
 * installs (or to `PUBLIC_CONNECTOR`). It is deliberately typed loosely rather than pointed at any
 * one connector's types: a storefront that uninstalls Litekart and installs Shopify must still
 * type-check, so nothing here may depend on a particular package being present.
 *
 * This costs nothing at the call sites. App code never imports `$connector` — it imports
 * `$lib/core/services`, which re-exports the fully typed service surface from
 * `@misiki/kitcommerce-core/services`. The only consumer of this module is
 * `src/lib/core/connectors/active.ts`, which reaches for optional hooks through explicit casts
 * because their presence varies by connector version.
 */
declare module '$connector' {
	/** The marker newer connectors export (`'vendure'`, `'shopify'`, …). Absent on older ones. */
	export const connectorName: string | undefined

	/** The connector's own BaseService class. Its statics differ per connector; see connectors/init.ts. */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	export const BaseService: any

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const connector: any
	export default connector
}

/**
 * The active connector's short name (`@misiki/x-cart-connector` → `x-cart`), substituted at build
 * time by the `define` in vite.config.ts. Used only as the fallback when the connector package
 * exports no `connectorName` of its own.
 */
declare const __CONNECTOR_NAME__: string
