<style>
.frosted {
	background-image: url('/auth/login/bg-lighter.svg');
	backdrop-filter: blur(15px);
	background-color: hsla(0, 0%, 100%, 0.75);
}
</style>

<script>
import { browser } from '$app/environment'
import { GOOGLE_CLIENT_ID, provider } from '$lib/config'
import { googleOneTap } from '../email-login/google-one-tap'
import { goto, invalidateAll } from '$app/navigation'
import { onMount } from 'svelte'
import { page } from '$app/stores'
import { toast } from '$lib/utils'
import Cookie from 'cookie-universal'
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

onMount(() => {
	googleOneTap(
		{
			client_id: GOOGLE_CLIENT_ID
		},
		async (res) => {
			const UserService = await import(`$lib/services/${provider}/UserService.ts`)
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

async function handleSendOTP({ detail }) {
	phone = detail
	try {
		loading = true
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
		const otp = detail
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
	phone = ''
	otpRequestSend = false
}
</script>

<SEO {...seoProps} />

<div
	class="frosted container mx-auto flex w-full max-w-sm flex-col rounded-2xl border bg-cover bg-center bg-no-repeat p-10 shadow-2xl"
	style="background-image: url('/login/bg-lighter.svg');">
	<h1 class="mb-8 w-full text-center text-2xl font-bold text-primary-500">Login/Register</h1>

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
			href="{`/auth/login?ref=${$page.url.searchParams.get('ref') || '/'}`}"
			aria-label="Click to login with email"
			class="whitespace-nowrap text-primary-500 hover:text-primary-700 hover:underline">
			Login with Email
		</a>

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
		By clicking send OTP you are accepting our
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
