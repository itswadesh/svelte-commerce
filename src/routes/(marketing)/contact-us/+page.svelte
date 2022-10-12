<script>
import Error from '$lib/components/Error.svelte'
import SEO from '$lib/components/SEO/index.svelte'
import PrimaryButton from '$lib/ui/PrimaryButton.svelte'
import TextareaFloating from '$lib/ui/TextareaFloating.svelte'
import TextboxFloating from '$lib/ui/TextboxFloating.svelte'
import { toast } from '$lib/util'
import { post } from '$lib/util/api'
import { page } from '$app/stores'

let seoProps = {
	title: `Contact Us`,
	description: `Contact Us`
}

let fullName = ''
let email = ''
let phone
let message = ''
let loading = false
let err

async function submitContactInformation() {
	try {
		loading = true
		const res = await post(
			`contact-us?store=${$page.data?.store?.id}`,
			{
				fullName: fullName,
				email: email,
				phone: phone,
				subject: `Someone contact us from ${$page.data.store.websiteName}`,
				message: message,
				store: $page.data.store.id
			},
			$page.data.origin
		)

		toast('You have successfully contacted with us', 'success')

		fullName = ''
		email = ''
		phone
		message = ''
	} catch (e) {
		// console.log('error = ', e)

		err = e
	} finally {
		loading = false
	}
}
</script>

<SEO {...seoProps} />

