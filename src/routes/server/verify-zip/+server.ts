import { getBySid } from '$lib/utils/server'
export async function POST({ request, cookies, locals }) {
	const formData = Object.fromEntries(await request.formData())
	const res = await getBySid(`pincodes/${formData.zip}`, cookies.get('connect.sid'))
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
