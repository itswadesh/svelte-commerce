import { ZipService } from '$lib/services'
import { services } from '@misiki/litekart-utils'
export async function POST({ request, cookies, locals }) {
	const formData = Object.fromEntries(await request.formData())
	const res = await services.ZipService.findZip({ zip: formData.zip, origin: locals.origin })
	let zip
	if (res) {
		zip = {
			hasReturnExchange: res.hasReturnExchange,
			deliveryDays: res.deliveryDays,
			pincode: res['Pincode'],
			hasCOD: res.hasCOD
		}
		locals.zip = zip
		cookies.set('zip', JSON.stringify(zip), { path: '/' })
	}
	return new Response(JSON.stringify(zip))
}
