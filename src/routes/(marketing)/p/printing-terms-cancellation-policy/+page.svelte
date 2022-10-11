<script>
import SEO from '$lib/components/SEO/index.svelte'
import { page } from '$app/stores'

let seoProps = {
	title: `Printing terms cancellation`,
	description: `Printing terms cancellation`
}
</script>

<SEO {...seoProps} />

<section class="min-h-screen p-3 sm:p-10">
	<div class="container mx-auto w-full max-w-6xl">
		<!-- Printing Terms & Cancellation Policy -->

		<h1 class="mb-5 text-center font-serif text-2xl font-medium sm:mb-10 md:text-3xl lg:text-4xl">
			Printing Terms & Cancellation Policy
		</h1>

		<p class="mb-5 text-sm text-gray-500 sm:text-base">
			The following Terms and Conditions apply to all transactions on the {$page.data.store.domain} web
			site. Please scroll through this screen, read them carefully and print a copy for future reference.
		</p>

		<ul class="flex flex-col gap-5 text-sm sm:text-base">
			<li>
				<h6 class="mb-5 font-semibold">IMAGES</h6>

				<p class="text-gray-500">
					Product images are for illustrative purposes only and may differ from the actual product.
					Due to differences in monitors, the colors of products may also appear different from
					those shown on the site.
				</p>
			</li>

			<li>
				<h6 class="mb-5 font-semibold">PRODUCTS DETAILS</h6>

				<p class="text-gray-500">
					Some products may have an associated image or photo. These are for reference only and
					should be considered illustrative.
				</p>
			</li>

			<li>
				<h6 class="mb-5 font-semibold">CANCELLATION OF ORDERS</h6>

				<p class="mb-5 text-gray-500">
					You may request to cancel your order for a refund, up to 2 hours after the date and time
					of the order. All cancellation requests will be accepted within 2 hours and we will
					initiate a refund to your original payment method. In that we deduct Rs. 60 as processing
					fee for any amount of orders you place on {$page.data.store.domain}.
				</p>

				<p class="text-gray-500">
					Cancellations after 2 hours will not be accepted. When you buy service and products from
					{$page.data.store.domain}, you agree to these terms.
				</p>
			</li>

			<li>
				<h6 class="mb-5 font-semibold">NOTE :-</h6>

				<p class="text-gray-500">
					In case you made a order without uploading picture in customized cover ,we’ll mail you to
					give a picture and if you will not share the picture within week ,we’ll proceed your order
					without that particular cover and no refund will be issued in that particular case.
				</p>
			</li>
		</ul>
	</div>
</section>
