<script>
import SEO from '$lib/components/SEO/index.svelte'
import LazyImg from '$lib/components/Image/LazyImg.svelte'
import PrimaryButton from '$lib/ui/PrimaryButton.svelte'
import { page } from '$app/stores'

let seoProps = {
	title: `Failure`,
	description: `Failure`
}

$: paymentUrl = $page?.url?.searchParams.get('ref')
</script>

<SEO {...seoProps} />

<div class="min-h-screen w-full">
	<div class="flex flex-col items-center justify-center gap-5 py-20 text-center">
		<div>
			<LazyImg src="/no/cancle.png" alt="failed" class="h-auto w-20 object-contain object-top" />
		</div>

		<h1 class="text-xl font-bold sm:text-2xl md:text-3xl">Payment Failed!</h1>

		<a href="{paymentUrl}" aria-label="Click to go back to payment methode" sveltekit:prefetch>
			<PrimaryButton class="uppercase">Pay Again</PrimaryButton>
		</a>
	</div>
</div>
