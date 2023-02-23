import { createDestinationFilePath, createUploadStream } from '$lib/utils/s3'
import dayjs from 'dayjs'
import { Readable } from 'stream'

export async function POST({ request }) {
	const contentType0 = request.headers.get('Content-Type')
	const body = request.body
	if(!body) throw "No image provided"
	const folderName = request.headers.get('folder')
	const extension = request.headers.get('extension')
	const contentType = contentType0 || 'image/png'
	const date = dayjs().format('YYYYMMDD')
	const folder = `stores/litekart/${folderName}`
	const filePath = await createDestinationFilePath(folder, `${date}.${extension}`)
	const stream = await Readable.from(body)
	const uploadStream = await createUploadStream(filePath, contentType)
	stream.pipe(uploadStream.writeStream)
	const result = await uploadStream.promise
	return new Response(JSON.stringify({ url: result.Location }))
}
