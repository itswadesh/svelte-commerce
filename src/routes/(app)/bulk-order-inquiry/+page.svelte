<style>
.success-animation {
	margin: 150px auto;
}

.checkmark {
	width: 100px;
	height: 100px;
	border-radius: 50%;
	display: block;
	stroke-width: 4;
	stroke: #4bb71b;
	stroke-miterlimit: 10;
	box-shadow: inset 0px 0px 0px #4bb71b;
	animation: fill 0.4s ease-in-out 0.4s forwards, scale 0.3s ease-in-out 0.9s both;
	position: relative;
	top: 5px;
	right: 5px;
	margin: 0 auto;
}

.checkmark__circle {
	stroke-dasharray: 166;
	stroke-dashoffset: 166;
	stroke-width: 4;
	stroke-miterlimit: 10;
	stroke: #4bb71b;
	fill: #fff;
	animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}

.checkmark__check {
	transform-origin: 50% 50%;
	stroke-dasharray: 48;
	stroke-dashoffset: 48;
	animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
}

@keyframes stroke {
	100% {
		stroke-dashoffset: 0;
	}
}

@keyframes scale {
	0%,
	100% {
		transform: none;
	}

	50% {
		transform: scale3d(1.1, 1.1, 1);
	}
}

@keyframes fill {
	100% {
		box-shadow: inset 0px 0px 0px 30px #4bb71b;
	}
}
</style>

<script>
import SEO from '$lib/components/SEO/index.svelte'
import PrimaryButton from '$lib/ui/PrimaryButton.svelte'
import Textarea from '$lib/ui/Textarea.svelte'
import Textbox from '$lib/ui/Textbox.svelte'

let seoProps = {
	title: `Bulk order inquiry`,
	description: `Bulk order inquiry`
}

function sendRequestForBulkOrder() {
	alert('Hi')
}
</script>

<SEO {...seoProps} />

