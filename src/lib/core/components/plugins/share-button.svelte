<script lang="ts">
	import { fly } from 'svelte/transition'
	import { page } from '$app/state'
	import { Email, Facebook, LinkedIn, Pinterest, Telegram, X, WhatsApp } from 'svelte-share-buttons-component'
	import facebookIcon from '$lib/assets/social-media/facebook.png'
	import gmailIcon from '$lib/assets/social-media/gmail.png'
	import linkedinIcon from '$lib/assets/social-media/linkedin.png'
	import linkIcon from '$lib/assets/social-media/link.png'
	import pinterestIcon from '$lib/assets/social-media/pinterest.png'
	import telegramIcon from '$lib/assets/social-media/telegram.png'
	import twitterIcon from '$lib/assets/social-media/twitter.png'
	import whatsappIcon from '$lib/assets/social-media/whatsapp.png'
	import { toast } from 'svelte-sonner'

	let { productImage, productName, url } = $props()

	let showDropDown = $state(false)

	let socialSharesList = [
		{
			icon: whatsappIcon,
			title: 'Whatsapp',
			dataAction: 'share/whatsapp/share',
			href: `whatsapp://send?text=${productName} ${url}`
		},
		{
			icon: telegramIcon,
			title: 'Telegram',
			href: `https://telegram.me/share/url?text=${productName}&url=${url}`
		},
		{
			icon: facebookIcon,
			title: 'Facebook',
			href: `https://facebook.com/sharer/sharer.php?u=${url}&quote=${productName}`
		},
		{
			icon: twitterIcon,
			title: 'X',
			href: `https://twitter.com/intent/tweet/?text=${productName}&hashtags=${'zapvi'}&via=${'zapvi'}&related=${'mobile cover, mousepad, phone grips, t-shirt, keychain, mobile accessories'}&url=${url}`
		},
		{
			icon: pinterestIcon,
			title: 'Pinterest',
			href: `https://pinterest.com/pin/create/button/?url=${url}&media=${productImage}&description=${productName}`
		},
		{
			icon: linkedinIcon,
			title: 'LInkedIn',
			href: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
		},
		{
			icon: gmailIcon,
			title: 'Gmail',
			href: `https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=${page.data.store?.email}&su=Take a look at this ${productName}&body=${url}`
		}
	]

	const copyToClipboard = (link: string) => {
		navigator.clipboard.writeText(link)

		toast.success('Copied')
	}
</script>

<div class="relative max-w-max">
	<button
		type="button"
		aria-label="Open Share Dropdown"
		class="group flex items-center gap-2 rounded-full border border-transparent p-1 transition duration-300 focus:outline-none lg:border-zinc-200 lg:px-2 lg:py-1
		{showDropDown ? 'border-primary-500 bg-black text-white shadow-lg' : 'lg:hover:border-primary-500 lg:hover:text-primary-500'}
		"
		onclick={() => (showDropDown = !showDropDown)}
	>
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-5 w-5 lg:h-4 lg:w-4">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
			></path>
		</svg>

		{#if !showDropDown}
			<span class="hidden text-sm lg:group-hover:block"> Share </span>
		{:else}
			<span class="hidden text-sm lg:block">Share</span>
		{/if}
	</button>

	{#if showDropDown}
		<!-- Desktop social share buttons -->

		<ul
			transition:fly={{ y: -5, duration: 300 }}
			class="absolute right-0 top-10 z-10 hidden min-w-max list-none flex-col rounded-full border bg-white py-1 shadow-md lg:flex"
		>
			<li class="p-2">
				<WhatsApp class="flex items-center justify-center rounded-full" text="{productName} {url}" />
			</li>

			<li class="p-2">
				<Telegram class="flex items-center justify-center rounded-full" text={productName} {url} />
			</li>

			<li class="p-2">
				<Facebook class="flex items-center justify-center rounded-full" quote={productName} {url} />
			</li>

			<li class="p-2">
				<X
					class="share-button flex items-center justify-center rounded-full"
					text={productName}
					{url}
					hashtags="litekart"
					via="litekart"
					related="mobile cover,t-shirt,key chain "
				/>
			</li>

			<li class="p-2">
				<Pinterest class="flex items-center justify-center rounded-full" {url} media={productImage} description={productName} />
			</li>

			<li class="p-2">
				<LinkedIn class="flex items-center justify-center rounded-full" {url} />
			</li>

			<li class="p-2">
				<Email class="flex items-center justify-center rounded-full" subject="Take a look at this {productName}" body={url} />
			</li>
		</ul>

		<!-- Mobile social share buttons -->

		<div
			transition:fly={{ y: 100, duration: 300 }}
			class="fixed inset-x-0 bottom-0 z-[10000000] bg-white lg:hidden"
			style="box-shadow: 0px -4px 10px rgba(50, 50, 50, 0.075);"
		>
			<div class="flex items-center gap-2 px-4 py-2">
				<button type="button" aria-label="Close share dropdown" class="focus:outline-none" onclick={() => (showDropDown = false)}>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5">
						<path
							d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
						></path>
					</svg>
					<span class="sr-only">Close</span>
				</button>

				<span class="font-medium">Share</span>
			</div>

			<hr />

			<ul class="m-0 grid list-none grid-cols-4 items-end justify-items-center gap-4 p-4">
				<li class="col-span-1">
					<button
						type="button"
						class="flex max-w-max flex-col items-center justify-center gap-1 text-xs focus:outline-none"
						onclick={() => {
							copyToClipboard(`${page?.url?.href}`), (showDropDown = false)
						}}
					>
						<img src={linkIcon} alt="Link icon" class="h-8 w-auto object-contain object-center" />

						<span class="leading-3">Copy Link</span>
					</button>
				</li>

				{#each socialSharesList as ss}
					<li class="col-span-1">
						<a
							href={encodeURI(ss.href)}
							data-action={ss.dataAction || ''}
							target="_blank"
							rel="noopener noreferrer"
							class="flex max-w-max flex-col items-center justify-center gap-1 text-xs"
							onclick={() => (showDropDown = false)}
						>
							<img src={ss.icon} alt="{ss.title} icon" class="h-8 w-auto object-contain object-center" />

							<span class="leading-3">{ss.title}</span>
						</a>
					</li>
				{/each}
			</ul>
		</div>

		<button
			type="button"
			class="fixed inset-0 z-40 h-full w-full bg-black bg-opacity-0 focus:outline-none lg:z-0"
			onclick={() => (showDropDown = false)}
		>
			<span class="sr-only">Close</span>
		</button>
	{/if}
</div>
