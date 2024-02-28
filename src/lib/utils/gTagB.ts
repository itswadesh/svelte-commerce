import { ga } from '@beyonk/svelte-google-analytics'
import { fb } from '@beyonk/svelte-facebook-pixel'

export const fireGTagEvent = (event_name, data) => {
	if (!data) data = {}
	data.items = data.items || []
	const items = data.items.map((item) => {
		item.discount = item.discount || item.coupon || {}
		return {
			item_id: item.sku ? item.sku : item._id,
			item_name: item.name,
			affiliation: item.vendorBusinessName,
			item_brand: item.brandName,
			item_category: item.categoryName,
			price: item.price,
			quantity: item.qty,
			coupon: item.discount?.code,
			currency: 'INR',
			discount: item.discount?.amount,
			savings: item.savings,
			index: 0
		}
	})
	const viewCartData = {
		currency: 'INR',
		value: data.total,
		items
	}

	switch (event_name) {
		case 'add_to_cart':
			// @ts-ignore
			ga.addEvent('add_to_cart', viewCartData)
			fb.track('add_to_cart', viewCartData)
			break

		case 'view_cart':
			// @ts-ignore
			ga.addEvent('view_cart', viewCartData)
			fb.track('view_cart', viewCartData)
			break

		case 'remove_from_cart':
			// @ts-ignore
			ga.addEvent('remove_from_cart', viewCartData)
			fb.track('remove_from_cart', viewCartData)
			break

		case 'begin_checkout':
			// @ts-ignore
			ga.addEvent('begin_checkout', viewCartData)
			fb.track('begin_checkout', viewCartData)
			break

		case 'purchase':
			const purchaseData = {
				transaction_id: data.orderNo,
				affiliation: items[0]?.vendorBusinessName,
				value: data.total,
				tax: data.tax,
				shipping: data.shipping?.charge,
				currency: 'INR',
				coupon: data.coupon?.code,
				items
			}
			// @ts-ignore
			ga.addEvent('purchase', purchaseData)
			fb.track('purchase', purchaseData)
			break
	}
}
