import { describe, expect, it, vi } from 'vitest'
import { skipMissingShelves } from '../src/lib/core/connectors/missing-shelves'

function services(collectionSlugs: string[] | Error) {
	const products = {
		list: vi.fn(async (args: object) => ({ from: 'list', args })),
		listFeaturedProducts: vi.fn(async (_args?: object) => ({ from: 'featured' })),
		listTrendingProducts: vi.fn(async (_args?: object) => ({ from: 'trending' }))
	}
	const collections = {
		list: vi.fn(async () => {
			if (collectionSlugs instanceof Error) throw collectionSlugs
			return { data: collectionSlugs.map((slug) => ({ slug })) }
		})
	}
	skipMissingShelves(products as never, collections as never)
	return { products, collections }
}

describe('skipMissingShelves', () => {
	it('goes straight to the newest products for a shelf the store has no collection for', async () => {
		const { products, collections } = services(['summer'])
		expect(await products.listFeaturedProducts({ page: 1, sort: '-createdAt' } as never)).toEqual({
			from: 'list',
			args: { page: 1, sort: '-createdAt', limit: undefined }
		})
		expect(await products.listTrendingProducts({ page: 2 } as never)).toMatchObject({ from: 'list' })
		expect(collections.list).toHaveBeenCalledTimes(1)
	})

	it('asks for a shelf the store has', async () => {
		const { products } = services(['featured'])
		expect(await products.listFeaturedProducts({ page: 1 } as never)).toEqual({ from: 'featured' })
		expect(await products.listTrendingProducts({ page: 1 } as never)).toMatchObject({ from: 'list' })
	})

	it('asks for every shelf when the collections cannot be listed', async () => {
		const { products } = services(new Error('down'))
		expect(await products.listFeaturedProducts({} as never)).toEqual({ from: 'featured' })
		expect(await products.listTrendingProducts({} as never)).toEqual({ from: 'trending' })
	})
})
