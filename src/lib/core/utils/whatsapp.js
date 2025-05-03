export const WHATSAPP_NUMBER = '+918249028220'

export function getWhatsAppLink(message = "Hi! I'm interested in Litekart marketplace platform.") {
	const encodedMessage = encodeURIComponent(message)
	return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`
}

export function openWhatsApp(message) {
	const url = getWhatsAppLink(message)
	window.open(url, '_blank')
}
