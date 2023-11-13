<style>
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
import { Confetti } from 'svelte-confetti'
import { page } from '$app/stores'
import { post } from '$lib/utils/api'
import Error from '$lib/components/Error.svelte'
import PrimaryButton from '$lib/ui/PrimaryButton.svelte'
import Radio from '$lib/ui/Radio.svelte'
import SEO from '$lib/components/SEO/index.svelte'
import Textarea from '$lib/ui/Textarea.svelte'
import Textbox from '$lib/ui/Textbox.svelte'
import { ContactService } from '$lib/services'

let seoProps = {
	title: `Bulk order inquiry`,
	description: `Bulk order inquiry`
}

let blukOrder = {
	name: '',
	companayName: '',
	email: '',
	phone: '',
	interestedProducts: [],
	minQty: null,
	message: ''
}
let contactSuccess = false
let mobileCover = false
let keychain = false
let tShirt = false
let popSocket = false
let coffeeMug = false
let mousePad = false
let err

function handleInterestedProduct(checked, value) {
	if (checked === true) {
		const ipa = [...blukOrder.interestedProducts]
		ipa.push(value)
		blukOrder.interestedProducts = ipa
	} else if (checked === false) {
		const ipa = [...blukOrder.interestedProducts]
		blukOrder.interestedProducts = ipa.filter((e) => e !== value)
	}
}

function updateQuantity(detail) {
	blukOrder.minQty = detail
}

async function submit() {
	try {
		const res = await ContactService.bulkOrderEnquiry({
			name: blukOrder.name,
			companayName: blukOrder.companayName,
			email: blukOrder.email,
			phone: blukOrder.phone,
			interestedProducts: blukOrder.interestedProducts,
			minQty: blukOrder.minQty,
			message: blukOrder.message,
			store: $page.data.storeId,
			origin: $page.data.origin
		})

		contactSuccess = true
	} catch (e) {
		err = e
	} finally {
	}
}
</script>

<SEO {...seoProps} />

