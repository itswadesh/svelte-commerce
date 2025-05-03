// Declare gtag as a global function
declare global {
	interface Window {
		gtag: (...args: any[]) => void
	}
}

import { page } from '$app/state'

// Reference gtag from window object
const gtag = typeof window !== 'undefined' ? window.gtag : undefined

export const fireGTagEvent = (event_name: string, data: any) => {
	let items

	const formatDate = (date: Date) => {
		const padZero = (num: number) => num.toString().padStart(2, '0')
		return `${padZero(date.getHours())}:${padZero(date.getMinutes())}`
	}

	const getDayOfWeek = (date: Date) => ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()]

	const getMonthName = (date: Date) =>
		['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][date.getMonth()]

	const now = new Date()

	const eventTime = formatDate(now)
	const eventDay = getDayOfWeek(now)
	const eventMonth = getMonthName(now)

	if (!data) data = {}
	data.items = data.items || []
	items = data.items.map((item: any, idx: number) => {
		if (!item) return
		item.discount = item?.discount || item?.coupon || {}
		return {
			item_id: item.sku ? item.sku : item._id,
			item_name: item.name,
			affiliation: item.vendorBusinessName || item.vendor?.BusinessName || item.vendor?.business_name,
			item_brand: item.brandName,
			item_category: item.category?.name || item.category,
			price: item.price,
			quantity: item.qty,
			coupon: item.discount?.code,
			currency: page?.data?.store?.currency?.code,
			discount: item.discount?.amount,
			savings: item.savings,
			index: idx
		}
	})

	if (event_name == 'view_item') {
		items = {
			item_id: data.sku ? data.sku : data.id,
			item_name: data.title,
			affiliation: data.vendor?.BusinessName || data.vendorBusinessName || data.vendor?.business_name,
			item_brand: data.brand?.name,
			item_category: data.category?.name,
			price: data.price,
			quantity: data.qty,
			currency: page?.data?.store?.currency?.code,
			index: 0
		}
	}

	if (event_name == 'view_item_list') {
		items = data.items.map((item: any) => {
			item.discount = item.discount || item.coupon || {}
			return {
				item_id: item.sku ? item.sku : item.id,
				item_name: item.title,
				affiliation: item.vendorBusinessName,
				item_brand: item.brandName,
				item_category: item.category?.name,
				price: item.price,
				quantity: item.qty,
				coupon: item.discount?.code,
				currency: page?.data?.store?.currency?.code,
				discount: item.discount?.amount,
				savings: item.savings,
				index: 0
			}
		})
	}

	// if (event_name === 'remove_from_cart') {
	//     items = {
	//         item_id: data.sku ? data.sku : data._id,
	//         item_name: data.name,
	//         affiliation: data.vendor?.BusinessName,
	//         item_brand: data.brand?.name,
	//         // item_category: data.category.name,
	//         price: data.price,
	//         quantity: data.qty,
	//         currency: page?.data?.store?.currency?.code,
	//         index: 0
	//     }
	// }
	if (gtag) {
		switch (event_name) {
			case 'add_to_cart':
				// @ts-ignore
				gtag('event', 'add_to_cart', {
					currency: page?.data?.store?.currency?.code,
					value: data.total,
					quantity: data.qty,
					affiliation: data.vendorBusinessName || data.vendor?.BusinessName || data.vendor?.business_name,
					items,
					user_id: data.user?.id,
					user_name: data.user?.name,
					user_email: data.user?.email,
					event_time: eventTime,
					event_day: eventDay,
					event_month: eventMonth
				})
				break

			case 'view_cart':
				// @ts-ignore
				gtag('event', 'view_cart', {
					currency: page?.data?.store?.currency?.code,
					value: data.total,
					items,
					event_time: eventTime,
					event_day: eventDay,
					event_month: eventMonth
				})
				break

			case 'view_item':
				// @ts-ignore
				gtag('event', 'view_item', {
					currency: page?.data?.store?.currency?.code,
					value: data.price,
					items,
					event_time: eventTime,
					event_day: eventDay,
					event_month: eventMonth
				})
				break

			case 'view_item_list':
				// @ts-ignore
				gtag('event', 'view_item_list', {
					currency: page?.data?.store?.currency?.code,
					item_list_id: data.category_id,
					item_list_name: data.category_name,
					total_items_id: [`${data.items.map((item: any) => `'${item._id}'`)}`],
					items,
					event_time: eventTime,
					event_day: eventDay,
					event_month: eventMonth
				})
				break

			case 'remove_from_cart':
				// @ts-ignore
				gtag('event', 'remove_from_cart', {
					currency: page?.data?.store?.currency?.code,
					value: data.price,
					items,
					affiliation: data.vendorBusinessName || data.vendor?.BusinessName || data.vendor?.business_name,
					event_time: eventTime,
					event_day: eventDay,
					event_month: eventMonth
				})
				break

			case 'begin_checkout':
				const beginCheckoutData = {
					currency: page?.data?.store?.currency?.code,
					value: data.total,
					items,
					affiliation: data.brand_name,
					retailer_id: data.retailer.id,
					retailer_name: data.retailer.name,
					retailer_email: data.retailer.email,
					event_time: eventTime,
					event_day: eventDay,
					event_month: eventMonth
				}
				// @ts-ignore
				gtag('event', 'begin_checkout', beginCheckoutData)
				break

			case 'add_payment_info':
				// @ts-ignore
				gtag('event', 'add_payment_info', {
					currency: page?.data?.store?.currency?.code,
					value: data.total,
					shipping: data.shipping?.charge,
					items,
					retailer_id: data.retailer.id,
					retailer_name: data.retailer.name,
					retailer_email: data.retailer.email,
					event_time: eventTime,
					event_day: eventDay,
					event_month: eventMonth
				})
				break

			case 'search':
				// @ts-ignore
				gtag('event', 'search', {
					search_term: data.search_term
				})
				break

			case 'purchase':
				// @ts-ignore
				gtag('event', 'purchase', {
					transaction_id: data.orderNo,
					affiliation: items[0]?.vendorBusinessName || items[0]?.vendor?.BusinessName || items[0]?.vendor?.business_name,
					value: data.amount?.total,
					tax: data.tax,
					shipping: data.amount?.shipping,
					currency: page?.data?.store?.currency?.code,
					coupon: data.coupon?.code,
					items,
					retailer_id: data.retailer.id,
					retailer_name: data.retailer.name,
					retailer_email: data.retailer.email,
					event_time: eventTime,
					event_day: eventDay,
					event_month: eventMonth
				})
				break

			case 'credit_request':
				// @ts-ignore
				gtag('event', 'credit_request', {
					currency: page?.data?.store?.currency?.code,
					company_id: data.company_id,
					company_name: data.company_name,
					credit: data.credit,
					event_time: eventTime,
					event_day: eventDay,
					event_month: eventMonth
				})
				break

			default:
				// @ts-ignore
				gtag('event', event_name, data)
				// console.log('event_name', event_name, data)
				break
		}
	}
}
