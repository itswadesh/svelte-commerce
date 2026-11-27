import { redirect } from '@sveltejs/kit'

// There is no reels feed: the engine has no reels, and the connector's reelsService lists nothing, so
// the old page showed only its heading (docs/decisions.md, 2026-11-27). Old links land on the catalogue.
export const GET = () => redirect(301, '/products')
