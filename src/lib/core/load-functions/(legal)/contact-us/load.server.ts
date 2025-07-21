import { PageService } from '$lib/core/services'
import type { PageServerLoad } from '../../../../../routes/(legal)/contact-us/$types'
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ parent, fetch }) => {
  const pageService = new PageService(fetch)
  const page = await pageService.getOne('contact-us')
  if (page.status != 'published')
    error(404, {
      message: 'Page not found'
    })
  return { page }
}

