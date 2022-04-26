<style>
.checkmark {
	width: 100px;
	height: 100px;
}

.checkmark {
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

<script context="module">
export async function load({ url, params, fetch, session, context }) {
	let me, err
	try {
		const me = (await KQL_Me.query({ fetch, settings: { cache: 0 } })).data?.me
		// console.log(res)
	} catch (e) {
		err = e
		toast(e, 'error')
	} finally {
	}
	return {
		props: { me, err }
	}
}
</script>

<script>
import SEO from '$lib/components/SEO/index.svelte'
import { store } from '$lib/store'
import { toast } from './../../util'
import { goto } from '$app/navigation'
import { KQL_Me } from '$lib/graphql/_kitql/graphqlStores'
import HeadingUnderline from '$lib/components/HeadingUnderline.svelte'
import Textbox from '$lib/ui/Textbox.svelte'
import Textarea from '$lib/ui/Textarea.svelte'

// console.log('store', store)

const seoProps = {
	title: 'Contact ',
	metadescription: ''
}

export let me = {},
	err

let contact = {},
	emailAddress = me?.email,
	fullNameOfSender = me?.fullName,
	loading = false,
	sendMessageSuccessfully = false

async function send(c) {
	try {
		loading = true
		c.email = emailAddress
		c.fullName = fullNameOfSender
		const { email, fullName, message } = c
		toast('Sending your message please wait...', 'info')
		// await post(`contact-us`, { email, fullName, message })
		toast('Send your message successfully', 'success')
		sendMessageSuccessfully = true
	} catch (e) {
		err = e
	} finally {
		loading = false
	}
}
</script>

<SEO {...seoProps} />
<div class="text-gray-800 bg-white min-h-screen">
	<div class="container mx-auto max-w-7xl p-3 py-5 sm:p-10">
		<div
			class="mb-5 sm:mb-10 text-gray-800 max-w-max mx-auto flex flex-col items-center justify-center">
			<h1 class="mb-2 text-primary-500 text-xl sm:text-2xl lg:text-3xl font-bold">Contact Us</h1>

			<HeadingUnderline />
		</div>

		{#if !sendMessageSuccessfully}
			<div class="flex flex-col-reverse lg:grid lg:grid-cols-3 gap-5 sm:gap-10">
				<div
					class="col-span-1 py-10 sm:py-0 grid grid-cols-1 gap-5 md:gap-10 justify-items-center lg:justify-items-start">
					<div
						class="flex flex-col lg:flex-row items-center lg:items-start justify-center lg:justify-start text-center lg:text-left space-y-5 lg:space-y-0 lg:space-x-5 max-w-xs">
						<div
							class="w-10 h-10 sm:w-14 sm:h-14 rounded-full border border-gray-800 flex items-center justify-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="w-5 h-5 sm:w-7 sm:h-7 text-gray-800"
								viewBox="0 0 20 20"
								fill="currentColor">
								<path
									fill-rule="evenodd"
									d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
									clip-rule="evenodd"></path>
							</svg>
						</div>

						<div class="flex-1">
							<h3 class="mb-2 text-base md:text-lg font-bold">Address</h3>

							<h4 class="text-sm text-gray-500 flex flex-col">
								<span>C/12, Kuarmunda, Sundergarh, Odisha, India </span><span>770039</span>
							</h4>
						</div>
					</div>

					<div
						class="flex flex-col lg:flex-row items-center lg:items-start justify-center lg:justify-start text-center lg:text-left space-y-5 lg:space-y-0 lg:space-x-5 max-w-xs">
						<div
							class="w-10 h-10 sm:w-14 sm:h-14 rounded-full border border-gray-800 flex items-center justify-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="w-5 h-5 sm:w-7 sm:h-7 text-gray-800"
								viewBox="0 0 20 20"
								fill="currentColor">
								<path
									d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 
										011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
							</svg>
						</div>

						<div class="flex-1">
							<h3 class="mb-2 text-base md:text-lg font-bold">Phone</h3>

							<h4 class="text-sm text-gray-500">+855-</h4>
						</div>
					</div>

					<div
						class="flex flex-col lg:flex-row items-center lg:items-start justify-center lg:justify-start text-center lg:text-left space-y-5 lg:space-y-0 lg:space-x-5 max-w-xs">
						<div
							class="w-10 h-10 sm:w-14 sm:h-14 rounded-full border border-gray-800 flex items-center justify-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="w-5 h-5 sm:w-7 sm:h-7 text-gray-800"
								viewBox="0 0 20 20"
								fill="currentColor">
								<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
								></path>

								<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
							</svg>
						</div>

						<div class="flex-1">
							<h3 class="mb-2 text-base md:text-lg font-bold">Email</h3>

							<h4 class="text-sm text-gray-500">hi@misiki.in</h4>
						</div>
					</div>
				</div>

				<form
					class="col-span-1 lg:col-span-2 flex flex-col space-y-4"
					on:submit|preventDefault="{() => send(contact)}">
					{#if me}
						<Textbox label="Email" type="text" required bind:value="{emailAddress}" />

						<Textbox label="Full name" required bind:value="{fullNameOfSender}" />
					{/if}

					<!-- <TextboxFloatingBorder
					label="What's this about?"
					type="text"
					required
					bind:value="{contact.subject}" /> 
					
					<TextboxFloatingBorder
					label="Description"
					type="text"
					required
					bind:value="{contact.description}" /> -->

					<Textarea label="Go ahead, we are listening.." bind:value="{contact.message}" />

					<button type="submit" class="w-full max-w-xs">Send</button>
				</form>
			</div>
		{:else}
			<div class="col-span-1 lg:col-span-2 flex flex-col items-center justify-center text-center">
				<div class="mb-2 sm:mb-10">
					<svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
						<circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"></circle>

						<path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"></path>
					</svg>
				</div>

				<h1 class="mb-5 text-2xl sm:text-4xl font-bold">Thank You!</h1>

				<p class="text-sm">We've received your message.</p>

				<p class="mb-10 text-sm">Someone from our team will contact you soon.</p>

				<button class="text-sm" on:click="{() => goto('/')}">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						viewBox="0 0 20 20"
						fill="currentColor">
						<path
							fill-rule="evenodd"
							d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
							clip-rule="evenodd"></path>
					</svg>

					<span>Back to Home</span>
				</button>
			</div>
		{/if}
	</div>
</div>
