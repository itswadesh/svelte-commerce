<script lang="ts">
	import { getCartState } from '$lib/core/stores/cart.svelte.js'
	import SeoHeader from '$lib/core/components/plugins/seo-header.svelte'
	import { Button } from '$lib/components/ui/button'
	import { getProductState } from '$lib/core/stores/product.svelte.js'
	import { formatPrice } from '$lib/core/utils/index.js'
	import { ArrowLeft, AlertCircle, RefreshCw } from 'lucide-svelte'
	import { page } from '$app/state'

	let loadingPayment = $state(false)
	const cartState = getCartState()
	let { data } = $props()

	function handleRetry() {
		loadingPayment = true
		window.location.href = '/checkout/cart'
	}
</script>

<SeoHeader
	metaTitle="Payment Not Completed"
	metaDescription="We weren't able to process your payment. Your order has not been placed and you have not been charged."
/>

<div class="payment-failed-container">
	<div class="payment-failed-card">
		<div class="payment-failed-header">
			<div class="icon-wrapper">
				<AlertCircle size="48" class="text-destructive" />
			</div>
			<h1>Payment Not Completed</h1>
			<p>We weren't able to process your payment. Your order has not been placed and you have not been charged.</p>
		</div>

		<div class="action-buttons">
			<Button variant="outline" class="back-button" href="/">
				<ArrowLeft class="mr-2" size="16" />
				Continue Shopping
			</Button>

			<Button class="retry-button" onclick={handleRetry} disabled={loadingPayment}>
				{#if loadingPayment}
					<RefreshCw class="mr-2 h-4 w-4 animate-spin" />
					Redirecting...
				{:else}
					Try Payment Again
				{/if}
			</Button>
		</div>

		{#if cartState.cart?.lineItems?.length}
			<div class="order-summary">
				<h2>Order Summary</h2>
				<div class="items-list">
					{#each cartState.cart?.lineItems as { thumbnail, title, qty, price, variant, slug }}
						<div class="item">
							<a href={`/products/${slug}?variant_id=${variant.id}`} class="item-image">
								<img src={thumbnail || '/images/placeholder.png'} alt={title} />
							</a>
							<div class="item-details">
								<a href={`/products/${slug}`} class="item-title">{title}</a>
								<!-- {#if variant}
                  <div class="item-variant">{variant}</div>
                {/if} -->
								<div class="item-price-qty">
									<span> {formatPrice(price, page?.data?.store?.currency?.code)} </span>
									<span>×</span>
									<span>{qty}</span>
								</div>
							</div>
						</div>
					{/each}
				</div>

				<div class="price-summary">
					<div class="price-row">
						<span>Subtotal</span>
						<span>{formatPrice(cartState.cart?.subtotal, page?.data?.store?.currency?.code)}</span>
					</div>

					<!-- Uncomment if shipping is available -->
					<!-- <div class="price-row">
            <span>Shipping</span>
            <span>{formatPrice(cartState.cart?.shipping_total, page?.data?.store?.currency?.code)}</span>
          </div> -->

					<div class="price-row total">
						<span>Total</span>
						<span>{formatPrice(cartState.cart?.total, page?.data?.store?.currency?.code)}</span>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.payment-failed-container {
		min-height: calc(100vh - 100px);
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 2rem 1rem;
		background-color: #f9fafb;
	}

	.payment-failed-card {
		background: white;
		border-radius: 0.75rem;
		box-shadow:
			0 4px 6px -1px rgba(0, 0, 0, 0.1),
			0 2px 4px -1px rgba(0, 0, 0, 0.06);
		width: 100%;
		max-width: 600px;
		overflow: hidden;
	}

	.payment-failed-header {
		padding: 2rem;
		text-align: center;
		border-bottom: 1px solid #e5e7eb;
	}

	.icon-wrapper {
		margin: 0 auto 1rem;
		display: flex;
		justify-content: center;
	}

	.payment-failed-header h1 {
		font-size: 1.5rem;
		font-weight: 700;
		margin-bottom: 0.75rem;
		color: #1f2937;
	}

	.payment-failed-header p {
		color: #4b5563;
		max-width: 450px;
		margin: 0 auto;
		line-height: 1.5;
	}

	.order-summary {
		padding: 1.5rem 2rem;
		border-bottom: 1px solid #e5e7eb;
	}

	.order-summary h2 {
		font-size: 1.25rem;
		font-weight: 600;
		margin-bottom: 1rem;
		color: #1f2937;
	}

	.items-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.item {
		display: flex;
		gap: 1rem;
	}

	.item-image {
		width: 60px;
		height: 60px;
		flex-shrink: 0;
		border-radius: 0.375rem;
		overflow: hidden;
		border: 1px solid #e5e7eb;
	}

	.item-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.item-details {
		flex: 1;
	}

	.item-name {
		font-weight: 500;
		color: #1f2937;
		margin-bottom: 0.25rem;
	}

	.item-variant {
		font-size: 0.875rem;
		color: #6b7280;
		margin-bottom: 0.5rem;
	}

	.item-price-qty {
		display: flex;
		gap: 0.5rem;
		font-size: 0.875rem;
		color: #4b5563;
	}

	.price-summary {
		border-top: 1px solid #e5e7eb;
		padding-top: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.price-row {
		display: flex;
		justify-content: space-between;
		color: #4b5563;
	}

	.price-row.total {
		font-weight: 600;
		color: #1f2937;
		padding-top: 0.75rem;
		margin-top: 0.25rem;
		border-top: 1px dashed #e5e7eb;
	}

	.action-buttons {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding: 1.5rem 2rem;
		border-bottom: 1px solid #e5e7eb;
	}

	@media (min-width: 640px) {
		.action-buttons {
			flex-direction: row;
			justify-content: space-between;
		}

		.back-button,
		.retry-button {
			min-width: 180px;
		}
	}

	.retry-button {
		background-color: #10b981;
	}

	.retry-button:hover {
		background-color: #059669;
	}
</style>
