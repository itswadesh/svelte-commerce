import { getMedusajsApi } from 'lib/utils/server'

export const fetchGiftCard = async ({ code }: any) => {
	const res = await getMedusajsApi(`gift-cards/${code}`)
	return res?.gift_card || {}
}
