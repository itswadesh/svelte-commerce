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
import { goto, invalidate } from '$app/navigation'
import VerifyOtp from '../_VerifyOtp.svelte'
import SendOtp from '../_SendOtp.svelte'
import { page } from '$app/stores'
import { onMount } from 'svelte'
import Cookie from 'cookie-universal'
import { post } from '$lib/util/api'

const cookies = Cookie()

export let data

const seoProps = {
	title: 'OTP Login',
	description: 'OTP Login'
}

onMount(async () => {})

let phone,
	loading = false,
	otpRequestSend = false,
	resendAfter = 0

async function handleSendOTP({ detail }) {
	phone = detail
	try {
		loading = true
		const data = await post('get-otp', { phone })
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
		const data = await post('verify-otp', { phone, otp })
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
		await invalidate()
		let r = data.ref || '/'
		goto(r)
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
	class="frosted container mx-auto flex w-full max-w-sm flex-col rounded-2xl border bg-cover bg-center bg-no-repeat px-4 py-10 shadow-2xl sm:px-8"
	style="background-image: url('/login/bg-lighter.svg');">
	<!-- Store logo/name  -->
	<a href="/" aria-label="Click to route home" class="mx-auto mb-5 max-w-max" sveltekit:prefetch>
		{#if data.store?.logo}
			<div>
				<LazyImg
					src="{data.store?.logo}"
					alt="{data.store?.name} logo"
					height="40"
					class="h-10 w-auto flex-shrink-0 object-contain object-center" />
			</div>
		{:else if data.store?.websiteName}
			<h1
				class="bg-gradient-to-br from-secondary-500 to-primary-500 bg-clip-text text-4xl font-extrabold text-transparent">
				{data.store?.websiteName}
			</h1>
		{/if}
	</a>

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
    class="mx-auto mb-5 flex w-full max-w-sm flex-wrap items-center justify-center gap-4 leading-4"
  >
    <a
      href={`/auth/login?ref=${$page.url.searchParams.get('ref') || '/'}`}
	  aria-label="Click to login with email"
      class="link max-w-max whitespace-nowrap hover:underline"
    >
      Login with email
    </a>
  </div> -->

	<p class="text-center text-sm text-gray-500">
		By clicking send OTP you are accepting our
		<a
			href="/p/terms"
			aria-label="Click to route terms & conditions"
			target="_blank"
			rel="noopener noreferrer"
			class="link whitespace-nowrap">
			<b>Terms & Conditions</b>
		</a>
	</p>
</div>