<section class="min-h-screen p-3 sm:p-10">
	<div class="container mx-auto w-full max-w-6xl">
		<!-- Contact Us -->

		<div class="mb-5 text-center sm:mb-10">
			<h1 class="mb-2 font-serif text-2xl font-medium md:text-3xl lg:text-4xl">Contact Us</h1>

			<p class="text-sm text-gray-500">Any queation or remarks? Just write us a message!</p>
		</div>

		<div class="grid grid-cols-1 rounded-xl border shadow-lg xl:grid-cols-3">
			<div class="col-span-1 m-2 overflow-hidden rounded-xl bg-gray-800 p-5 text-white sm:p-10">
				<h2 class="mb-2 text-xl font-semibold sm:text-2xl">Contact Information</h2>

				<p class="mb-5 text-sm text-gray-400 sm:text-base">
					Fill up teh form and our Team will get back to you within 24 hours.
				</p>

				<ul class="mb-5 flex flex-col gap-4">
					<li class="flex gap-4">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="mt-0.5 h-6 w-6"
							viewBox="0 0 20 20"
							fill="currentColor">
							<path
								d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"
							></path>
						</svg>

						<span class="flex-1"> +91 6370248486 </span>
					</li>

					<li class="flex gap-4">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="mt-0.5 h-6 w-6"
							viewBox="0 0 20 20"
							fill="currentColor">
							<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
							></path>
							<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
						</svg>

						<span class="flex-1"> contact@lrnr.in </span>
					</li>

					<li class="flex gap-4">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="mt-0.5 h-6 w-6"
							viewBox="0 0 20 20"
							fill="currentColor">
							<path
								fill-rule="evenodd"
								d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
								clip-rule="evenodd"></path>
						</svg>

						<span class="flex-1">
							{$page.data.store.address}
						</span>
					</li>
				</ul>

				<ul class="flex flex-wrap items-center gap-2">
					<!-- Facebook -->

					<li
						class="duraton-300 h-10 w-10 overflow-hidden rounded-full transition hover:bg-[#4267B2]">
						<a
							href="{$page.data.store.facebookPage}"
							aria-label="Click to route facebook page"
							target="_blank"
							rel="noopener noreferrer"
							class="flex h-full w-full items-center justify-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								viewBox="0 0 24 24"
								stroke-width="2"
								stroke="currentColor"
								fill="none"
								stroke-linecap="round"
								stroke-linejoin="round">
								<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
								<path d="M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3"
								></path>
							</svg>
						</a>
					</li>

					<!-- Instagram -->

					<li
						class="duraton-300 h-10 w-10 overflow-hidden rounded-full transition hover:bg-[#C13584]">
						<a
							href="{$page.data.store.instagramPage}"
							aria-label="Click to route instagram page"
							target="_blank"
							rel="noopener noreferrer"
							class="flex h-full w-full items-center justify-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								viewBox="0 0 24 24"
								stroke-width="2"
								stroke="currentColor"
								fill="none"
								stroke-linecap="round"
								stroke-linejoin="round">
								<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
								<rect x="4" y="4" width="16" height="16" rx="4"></rect>
								<circle cx="12" cy="12" r="3"></circle>
								<line x1="16.5" y1="7.5" x2="16.5" y2="7.501"></line>
							</svg>
						</a>
					</li>

					<!-- Twitter -->

					<li
						class="duraton-300 h-10 w-10 overflow-hidden rounded-full transition hover:bg-[#1DA1F2]">
						<a
							href="{$page.data.store.twitterPage}"
							aria-label="Click to route twitter page"
							target="_blank"
							rel="noopener noreferrer"
							class="flex h-full w-full items-center justify-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								viewBox="0 0 24 24"
								stroke-width="2"
								stroke="currentColor"
								fill="none"
								stroke-linecap="round"
								stroke-linejoin="round">
								<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
								<path
									d="M22 4.01c-1 .49 -1.98 .689 -3 .99c-1.121 -1.265 -2.783 -1.335 -4.38 -.737s-2.643 2.06 -2.62 3.737v1c-3.245 .083 -6.135 -1.395 -8 -4c0 0 -4.182 7.433 4 11c-1.872 1.247 -3.739 2.088 -6 2c3.308 1.803 6.913 2.423 10.034 1.517c3.58 -1.04 6.522 -3.723 7.651 -7.742a13.84 13.84 0 0 0 .497 -3.753c-.002 -.249 1.51 -2.772 1.818 -4.013z"
								></path>
							</svg>
						</a>
					</li>

					<!-- Pinterest -->

					<li
						class="duraton-300 h-10 w-10 overflow-hidden rounded-full transition hover:bg-[#D32D2D]">
						<a
							href="{$page.data.store.pinterestPage}"
							aria-label="Click to route pinterest page"
							target="_blank"
							rel="noopener noreferrer"
							class="flex h-full w-full items-center justify-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								viewBox="0 0 24 24"
								stroke-width="2"
								stroke="currentColor"
								fill="none"
								stroke-linecap="round"
								stroke-linejoin="round">
								<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
								<line x1="8" y1="20" x2="12" y2="11"></line>
								<path
									d="M10.7 14c.437 1.263 1.43 2 2.55 2c2.071 0 3.75 -1.554 3.75 -4a5 5 0 1 0 -9.7 1.7"
								></path>
								<circle cx="12" cy="12" r="9"></circle>
							</svg>
						</a>
					</li>

					<!-- Linked in -->

					<li
						class="duraton-300 h-10 w-10 overflow-hidden rounded-full transition hover:bg-[#0077b5]">
						<a
							href="{$page.data.store.linkedinPage}"
							aria-label="Click to route linkedin page"
							target="_blank"
							rel="noopener noreferrer"
							class="flex h-full w-full items-center justify-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								viewBox="0 0 24 24"
								stroke-width="2"
								stroke="currentColor"
								fill="none"
								stroke-linecap="round"
								stroke-linejoin="round">
								<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
								<rect x="4" y="4" width="16" height="16" rx="2"></rect>
								<line x1="8" y1="11" x2="8" y2="16"></line>
								<line x1="8" y1="8" x2="8" y2="8.01"></line>
								<line x1="12" y1="16" x2="12" y2="11"></line>
								<path d="M16 16v-3a2 2 0 0 0 -4 0"></path>
							</svg>
						</a>
					</li>

					<!-- Youtube -->

					<li
						class="duraton-300 h-10 w-10 overflow-hidden rounded-full transition hover:bg-[#FF0000]">
						<a
							href="{$page.data.store.youtubeChannel}"
							aria-label="Click to route youtube page"
							target="_blank"
							rel="noopener noreferrer"
							class="flex h-full w-full items-center justify-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								viewBox="0 0 24 24"
								stroke-width="2"
								stroke="currentColor"
								fill="none"
								stroke-linecap="round"
								stroke-linejoin="round">
								<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
								<rect x="3" y="5" width="18" height="14" rx="4"></rect>
								<path d="M10 9l5 3l-5 3z"></path>
							</svg>
						</a>
					</li>
				</ul>
			</div>

			<form
				on:submit|preventDefault="{submitContactInformation}"
				class="col-span-1 flex flex-col gap-5 p-5 sm:p-10 xl:col-span-2">
				<Error err="{err}" />

				<TextboxFloating
					type="text"
					label="Full Name"
					required
					class="col-span-1 w-full"
					bind:value="{fullName}" />

				<div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
					<TextboxFloating
						type="text"
						label="Email"
						required
						class="col-span-1 w-full"
						bind:value="{email}" />

					<TextboxFloating
						type="tel"
						label="Phone"
						required
						class="col-span-1 w-full"
						bind:value="{phone}" />
				</div>

				<TextareaFloating
					label="Write your message here..."
					class="w-full"
					required
					bind:value="{message}" />

				<div class="flex justify-end">
					<PrimaryButton type="submit" loading="{loading}" class="px-10 uppercase" blackBackground>
						submit
					</PrimaryButton>
				</div>
			</form>
		</div>
	</div>
</section>
