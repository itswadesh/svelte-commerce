<script>
// import indiaFlag from '$lib/assets/flags/india.png'
import { applyAction, enhance } from '$app/forms'
import { browser } from '$app/environment'
import { fly, scale } from 'svelte/transition'
import { GOOGLE_CLIENT_ID } from '$lib/config'
import { googleOneTap } from './google-one-tap'
import { goto, invalidateAll } from '$app/navigation'
import { LazyImg, Error } from '$lib/components'
import { onMount } from 'svelte'
import { page } from '$app/stores'
import { PrimaryButton } from '$lib/ui'
import { toast } from '$lib/utils'
import Cookie from 'cookie-universal'
import SEO from '$lib/components/SEO/index.svelte'
import VerifyOtp from '../_VerifyOtp.svelte'
import { UserService } from '$lib/services'

const cookies = Cookie()

const IS_DEV = import.meta.env.IS_DEV

export let data

const seoProps = {
	title: 'Login with email/phone',
	description: 'Login with email/phone'
}

let email = IS_DEV ? 'demo@litekart.in' : $page?.url?.searchParams.get('email')
let err
let isEmail = false
let isMobile = false
let loading = false
let maxlength = null
let otpRequestSend = false
let password = IS_DEV ? 'litekart' : ''
let phone = IS_DEV ? '8249028220' : ''
let ref = $page?.url?.searchParams.get('ref')
let resendAfter = 0
let selectedCountry = data.countries[0]
let showDropDown = false
let showPassword = false
let type = 'password'
let value = email ? email : IS_DEV ? 'hi@litekart.in' : null
let zodErrors = null

onMount(() => {
	googleOneTap(
		{
			client_id: GOOGLE_CLIENT_ID
		},
		async (res) => {
			try {
				const onetap = await UserService.googleOneTapLoginService({
					data: res,
					origin: $page.data.origin
				})
				const me = {
					id: onetap.id,
					email: onetap.email,
					phone: onetap.phone,
					firstName: onetap.firstName,
					lastName: onetap.lastName,
					avatar: onetap.avatar,
					role: onetap.role,
					verified: onetap.verified,
					active: onetap.active
				}
				await cookies.set('me', me, { path: '/', maxAge: 31536000 })
				let r = ref || '/'
				if (browser) goto(r)
			} catch (e) {
				toast(e?.body?.message || e, 'error')
			}
		}
	)

	verifyIsMobileNum()
})

function togglePassword() {
	showPassword = !showPassword
	if (type === 'password') {
		type = 'text'
	} else type = 'password'
}

