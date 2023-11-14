import { error, redirect } from '@sveltejs/kit'
import { ProductService } from '$lib/services'

export const prerender = false

export async function load({ url, locals, cookies }) {
	const pid = url.searchParams.get('pid')
	const ref = url.searchParams.get('ref')

	let product

	try {
		product = await ProductService.fetchProduct({
			id: pid,
			storeId: locals.storeId,
			server: true,
			origin: locals.origin,
			sid: cookies.get('connect.sid')
		})

		if (!product) throw error(404, 'Product not found')

		return { ref, product }
	} catch (e) {
		if (e.status === 401 || e.status === 403) {
			throw redirect(307, '/auth/login')
		}

		throw error(e.status, e.message)
	}
}