<section class="min-h-screen px-3 py-5 sm:p-10">
	<div class="container mx-auto mb-20 w-full max-w-lg">
		{#if err}
			<div class="mb-5">
				<Error err="{err}" />
			</div>
		{/if}

		{#if !contactSuccess}
			<!-- Contact for Bulk Orders Form -->

			<div>
				<h1
					class="mb-5 text-center font-serif text-2xl font-medium sm:mb-10 md:text-3xl lg:text-4xl">
					Contact for Bulk Orders
				</h1>

				<form on:submit|preventDefault="{submit}">
					<ul class="mb-8 flex flex-col gap-4">
						<li>
							<h6 class="mb-2 font-semibold">Name <span class="text-red-500">*</span></h6>

							<Textbox type="text" class="w-full" bind:value="{blukOrder.name}" required />
						</li>

						<li>
							<h6 class="mb-2 font-semibold">Company Name <span class="text-red-500">*</span></h6>

							<Textbox type="text" class="w-full" bind:value="{blukOrder.companayName}" required />
						</li>

						<li>
							<h6 class="mb-2 font-semibold">Email <span class="text-red-500">*</span></h6>

							<Textbox type="email" class="w-full" bind:value="{blukOrder.email}" required />
						</li>

						<li>
							<h6 class="mb-2 font-semibold">Phone Number <span class="text-red-500">*</span></h6>

							<Textbox type="tel" class="w-full" bind:value="{blukOrder.phone}" required />
						</li>

						<li>
							<h6 class="mb-2 font-semibold">
								Interested Product <span class="text-red-500">*</span>
							</h6>

							<ul class="flex flex-col gap-2">
								<li>
									<label class="flex items-center gap-3 text-sm font-semibold">
										<input
											type="checkbox"
											class="h-4 w-4 border-2"
											bind:checked="{mobileCover}"
											on:change="{() => handleInterestedProduct(mobileCover, 'Mobile Cover')}" />

										<span>Mobile Cover</span>
									</label>
								</li>

								<li>
									<label class="flex items-center gap-3 text-sm font-semibold">
										<input
											type="checkbox"
											class="h-4 w-4 border-2"
											bind:checked="{keychain}"
											on:change="{() => handleInterestedProduct(keychain, 'Keychain')}" />

										<span>Keychain</span>
									</label>
								</li>

								<li>
									<label class="flex items-center gap-3 text-sm font-semibold">
										<input
											type="checkbox"
											class="h-4 w-4 border-2"
											bind:checked="{tShirt}"
											on:change="{() => handleInterestedProduct(tShirt, 'T-Shirt')}" />

										<span>T-Shirt</span>
									</label>
								</li>

								<li>
									<label class="flex items-center gap-3 text-sm font-semibold">
										<input
											type="checkbox"
											class="h-4 w-4 border-2"
											bind:checked="{popSocket}"
											on:change="{() => handleInterestedProduct(popSocket, 'Pop Socket')}" />

										<span>Pop Socket</span>
									</label>
								</li>

								<li>
									<label class="flex items-center gap-3 text-sm font-semibold">
										<input
											type="checkbox"
											class="h-4 w-4 border-2"
											bind:checked="{coffeeMug}"
											on:change="{() => handleInterestedProduct(coffeeMug, 'Coffee Mug')}" />

										<span>Coffee Mug</span>
									</label>
								</li>

								<li>
									<label class="flex items-center gap-3 text-sm font-semibold">
										<input
											type="checkbox"
											class="h-4 w-4 border-2"
											bind:checked="{mousePad}"
											on:change="{() => handleInterestedProduct(mousePad, 'Mouse Pad')}" />

										<span>Mouse Pad</span>
									</label>
								</li>
							</ul>
						</li>

						<li>
							<div class="mb-2">
								<h6 class="mb-1 font-semibold">
									Min. Quantity <span class="text-red-500">*</span>
								</h6>

								<p class="text-sm">Must be greater than or equal to 25+</p>
							</div>

							<ul class="flex flex-col gap-2">
								<li>
									<Radio
										bind:modelValue="{blukOrder.minQty}"
										value="50+"
										on:change="{({ detail }) => updateQuantity(detail)}">
										<span class="text-sm font-semibold"> 50+ </span>
									</Radio>
								</li>

								<li>
									<Radio
										bind:modelValue="{blukOrder.minQty}"
										value="100+"
										on:change="{({ detail }) => updateQuantity(detail)}">
										<span class="text-sm font-semibold"> 100+ </span>
									</Radio>
								</li>

								<li>
									<Radio
										bind:modelValue="{blukOrder.minQty}"
										value="200+"
										on:change="{({ detail }) => updateQuantity(detail)}">
										<span class="text-sm font-semibold"> 200+ </span>
									</Radio>
								</li>

								<li>
									<Radio
										bind:modelValue="{blukOrder.minQty}"
										value="500+"
										on:change="{({ detail }) => updateQuantity(detail)}">
										<span class="text-sm font-semibold"> 500+ </span>
									</Radio>
								</li>

								<li>
									<Radio
										bind:modelValue="{blukOrder.minQty}"
										value="More than 1000+"
										on:change="{({ detail }) => updateQuantity(detail)}">
										<span class="text-sm font-semibold"> More than 1000+ </span>
									</Radio>
								</li>
							</ul>
						</li>

						<li>
							<h6 class="mb-2 font-semibold">Any Note for Us</h6>

							<Textarea
								placeholder="We are happy to listen you, write your note..."
								bind:value="{blukOrder.message}"
								required />
						</li>
					</ul>

					<PrimaryButton type="submit" class="px-20 uppercase">submit</PrimaryButton>
				</form>
			</div>
		{:else}
			<!-- Success Message -->

			<div class="flex flex-col gap-8">
				<div class="flex flex-col items-center justify-center gap-4 text-center">
					<div class="mb-5 sm:mb-10">
						<svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
							<circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"></circle>

							<path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"></path>
						</svg>
					</div>

					<h1 class="text-2xl font-semibold capitalize md:text-3xl lg:text-4xl">
						Thank you for contacting us
					</h1>

					<p class="text-sm">One of our team member will contact you shortly</p>
				</div>

				<div class="mb-5">
					<h6 class="mb-2 text-lg font-bold">Order Details</h6>

					<ul class="flex flex-col gap-2">
						<li class="flex gap-4">
							<h6 class="w-36 font-semibold">Name</h6>

							<div class="flex flex-1 gap-2">
								<span>:</span>

								<span> {blukOrder.name || '_'} </span>
							</div>
						</li>

						<li class="flex gap-4">
							<h6 class="w-36 font-semibold">Company Name</h6>

							<div class="flex flex-1 gap-2">
								<span>:</span>

								<span> {blukOrder.companayName || '_'} </span>
							</div>
						</li>

						<li class="flex gap-4">
							<h6 class="w-36 font-semibold">Email</h6>

							<div class="flex flex-1 gap-2">
								<span>:</span>

								<span> {blukOrder.email || '_'} </span>
							</div>
						</li>

						<li class="flex gap-4">
							<h6 class="w-36 font-semibold">Phone Number</h6>

							<div class="flex flex-1 gap-2">
								<span>:</span>

								<span> {blukOrder.phone || '_'} </span>
							</div>
						</li>

						<li class="flex gap-4">
							<h6 class="w-36 font-semibold">Interested Product</h6>

							<div class="flex flex-1 gap-2">
								<span>:</span>

								<ul class="flex flex-1 flex-wrap">
									{#each blukOrder.interestedProducts as i, ix}
										<li>
											{#if ix > 0},{/if}
											{i}
										</li>
									{/each}
								</ul>
							</div>
						</li>

						<li class="flex gap-4">
							<h6 class="w-36 font-semibold">Min. Quantity</h6>

							<div class="flex flex-1 gap-2">
								<span>:</span>

								<span> {blukOrder.minQty || '_'} </span>
							</div>
						</li>

						<li class="flex gap-4">
							<h6 class="w-36 font-semibold">Yodivr Note for Us</h6>

							<div class="flex flex-1 gap-2">
								<span>:</span>

								<p>
									{@html blukOrder.message || '_'}
								</p>
							</div>
						</li>
					</ul>
				</div>

				<a href="/" aria-label="Click to visit home" class="mx-auto block max-w-max">
					<PrimaryButton class="px-10">Go to Home</PrimaryButton>
				</a>
			</div>

			<div
				style="position: fixed; top: -50px; left: 0; height: 100vh; width: 100vw; display: flex; justify-content: center; overflow: hidden; pointer-events: none;">
				<Confetti
					x="{[-5, 5]}"
					y="{[0, 0.1]}"
					delay="{[50, 2000]}"
					duration="2000"
					amount="500"
					fallDistance="100vh" />
			</div>
		{/if}
	</div>
</section>
