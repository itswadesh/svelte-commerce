<style>
.frosted {
	background-image: url('/auth/login/bg-lighter.svg');
	backdrop-filter: blur(15px);
	background-color: hsla(0, 0%, 100%, 0.75);
}
</style>

<script>
import { browser } from '$app/environment'
import { GOOGLE_CLIENT_ID, IS_DEV, provider } from '$lib/config'
import { googleOneTap } from './google-one-tap'
import { goto, invalidateAll } from '$app/navigation'
import { onMount } from 'svelte'
import { page } from '$app/stores'
import { scale } from 'svelte/transition'
import { toast } from '$lib/utils'
import Cookie from 'cookie-universal'
import Error from '$lib/components/Error.svelte'
// import indiaFlag from '$lib/assets/flags/india.png'
import PrimaryButton from '$lib/ui/PrimaryButton.svelte'
import SEO from '$lib/components/SEO/index.svelte'
import TextboxFloating from '$lib/ui/TextboxFloating.svelte'
import VerifyOtp from '../_VerifyOtp.svelte'

const cookies = Cookie()

export let data

// console.log('zzzzzzzzzzzzzzzzzz', data)

const seoProps = {
	title: 'Login',
	description: 'Login'
}

let email = IS_DEV ? 'hi@litekart.in' : ''
let password = IS_DEV ? 'litekart' : ''
let phone = IS_DEV ? '8249028220' : ''
let err
let isEmail = false
let isMobile = false
let loading = false
let maxlength = null
let otpRequestSend = false
let ref = $page?.url?.searchParams.get('ref')
let resendAfter = 0
let selectedCountry = data.countries[0]
let showDropDown = false
let showPassword = false
let type = 'password'
let value = null

