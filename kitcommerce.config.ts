// Pick exactly one. This line is the whole backend switch: the rest of the app reaches services
// through `$lib/core/services`, never a connector package by name, so pointing it at another
// module in src/lib/core/connectors is all it takes to run the same storefront on another backend.
// Swap the connector package in package.json to match, so installs and Docker builds resolve it.
//
// Each module re-exports its @misiki/*-connector and exports a `connectorName` marker. The three
// backends below need a PUBLIC_<CONNECTOR>_* env set in .env too; `src/lib/core/connectors/init.ts`
// fails at boot naming the variable when one is missing or set against the wrong connector.
//
// Every other backend is switched by pointing this line straight at its package —
// `export * as services from '@misiki/bagisto-connector'` — with no module of its own here. Each
// connector now carries its own `setStaticStore`, `serveRestLocally` and `connectorName`, and
// init.ts registers the first two on whatever is active. See docs/<CONNECTOR>.md.

export * as services from './src/lib/core/connectors/litekart'
// export * as services from './src/lib/core/connectors/vendure'
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
