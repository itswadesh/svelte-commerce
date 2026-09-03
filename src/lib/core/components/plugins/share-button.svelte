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

	// The X share used to post `zapvi` as both hashtag and handle, with mobile-accessory keywords
	// as `related`, whatever the store sells. Nothing about another merchant belongs in a share
	// this store's shopper sends; the only credit that can be right is the store's own handle,
	// taken from its social settings, and nothing at all when it has none.
	const twitterVia = $derived.by(() => {
		const profile = page.data?.store?.plugins?.socialSharingButtons?.twitter
		if (!profile) return ''
		const handle = String(profile).replace(/\/+$/, '').split('/').pop() || ''
		return /^[A-Za-z0-9_]{1,15}$/.test(handle) ? handle : ''
	})

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
			href: `https://twitter.com/intent/tweet/?text=${productName}&url=${url}`
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
		class="group flex items-center gap-2 rounded-full border-border px-3 py-1.5 transition-all duration-fast hover:border-primary hover:text-primary sm:border lg:px-4
		{showDropDown ? 'sm:border-foreground sm:bg-foreground sm:text-background' : 'bg-background text-foreground'}
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

		<span class="hidden text-sm font-medium sm:block">Share</span>
	</button>

	{#if showDropDown}
		<!-- Backdrop for closing -->
		<button
			type="button"
			class="fixed inset-0 z-overlay bg-black/40 backdrop-blur-xs transition-opacity"
			onclick={() => (showDropDown = false)}
			transition:fade={{ duration: 200 }}
		>
			<span class="sr-only">Close Share Menu</span>
		</button>

		<!-- Desktop Share Popover -->
		<div
			transition:fly={{ y: -10, duration: 300 }}
			class="absolute right-0 top-12 z-popover hidden w-72 flex-col rounded-lg border bg-popover p-4 shadow-z-10 lg:flex"
		>
			<div class="mb-4 flex items-center justify-between px-1">
				<h3 class="text-sm font-bold text-foreground">Share Product</h3>
				<button
					type="button"
					aria-label="Close share options"
					class="rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
					onclick={() => (showDropDown = false)}
				>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5">
						<path
							d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
						/>
					</svg>
				</button>
			</div>

			<div class="grid grid-cols-4 gap-x-2 gap-y-6">
				<div class="flex flex-col items-center gap-1.5">
					<div class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full shadow-sm transition-transform hover:scale-110">
						<WhatsApp class="flex h-full w-full" text="{productName} {url}" />
					</div>
					<span class="text-xs font-medium text-muted-foreground">WhatsApp</span>
				</div>
				<div class="flex flex-col items-center gap-1.5">
					<div class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full shadow-sm transition-transform hover:scale-110">
						<Telegram class="flex h-full w-full" text={productName} {url} />
					</div>
					<span class="text-xs font-medium text-muted-foreground">Telegram</span>
				</div>
				<div class="flex flex-col items-center gap-1.5">
					<div class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full shadow-sm transition-transform hover:scale-110">
						<Facebook class="flex h-full w-full" quote={productName} {url} />
					</div>
					<span class="flex text-xs font-medium text-muted-foreground">Facebook</span>
				</div>
				<div class="flex flex-col items-center gap-1.5">
					<div class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full shadow-sm transition-transform hover:scale-110">
						<X class="flex h-full w-full" text={productName} {url} via={twitterVia} />
					</div>
					<span class="text-xs font-medium text-muted-foreground">X</span>
				</div>
				<div class="flex flex-col items-center gap-1.5">
					<div class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full shadow-sm transition-transform hover:scale-110">
						<Pinterest class="flex h-full w-full" {url} media={productImage} description={productName} />
					</div>
					<span class="text-xs font-medium text-muted-foreground">Pinterest</span>
				</div>
				<div class="flex flex-col items-center gap-1.5">
					<div class="flex h-10 w-10 overflow-hidden rounded-full shadow-sm transition-transform hover:scale-110">
						<LinkedIn class="flex h-full w-full" {url} />
					</div>
					<span class="text-xs font-medium text-muted-foreground">LinkedIn</span>
				</div>
				<div class="flex flex-col items-center gap-1.5">
					<div class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full shadow-sm transition-transform hover:scale-110">
						<Email class="flex h-full w-full" subject="Check this out: {productName}" body={url} />
					</div>
					<span class="text-xs font-medium text-muted-foreground">Email</span>
				</div>
				<div class="flex flex-col items-center gap-1.5">
					<button
						type="button"
						aria-label="Copy product link"
						class="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground transition-all hover:bg-primary hover:text-primary-foreground"
						onclick={() => copyToClipboard(url)}
					>
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-4 w-4">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
							/>
						</svg>
					</button>
					<span class="text-xs font-medium text-muted-foreground">Copy Link</span>
				</div>
			</div>
		</div>

		<!-- Mobile Share Bottom Sheet -->
		<div
			transition:fly={{ y: '100%', duration: 400, opacity: 1 }}
			class="pb-safe fixed inset-x-0 bottom-0 z-drawer overflow-hidden rounded-t-xl bg-background shadow-z-10 lg:hidden"
		>
			<!-- Drag Handle -->
			<div class="flex justify-center pt-3">
				<div class="h-1.5 w-12 rounded-full bg-muted"></div>
			</div>

			<div class="flex items-center justify-between px-6 py-4">
				<h3 class="text-lg font-bold text-foreground">Share Product</h3>
				<button
					type="button"
					aria-label="Close share options"
					class="flex h-11 w-11 items-center justify-center rounded-full bg-muted text-muted-foreground active:bg-muted/70"
					onclick={() => (showDropDown = false)}
				>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-6 w-6">
						<path
							d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
						/>
					</svg>
				</button>
			</div>

			<div class="grid grid-cols-4 items-start justify-items-center gap-y-6 px-4 pb-12 pt-2">
				<button
					type="button"
					class="group flex flex-col items-center gap-2"
					onclick={() => {
						copyToClipboard(url)
						showDropDown = false
					}}
				>
					<div class="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-foreground transition-all group-active:scale-95">
						<img src={linkIcon} alt="" class="h-7 w-7 opacity-80" />
					</div>
					<span class="text-xs font-medium text-muted-foreground">Copy Link</span>
				</button>

				{#each socialSharesList as ss}
					<a
						href={encodeURI(ss.href)}
						data-action={ss.dataAction || ''}
						target="_blank"
						rel="noopener noreferrer"
						class="group flex flex-col items-center gap-2"
						onclick={() => (showDropDown = false)}
					>
						<div
							class="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border bg-muted/50 transition-all group-active:scale-95 group-active:bg-muted"
						>
							<img src={ss.icon} alt="" class="h-14 w-14 rounded-full object-cover" />
						</div>
						<span class="text-xs font-medium text-muted-foreground">{ss.title}</span>
					</a>
				{/each}
			</div>
		</div>
	{/if}
</div>
