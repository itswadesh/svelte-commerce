<script>
import { browser } from '$app/environment'
import { fly } from 'svelte/transition'
import { goto, invalidateAll } from '$app/navigation'
import { page } from '$app/stores'
import { post } from '$lib/utils/api'
import { toast } from '$lib/utils'
import { UserService } from '$lib/services'
import Cookie from 'cookie-universal'
import Error from '$lib/components/Error.svelte'
import LazyImg from '$lib/components/Image/LazyImg.svelte'
import PrimaryButton from '$lib/ui/PrimaryButton.svelte'
import SEO from '$lib/components/SEO/index.svelte'
import TextboxFloating from '$lib/ui/TextboxFloating.svelte'
const IS_DEV = import.meta.env.DEV

const cookies = Cookie()

const seoProps = {
	title: 'Signup',
	description: 'Signup'
}

let ref = $page?.url?.searchParams.get('ref')
let role = $page?.url?.searchParams.get('role') || 'admin'
let store = $page?.url?.searchParams.get('store') || undefined
let newResistration = {
	firstName: IS_DEV ? 'Swadesh' : '',
	lastName: IS_DEV ? 'Behera' : '',
	email: IS_DEV ? 'hi@litekart.in' : '',
	password: IS_DEV ? 'litekart' : '',
	passwordConfirmation: IS_DEV ? 'litekart' : ''
}
let loading = false
let showPassword = false
let passwordType = 'password'
let showConfirmPassword = false
let confirmPasswordType = 'password'
let err

function togglePassword() {
	showPassword = !showPassword
	if (passwordType === 'password') {
		passwordType = 'text'
	} else passwordType = 'password'
}

function toggleConfirmPassword() {
	showConfirmPassword = !showConfirmPassword
	if (confirmPasswordType === 'password') {
		confirmPasswordType = 'text'
	} else confirmPasswordType = 'password'
}

function getLoginUrl(baseUrl) {
	const query = $page.url.searchParams.toString()
	const ref = $page.url.searchParams.get('ref')
	// let baseUrl = `${$page.data.origin}/auth/login`
	let url = '' //new URL(baseUrl)
	if (!!ref) {
		// url.searchParams.set('ref', ref || '')
		url = `${baseUrl}?ref=${ref}`
	} else {
		url = baseUrl + '?' + query
	}
	return url.toString()
}

async function submit(n) {
	try {
		loading = true
		const { firstName, lastName, phone, email, password, passwordConfirmation } = n

		const res = await UserService.signupService({
			firstName: firstName,
			lastName: lastName,
			phone: phone,
			email: email,
			password: password,
			passwordConfirmation: passwordConfirmation,
			role: role,
			storeId: $page.data.store?.id,
			origin: $page.data.origin
		})

		const me = {
			id: res._id || res.id,
			email: res.email,
			phone: res.phone,
			firstName: res.firstName,
			lastName: res.lastName,
			avatar: res.avatar,
			role: res.role,
			verified: res.verified,
			active: res.active,
			store: res.store
		}

		await cookies.set('me', me, { path: '/' })
		// $page.data.me = me
		await invalidateAll()

		if (browser) goto('/')
	} catch (e) {
		toast(e, 'error')
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
			<LazyImg
				src="{$page?.data?.store?.logo}"
				alt="logo"
				height="64"
				aspect_ratio="4:1"
				class="max-h-16 max-w-[160px] object-contain object-center" />
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

	<h1 class="mb-8 w-full text-center text-2xl font-semibold text-primary-500">Signup</h1>

	<Error err="{err}" />

	<form class="mb-5 flex flex-col gap-5" on:submit|preventDefault="{() => submit(newResistration)}">
		<TextboxFloating
			type="text"
			label="First Name"
			class="w-full"
			required
			bind:value="{newResistration.firstName}" />

		<TextboxFloating
			type="text"
			label="Last Name"
			class="w-full"
			required
			bind:value="{newResistration.lastName}" />

		<TextboxFloating type="tel" label="Phone" class="w-full" bind:value="{newResistration.phone}" />

		<div>
			<TextboxFloating
				type="email"
				label="Email"
				class="mb-1 w-full"
				bind:value="{newResistration.email}" />

			<p class="text-xs">
				Do not have email?
				<a
					href="{getLoginUrl('/auth/login')}"
					tabindex="-1"
					class="text-primary-500 hover:underline">
					Signup using phone number
				</a>
			</p>
		</div>

		<div class="relative">
			<TextboxFloating
				type="{passwordType}"
				label="Password"
				class="w-full"
				required
				bind:value="{newResistration.password}" />

			<button
				type="button"
				tabindex="-1"
				class="absolute inset-y-0 right-2 flex cursor-pointer items-end justify-center pb-2"
				on:click="{togglePassword}">
				{#if showPassword}
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
				type="{confirmPasswordType}"
				label="Confirm Password"
				class="w-full"
				required
				bind:value="{newResistration.passwordConfirmation}" />

			<button
				type="button"
				tabindex="-1"
				class="absolute inset-y-0 right-2 flex cursor-pointer items-end justify-center pb-2"
				on:click="{toggleConfirmPassword}">
				{#if showConfirmPassword}
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

		<PrimaryButton type="submit" loading="{loading}" class="w-full">SUMBIT</PrimaryButton>
	</form>

	<div class="mx-auto mb-5 flex max-w-max flex-col gap-1 text-center">
		<a
			href="{getLoginUrl('/auth/login')}"
			aria-label="Click to signin"
			class="whitespace-nowrap text-primary-500 hover:text-primary-700 hover:underline">
			Signin
		</a>
	</div>

	<p in:fly="{{ y: 10, duration: 700, delay: 300 }}" class="text-center text-sm text-zinc-500">
		By clicking login you are accepting our

		<br />

		<a
			href="/terms-conditions"
			aria-label="Click to visit terms & conditions"
			target="_blank"
			rel="noopener noreferrer"
			class="whitespace-nowrap text-primary-500 hover:text-primary-700 hover:underline">
			<b>Terms & Conditions</b>
		</a>
	</p>
</div>
