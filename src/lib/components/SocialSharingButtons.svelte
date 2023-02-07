<script lang="ts">
import { Reddit, Telegram, WhatsApp, Facebook, Twitter } from 'svelte-share-buttons-component'
import { WWW_URL } from '$lib/config'
import { fly } from 'svelte/transition'

export let product

let showDropDown = false
</script>

<div class="relative max-w-max">
	<button
		type="button"
		class="flex items-center gap-2 rounded-full border py-1 px-4 transition duration-300 focus:outline-none 
		{showDropDown
			? 'border-primary-500 bg-primary-500 text-white shadow-lg'
			: 'hover:border-primary-500 hover:text-primary-500'}
		"
		on:click="{() => (showDropDown = !showDropDown)}"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="h-5 w-5"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
			></path>
		</svg>

		<span> Share </span>
	</button>

	{#if showDropDown}
		<ul
			transition:fly="{{ y: -5, duration: 300 }}"
			class="absolute top-10 right-0 z-50 flex min-w-max list-none flex-col divide-y rounded-md border bg-white shadow-md"
		>
			<li class="p-2">
				<Reddit title="{product.title || product.name}" url="{WWW_URL}" />
			</li>

			<li class="p-2">
				<Telegram text="{product.title || product.name}" url="{WWW_URL}" />
			</li>

			<li class="p-2">
				<WhatsApp text="{product.title || product.name} {WWW_URL}" />
			</li>

			<li class="p-2">
				<Facebook quote="{product.title || product.name}" url="{WWW_URL}" />
			</li>

			<li class="p-2">
				<Twitter
					text="{product.title || product.name}"
					url="{WWW_URL}"
					hashtags="lrnr"
					via="lrnrin"
					related="mcq,cbse,chse,wbbse"
				/>
			</li>
		</ul>

		<button
			type="button"
			class="fixed inset-0 z-40 h-full w-full bg-black bg-opacity-0 focus:outline-none"
			on:click="{() => (showDropDown = false)}"
		>
		</button>
	{/if}
</div>
