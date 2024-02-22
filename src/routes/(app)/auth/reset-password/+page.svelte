<script>
import { browser } from '$app/environment'
import { goto, invalidateAll } from '$app/navigation'
import { page } from '$app/stores'
import { LazyImg, Error } from '$lib/components'
import { TextboxFloating, PrimaryButton } from '$lib/ui'
import SEO from '$lib/components/SEO/index.svelte'
import { UserService } from '$lib/services'

const seoProps = {
	title: 'Reset Password',
	description: 'Reset Password'
}

let loading = false
let password = {}
let showOldPassword = false
let showNewPassword = false
let showConfirmationPassword = false
let oldPassowrdType = 'password'
let newPassowrdType = 'password'
let confirmationPassowrdType = 'password'
let err

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

async function submit(p) {
	try {
		loading = true
		const { password, passwordConfirmation } = p
		const id = $page.data?.id
		const token = $page.data?.token

		const res = await UserService.resetPasswordService({
			id,
			token,
			password,
			passwordConfirmation,
			storeId: $page?.data?.storeId,
			origin: $page.data.origin
		})

		await invalidateAll()

		if (browser) goto('/auth/change-success')
	} catch (e) {
		err = e
	} finally {
		loading = false
	}
}
</script>

<SEO {...seoProps} />

<div class="flex w-full max-w-md flex-col rounded-2xl border bg-white p-10 shadow-2xl">
	<a href="/" aria-label="Go to home" class="mx-auto mb-8 block max-w-max">
		{#if $page.data.store?.logo}
			<img
				src="{$page?.data?.store?.logo}"
				alt="logo"
				class="max-h-10 sm:max-h-16 w-40 object-contain object-center" />
		{:else}
			<h1
				class="bg-gradient-to-b from-primary-500 to-primary-700 bg-clip-text text-3xl font-extrabold text-transparent underline decoration-zinc-800">
				{#if $page.data.store?.websiteName}
					{$page.data.store?.websiteName}
				{:else}
					Litekart
				{/if}
			</h1>
		{/if}
	</a>

	<h2 class="mb-8 w-full text-center text-2xl font-semibold text-primary-500">Reset Password</h2>

	<Error {err} />

	<form class="mb-5 flex flex-col gap-5" on:submit|preventDefault="{() => submit(password)}">
		<div class="relative">
			<TextboxFloating
				type="{newPassowrdType}"
				label="New Password"
				class="w-full"
				required
				bind:value="{password.password}" />

			<button
				type="button"
				tabindex="-1"
				class="absolute inset-y-0 right-2 flex cursor-pointer items-end justify-center pb-2"
				on:click="{() => toggleNewPassowrd()}">
				{#if showNewPassword}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="h-5 w-5">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
						></path>
					</svg>
				{:else}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="h-5 w-5">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
						></path>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
					</svg>
				{/if}
			</button>
		</div>

		<div class="relative">
			<TextboxFloating
				type="{confirmationPassowrdType}"
				label="Confirm Password"
				class="w-full"
				required
				bind:value="{password.passwordConfirmation}" />

			<button
				type="button"
				tabindex="-1"
				class="absolute inset-y-0 right-2 flex cursor-pointer items-end justify-center pb-2"
				on:click="{() => toggleConfirmationPassowrd()}">
				{#if showConfirmationPassword}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="h-5 w-5">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
						></path>
					</svg>
				{:else}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="h-5 w-5">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
						></path>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
					</svg>
				{/if}
			</button>
		</div>

		<PrimaryButton type="submit" {loading} class="w-full">UPDATE PASSWORD</PrimaryButton>
	</form>

	<div class="mx-auto flex max-w-max flex-col gap-1 text-center text-sm">
		<a
			href="{`${$page.url.searchParams.get('ref') || '/'}`}"
			aria-label="Click to back into login"
			class="max-w-max whitespace-nowrap text-primary-500 hover:text-primary-700 hover:underline">
			Go Back
		</a>
	</div>
</div>
