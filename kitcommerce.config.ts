// Pick exactly one. This line is the whole backend switch: the rest of the app reaches services
// through `$lib/core/services`, never a connector package by name, so pointing it at another
// module in src/lib/core/connectors is all it takes to run the same storefront on another backend.
// Swap the connector package in package.json to match, so installs and Docker builds resolve it.
//
// Each module re-exports its @misiki/*-connector and exports a `connectorName` marker. The
// Medusa, Vendure and Saleor connectors still call Litekart REST endpoints for store/page
// metadata, which fails with no Litekart API behind them (see docs/MEDUSA.md, docs/VENDURE.md and
// docs/SALEOR.md), so their modules serve those Litekart-only bits statically. Each also needs its
// PUBLIC_<CONNECTOR>_* env set in .env.

// export * as services from './src/lib/core/connectors/litekart'
export * as services from './src/lib/core/connectors/vendure'
// export * as services from './src/lib/core/connectors/medusa'
// export * as services from './src/lib/core/connectors/saleor'

// Connectors without a Litekart API behind them read store details from static config instead.
// Merge store identity overrides here — name, logo, favicon, currency, menus, plugins,
// cssVariables — over the extracted defaults (src/lib/core/connectors/default-store.json).
//
// One value is not yours to flip: `isEmailMandatory` is forced true for those connectors (see
// src/lib/core/connectors/static-store.ts). Setting it false here does not make the email optional,
// it only defers the failure to the payment step — on Vendure, `State Transition Failed: Cannot
// transition Order to the "ArrangingPayment" state without Customer details`, with the shopper
// stranded there.
export default {}