<section class="min-h-screen p-3 sm:p-10">
	<div class="container mx-auto w-full max-w-lg">
		<!-- Contact for Bulk Orders Form -->

		<div>
			<h1 class="mb-5 text-center font-serif text-2xl font-medium sm:mb-10 md:text-3xl lg:text-4xl">
				Contact for Bulk Orders
			</h1>

			<form on:submit="{sendRequestForBulkOrder}">
				<ul class="mb-8 flex flex-col gap-4">
					<li>
						<h6 class="mb-2 font-semibold">Name <span class="text-red-500">*</span></h6>

						<Textbox class="w-full" />
					</li>

					<li>
						<h6 class="mb-2 font-semibold">Company Name <span class="text-red-500">*</span></h6>

						<Textbox class="w-full" />
					</li>

					<li>
						<h6 class="mb-2 font-semibold">Email <span class="text-red-500">*</span></h6>

						<Textbox class="w-full" />
					</li>

					<li>
						<h6 class="mb-2 font-semibold">Phone Number <span class="text-red-500">*</span></h6>

						<Textbox class="w-full" />
					</li>

					<li>
						<h6 class="mb-2 font-semibold">
							Interested Product <span class="text-red-500">*</span>
						</h6>

						<ul class="flex flex-col gap-2">
							<li>
								<label class="flex items-center gap-3 text-sm font-semibold">
									<input type="checkbox" class="h-4 w-4 border-2" />

									<span>Mobile Cover</span>
								</label>
							</li>

							<li>
								<label class="flex items-center gap-3 text-sm font-semibold">
									<input type="checkbox" class="h-4 w-4 border-2" />

									<span>Keychain</span>
								</label>
							</li>

							<li>
								<label class="flex items-center gap-3 text-sm font-semibold">
									<input type="checkbox" class="h-4 w-4 border-2" />

									<span>T-Shirt</span>
								</label>
							</li>

							<li>
								<label class="flex items-center gap-3 text-sm font-semibold">
									<input type="checkbox" class="h-4 w-4 border-2" />

									<span>Pop Socket</span>
								</label>
							</li>

							<li>
								<label class="flex items-center gap-3 text-sm font-semibold">
									<input type="checkbox" class="h-4 w-4 border-2" />

									<span>Coffee Mug</span>
								</label>
							</li>

							<li>
								<label class="flex items-center gap-3 text-sm font-semibold">
									<input type="checkbox" class="h-4 w-4 border-2" />

									<span>Mouse Pad</span>
								</label>
							</li>
						</ul>
					</li>

					<li>
						<div class="mb-2">
							<h6 class="mb-1 font-semibold">Min. Quantity <span class="text-red-500">*</span></h6>

							<p class="text-sm">Must be greater than or equal to 25+</p>
						</div>

						<ul class="flex flex-col gap-2">
							<li>
								<label class="flex items-center gap-3 text-sm font-semibold">
									<input type="checkbox" class="h-4 w-4 border-2" />

									<span>50+</span>
								</label>
							</li>

							<li>
								<label class="flex items-center gap-3 text-sm font-semibold">
									<input type="checkbox" class="h-4 w-4 border-2" />

									<span>100+</span>
								</label>
							</li>

							<li>
								<label class="flex items-center gap-3 text-sm font-semibold">
									<input type="checkbox" class="h-4 w-4 border-2" />

									<span>200+</span>
								</label>
							</li>

							<li>
								<label class="flex items-center gap-3 text-sm font-semibold">
									<input type="checkbox" class="h-4 w-4 border-2" />

									<span>500+</span>
								</label>
							</li>

							<li>
								<label class="flex items-center gap-3 text-sm font-semibold">
									<input type="checkbox" class="h-4 w-4 border-2" />

									<span>More than 100+</span>
								</label>
							</li>
						</ul>
					</li>

					<li>
						<h6 class="mb-2 font-semibold">Any Note for Us</h6>

						<Textarea placeholder="We are happy to listen you, write your note..." />
					</li>
				</ul>

				<PrimaryButton class="px-20 uppercase">submit</PrimaryButton>
			</form>
		</div>

		<!-- Success Message -->

		<div class="flex flex-col gap-8">
			<div class="flex flex-col items-center justify-center gap-4 text-center">
				<div class="mb-5 sm:mb-10">
					<svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
						<circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"></circle>

						<path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"></path>
					</svg>
				</div>

				<h1 class="text-2xl font-semibold md:text-3xl lg:text-4xl">Thank You for Your Order</h1>

				<p class="text-sm">One of our team member will contact you shortly</p>
			</div>

			<div>
				<h6 class="mb-2 text-lg font-bold">Order Details</h6>

				<ul class="flex flex-col gap-2">
					<li class="flex gap-4">
						<h6 class="w-36 font-semibold">Name</h6>

						<div class="flex flex-1 gap-2">
							<span>:</span>

							<span> Robert Downey, Jr </span>
						</div>
					</li>

					<li class="flex gap-4">
						<h6 class="w-36 font-semibold">Company Name</h6>

						<div class="flex flex-1 gap-2">
							<span>:</span>

							<span> Stark Industries </span>
						</div>
					</li>

					<li class="flex gap-4">
						<h6 class="w-36 font-semibold">Email</h6>

						<div class="flex flex-1 gap-2">
							<span>:</span>

							<span> tonystark@gmail.com </span>
						</div>
					</li>

					<li class="flex gap-4">
						<h6 class="w-36 font-semibold">Phone Number</h6>

						<div class="flex flex-1 gap-2">
							<span>:</span>

							<span> +91 9876543210 </span>
						</div>
					</li>

					<li class="flex gap-4">
						<h6 class="w-36 font-semibold">Interested Product</h6>

						<div class="flex flex-1 gap-2">
							<span>:</span>

							<ul class="flex flex-1 flex-wrap gap-2">
								<li>Mobile Cover,</li>

								<li>Keychain,</li>

								<li>Pop Socket</li>
							</ul>
						</div>
					</li>

					<li class="flex gap-4">
						<h6 class="w-36 font-semibold">Min. Quantity</h6>

						<div class="flex flex-1 gap-2">
							<span>:</span>

							<span> 50+ </span>
						</div>
					</li>

					<li class="flex gap-4">
						<h6 class="w-36 font-semibold">Yodivr Note for Us</h6>

						<div class="flex flex-1 gap-2">
							<span>:</span>

							<span>
								I will pay 30% in advance and rest of amount after delivery, i need this order in
								between one week.
							</span>
						</div>
					</li>
				</ul>
			</div>

			<PrimaryButton class="mx-auto px-10">Go to Home</PrimaryButton>
		</div>
	</div>
</section>
