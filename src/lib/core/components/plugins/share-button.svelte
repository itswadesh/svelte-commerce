<script lang="ts">
	import { fly, fade } from 'svelte/transition'
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
	import { toast } from '@misiki/kitcommerce-core'

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
			title: 'LinkedIn',
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
		toast.success('Link copied')
	}
</script>

<div class="relative max-w-max">
	<button
		type="button"
		aria-label="Open Share Options"
		class="group flex items-center gap-2 rounded-full sm:border border-zinc-200 px-3 py-1.5 transition-all duration-300 hover:border-primary-500 hover:text-primary-500 focus:outline-none sm:focus:ring-2 sm:focus:ring-primary-500 sm:focus:ring-offset-2 lg:px-4
		{showDropDown ? 'sm:bg-zinc-900 sm:text-white sm:border-zinc-900 sm:ring-2 sm:ring-primary-500 sm:ring-offset-2' : 'bg-white text-zinc-700'}
		"
		onclick={() => (showDropDown = !showDropDown)}
	>
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
			></path>
		</svg>

		<span class="text-sm hidden sm:block font-medium">Share</span>
	</button>

	{#if showDropDown}
		<!-- Backdrop for closing -->
		<button
			type="button"
			class="fixed inset-0 z-[9999997] bg-zinc-950/20 backdrop-blur-[2px] transition-opacity focus:outline-none"
			onclick={() => (showDropDown = false)}
			transition:fade={{ duration: 200 }}
		>
			<span class="sr-only">Close Share Menu</span>
		</button>

		<!-- Desktop Share Popover -->
		<div
			transition:fly={{ y: -10, duration: 300 }}
			class="absolute right-0 top-12 z-[9999998] hidden w-72 flex-col rounded-2xl border border-zinc-200 bg-white p-4 shadow-2xl lg:flex"
		>
			<div class="mb-4 flex items-center justify-between px-1">
				<h3 class="text-sm font-bold text-zinc-900">Share Product</h3>
				<button
					type="button"
					class="rounded-full p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 focus:outline-none transition-colors"
					onclick={() => (showDropDown = false)}
				>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5">
						<path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
					</svg>
				</button>
			</div>

			<div class="grid grid-cols-4 gap-y-6 gap-x-2">
				<div class="flex flex-col items-center gap-1.5">
					<div class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full shadow-sm transition-transform hover:scale-110">
						<WhatsApp class="h-full flex w-full" text="{productName} {url}" />
					</div>
					<span class="text-[10px] font-medium text-zinc-500">WhatsApp</span>
				</div>
				<div class="flex flex-col items-center gap-1.5">
					<div class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full shadow-sm transition-transform hover:scale-110">
						<Telegram class="h-full flex w-full" text={productName} {url} />
					</div>
					<span class="text-[10px] font-medium text-zinc-500">Telegram</span>
				</div>
				<div class="flex flex-col items-center gap-1.5">
					<div class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full shadow-sm transition-transform hover:scale-110">
						<Facebook class="h-full flex w-full" quote={productName} {url} />
					</div>
					<span class="text-[10px] flex font-medium text-zinc-500">Facebook</span>
				</div>
				<div class="flex flex-col items-center gap-1.5">
					<div class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full shadow-sm transition-transform hover:scale-110">
						<X
							class="h-full flex w-full"
							text={productName}
							{url}
							hashtags="zapvi"
							via="zapvi"
							related="mobile cover, mousepad, phone grips, t-shirt, keychain, mobile accessories"
						/>
					</div>
					<span class="text-[10px] font-medium text-zinc-500">X</span>
				</div>
				<div class="flex flex-col items-center gap-1.5">
					<div class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full shadow-sm transition-transform hover:scale-110">
						<Pinterest class="h-full flex w-full" {url} media={productImage} description={productName} />
					</div>
					<span class="text-[10px] font-medium text-zinc-500">Pinterest</span>
				</div>
				<div class="flex flex-col items-center gap-1.5">
					<div class="flex h-10 w-10 overflow-hidden rounded-full shadow-sm transition-transform hover:scale-110">
						<LinkedIn class="h-full flex w-full" {url} />
					</div>
					<span class="text-[10px] font-medium text-zinc-500">LinkedIn</span>
				</div>
				<div class="flex flex-col items-center gap-1.5">
					<div class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full shadow-sm transition-transform hover:scale-110">
						<Email class="h-full flex w-full" subject="Check this out: {productName}" body={url} />
					</div>
					<span class="text-[10px] font-medium text-zinc-500">Email</span>
				</div>
				<div class="flex flex-col items-center gap-1.5">
					<button
						type="button"
						class="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 transition-all hover:bg-primary-500 hover:text-white"
						onclick={() => copyToClipboard(url)}
					>
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-4 w-4">
							<path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
						</svg>
					</button>
					<span class="text-[10px] font-medium text-zinc-500">Copy Link</span>
				</div>
			</div>
		</div>

		<!-- Mobile Share Bottom Sheet -->
		<div
			transition:fly={{ y: '100%', duration: 400, opacity: 1 }}
			class="fixed inset-x-0 bottom-0 z-[9999997] overflow-hidden rounded-t-[2rem] bg-white pb-safe lg:hidden"
			style="box-shadow: 0px -8px 40px rgba(0, 0, 0, 0.12);"
		>
			<!-- Drag Handle -->
			<div class="flex justify-center pt-3">
				<div class="h-1.5 w-12 rounded-full bg-zinc-200"></div>
			</div>

			<div class="flex items-center justify-between px-6 py-4">
				<h3 class="text-lg font-bold text-zinc-900">Share Product</h3>
				<button
					type="button"
					class="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 active:bg-zinc-200"
					onclick={() => (showDropDown = false)}
				>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-6 w-6">
						<path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
					</svg>
				</button>
			</div>

			<div class="grid grid-cols-4 items-start justify-items-center gap-y-6 px-4 pb-12 pt-2">
				<button
					type="button"
					class="group flex flex-col items-center gap-2 focus:outline-none"
					onclick={() => {
						copyToClipboard(url)
						showDropDown = false
					}}
				>
					<div class="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 group-active:scale-95 group-active:bg-zinc-200 transition-all">
						<img src={linkIcon} alt="Copy Link" class="h-7 w-7 opacity-80" />
					</div>
					<span class="text-xs font-medium text-zinc-600">Copy Link</span>
				</button>

				{#each socialSharesList as ss}
					<a
						href={encodeURI(ss.href)}
						data-action={ss.dataAction || ''}
						target="_blank"
						rel="noopener noreferrer"
						class="group flex flex-col items-center gap-2 focus:outline-none"
						onclick={() => (showDropDown = false)}
					>
						<div class="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-zinc-50 group-active:scale-95 group-active:bg-zinc-100 transition-all border border-zinc-100">
							<img src={ss.icon} alt={ss.title} class="h-14 w-14 rounded-full object-cover" />
						</div>
						<span class="text-xs font-medium text-zinc-600">{ss.title}</span>
					</a>
				{/each}
			</div>
		</div>
	{/if}
</div>

