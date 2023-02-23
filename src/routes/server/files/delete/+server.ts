import { deleteFileFromS3 } from '$lib/utils/s3'

export async function POST({ request }) {
	const url = await request.headers.get('url')
	let deleted = false
	try {
		await deleteFileFromS3(url)
		deleted = true
	} catch (e) {
		deleted = false
		return new Response(String(e), { status: 400 })
	}
	return new Response(JSON.stringify({ deleted }))
}
