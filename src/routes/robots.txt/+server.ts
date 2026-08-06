import { robotsTxt } from '@misiki/kitcommerce-core/request-handlers'

// Rules live in core so every storefront cloned from this template inherits them; only the
// sitemap location differs per store.
export const GET = robotsTxt((domain) => `https://${domain}/sitemaps/${domain}-sitemaps/sitemap_index.xml`)
