// Pick exactly one. This line is the whole backend switch: the rest of the app reaches services
// through `$lib/core/services`, never a connector package by name, so pointing it at another
// module in src/lib/core/connectors is all it takes to run the same storefront on another backend.
// Swap the connector package in package.json to match, so installs and Docker builds resolve it.
//
// Each module re-exports its @misiki/*-connector and exports a `connectorName` marker.
// Every backend but Litekart also needs a PUBLIC_<CONNECTOR>_* env set in .env;
// `src/lib/core/connectors/init.ts` holds one row per backend and fails at boot naming the
// variable when it is missing, or set while a different connector is active. See
// docs/<CONNECTOR>.md for that backend's variables and its Store identity section.

// export * as services from './src/lib/core/connectors/litekart'
// export * as services from './src/lib/core/connectors/bagisto'
// export * as services from './src/lib/core/connectors/broadleaf'
// export * as services from './src/lib/core/connectors/commercetools'
// export * as services from './src/lib/core/connectors/cs-cart'
// export * as services from './src/lib/core/connectors/evershop'
export * as services from './src/lib/core/connectors/gocommerce'
// export * as services from './src/lib/core/connectors/magento'
// export * as services from './src/lib/core/connectors/medusa'
// export * as services from './src/lib/core/connectors/nopcommerce'
// export * as services from './src/lib/core/connectors/opencart'
// export * as services from './src/lib/core/connectors/orocommerce'
// export * as services from './src/lib/core/connectors/oscar'
// export * as services from './src/lib/core/connectors/prestashop'
// export * as services from './src/lib/core/connectors/saleor'
// export * as services from './src/lib/core/connectors/sharetribe'
// export * as services from './src/lib/core/connectors/shopify'
// export * as services from './src/lib/core/connectors/shopware'
// export * as services from './src/lib/core/connectors/shuup'
// export * as services from './src/lib/core/connectors/spree'
// export * as services from './src/lib/core/connectors/spryker'
// export * as services from './src/lib/core/connectors/swell'
// export * as services from './src/lib/core/connectors/sylius'
// export * as services from './src/lib/core/connectors/vendure'
// export * as services from './src/lib/core/connectors/virto'
// export * as services from './src/lib/core/connectors/woocommerce'
// export * as services from './src/lib/core/connectors/x-cart'

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
