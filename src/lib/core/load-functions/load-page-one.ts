import { PageService } from '$lib/core/services'
import { error } from '@sveltejs/kit';

export function getOnePage(pageSlug: string) {
  return async ({ fetch, setHeaders }: { fetch: typeof globalThis.fetch, setHeaders: any }) => {
    try {
      setHeaders({
        'cache-control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400'
      })
      const pageService = new PageService(fetch)
      const page = await pageService.getOne(pageSlug)
      return { page }
    } catch (e: any) {
      console.error(e)
      error(404, "Page Not Found")
    }
  }
}
