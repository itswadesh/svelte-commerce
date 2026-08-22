import { env } from '$env/dynamic/public'
import { env as privateEnv } from '$env/dynamic/private'
import type { RequestHandler } from '@sveltejs/kit'
// Resolve StoreService through the services barrel, never a connector package by name: the
// active connector is whichever one kitcommerce.config.ts exports, and naming
// @misiki/litekart-connector here would break the build for anyone who swapped it for their
// own backend's connector.
import { StoreService } from '$lib/core/services'

export const GET: RequestHandler = async ({ fetch, cookies }) => {
  const storeId = cookies.get('litekart_store_id') || ''

  const storeService = new StoreService(fetch)
  const data = (await storeService.get(`/api/stores/${storeId}`)) as { sitemap: string }
  let sitemapPath = data?.sitemap

  if (!sitemapPath) {
    const xmlError = `<?xml version="1.0" encoding="UTF-8"?>
      <error>
        <message>Sitemap not found. Generate one via Settings > Sitemaps in the admin dashboard.</message>
      </error>`

    return new Response(xmlError, {
      status: 404,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8'
      }
    })
  }

  // Extract path starting from /sitemaps/ onwards (excluding host and bucket prefixes)
  const match = sitemapPath.match(/\/sitemaps\/.*/)
  if (match) {
    sitemapPath = match[0]
  }

  let baseUrl =
    env.PUBLIC_SITEMAP_URL ||
    `https://${privateEnv.S3_BUCKET_NAME}.s3.${privateEnv.S3_REGION}.amazonaws.com`

  if (baseUrl.endsWith('/')) {
    baseUrl = baseUrl.slice(0, -1)
  }

  const destinationUrl = `${baseUrl}${sitemapPath}`

  try {
    const response = await fetch(destinationUrl)

    const headers = new Headers(response.headers)
    headers.delete('content-encoding')
    headers.delete('content-length')

    return new Response(response.body, {
      status: response.status,
      headers
    })
  } catch (error) {
    console.error('Failed to fetch sitemap:', error)
    return new Response('Sitemap not found', { status: 404 })
  }
}

