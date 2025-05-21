<script lang="ts">
	import { paymentMethodService } from '$lib/core/services'
	import { injectAffirm } from '$lib/core/utils/affirm-injector'
	import { onMount } from 'svelte'
	import { toast } from 'svelte-sonner'

	interface Props {
		pageType: 'homepage' | 'landing' | 'search' | 'category' | 'product' | 'cart' | 'payment' | 'banner' | 'marketplace'
		class: 'affirm-as-low-as' | 'affirm-site-modal' | 'affirm-product-modal'
		amount: number
		promoId?: string | null
		sku?: string | null
		brand?: string | null
		category?: string | null
		color?: 'black' | 'white' | null
		logoType?: 'text' | 'symbol' | null
	}
	const { amount, pageType, promoId = null, class: klass, logoType = null, sku = null, brand = null, category = null, color = null }: Props = $props()

  async function loadAffirm() {
		try {
			const allPaymentMethods = await paymentMethodService.list({})
			const listOfPaymentMethods = allPaymentMethods.data || []

			const affirmPaymentMethod = listOfPaymentMethods.find((f) => f?.name?.toUpperCase?.() === 'AFFIRMPAY') || null
			if (affirmPaymentMethod) {
				// Should only proceed with Affirm initialization if country is USA
				injectAffirm(affirmPaymentMethod.apiKey, affirmPaymentMethod.isTest)
			}
		} catch (e: any) {
			toast.error(e.message || 'Failed to load affirm prequalify')
		}
	}

	onMount(loadAffirm)
</script>

<p
	class={klass}
	data-page-type={pageType}
	data-amount={amount * 100}
	data-sku={sku}
	data-promo-id={promoId}
	data-category={category}
	data-affirm-color={color}
	data-affirm-type={logoType}
	data-brand={brand}
></p>

<!--
	class={klass}
	data-amount={amount}
	data-page-type={pageType}
-->
