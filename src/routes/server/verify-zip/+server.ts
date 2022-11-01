import { gett } from '$lib/utils'
export async function POST({ request, cookies, locals }) {
	const formData = Object.fromEntries(await request.formData())
	const res = await gett(`pincodes/${formData.zip}`, request.headers.get('cookie'))
	if (res) {
		const zip = {
			hasReturnExchange: res.hasReturnExchange,
			deliveryDays: res.deliveryDays,
			pincode: res['Pincode'],
			hasCOD: res.hasCOD
		}
		locals.zip = zip
		cookies.set('zip', JSON.stringify(zip), { path: '/' })
	}
	return new Response(JSON.stringify(res))
}