onMount(() => {
	googleOneTap(
		{
			client_id: GOOGLE_CLIENT_ID
		},
		async (res) => {
			const UserService = await import(`./../../../lib/services/${provider}/UserService.ts`)
			const onetap = await UserService.googleOneTapLoginService({
				data: res,
				origin: $page.data.origin
			})
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

const verifyIsMobileNum = () => {
	if (value) {
		if (value[0] === '+') {
			isEmail = false
			isMobile = true
			maxlength = 10
		} else if (parseFloat(value) == value) {
			isEmail = false
			isMobile = true
			maxlength = 10
		} else {
			isEmail = true
			isMobile = false
			maxlength = null
		}
	} else {
		isEmail = false
		isMobile = false
		maxlength = null
	}

	// console.log('isMobile, isEmail', isMobile, isEmail)
}

async function submit() {
	if (isMobile) {
		phone = selectedCountry?.dialCode + value
		await handleSendOTP({ detail: phone })
	} else {
		try {
			loading = true

			const UserService = await import(`./../../../lib/services/${provider}/UserService.ts`)

			const res = await UserService.loginService({
				email: email,
				password: password,
				storeId: $page.data.store?.id,
				origin: $page.data.origin
			})

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
			toast(e.body, 'error')
			err = e?.body || e
		} finally {
			loading = false
		}
	}
}

async function handleSendOTP({ detail }) {
	phone = detail

	// console.log('phone', phone)

	try {
		loading = true

		const UserService = await import(`./../../../lib/services/${provider}/UserService.ts`)

		const res = await UserService.getOtpService({
			phone,
			storeId: data.store?.id,
			origin: data.origin
		})

		resendAfter = res?.timer
		otpRequestSend = true
	} catch (e) {
		toast(e?.body?.message || e, 'error')
	} finally {
		loading = false
	}
}

async function handleVerifyOtp({ detail }) {
	try {
		loading = true

		phone = selectedCountry?.dialCode + value
		const otp = detail

		const UserService = await import(`./../../../lib/services/${provider}/UserService.ts`)

		const res = await UserService.verifyOtpService({
			phone,
			otp,
			storeId: data.store?.id,
			origin: data.origin
		})

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
		// await invalidateAll()

		let r = ref || '/'
		if (browser) goto(r)
	} catch (e) {
		toast(e?.body?.message || e, 'error')
	} finally {
		loading = false
	}
}

function changeNumber() {
	value = ''
	otpRequestSend = false
}
</script>

<SEO {...seoProps} />

<div
	class="frosted container mx-auto flex w-full max-w-sm flex-col rounded-2xl border bg-cover bg-center bg-no-repeat p-10 shadow-2xl"
	style="background-image: url('/login/bg-lighter.svg');">
	<h1 class="mb-8 w-full text-center text-2xl font-bold text-primary-500">Log in</h1>

	<Error err="{err}" />

	{#if !otpRequestSend}
		<form class="mb-8 flex flex-col gap-5" on:submit|preventDefault="{submit}">
			<!-- Email or mobile number -->

			<label>
				<h6 class="mb-1">
					{#if isMobile}
						Mobile number
					{:else if isEmail}
						Email address
					{:else}
						Email or mobile number
					{/if}
				</h6>

				<div class="relative w-full bg-white rounded-md ">
					<input
						type="text"
						placeholder="Enter email or mobile number"
						bind:value="{value}"
						maxlength="{maxlength}"
						autofocus
						required
						class="w-full rounded-md border border-gray-300 focus:border-primary-500 focus:outline-none
						{isMobile ? 'py-3 pl-3 pr-40' : 'p-3'}"
						on:input="{verifyIsMobileNum}" />

					{#if isMobile && selectedCountry}
						<div class="absolute right-0 inset-y-0">
							<button
								type="button"
								class="h-full relative max-w-max px-4 flex items-center justify-center gap-2 text-sm whitespace-nowrap rounded-md border border-transparent focus:border-primary-500 focus:outline-none"
								on:click="{() => (showDropDown = !showDropDown)}">
								<!-- <img src="{indiaFlag}" alt="" class="h-8 w-8 object-contain object-center" /> -->

								<span>{selectedCountry?.code}</span>

								<span> {selectedCountry?.dialCode} </span>

								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="currentColor"
									class="w-5 h-5 transform transition duration-300"
									class:-rotate-180="{showDropDown}">
									<path
										fill-rule="evenodd"
										d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
										clip-rule="evenodd"></path>
								</svg>
							</button>
						</div>

						{#if showDropDown}
							<ul
								class="absolute z-10 top-14 inset-x-0 h-80 p-2 overflow-y-auto bg-white border shadow-md text-sm rounded-md">
								{#each data.countries as country}
									<li>
										<button
											class="w-full text-left p-2 flex items-center gap-4 hover:bg-gray-100 transition duration-300 rounded-md focus:outline-none"
											on:click="{() => {
												;(selectedCountry = country), (showDropDown = false)
											}}">
											<!-- <img src="{indiaFlag}" alt="" class="h-8 w-8 object-contain object-center" /> -->

											<span>{country?.code}</span>

											<span> {country.name} ({country.dialCode}) </span>
										</button>
									</li>
								{/each}
							</ul>

							<button
								type="button"
								class="fixed inset-0 h-full w-screen bg-black bg-opacity-0 cursor-default focus:outline-none"
								on:click="{() => (showDropDown = false)}">
							</button>
						{/if}
					{/if}
				</div>
			</label>

			<!-- Password -->

			{#if isEmail}
				<div transition:scale="{{ duration: 300 }}">
					<div class="mb-1 flex items-center gap-2 justify-between">
						<label for="password" class="flex-1">Password</label>

						<button class="max-w-max text-xs text-gray-500 hover:underline focus:outline-none">
							Forgot Password
						</button>
					</div>

					<div class="relative w-full bg-white rounded-md">
						{#if type === 'text'}
							<input
								id="password"
								type="text"
								placeholder="Enter email or mobile number"
								bind:value="{password}"
								required
								class="py-3 pl-3 pr-12 w-full rounded-md border border-gray-300 focus:border-primary-500 focus:outline-none" />
						{:else if type === 'password'}
							<input
								id="password"
								type="password"
								placeholder="Enter email or mobile number"
								bind:value="{password}"
								required
								class="py-3 pl-3 pr-12 w-full rounded-md border border-gray-300 focus:border-primary-500 focus:outline-none" />
						{/if}

						<div
							class="absolute inset-y-0 right-0 px-3 flex cursor-pointer items-center justify-center"
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
				</div>
			{/if}

			<!-- Submit -->

			<PrimaryButton type="submit" loading="{loading}" disabled="{loading}" class="w-full">
				{#if isMobile}
					Send OTP
				{:else}
					Log in
				{/if}
			</PrimaryButton>
		</form>
	{:else}
		<VerifyOtp
			loading="{loading}"
			phone="{phone}"
			resendAfter="{resendAfter}"
			on:verifyOtp="{({ detail }) => handleVerifyOtp({ detail })}"
			on:resend="{({ detail }) => handleSendOTP({ detail })}"
			on:changeNumber="{changeNumber}" />
	{/if}

	<div class="mx-auto mb-5 flex max-w-max flex-col gap-1 text-center text-sm">
		<a
			href="{`/auth/signup?ref=${$page.url.searchParams.get('ref') || '/'}`}"
			aria-label="Click to login with email"
			class="whitespace-nowrap text-primary-500 hover:text-primary-700 hover:underline">
			Signup
		</a>

		<a
			href="{$page.data.store?.adminUrl}?role=vendor&store={$page.data.store?.id}"
			aria-label="Click to login as vendor"
			class="whitespace-nowrap text-primary-500 hover:text-primary-700 hover:underline">
			Join as Vendor
		</a>
	</div>

	<p class="text-center text-sm text-gray-500">
		By clicking login you are accepting our
		<a
			href="/terms-conditions"
			aria-label="Click to route terms & conditions"
			target="_blank"
			rel="noopener noreferrer"
			class="whitespace-nowrap text-primary-500 hover:text-primary-700 hover:underline">
			<b>Terms & Conditions</b>
		</a>
	</p>
</div>
