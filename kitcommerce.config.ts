// pick exactly one
export * as services from '@misiki/litekart-connector'
// Backends other than Litekart use the override modules below, not the raw @misiki/*-connector
// packages — the raw connectors still call Litekart REST endpoints for store/page metadata (see
// VENDURE.md / MEDUSA.md / SALEOR.md). Each also needs its PUBLIC_<CONNECTOR>_* env set in .env.
// export * as services from './src/lib/core/connectors/vendure'
// export * as services from './src/lib/core/connectors/medusa'
// export * as services from './src/lib/core/connectors/saleor'

// Non-Litekart modes read store details from static config instead of the Litekart REST API.
// Merge store identity overrides here — name, logo, favicon, currency, menus, plugins,
// cssVariables — over the extracted defaults (src/lib/core/connectors/default-store.json).
export default {}