const verifyIsMobileNum = () => {
	err = null

	if (value) {
		if (value[0] === '+') {
			isEmail = false
			isMobile = true
			maxlength = 13
		} else if (parseFloat(value) == value) {
			isEmail = false
			isMobile = true
			maxlength = 13
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

	if (isMobile) {
		phone = value
	}
}

async function handleSendOTP({ detail }) {
	phone = detail
	resendAfter = 0

	try {
		loading = true

		const res = await UserService.getOtpService({
			phone,
			storeId: data.storeId,
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

function changeNumber() {
	value = ''
	otpRequestSend = false
}
</script>

<SEO {...seoProps} />

<div class="flex w-full max-w-md flex-col rounded-2xl border bg-white p-10 shadow-2xl">
	<a href="/" aria-label="Go to home" class="mx-auto mb-8 block max-w-max">
		{#if $page.data.store?.logo}
			<img
				src="{$page.data.store?.logo}"
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

	<h2 class="mb-8 w-full text-center text-2xl font-semibold text-primary-500">Log in</h2>

	<Error {err} class="mb-5" />

	{#if !otpRequestSend}
		<form
			action="/auth/login?/login"
			method="POST"
			use:enhance="{() => {
				err = null
				return async ({ result }) => {
					resendAfter = 0

					if (result?.status === 200 && result?.data) {
						if (isEmail) {
							const me = {
								id: result?.data?._id || result?.data?.id,
								email: result?.data?.email,
								phone: result?.data?.phone,
								firstName: result?.data?.firstName,
								lastName: result?.data?.lastName,
								avatar: result?.data?.avatar,
								role: result?.data?.role,
								verified: result?.data?.verified,
								active: result?.data?.active
							}

							await cookies.set('me', me, { path: '/', maxAge: 31536000 })
							const r = ref || '/'
							if (browser) goto(r)
							await applyAction(result)
						} else {
							otpRequestSend = true
							resendAfter = result?.data?.timer
						}
					} else if (result?.error) {
						zodErrors = result?.error?.errors || null
						err = result?.error?.message || null
					}
				}
			}}"
			class="mb-8 flex flex-col gap-5">
			<!-- on:submit|preventDefault="{submit}" -->
			<!-- Email or mobile number -->

			<label>
				<!-- Heading -->

				<h6 class="mb-1">
					{#if isMobile}
						Mobile number
					{:else if isEmail}
						Email address
					{:else}
						Email or mobile number
					{/if}
				</h6>

				<div class="relative w-full rounded bg-white">
					<!-- Enter email or mobile number -->

					<input
						type="text"
						placeholder="Enter email or mobile number"
						bind:value
						{maxlength}
						autofocus
						required
						class="w-full p-3 rounded border border-zinc-200 focus:border-primary-500 focus:outline-none"
						on:input="{verifyIsMobileNum}" />
					<!-- {isMobile ? 'py-3 pl-3 pr-40' : 'p-3'} -->

					<!-- Countries list for country code -->

					<!-- {#if isMobile && selectedCountry}
						<div class="absolute right-0 inset-y-0">
							<button
								type="button"
								class="h-full relative max-w-max px-4 flex items-center justify-center gap-2 text-sm whitespace-nowrap rounded border border-transparent focus:border-primary-500 focus:outline-none"
								on:click="{() => (showDropDown = !showDropDown)}">
								<img src="{indiaFlag}" alt="" class="h-8 w-8 object-contain object-center" />

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
								class="absolute z-10 top-14 inset-x-0 h-80 p-2 overflow-y-auto bg-white border shadow-md text-sm rounded">
								{#each data.countries as country}
									<li>
										<button
											class="w-full text-left p-2 flex items-center gap-4 hover:bg-zinc-100 transition duration-300 rounded focus:outline-none"
											on:click="{() => {
												;(selectedCountry = country), (showDropDown = false)
											}}">
											<img src="{indiaFlag}" alt="" class="h-8 w-8 object-contain object-center" />

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
					{/if} -->

					{#if zodErrors?.email || zodErrors?.phone}
						<p class="mt-1 text-red-500">{zodErrors?.email || zodErrors?.phone}</p>
					{/if}
				</div>

				{#if isMobile}
					<p class="mt-1 text-xs text-zinc-500">E.g. +nnxxxxxxxxxx</p>
				{/if}
			</label>

			<!-- Email password -->

			{#if isEmail}
				<div transition:scale="{{ duration: 100 }}">
					<div class="mb-1 flex items-center justify-between gap-2">
						<label for="password" class="flex-1">Password</label>

						<a
							href="/auth/forgot-password"
							tabindex="-1"
							class="max-w-max text-xs text-zinc-500 focus:outline-none hover:underline">
							Forgot Password
						</a>
					</div>

					<div class="w-full">
						<div class="relative w-full rounded bg-white">
							{#if type === 'text'}
								<input
									id="password"
									type="text"
									placeholder="Enter email or mobile number"
									bind:value="{password}"
									required
									class="w-full rounded border border-zinc-200 py-3 pl-3 pr-12 focus:border-primary-500 focus:outline-none" />
							{:else if type === 'password'}
								<input
									id="password"
									type="password"
									placeholder="Enter email or mobile number"
									bind:value="{password}"
									required
									class="w-full rounded border border-zinc-200 py-3 pl-3 pr-12 focus:border-primary-500 focus:outline-none" />
							{/if}

							<button
								type="button"
								tabindex="-1"
								class="absolute inset-y-0 right-0 flex cursor-pointer items-center justify-center px-3"
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

						{#if zodErrors?.password}
							<p class="mt-1 text-red-500">{zodErrors?.password}</p>
						{/if}
					</div>
				</div>
			{/if}

			<input type="hidden" name="isEmail" value="{isEmail || null}" />

			<input type="hidden" name="phoneOrEmail" value="{value || null}" />

			<input type="hidden" name="password" value="{password || null}" />

			<!-- Submit -->

			<PrimaryButton
				type="submit"
				{loading}
				disabled="{loading}"
				class="w-full"
				on:click="{() => (zodErrors = null)}">
				{#if isMobile}
					Send OTP
				{:else}
					Log in
				{/if}
			</PrimaryButton>
		</form>
	{:else}
		<!-- Verify OTP -->

		<VerifyOtp
			{loading}
			bind:phone
			bind:resendAfter
			on:resend="{({ detail }) => handleSendOTP({ detail })}"
			on:changeNumber="{changeNumber}" />
	{/if}

	<!-- Signup & Join as Vendor -->

	<div class="mx-auto mb-5 flex max-w-max flex-col gap-1 text-center text-sm">
		<a
			href="{`/auth/signup?ref=${$page.url.searchParams.get('ref') || '/'}`}"
			aria-label="Click to login with email"
			class="whitespace-nowrap text-primary-500 hover:text-primary-700 hover:underline">
			Signup
		</a>

		<!-- <a
			href="{$page.data.store?.adminUrl}?role=vendor&store={$page.data.store}"
			aria-label="Click to login as vendor"
			class="whitespace-nowrap text-primary-500 hover:text-primary-700 hover:underline">
			Join as Vendor
		</a> -->
	</div>

	<!-- Terms & Conditions -->

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
