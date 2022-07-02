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
import TextboxFloating from '$lib/ui/TextboxFloating.svelte'
import SEO from '$lib/components/SEO/index.svelte'
import ImageLoader from '$lib/components/Image/ImageLoader.svelte'
import { loginUrl } from '$lib/store'
import { KQL_StoreOne } from '$lib/graphql/_kitql/graphqlStores'
import { onMount } from 'svelte'
export let store
const seoProps = {
	title: 'Reset Password ',
	metadescription: 'Reset Password'
}

onMount(async () => {
	// await KQL_StoreOne.query({ variables: { id: store?.id } })
})

let loading = false
let showCurrentPassword = false
let showNewPassword = false
let currentPassowrdType = 'password'
let newPassowrdType = 'password'
// let go = '/auth/login'

function toggleCurrentPassowrd() {
	showCurrentPassword = !showCurrentPassword
	if (currentPassowrdType === 'password') {
		currentPassowrdType = 'text'
	} else currentPassowrdType = 'password'
}

function toggleNewPassowrd() {
	showNewPassword = !showNewPassword
	if (newPassowrdType === 'password') {
		newPassowrdType = 'text'
	} else newPassowrdType = 'password'
}
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

	<div class="mb-5 text-center font-bold uppercase">RESET PASSWORD</div>

	<h6 class="mb-3 text-center text-gray-600">Enter a new password for your accoun</h6>

	<form class="mb-8">
		<div class="relative mb-3">
			<TextboxFloating
				class="w-full"
				type="{currentPassowrdType}"
				required
				label="Current Passowrd" />

			<div
				class="absolute inset-y-0 right-0 mx-3 flex cursor-pointer items-center justify-center text-gray-500"
				on:click="{() => toggleCurrentPassowrd()}">
				{#if showCurrentPassword}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
						></path>
					</svg>
				{:else}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
						></path>
					</svg>
				{/if}
			</div>
		</div>

		<div class="relative mb-5">
			<TextboxFloating class="w-full" type="{newPassowrdType}" required label="New Passowrd" />

			<div
				class="absolute inset-y-0 right-0 mx-3 flex cursor-pointer items-center justify-center text-gray-500"
				on:click="{() => toggleNewPassowrd()}">
				{#if showNewPassword}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
						></path>
					</svg>
				{:else}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
						></path>
					</svg>
				{/if}
			</div>
		</div>

		<GradiantButton class="mx-auto w-full max-w-sm" type="submit" loading="{loading}">
			RESET PASSWORD
		</GradiantButton>
	</form>

	<div class="flex items-center justify-center">
		<a
			href="{$loginUrl}?ref=reset-password"
			class="text-start max-w-max text-primary-500 hover:underline">
			Back to login
		</a>
	</div>
</div>
