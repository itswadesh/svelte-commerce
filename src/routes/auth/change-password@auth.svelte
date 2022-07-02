<style>
.frosted {
	background-image: url('/auth/login/bg-lighter.svg');
	backdrop-filter: blur(15px);
	background-color: hsla(0, 0%, 100%, 0.75);
}
</style>

<script context="module" lang="ts">
export async function load({ url, params, fetch, session, context }) {
	let ref = url.searchParams.get('ref')

	return {
		props: {
			store: session.store,
			ref
		}
	}
}
</script>

<script>
import { goto } from '$app/navigation'
import GradiantButton from '$lib/ui/GradiantButton.svelte'
import TextboxFloating from '$lib/ui/TextboxFloating.svelte'
import { toast } from '$lib/util'
import SEO from '$lib/components/SEO/index.svelte'
import ImageLoader from '$lib/components/Image/ImageLoader.svelte'
import { post } from '$lib/util/api'
import { loginUrl } from '$lib/store'
import { KQL_ChangePassword, KQL_StoreOne } from '$lib/graphql/_kitql/graphqlStores'
import { onMount } from 'svelte'

const seoProps = {
	title: 'Change Password ',
	metadescription: 'Change Password'
}

let loading = false
let password = {}
let showOldPassword = false
let showNewPassword = false
let showConfirmationPassword = false
let oldPassowrdType = 'password'
let newPassowrdType = 'password'
let confirmationPassowrdType = 'password'
// let go = '/auth/login'

export let store, ref

onMount(async () => {
	// await KQL_StoreOne.query({ variables: { id: store?.id } })
})

function toggleCurrentPassowrd() {
	showOldPassword = !showOldPassword
	if (oldPassowrdType === 'password') {
		oldPassowrdType = 'text'
	} else oldPassowrdType = 'password'
}

function toggleNewPassowrd() {
	showNewPassword = !showNewPassword
	if (newPassowrdType === 'password') {
		newPassowrdType = 'text'
	} else newPassowrdType = 'password'
}

function toggleConfirmationPassowrd() {
	showConfirmationPassword = !showConfirmationPassword
	if (confirmationPassowrdType === 'password') {
		confirmationPassowrdType = 'text'
	} else confirmationPassowrdType = 'password'
}

async function handleChangePassword(p) {
	try {
		const { oldPassword, password, passwordConfirmation } = p
		toast('Requesting change password...', 'info')
		loading = true
		await KQL_ChangePassword.mutate({
			variables: {
				oldPassword,
				password,
				passwordConfirmation
			}
		})
		if ($KQL_ChangePassword.errors) {
			toast('Error: ' + $KQL_ChangePassword.errors[0].message, 'error')
		} else {
			toast('Password changed successfully.', 'success')
			goto('/auth/change-success')
		}
	} catch (e) {
		toast(e.message, 'error')
		if (e.message === 'You must be logged in') {
			// let go = '/auth/login'
			// if ($session.settings.otpLogin) {
			// 	go = `/auth/phone-login`
			// }
			const url = '/'
			goto(`${$loginUrl}?ref=${url}`)
		}
	} finally {
		loading = false
	}
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

	<div class="mb-5 text-center font-bold uppercase">Change Password</div>

	<form class="mb-8" on:submit|preventDefault="{() => handleChangePassword(password)}">
		<div class="relative mb-3">
			<TextboxFloating
				bind:value="{password.oldPassword}"
				class="w-full"
				type="{oldPassowrdType}"
				required
				label="Current Passowrd" />

			<div class="absolute inset-y-0 right-3 flex items-center justify-center">
				<div
					class="text-gray-500 focus:outline-none focus:ring-0 focus:ring-offset-0"
					on:click="{() => toggleCurrentPassowrd()}">
					{#if showOldPassword}
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
		</div>

		<div class="relative mb-5">
			<TextboxFloating
				bind:value="{password.password}"
				class="w-full"
				type="{newPassowrdType}"
				required
				label="New Passowrd" />

			<div class="absolute inset-y-0 right-3 flex items-center justify-center">
				<div
					class="text-gray-500 focus:outline-none focus:ring-0 focus:ring-offset-0"
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
		</div>

		<div class="relative mb-5">
			<TextboxFloating
				bind:value="{password.passwordConfirmation}"
				class="w-full"
				type="{confirmationPassowrdType}"
				required
				label="Confirmation Passowrd" />

			<div class="absolute inset-y-0 right-3 flex items-center justify-center">
				<div
					class="text-gray-500 focus:outline-none focus:ring-0 focus:ring-offset-0"
					on:click="{() => toggleConfirmationPassowrd()}">
					{#if showConfirmationPassword}
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
		</div>

		<GradiantButton class="mx-auto w-full max-w-sm" type="submit" loading="{loading}">
			UPDATE PASSWORD
		</GradiantButton>
	</form>

	<div class="flex items-center justify-center">
		<button
			type="button"
			title="Click to go back"
			class="flex transform items-center justify-center rounded-full border bg-white p-2 transition duration-300 hover:-translate-x-1 hover:bg-primary-200"
			on:click="{() => goto(ref || '/')}">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"></path>
			</svg>
		</button>

		<!-- <a
			href="{$loginUrl}?ref=/auth/change-password"
			class="text-start max-w-max text-primary-500 hover:underline">
			Back to login
		</a> -->
	</div>
</div>
