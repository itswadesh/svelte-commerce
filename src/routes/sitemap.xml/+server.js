import { domain, id } from '$lib/config'
import { getBySid } from '$lib/utils/server'
export async function GET() {
	const resP = await getBySid(`es/products?store=${id}`)
	const products = resP?.data?.map((product) => {
		product = {
			name: product._source.name.replace('&', ''),
			slug: product._source.slug,
			description: product._source.description,
			updatedAt: product._source.updatedAt
		}
		return product
	})
	const resPages = await getBySid(`pages?store=${id}`)
	const pages = resPages?.data?.map((page) => {
		page = {
			name: page._source.name.replace('&', ''),
			slug: page._source.slug,
			description: page._source.description,
			updatedAt: page._source.updatedAt
		}
		return page
	})
	if (!products) return new Response(undefined, { status: 404 })
	const body = sitemap(products, pages)

	const headers = {
		'Cache-Control': 'max-age=0, s-maxage=3600',
		'Content-Type': 'application/xml'
	}
	return {
		headers,
		body
	}
}

const sitemap = (products, pages) => `<?xml version="1.0" encoding="UTF-8" ?>
      <urlset
        xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="https://www.w3.org/1999/xhtml"
        xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
      >
      <url>
        <loc>${domain}</loc>
        <changefreq>daily</changefreq>
        <priority>0.7</priority>
      </url>
        ${products
					.map(
						(product) =>
							`
              <url>
                <loc>${domain}/${product.slug}</loc>
                <changefreq>daily</changefreq>
                <priority>0.7</priority>
              </url>
            `
					)
					.join('')} 
          ${products
						.map(
							(product) =>
								`
              <url>
                <loc>${domain}/${product.slug}</loc>
                <changefreq>daily</changefreq>
                <priority>0.7</priority>
              </url>
            `
						)
						.join('')}
      </urlset>
    `
