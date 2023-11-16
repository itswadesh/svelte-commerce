<script>
import { browser } from '$app/environment'
import { page } from '$app/stores'
import SEO from '$lib/components/SEO/index.svelte'
// import { storeStore } from '$lib/store/store'
import { onMount } from 'svelte'

let seoProps = {
	title: `Payments returns`,
	description: `Payments returns`
}
$: store = $page.data?.store

// let store = {}
// onMount(() => {
// 	if (browser) {
// 		storeStore.subscribe((value) => (store = value))
// 	}
// })
</script>

<SEO {...seoProps} />

<section class="min-h-screen px-3 py-5 sm:p-10">
	<div class="container mx-auto w-full max-w-6xl">
		<!-- Payments & Returns -->

		<h1 class="mb-5 text-center font-serif text-2xl font-medium sm:mb-10 md:text-3xl lg:text-4xl">
			Payments & Returns
		</h1>

		<ul class="flex flex-col gap-5 text-justify text-sm sm:text-base">
			<li>
				<h6 class="mb-5 font-semibold">PAYMENTS</h6>

				<p class="text-zinc-500">
					{store?.websiteName} accepts Debit Cards, Credit Cards, NetBanking & Wallets for payments.
				</p>
			</li>

			<li>
				<h6 class="mb-5 font-semibold">SHIPPING</h6>

				<p class="text-zinc-500">
					{store?.websiteName} offers to ship to cities all over India. Customers usually receive their
					orders within 7-8 working days. The customer is responsible for any import duty that may be
					levied upon their order. <br /> <br />

					If you have any questions about the expected delivery period for your address, please
					email us at {store?.websiteEmail} <br /> <br />

					Once your {store?.domain} order ships it must go to the address provided at the time you place
					your order. If you cannot receive or pick up your order after three attempts by the courier,
					it will come back to our warehouse. <br /> <br />

					Any refund against RTO orders will be not initiated, You can Request Us to Re-Ship it with
					New Actual Address & Contact Details. We will reship it on next working Day.
				</p>
			</li>

			<li>
				<h6 class="mb-5 font-semibold">RETURNS</h6>

				<div class="text-zinc-500">
					{store?.websiteName} offers a replacement guarantee only if the product received is damaged/defective.
					Please get in touch with us at {store?.websiteEmail} within 3 days of receiving your order
					if you would like to have it replaced. We will provide a shipping address that you can ship
					your order back to.
					{store?.websiteName} will dispatch a replacement as soon as we receive your returned order.<br />
					<br />

					We do not exchange products if the customer has ordered a wrong item. <br /> <br />

					We do not guarantee that your monitor’s display of color will be accurate. The brightness,
					contrast and resolution of your screen will make the color of the product look slightly
					different. <br /> <br />

					Return/exchange will not be applicable if the product is disliked by the customer, or if a
					wrong product was ordered. <br /> <br />

					<b>What are the conditions for Replacement Or Refund?</b> <br /> <br />

					As explained earlier, to be eligible for free replacement, return, refund of any item –
					buyer must product an authenticated unboxing video which can support buyer’s claim. No
					replacement claim will be accepted without unboxing video. <br /> <br />

					Free replacements or refund can be requested if the following conditions apply: <br />
					<br />

					<ul class="ml-4 flex list-disc flex-col gap-4">
						<li>
							Item received is physically damaged; (you must prove this by a video of unpacking or
							unboxing)
						</li>

						<li>
							Item received has missing parts or accessories; (you must prove this by a video of
							unpacking or unboxing)
						</li>

						<li>
							Item received is different from their description on the product detail page on
							{store?.domain};
						</li>

						<li>
							Item received is defective/does not work properly. (you must prove this by a video of
							unpacking or unboxing)
						</li>
					</ul>
				</div>
			</li>
		</ul>
	</div>
</section>
