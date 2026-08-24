// Litekart needs no service overrides: every endpoint the other modules in this directory stub out
// — `/api/stores/public-details`, `/api/pages/*`, `/api/menu`, `/api/ms-autocomplete/*`, wishlist,
// coupons, the Conversational Shopping assistant — is served by the Litekart API itself. This
// module exists so `kitcommerce.config.ts` selects every backend the same way: one path under
// src/lib/core/connectors, never a connector package by name.
export * from '@misiki/litekart-connector'

// The marker every module in this directory exports. `init.ts` uses it to reject a
// PUBLIC_<CONNECTOR>_* env set against the wrong connector; `/health` uses it to pick which env is
// required; the assistant service uses it to skip the Litekart-only assistant API on other
// backends. Store identity is unaffected — on Litekart it comes live from the API, so
// static-store.ts and the kitcommerce.config.ts default export stay out of the picture.
export const connectorName = 'litekart'
