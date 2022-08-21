<style>
.frosted {
	background-image: url('/auth/login/bg-lighter.svg');
	backdrop-filter: blur(15px);
	background-color: hsla(0, 0%, 100%, 0.75);
}
</style>

<script>
import SEO from '$lib/components/SEO/index.svelte'
import ImageLoader from '$lib/components/Image/ImageLoader.svelte'
import { toast } from '$lib/util'
import { goto } from '$app/navigation'
import VerifyOtp from '../_VerifyOtp.svelte'
import SendOtp from '../_SendOtp.svelte'
import { page } from '$app/stores'
import { browser } from '$app/env'
import { GQL_getOtp, GQL_storeOne, GQL_verifyOtp } from '$houdini'
import { onMount } from 'svelte'
import Cookie from 'cookie-universal'
const cookies = Cookie()
// let go = '/auth/login'

export let data
let { me, ref, store, user } = data
$: ({ me, ref, store, user } = data)
const seoProps = {
	title: 'OTP Login ',
	metadescription: 'OTP Login'
}

// const cookies = Cookie()
// let store = cookies.get('store')

onMount(async () => {
	// await GQL_storeOne.fetch({ variables: { id: store?.id } })
})

let phone,
	loading = false,
	otpRequestSend = false,
	resendAfter

async function handleSendOTP(detail) {
	try {
		loading = true
		phone = detail.detail
		const { data } = await GQL_getOtp.mutate({ variables: { phone, store: store.id } })
		resendAfter = data?.getOtp?.timer
		otpRequestSend = true
	} catch (e) {
		toast(e, 'error')
	} finally {
		loading = false
	}
}

async function handleVerifyOtp(detail) {
	try {
		loading = true
		// console.log(detail)
		const otp = `${detail.detail}`
		const data = (await GQL_verifyOtp.mutate({ variables: { phone, otp, store: store.id } })).data
			?.verifyOtp
		if ($GQL_verifyOtp.errors) toast($GQL_verifyOtp.errors[0].message, 'error')
		else {
			const me = {
				email: data.email,
				firstName: data.firstName,
				lastName: data.lastName,
				avatar: data.avatar,
				role: data.role,
				verified: data.verified,
				active: data.active
			}
			await cookies.set('me', me, { path: '/' })
			user.me = me
			let r = ref || '/my'
			if (browser) goto(r)
		}
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

	<a href="/" class="mx-auto mb-5 max-w-max">
		{#if store?.logoCdn}
			<ImageLoader
				src="{store?.logoCdn}"
				alt="{store?.name} logo"
				class="h-10 w-auto flex-shrink-0 object-contain object-center" />
		{:else if store?.websiteName}
			<h1
				class="bg-gradient-to-br from-secondary-500 to-primary-500 bg-clip-text text-4xl font-extrabold text-transparent">
				{store?.websiteName}
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

	<div class="mx-auto flex w-full max-w-sm flex-wrap items-center justify-center gap-4 leading-4">
		<a
			href="{`/auth/login?ref=${$page.url.searchParams.get('ref') || '/'}`}"
			class="max-w-max whitespace-nowrap text-primary-500 hover:underline">
			Login with email
		</a>

		<!-- <a
				href="https://admin.atozzones.com/otplogin?role=vendor&store={store?.id}"
				target="_blank"
				rel="noopener noreferrer"
				class="text-primary-500 hover:underline max-w-max whitespace-nowrap">
				Login as vendor
			</a> -->
	</div>
</div>
