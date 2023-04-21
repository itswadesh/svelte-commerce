<script>
import { page } from '$app/stores'
import noCancle from '$lib/assets/no/cancle.png'
import PrimaryButton from '$lib/ui/PrimaryButton.svelte'
import SEO from '$lib/components/SEO/index.svelte'

let seoProps = {
	title: `Payment Failure`,
	description: `Payment Failure`
}

$: paymentUrl = $page?.url?.searchParams.get('ref')
</script>

<SEO {...seoProps} />

<div class="min-h-screen w-full">
	<div class="flex flex-col items-center justify-center gap-5 py-20 text-center">
		<div>
			<img src="{noCancle}" alt="failed" class="h-auto w-20 object-contain object-top" />
		</div>

		<h1 class="text-xl font-bold sm:text-2xl md:text-3xl">Payment Failed!</h1>
		<a href="/cart" aria-label="Click to go back to payment method" data-sveltekit-preload-data>
			<PrimaryButton class="uppercase">Pay Again</PrimaryButton>
		</a>
	</div>
</div>
