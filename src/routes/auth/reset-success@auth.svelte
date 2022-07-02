<style>
.frosted {
	background-image: url('/auth/login/bg-lighter.svg');
	backdrop-filter: blur(15px);
	background-color: hsla(0, 0%, 100%, 0.75);
}
</style>

<script context="module" lang="ts">
export async function load({ url, params, fetch, session, context }) {
	return {
		props: {
			store: session.store
		}
	}
}
</script>

<script>
import GradiantButton from '$lib/ui/GradiantButton.svelte'
import SEO from '$lib/components/SEO/index.svelte'
import ImageLoader from '$lib/components/Image/ImageLoader.svelte'
import { KQL_StoreOne } from '$lib/graphql/_kitql/graphqlStores'
import { loginUrl } from '$lib/store'
import { onMount } from 'svelte'
export let store
const seoProps = {
	title: 'Reset Success ',
	metadescription: 'Reset Success '
}

onMount(async () => {
	// await KQL_StoreOne.query({ variables: { id: store?.id } })
})

let loading = false
// let go = '/auth/login'
</script>

<SEO {...seoProps} />

<div
	class="frosted container mx-auto flex w-full max-w-sm flex-col rounded-2xl border bg-cover bg-center bg-no-repeat px-4 py-10 shadow-2xl sm:px-8"
	style="background-image: url('/login/bg-lighter.svg');">
	<!-- Store logo/name  -->

	<a href="/" class="mx-auto mb-5 max-w-max">
		{#if store?.logoCdn}
			<ImageLoader
				src="{store?.logoCdn}"
				alt="{store?.name} logo"
				class="h-10 w-auto flex-shrink-0 object-contain object-center" />
		{:else if store?.websiteName}
			<h1
				class="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-secondary-500 to-primary-500">
				{store?.websiteName}
			</h1>
		{/if}
	</a>

	<div class="mb-5 text-center font-bold uppercase">Reset success</div>

	<div class="mx-auto  mb-5 max-w-max">
		<svg class="h-20 w-20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 62 80">
			<path
				fill="lightblue"
				fill-rule="nonzero"
				d="M59.466 10.162l-27.88-10a2.708 2.708 0 0 0-1.84 0l-27.878 10C.748 10.562 0 11.645 0 12.858v31.945c0 5.943 2.265 11.809 6.736 17.438 1.69 2.117 3.757 4.257 6.319 6.543 2.954 2.643 10.25 7.23 15.85 10.613l.308.189c.444.277.947.414 1.45.414a2.77 2.77 0 0 0 1.458-.414l.307-.189c5.6-3.383 12.897-7.97 15.85-10.611 2.563-2.288 4.63-4.428 6.322-6.55 4.468-5.624 6.733-11.48 6.733-17.405V12.858c0-1.213-.748-2.296-1.867-2.696zm-28.8 8.41c4.613 0 8.364 3.846 8.364 8.573s-3.751 8.572-8.363 8.572-8.364-3.845-8.364-8.572c0-4.727 3.752-8.572 8.364-8.572zm13.94 37.145H16.727c-.77 0-1.394-.639-1.394-1.428 0-8.665 6.88-15.715 15.334-15.715C39.12 38.574 46 45.624 46 54.289c0 .79-.623 1.428-1.394 1.428z"
			></path>
		</svg>
	</div>

	<h6 class="mb-3 text-center text-gray-600">Password successfully changed</h6>

	<h6 class="mb-5 text-center text-gray-600">You need to login again</h6>

	<div class="flex items-center justify-center">
		<a
			href="{$loginUrl}?ref=reset-success"
			class="text-start max-w-max text-primary-500 hover:underline">
			Back to login
		</a>
	</div>
</div>
