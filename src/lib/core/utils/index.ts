export * from '@misiki/kitcommerce-core/utils'

export const getCdnImageUrl = ({ src, IMAGE_CDN_URL, IMAGE_CDN_PROVIDER, NO_QUERY = false }) => {
	const possibleImageUrls = ['https://sparkinity.s3.eu-west-2.amazonaws.com']
	let originalImageUrl = src
	let shouldAttachCdn = false
	for (const i of possibleImageUrls) {
		if (src?.includes(i)) {
			originalImageUrl = src.replace(i, '')
			shouldAttachCdn = true
		}
	}
	if (shouldAttachCdn) {
		if (NO_QUERY) return originalImageUrl
		else return IMAGE_CDN_URL + originalImageUrl
	} else {
		return originalImageUrl
	}
}