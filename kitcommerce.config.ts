// Pick exactly one. This line is the whole backend switch: the rest of the app reaches services
// through `$lib/core/services`, never a connector package by name, so replacing
// @misiki/litekart-connector with the connector for the backend you actually run —
// @misiki/medusa-connector, @misiki/vendure-connector, @misiki/saleor-connector, etc. — is all it
// takes. Swap the package in package.json to match, so installs and Docker builds resolve it.
export * as services from '@misiki/litekart-connector'
// Medusa, Vendure and Saleor go through the override modules below rather than the raw connector
// package: those connectors still call Litekart REST endpoints for store/page metadata, which
// fails with no Litekart API behind them (see docs/VENDURE.md, docs/MEDUSA.md and
// docs/SALEOR.md). The override re-exports its connector and serves the Litekart-only bits
// statically. Each also needs its PUBLIC_<CONNECTOR>_* env set in .env.
// export * as services from './src/lib/core/connectors/vendure'
// export * as services from './src/lib/core/connectors/medusa'
// export * as services from './src/lib/core/connectors/saleor'

// Connectors without a Litekart API behind them read store details from static config instead.
// Merge store identity overrides here — name, logo, favicon, currency, menus, plugins,
// cssVariables — over the extracted defaults (src/lib/core/connectors/default-store.json).
export default {}
