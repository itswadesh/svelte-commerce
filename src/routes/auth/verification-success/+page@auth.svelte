<style scoped>
.frosted {
	background-image: url('/login/bg-lighter.svg');
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
import { goto } from '$app/navigation'
import ImageLoader from '$lib/components/Image/ImageLoader.svelte'
import { loginUrl, settings } from '$lib/store'

export let store

function gotoLogin() {
	goto($loginUrl)
}
</script>

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

	<div class="mx-auto mt-5 md:w-10/12">
		<div class="mx-auto max-w-max">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-28 w-28 text-green-500 opacity-50"
				viewBox="0 0 20 20"
				fill="currentColor">
				<path
					fill-rule="evenodd"
					d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
					clip-rule="evenodd"></path>
			</svg>
		</div>

		<div class="mt-5 flex flex-col space-y-5">
			<div class="mb-5 text-center font-bold uppercase">Account successfully verified</div>

			<div class="flex items-center justify-center">
				<a href="/" class="text-start max-w-max text-primary-500 hover:underline"> Back to Home </a>
			</div>
		</div>
	</div>
</div>
