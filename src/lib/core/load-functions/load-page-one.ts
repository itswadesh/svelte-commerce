import { PageService } from '$lib/core/services'
import { error } from '@sveltejs/kit';

export function getOnePage(pageSlug: string) {
  return async ({ fetch }: { fetch: typeof globalThis.fetch }) => {
    try {
      const pageService = new PageService(fetch)
      const page = await pageService.getOne(pageSlug)
      return { page }
    } catch (e: any) {
      console.error(e)
      error(404, "Page Not Found")
    }
  }
}
