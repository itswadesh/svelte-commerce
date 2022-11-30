<style>
.frosted {
	background-image: url('/auth/login/bg-lighter.svg');
	backdrop-filter: blur(15px);
	background-color: hsla(0, 0%, 100%, 0.75);
}
</style>

<script>
import { browser } from '$app/environment'
import { goto, invalidateAll } from '$app/navigation'
import { page } from '$app/stores'
import { post } from '$lib/util/api'
import Cookie from 'cookie-universal'
import PrimaryButton from '$lib/ui/PrimaryButton.svelte'
import SEO from '$lib/components/SEO/index.svelte'
import TextboxFloating from '$lib/ui/TextboxFloating.svelte'
import Error from '$lib/components/Error.svelte'
import { googleOneTap } from './google-one-tap'
import { GOOGLE_CLIENT_ID } from '$lib/config'
import { onMount } from 'svelte'

const cookies = Cookie()

const seoProps = {
	title: 'Email Login',
	description: 'Email Login'
}

let ref = $page?.url?.searchParams.get('ref')
let email
let password
let loading = false
let showPassword = false
let type = 'password'
let err

onMount(() => {
	googleOneTap(
		{
			client_id: GOOGLE_CLIENT_ID
		},
		async (res) => {
			const onetap = await post('auth/google/onetap', res)
			const me = {
				email: onetap.email,
				phone: onetap.phone,
				firstName: onetap.firstName,
				lastName: onetap.lastName,
				avatar: onetap.avatar,
				role: onetap.role,
				verified: onetap.verified,
				active: onetap.active
			}
			await cookies.set('me', me, { path: '/' })
			let r = ref || '/'
			if (browser) goto(r)
		}
	)
})

function togglePassword() {
	showPassword = !showPassword
	if (type === 'password') {
		type = 'text'
	} else type = 'password'
}

async function submit() {
	try {
		loading = true

		const res = await post('login', {
			email: email,
			password: password
		})

		// console.log('zzzzzzzzzzzzzzzzzz', res)

		const me = {
			email: res.email,
			phone: res.phone,
			firstName: res.firstName,
			lastName: res.lastName,
			avatar: res.avatar,
			role: res.role,
			verified: res.verified,
			active: res.active
		}

		await cookies.set('me', me, { path: '/' })
		// $page.data.me = me
		await invalidateAll()
		let r = ref || '/'
		if (browser) goto(r)
	} catch (e) {
		err = e
	} finally {
		loading = false
	}
}
</script>

<SEO {...seoProps} />

<div
	class="frosted container mx-auto flex w-full max-w-sm flex-col rounded-2xl border bg-cover bg-center bg-no-repeat p-10 shadow-2xl"
	style="background-image: url('/login/bg-lighter.svg');">
	<h1 class="mb-8 w-full text-center text-2xl font-bold text-primary-500">Login</h1>

	<Error err="{err}" />

	<form class="mb-5 flex flex-col gap-5" on:submit|preventDefault="{submit}">
		<TextboxFloating type="email" label="Email" class="w-full" required bind:value="{email}" />

		<div class="relative">
			<TextboxFloating
				type="{type}"
				label="Password"
				class="w-full"
				required
				bind:value="{password}" />

			<div
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
			</div>
		</div>

		<div class="flex justify-end">
			<a
				href="{`/auth/forgot-password?ref=${$page.url.searchParams.get('ref') || '/'}`}"
				aria-label="Click to route terms & conditions"
				class="whitespace-nowrap text-xs text-gray-500 hover:underline">
				Forgot Password
			</a>
		</div>

		<PrimaryButton type="submit" loading="{loading}" class="w-full">SUBMIT</PrimaryButton>
	</form>

	<div class="mx-auto mb-5 flex max-w-max flex-col gap-1 text-center text-sm">
		<a
			href="{`/auth/otp-login?ref=${$page.url.searchParams.get('ref') || '/'}`}"
			aria-label="Click to login with email"
			class="whitespace-nowrap text-primary-500 hover:text-primary-700 hover:underline">
			Login with Phone
		</a>

		<a
			href="{`/auth/signup?ref=${$page.url.searchParams.get('ref') || '/'}`}"
			aria-label="Click to login with email"
			class="whitespace-nowrap text-primary-500 hover:text-primary-700 hover:underline">
			Signup
		</a>

		<a
			href="{$page.data.store?.adminUrl}?role=vendor&store={$page.data.store?.id}"
			aria-label="Click to login with email"
			class="whitespace-nowrap text-primary-500 hover:text-primary-700 hover:underline">
			Join as Vendor
		</a>
	</div>

	<p class="text-center text-sm text-gray-500">
		By clicking login you are accepting our
		<a
			href="/p/terms-conditions"
			aria-label="Click to route terms & conditions"
			target="_blank"
			rel="noopener noreferrer"
			class="whitespace-nowrap text-primary-500 hover:text-primary-700 hover:underline">
			<b>Terms & Conditions</b>
		</a>
	</p>
</div>
