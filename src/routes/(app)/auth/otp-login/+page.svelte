<script>
import { browser } from '$app/environment'
import { goto, invalidateAll } from '$app/navigation'
import { page } from '$app/stores'
import { post } from '$lib/utils/api'
import { toast } from '$lib/utils'
import { UserService } from '$lib/services'
import Cookie from 'cookie-universal'
import { LazyImg } from '$lib/components'
import SendOtp from '../_SendOtp.svelte'
import SEO from '$lib/components/SEO/index.svelte'
import VerifyOtp from '../_VerifyOtp.svelte'

const cookies = Cookie()

export let data

const seoProps = {
	title: 'OTP Login',
	description: 'OTP Login'
}

let phone
let loading = false
let otpRequestSend = false
let resendAfter = 0
let ref = $page?.url?.searchParams.get('ref')

async function handleSendOTP({ detail }) {
	phone = detail
	const role = $page.url.searchParams.get('role')
	const store = $page.url.searchParams.get('store')
	const getOtpPayLoad = {
		phone,
		role: 'admin'
	}
	if (role && role !== 'null' && role !== null) {
		getOtpPayLoad.role = role
	}
	if (store && store !== 'null' && store !== null) {
		getOtpPayLoad.store = store
	}
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
		toast(e.message, 'error')
	} finally {
		loading = false
	}
}

async function handleVerifyOtp({ detail }) {
	try {
		loading = true
		const otp = detail

		const res = await UserService.verifyOtpService({
			phone,
			otp,
			storeId: data.storeId,
			origin: data.origin
		})

		const me = {
			id: res._id,
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

		let r = ref || '/'
		if (browser) goto(r)
	} catch (e) {
		toast(e, 'error')
	} finally {
		loading = false
	}
}

function changeNumber() {
	phone = ''
	otpRequestSend = false
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

	<h2 class="mb-8 w-full text-center text-2xl font-semibold text-primary-500">Login/Register</h2>

	{#if !otpRequestSend}
		<SendOtp
			loading="{loading}"
			phone="{phone}"
			on:send="{({ detail }) => handleSendOTP({ detail })}" />
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
			href="{getLoginUrl('/auth/login')}"
			aria-label="Click to login with email"
			class="whitespace-nowrap text-primary-500 hover:text-primary-700 hover:underline">
			Login with Email
		</a>

		<!-- <a
			href="{`/auth/signup?ref=${$page.url.searchParams.get('ref') || '/'}`}"
			aria-label="Click to login with email"
			class="whitespace-nowrap text-primary-500 hover:text-primary-700 hover:underline">
			Signup
		</a> -->
	</div>

	<p class="text-center text-sm text-zinc-500">
		By clicking send OTP you are accepting our
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
