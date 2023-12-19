<script>
import { BackButton, WhiteButton } from '$lib/ui'
import { goto } from '$app/navigation'
import SaveAddress from '../_SaveAddress.svelte'
import SEO from '$lib/components/SEO/index.svelte'

export let data

const seoProps = {
	title: 'Address Details ',
	description: 'Details about the category, name, contact, ratings, message, comments'
}

function redirectToNewAddressDetailsPage({ detail }) {
	if (detail.id === 'new' && detail.newAddressId) {
		goto(`/my/addresses/${detail.newAddressId}`)
	} else {
		goto(`/my/addresses`)
	}
}
</script>

<SEO {...seoProps} />

<section>
	<header class="mb-5 flex flex-wrap items-start justify-between gap-4">
		<div>
			<div class="flex flex-wrap items-center gap-2">
				<h2 class="capitalize">
					<span class="text-zinc-500"> Addresses / </span>

					<span>
						{#if data.id === 'new'}
							<span> New </span>
						{:else if !data.address?.title}
							<span> Address Details </span>
						{:else}
							<span> {data.address?.title} </span>
						{/if}
					</span>
				</h2>
			</div>

			<!-- <p class="mt-2"></p> -->
		</div>

		<!--  Back button -->

		<div class="flex flex-wrap items-center gap-2">
			<a href="/my/addresses" class="block">
				<WhiteButton hideLoading class="group text-xs">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="h-5 w-5 transform transition duration-300 group-hover:-translate-x-2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"
						></path>
					</svg>

					<div class="flex flex-col gap-0.5 text-left">
						<span class="hidden text-xs font-normal text-zinc-500 sm:block"> Prev </span>

						<span>Addresses</span>
					</div>
				</WhiteButton>
			</a>
		</div>
	</header>

	<div class="max-w-3xl">
		<SaveAddress
			shipping_address="{data.address}"
			countries="{data.countries}"
			states="{data.states}"
			on:saved="{({ detail }) => redirectToNewAddressDetailsPage({ detail })}" />
	</div>
</section>
