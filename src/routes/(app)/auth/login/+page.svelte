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
import { page } from '$app/stores'
import { onMount } from 'svelte'
// import Cookie from 'cookie-universal'
import { post } from '$lib/util/api'
import { browser } from '$app/environment'
// import Partytown from 'partytown-sveltekit/Partytown.svelte'

// const cookies = Cookie()

export let data

const seoProps = {
	title: 'OTP Login',
	description: 'OTP Login'
}

onMount(async () => {
	const { googleOneTap } = await import('./google-one-tap')
	const options = {
		client_id: $page.data.store.GOOGLE_CLIENT_ID, // required
		auto_select: false, // optional
		cancel_on_tap_outside: false, // optional
		context: 'signin' // optional
	}
	googleOneTap(options, async (response) => {
		console.log('rrrrrrrrrrrrrrrr', response)
		const onetap = await post('/api/auth/google/onetap', response)
	})
})

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
		// await cookies.set('me', me, { path: '/' })
		// $page.data.me = me
		await invalidateAll()
		let r = data.ref || '/'
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
	<h1
		class="mb-5 w-full border-b-2 border-primary-500 pb-4 text-center text-xl font-bold text-primary-500">
		Login/Register
	</h1>

	<p class="text-center text-sm text-gray-500">
		By clicking send OTP you are accepting our
		<a
			href="/p/terms-conditions"
			aria-label="Click to route terms & conditions"
			target="_blank"
			rel="noopener noreferrer"
			class="link whitespace-nowrap">
			<b>Terms & Conditions</b>
		</a>
	</p>
</div>
