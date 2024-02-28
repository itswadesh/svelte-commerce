import { ZipService } from '$lib/services'

export async function POST({ request, cookies, locals }) {
	try {
		const formData = Object.fromEntries(await request.formData())
		const res = await ZipService.findZip({ zip: formData.zip, origin: locals.origin })
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
	} catch (e) {
		console.log('e', e)
		return new Response(JSON.stringify({}))
	}
}
