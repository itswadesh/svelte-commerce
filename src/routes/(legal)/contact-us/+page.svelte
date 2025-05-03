<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import { Input } from '$lib/components/ui/input'
	import { Label } from '$lib/components/ui/label'
	import { Textarea } from '$lib/components/ui/textarea'
	import { Check, AlertCircle } from 'lucide-svelte'
	import { page } from '$app/state'
	import ContactUsRenderer from '$lib/core/composables/contact-us-renderer.svelte'

	let info = $state({
		name: '',
		email: '',
		message: ''
	})
</script>

<svelte:head>
	<title>Contact us</title>
</svelte:head>

<ContactUsRenderer bind:info>
	{#snippet content({ error, success, nameError, messageError, emailError, loading, handleSubmit })}
		<div class="container mx-auto max-w-4xl px-4 py-8">
			<div class="grid md:grid-cols-2">
				<div class="w-full bg-black p-6 text-white shadow-lg sm:p-8">
					<h2 class="mb-4 text-2xl font-semibold">Contact Information</h2>

					<p class="mb-6 text-zinc-300">Fill up the form and our Team will get back to you within 24 hours.</p>
					<br />
					<div class="prose-lg text-base leading-tight text-gray-300 [&>p]:my-2">{@html page?.data?.page?.content}</div>
					<!-- {#if page?.data?.store?.businessPhone || page?.data?.store?.businessEmail}
				<ul class="mb-6 flex flex-col gap-4">
					{#if page?.data?.store?.businessPhone}
						<li class="flex items-center gap-4">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-zinc-300" viewBox="0 0 20 20" fill="currentColor">
								<path
									d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"
								></path>
							</svg>
							<p class="flex-1 text-zinc-300">{page?.data?.store?.businessPhone}</p>
						</li>
					{/if}

					{#if page?.data?.store?.businessEmail}
						<li class="flex items-center gap-4">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-zinc-300" viewBox="0 0 20 20" fill="currentColor">
								<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
								<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
							</svg>
							<p class="flex-1 text-zinc-300">{page?.data?.store?.businessEmail}</p>
						</li>
					{/if}
					{#if page?.data?.store?.address_1}
						<li class="flex items-center gap-4">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-zinc-300" viewBox="0 0 20 20" fill="currentColor">
								<path
									fill-rule="evenodd"
									d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
									clip-rule="evenodd"
								></path>
							</svg>
							<p class="flex-1 text-zinc-300">
								{page?.data?.store?.address_1}, {page?.data?.store?.address_2}, {page?.data?.store?.city}, {page?.data?.store?.state}, {page?.data
									?.store?.country?.name}
							</p>
						</li>
					{/if}
			</ul>
			{/if} -->

					{#if page?.data?.store?.plugins?.socialSharingButtons?.active}
						<div class="flex items-center gap-4">
							{#each Object.entries(page?.data?.store?.plugins?.socialSharingButtons || {}) as [key, social]}
								{#if key !== 'active' && key !== 'position' && social}
									<a
										href={social as string}
										target="_blank"
										rel="noopener noreferrer"
										class="text-zinc-300 transition-colors hover:text-white"
										aria-label={`Visit our ${key} page`}
									>
										{#if key === 'twitter'}
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="h-5 w-5"
												viewBox="0 0 24 24"
												stroke-width="1.5"
												stroke="currentColor"
												fill="none"
												stroke-linecap="round"
												stroke-linejoin="round"
											>
												<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
												<path
													d="M22 4.01c-1 .49 -1.98 .689 -3 .99c-1.121 -1.265 -2.783 -1.335 -4.38 -.737s-2.643 2.06 -2.62 3.737v1c-3.245 .083 -6.135 -1.395 -8 -4c0 0 -4.182 7.433 4 11c-1.872 1.247 -3.739 2.088 -6 2c3.308 1.803 6.913 2.423 10.034 1.517c3.58 -1.04 6.522 -3.723 7.651 -7.742a13.84 13.84 0 0 0 .497 -3.753c-.002 -.249 1.51 -2.772 1.818 -4.013z"
												></path>
											</svg>
										{:else if key === 'facebook'}
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="h-5 w-5"
												viewBox="0 0 24 24"
												stroke-width="1.5"
												stroke="currentColor"
												fill="none"
												stroke-linecap="round"
												stroke-linejoin="round"
											>
												<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
												<path d="M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3"></path>
											</svg>
										{:else if key === 'linkedin'}
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="h-5 w-5"
												viewBox="0 0 24 24"
												stroke-width="1.5"
												stroke="currentColor"
												fill="none"
												stroke-linecap="round"
												stroke-linejoin="round"
											>
												<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
												<rect x="4" y="4" width="16" height="16" rx="2"></rect>
												<line x1="8" y1="11" x2="8" y2="16"></line>
												<line x1="8" y1="8" x2="8" y2="8.01"></line>
												<line x1="12" y1="16" x2="12" y2="11"></line>
												<path d="M16 16v-3a2 2 0 0 0 -4 0"></path>
											</svg>
										{:else if key === 'instagram'}
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="h-5 w-5"
												viewBox="0 0 24 24"
												stroke-width="1.5"
												stroke="currentColor"
												fill="none"
												stroke-linecap="round"
												stroke-linejoin="round"
											>
												<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
												<rect x="4" y="4" width="16" height="16" rx="4"></rect>
												<circle cx="12" cy="12" r="3"></circle>
												<line x1="16.5" y1="7.5" x2="16.5" y2="7.501"></line>
											</svg>
										{/if}
									</a>
								{/if}
							{/each}
						</div>
					{/if}
				</div>

				<div class="w-full">
					{#if success}
						<div class="w-full border bg-white p-6 text-center shadow-lg">
							<div class="mb-4 flex justify-center">
								<div class="rounded-full bg-green-100 p-3">
									<Check class="h-8 w-8 text-green-600" />
								</div>
							</div>
							<h2 class="mb-2 text-2xl font-bold">Thank you for contacting us!</h2>
							<p class="text-gray-600">We'll get back to you as soon as possible.</p>
						</div>
					{:else}
						<div class="w-full border bg-white p-6 shadow-lg">
							<div class="mb-6">
								<h2 class="text-2xl font-semibold">Contact Us</h2>
								<p class="text-sm text-gray-500">Fill out the form below and we'll get back to you as soon as possible.</p>
							</div>
							<div>
								{#if error}
									<div class="mb-4 flex items-center gap-2 bg-red-50 p-3 text-red-600">
										<AlertCircle class="h-5 w-5" />
										<p class="text-sm">{error}</p>
									</div>
								{/if}
								<form class="grid gap-4" onsubmit={handleSubmit}>
									<div class="grid gap-2">
										<Label for="name">Name</Label>
										<Input
											id="name"
											placeholder="Enter your name"
											bind:value={info.name}
											class={nameError ? 'border-red-500 focus:border-red-500' : ''}
											required
										/>
										{#if nameError}
											<p class="text-sm text-red-500">{nameError}</p>
										{/if}
									</div>
									<div class="grid gap-2">
										<Label for="email">Email</Label>
										<Input
											id="email"
											type="email"
											placeholder="Enter your email"
											bind:value={info.email}
											class={emailError ? 'border-red-500 focus:border-red-500' : ''}
											required
										/>
										{#if emailError}
											<p class="text-sm text-red-500">{emailError}</p>
										{/if}
									</div>
									<div class="grid gap-2">
										<Label for="message">Message</Label>
										<Textarea
											id="message"
											placeholder="Enter your message"
											class={messageError ? 'border-red-500 focus:border-red-500' : ''}
											bind:value={info.message}
											required
										/>
										{#if messageError}
											<p class="text-sm text-red-500">{messageError}</p>
										{/if}
									</div>
									<Button type="submit" class="w-full" disabled={loading}>
										{#if loading}
											<div class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
										{/if}
										{loading ? 'Sending...' : 'Submit'}
									</Button>
								</form>
							</div>
						</div>
					{/if}
				</div>
			</div>
		</div>
	{/snippet}
</ContactUsRenderer>

<style>
	p {
		margin: 0;
	}
</style>

