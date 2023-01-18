import { websiteName, description, domain, id } from '$lib/config'
import { date } from '$lib/utils'
import { gett } from '$lib/utils/server'

export async function GET() {
	const resP = await gett(`es/products?store=${id}`)
	const products = resP?.data?.map((product) => {
		product = {
			name: product._source.name.replace('&', ''),
			slug: product._source.slug,
			description: product._source.description,
			updatedAt: product._source.updatedAt
		}
		return product
	})
	if (!products) return new Response(undefined, { status: 404 })
	const body = xml(products)

	const headers = {
		'Cache-Control': 'max-age=0, s-maxage=3600',
		'Content-Type': 'application/xml'
	}
	return {
		headers,
		body
	}
}

const xml = (
	products
) => `<rss xmlns:dc="https://purl.org/dc/elements/1.1/" xmlns:content="https://purl.org/rss/1.0/modules/content/" xmlns:atom="https://www.w3.org/2005/Atom" version="2.0">
  <channel>
    <title>${websiteName}</title>
    <link>${domain}</link>
    <description>${description}</description>
    ${products
			.map(
				(product) =>
					`
        <item>
          <title>${product?.name || ''}</title>
          <description>${product?.description || ''}</description>
          <link>${domain}/${product?.slug}/</link>
          <pubDate>${date(product?.updatedAt)}</pubDate>
          <content:encoded>${product?.previewHtml} 
            <div style="margin-top: 50px; font-style: italic;">
              <strong>
                <a href="${domain}/${product.slug}" aria-label="Click to keep reading">
                  Keep Reading
                </a>
              </strong>  
            </div>
          </content:encoded>
        </item>
      `
			)
			.join('')}
  </channel>
</rss>`
