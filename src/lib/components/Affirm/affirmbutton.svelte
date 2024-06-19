<!-- src/components/AffirmButton.svelte -->
<script>
const orderDetails = {
	merchant: {
		user_confirmation_url: 'http://localhost:6968/confirm',
		user_cancel_url: 'http://localhost:6968/cancel',
		public_api_key: 'KYTB4NGNPWXHWVTZ',
		user_confirmation_url_action: 'POST',
		name: 'My merchant brand name'
	},
	shipping: {
		name: { first: 'Joe', last: 'Doe' },
		address: {
			line1: '633 Folsom St',
			line2: 'Floor 7',
			city: 'San Francisco',
			state: 'CA',
			zipcode: '94107',
			country: 'USA'
		},
		phone_number: '4153334567',
		email: 'joedoe@123fakestreet.com'
	},
	billing: {
		name: { first: 'Joe', last: 'Doe' },
		address: {
			line1: '633 Folsom St',
			line2: 'Floor 7',
			city: 'San Francisco',
			state: 'CA',
			zipcode: '94107',
			country: 'USA'
		},
		phone_number: '4153334567',
		email: 'joedoe@123fakestreet.com'
	},
	items: [
		{
			display_name: 'Awesome Pants',
			sku: 'ABC-123',
			unit_price: 10000,
			qty: 3,
			item_image_url: 'http://merchantsite.com/images/awesome-pants.jpg',
			item_url: 'http://merchantsite.com/products/awesome-pants.html',
			categories: [
				['Home', 'Bedroom'],
				['Home', 'Furniture', 'Bed']
			]
		}
	],
	discounts: {
		RETURN5: { discount_amount: 500, discount_display_name: 'Returning customer 5% discount' },
		PRESDAY10: { discount_amount: 1000, discount_display_name: "President's Day 10% off" }
	},
	metadata: { shipping_type: 'UPS Ground', mode: 'modal' },
	order_id: 'JKLMO4321',
	currency: 'USD',
	financing_program: 'flyus_3z6r12r',
	shipping_amount: 1000,
	tax_amount: 600,
	total: 30100
}

function openAffirmCheckout() {
	console.log('Affirm object:', affirm)
	try {
		affirm.checkout(orderDetails)
		affirm.checkout.open({
			onFail: function (error) {
				console.error('Affirm checkout failed:', error)
			}
		})
		console.log('Affirm checkout initiated.')
	} catch (error) {
		console.error('Error initiating Affirm checkout:', error)
	}
}
</script>

<button on:click="{openAffirmCheckout}">Pay with Affirm</button>
