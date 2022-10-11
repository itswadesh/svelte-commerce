<style>
.frosted {
	background-image: url('/auth/login/bg-lighter.svg');
	backdrop-filter: blur(15px);
	background-color: hsla(0, 0%, 100%, 0.75);
}
</style>

<script>
import SEO from '$lib/components/SEO/index.svelte'
import LazyImg from '$lib/components/Image/LazyImg.svelte'
import { toast } from '$lib/util'
import { goto, invalidateAll } from '$app/navigation'
import VerifyOtp from '../_VerifyOtp.svelte'
import SendOtp from '../_SendOtp.svelte'
import { page } from '$app/stores'
import { onMount } from 'svelte'
import Cookie from 'cookie-universal'
import { post } from '$lib/util/api'
import { browser } from '$app/environment'

const cookies = Cookie()

export let data

const seoProps = {
	title: 'OTP Login',
	description: 'OTP Login'
}

// console.log('zzzzzzzzzzzzzzzzzz', $page)

onMount(async () => {})

let phone
let loading = false
let otpRequestSend = false
let resendAfter = 0
let ref = $page?.url?.searchParams.get('ref')

async function handleSendOTP({ detail }) {
	phone = detail
	try {
		loading = true
		const data = await post('get-otp', { phone }, $page.data.origin)
		resendAfter = data?.timer
		otpRequestSend = true
	} catch (e) {
		toast(e, 'error')
	} finally {
		loading = false
	}
}

async function handleVerifyOtp({ detail }) {
	try {
		loading = true
		const otp = detail
		const data = await post('verify-otp', { phone, otp }, $page.data.origin)
		const me = {
			email: data.email,
			phone: data.phone,
			firstName: data.firstName,
			lastName: data.lastName,
			avatar: data.avatar,
			role: data.role,
			verified: data.verified,
			active: data.active
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
</script>

<SEO {...seoProps} />

<div
	class="frosted container mx-auto flex w-full max-w-sm flex-col rounded-2xl border bg-cover bg-center bg-no-repeat p-10 shadow-2xl"
	style="background-image: url('/login/bg-lighter.svg');">
	<h1 class="mb-5 w-full  pb-4 text-center text-2xl font-bold text-primary-500">Login/Register</h1>

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

	<!-- <div
		class="mx-auto mb-5 flex w-full max-w-sm flex-wrap items-center justify-center gap-4 leading-4">
		<a
			href="{`/auth/login?ref=${$page.url.searchParams.get('ref') || '/'}`}"
			aria-label="Click to login with email"
			class="max-w-max whitespace-nowrap text-primary-500 hover:text-primary-700 hover:underline hover:underline">
			Login with email
		</a>
	</div> -->

	<p class="text-center text-sm text-gray-500">
		By clicking send OTP you are accepting our
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
