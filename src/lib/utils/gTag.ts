export const fireGTagEvent = (event_name, data) => {
	let items

	const formatDate = (date) => {
		const padZero = (num) => num.toString().padStart(2, '0')
		return `${padZero(date.getHours())}:${padZero(date.getMinutes())}`
	}

	const getDayOfWeek = (date) =>
		['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()]

	const getMonthName = (date) =>
		[
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December'
		][date.getMonth()]

	const now = new Date()

	const eventTime = formatDate(now)
	const eventDay = getDayOfWeek(now)
	const eventMonth = getMonthName(now)

	if (!data) data = {}
	data.items = data.items || []
	items = data.items.map((item) => {
		item.discount = item.discount || item.coupon || {}
		return {
			item_id: item.sku ? item.sku : item._id,
			item_name: item.name,
			affiliation: item.vendorBusinessName,
			item_brand: item.brandName,
			item_category: item.category,
			price: item.price + '.00',
			quantity: item.qty,
			coupon: item.discount?.code,
			currency: 'INR',
			discount: item.discount?.amount,
			savings: item.savings,
			index: 0
		}
	})

	if (event_name == 'view_item') {
		items = {
			item_id: data.sku ? data.sku : data._id,
			item_name: data.name,
			affiliation: data.vendor?.BusinessName,
			item_brand: data.brand?.name,
			item_category: data.category?.name,
			price: data.price + '.00',
			quantity: 1,
			currency: 'INR',
			index: 0
		}
	}

	if (event_name == 'view_item_list') {
		items = data.items.map((item) => {
			item.discount = item.discount || item.coupon || {}
			return {
				item_id: item.sku ? item.sku : item._id,
				item_name: item.name,
				affiliation: item.vendorBusinessName,
				item_brand: item.brandName,
				item_category: item.category?.name,
				price: item.price + '.00',
				quantity: item.qty,
				coupon: item.discount?.code,
				currency: 'INR',
				discount: item.discount?.amount,
				savings: item.savings,
				index: 0
			}
		})
	}

	if (event_name === 'remove_from_cart') {
		items = {
			item_id: data.sku ? data.sku : data._id,
			item_name: data.name,
			affiliation: data.vendor?.BusinessName,
			item_brand: data.brand?.name,
			// item_category: data.category.name,
			price: data.price + '.00',
			quantity: data.qty,
			currency: 'INR',
			index: 0
		}
	}

	switch (event_name) {
		case 'add_to_cart':
			// @ts-ignore
			gtag('event', 'add_to_cart', {
				currency: 'INR',
				value: data.total,
				items,
				event_time: eventTime,
				event_day: eventDay,
				event_month: eventMonth
			})
			break

		case 'view_cart':
			// @ts-ignore
			gtag('event', 'view_cart', {
				currency: 'INR',
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
				currency: 'INR',
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
				currency: 'INR',
				item_list_id: data.category_id,
				item_list_name: data.category_name,
				total_items_id: [`${data.items.map((item) => `'${item._id}'`)}`],
				items,
				event_time: eventTime,
				event_day: eventDay,
				event_month: eventMonth
			})
			break

		case 'remove_from_cart':
			// @ts-ignore
			gtag('event', 'remove_from_cart', {
				currency: 'INR',
				value: data.price,
				items,
				event_time: eventTime,
				event_day: eventDay,
				event_month: eventMonth
			})
			break

		case 'begin_checkout':
			// @ts-ignore
			gtag('event', 'begin_checkout', {
				currency: 'INR',
				value: data.total,
				items,
				event_time: eventTime,
				event_day: eventDay,
				event_month: eventMonth
			})
			break

		case 'add_payment_info':
			// @ts-ignore
			gtag('event', 'add_payment_info', {
				currency: 'INR',
				value: data.total,
				shipping: data.shipping?.charge,
				items,
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
				affiliation: items[0]?.vendorBusinessName,
				value: data.amount?.total,
				tax: data.tax,
				shipping: data.amount?.shipping,
				currency: 'INR',
				coupon: data.coupon?.code,
				items,
				event_time: eventTime,
				event_day: eventDay,
				event_month: eventMonth
			})
	}
}
