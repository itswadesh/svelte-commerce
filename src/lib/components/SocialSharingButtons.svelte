<script lang="ts">
import { fly } from 'svelte/transition'
import { page } from '$app/stores'
import {
	Email,
	Facebook,
	LinkedIn,
	Pinterest,
	Telegram,
	Twitter,
	WhatsApp
} from 'svelte-share-buttons-component'
import { toast } from '$lib/utils'
import facebookIcon from '$lib/assets/social-media/facebook.png'
import gmailIcon from '$lib/assets/social-media/gmail.png'
import linkedinIcon from '$lib/assets/social-media/linkedin.png'
import linkIcon from '$lib/assets/social-media/link.png'
import pinterestIcon from '$lib/assets/social-media/pinterest.png'
import telegramIcon from '$lib/assets/social-media/telegram.png'
import twitterIcon from '$lib/assets/social-media/twitter.png'
import whatsappIcon from '$lib/assets/social-media/whatsapp.png'

export let productImage
export let productName
export let url

let showDropDown = false

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
		title: 'Twitter',
		href: `https://twitter.com/intent/tweet/?text=${productName}&hashtags=${'litekart'}&via=${'litekart'}&related=${'mobile cover, mousepad, phone grips, t-shirt, keychain, mobile accessories'}&url=${url}`
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
		href: `https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=${$page?.data?.store?.email}&su=Take a look at this ${productName}&body=${url}`
	}
]

const copyToClipboard = (link) => {
	navigator.clipboard.writeText(link)

	toast('Copied', 'success')
}
</script>

<div class="relative max-w-max">
	<button
		type="button"
		class="flex items-center gap-2 rounded-full border border-transparent lg:border-zinc-200 p-1 lg:py-1 lg:px-4 transition duration-300 focus:outline-none
		{showDropDown
			? 'border-primary-500 bg-primary-500 text-white shadow-lg'
			: 'lg:hover:border-primary-500 lg:hover:text-primary-500'}
		"
		on:click="{() => (showDropDown = !showDropDown)}">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="h-6 w-6 lg:h-5 lg:w-5">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
			></path>
		</svg>

		<span class="hidden lg:block"> Share </span>
	</button>

	{#if showDropDown}
		<!-- Desktop social share buttons -->

		<ul
			transition:fly="{{ y: -5, duration: 300 }}"
			class="hidden lg:flex absolute top-10 right-0 z-10 min-w-max list-none flex-col divide-y rounded border bg-white shadow-md">
			<li class="p-2">
				<WhatsApp text="{productName} {url}" />
			</li>

			<li class="p-2">
				<Telegram text="{productName}" url="{url}" />
			</li>

			<li class="p-2">
				<Facebook quote="{productName}" url="{url}" />
			</li>

			<li class="p-2">
				<Twitter
					class="share-button"
					text="{productName}"
					url="{url}"
					hashtags="litekart"
					via="litekart"
					related="mobile cover,t-shirt,key chain " />
			</li>

			<li class="p-2">
				<Pinterest url="{url}" media="{productImage}" description="{productName}" />
			</li>

			<li class="p-2">
				<LinkedIn url="{url}" />
			</li>

			<li class="p-2">
				<Email subject="Take a look at this {productName}" body="{url}" />
			</li>
		</ul>

		<!-- Mobile social share buttons -->

		<div
			transition:fly="{{ y: 100, duration: 300 }}"
			class="fixed lg:hidden inset-x-0 bottom-0 z-[100] bg-white border-t"
			style="box-shadow: 0px -4px 10px rgba(50, 50, 50, 0.075);">
			<div class="py-2 px-4 flex items-center gap-2">
				<button type="button" class="focus:outline-none" on:click="{() => (showDropDown = false)}">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						class="w-5 h-5">
						<path
							d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
						></path>
					</svg>
				</button>

				<span class="font-medium">Share</span>
			</div>

			<hr />

			<ul class="p-4 grid grid-cols-4 gap-4 m-0 list-none items-end justify-items-center">
				<li class="col-span-1">
					<button
						type="button"
						class="max-w-max flex flex-col items-center justify-center gap-1 text-xs focus:outline-none"
						on:click="{() => {
							copyToClipboard(`${$page?.url?.href}`), (showDropDown = false)
						}}">
						<img src="{linkIcon}" alt="Link icon" class="h-8 w-auto object-contain object-center" />

						<span class="leading-3">Copy Link</span>
					</button>
				</li>

				{#each socialSharesList as ss}
					<li class="col-span-1">
						<a
							href="{encodeURI(ss.href)}"
							data-action="{ss.dataAction || ''}"
							target="_blank"
							rel="noopener noreferrer"
							class="max-w-max flex flex-col items-center justify-center gap-1 text-xs"
							on:click="{() => (showDropDown = false)}">
							<img
								src="{ss.icon}"
								alt="{ss.title} icon"
								class="h-8 w-auto object-contain object-center" />

							<span class="leading-3">{ss.title}</span>
						</a>
					</li>
				{/each}
			</ul>
		</div>

		<button
			type="button"
			class="fixed inset-0 z-40 lg:z-0 h-full w-full bg-black bg-opacity-0 focus:outline-none"
			on:click="{() => (showDropDown = false)}">
		</button>
	{/if}
</div>
