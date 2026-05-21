import { StoreService } from '@misiki/litekart-connector'
import { error, redirect, type RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ fetch, cookies, url }) => {
  const storeId = cookies.get('litekart_store_id')
  const storeService = new StoreService(fetch)
  const data = await storeService.get(`/api/stores/${storeId}`)
  if (data?.sitemap)
	  redirect(302, data.sitemap)
  else
    error(404, 'Sitemap not found, you can generate sitemap through the admin dashboard.')
}
