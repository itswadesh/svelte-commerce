import { PageService } from '$lib/core/services'
import type { PageServerLoad } from '../../../../../routes/(legal)/terms-and-conditions/$types'
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ fetch }) => {
  const pageService = new PageService(fetch)
  const page = await pageService.getOne('terms-and-conditions')
  if (page.status != 'published')
    error(404, {
      message: 'Page not found'
    })
  return { page }
}

