import { wwwProductsSlugLoad } from '$lib/core/load-functions/index.js'
import type { PageLoad } from './$types'

export const load: PageLoad = async (event) => {
  const [coreData, layoutRes] = await Promise.all([
    wwwProductsSlugLoad(event),
    event
      .fetch('/api/pages/product-detail')
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null),
  ])
  return {
    ...coreData,
    productDetailPage: layoutRes,
  }
}
