<style>
.animate-slide-in-left {
	animation: slideInLeft 0.3s ease-out forwards;
}

.animate-bounce {
	animation: bounce 0.3s ease-out forwards;
}

@keyframes slideInLeft {
	from {
		transform: translateX(100%);
	}
	to {
		transform: translateX(0);
	}
}

@keyframes bounce {
	0%,
	100% {
		transform: translateY(0);
	}
	50% {
		transform: translateY(-20px);
	}
}
</style>

<script>
import { onMount } from 'svelte'
import lightning from '$lib/assets/payment-processing/lightning.gif'
import list from '$lib/assets/payment-processing/list.gif'
import tick from '$lib/assets/payment-processing/tick.gif'

export let loadingForPaymentProcessingSteps = false

let paymentProcessingStep = 1

onMount(() => {
	setTimeout(() => {
		paymentProcessingStep = 2
		setTimeout(() => {
			paymentProcessingStep = 3
			loadingForPaymentProcessingSteps = false
		}, 1000)
	}, 1000)
})
</script>

<div
	class="fixed h-screen w-screen inset-0 flex justify-center items-center bg-black bg-opacity-60 p-5 sm:p-10">
	{#if paymentProcessingStep === 1}
		<div
			class="h-60 w-60 bg-white p-4 flex flex-col gap-4 items-center justify-center text-center font-semibold rounded transform translate-x-full animate-slide-in-left">
			<img src="{lightning}" alt="" class="h-8 w-auto object-contain object-center" />

			<span> Fetching your order info </span>
		</div>
	{:else if paymentProcessingStep === 2}
		<div
			class="h-60 w-60 bg-white p-4 flex flex-col gap-4 items-center justify-center text-center font-semibold rounded transform animate-bounce">
			<img src="{list}" alt="" class="h-8 w-auto object-contain object-center" />

			<span>Filling your information</span>
		</div>
	{:else}
		<div
			class="h-60 w-60 bg-white p-4 flex flex-col gap-4 items-center justify-center text-center font-semibold rounded transform animate-bounce">
			<img src="{tick}" alt="" class="h-8 w-auto object-contain object-center" />

			<span>All set</span>
		</div>
	{/if}
</div>
