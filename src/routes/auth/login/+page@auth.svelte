<style>
.frosted {
	background-image: url('/auth/login/bg-lighter.svg');
	backdrop-filter: blur(15px);
	background-color: hsla(0, 0%, 100%, 0.75);
}
</style>

<script>
import ImageLoader from '$lib/components/Image/ImageLoader.svelte'
import { browser } from '$app/env'
import { goto } from '$app/navigation'
import { signIn } from '$lib/services'
import GradiantButton from '$lib/ui/GradiantButton.svelte'
import TextboxFloating from '$lib/ui/TextboxFloating.svelte'
import SEO from '$lib/components/SEO/index.svelte'
import { page, session } from '$app/stores'
import { GQL_storeOne } from '$houdini'
import Cookie from 'cookie-universal'
import { onMount } from 'svelte'

export let data
let { me, ref, store } = data
$: ({ me, ref, store } = data)
// if (me?.active && browser) goto(`/my`)
const seoProps = {
	title: 'Login ',
	metadescription: 'Login'
}

const cookies = Cookie()
// let store = cookies.get('store')

onMount(async () => {
	// await GQL_storeOne.fetch({ variables: { id: store?.id } })
})

let loading = false
let showPassword = false
let type = 'password'

function togglePassword() {
	showPassword = !showPassword
	if (type === 'password') {
		type = 'text'
	} else type = 'password'
}

// const user = getUser()
// if (browser && user) goto('/')

let email = ''
let password = ''

async function handleSignIn() {
	try {
		loading = true
		const me = await signIn({ email, password })
		// cookies.set('me', me, { path: '/' })
		$session.me = me
		let r = ref || '/my'
		if (browser) goto(r)
	} catch (e) {
	} finally {
		loading = false
	}
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

	<h6 class="mb-3 text-center text-gray-600">Please login using email and password</h6>

	<form class="mb-8 flex flex-col" on:submit|preventDefault="{handleSignIn}">
		<TextboxFloating bind:value="{email}" class="mb-3 w-full" type="email" required label="Email" />

		<div class="relative">
			<TextboxFloating
				bind:value="{password}"
				class="mb-3 w-full"
				type="{type}"
				required
				label="Password" />

			<div
				class="absolute inset-y-0 right-0 mx-3 flex cursor-pointer items-center justify-center text-gray-500"
				on:click="{() => togglePassword()}">
				{#if showPassword}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
						></path>
					</svg>
				{:else}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
						></path>
					</svg>
				{/if}
			</div>
		</div>

		<div class="mb-5 flex justify-end">
			<a
				href="/auth/forgot-password"
				class="max-w-max text-end text-xs font-light hover:text-gray-800 hover:underline focus:outline-none">
				Forgot Password?
			</a>
		</div>

		<GradiantButton class="mx-auto w-full max-w-sm" type="submit" loading="{loading}">
			LOGIN
		</GradiantButton>
	</form>

	<!-- OR  -->

	<div class="mb-8 flex flex-row items-center">
		<hr class="flex-1 border-t border-gray-400" />

		<span class="mx-3 -mt-1 leading-3">or</span>

		<hr class="flex-1 border-t border-gray-400" />
	</div>

	<!-- mb-5 -->
	<div class="mx-auto flex w-full max-w-sm flex-wrap items-center justify-center gap-4 leading-4">
		<a
			href="{`/auth/otp-login?ref=${$page.url.searchParams.get('ref') || '/'}`}"
			class="max-w-max whitespace-nowrap text-primary-500 hover:underline">
			Login/Signup with phone
		</a>

		<a
			href="{`/auth/signup?ref=${$page.url.searchParams.get('ref') || '/'}`}"
			class="max-w-max whitespace-nowrap text-primary-500 hover:underline">
			Not a Member yet?
		</a>

		<a
			href="{`/auth/signup?role=vendor&store=${store?.id}&ref=${
				$page.url.searchParams.get('ref') || '/'
			}`}"
			class="max-w-max whitespace-nowrap text-primary-500 hover:underline">
			Signup as vendor
		</a>
	</div>

	<!-- Get magin link -->

	<!-- <div class="mt-5">
			{#await signInPromise}
				Sending magic link to {email} ...
			{:then { data, error }}
				<Error err="{error}" />

				{#if data}
					<strong class="text-green-600">Successfully sent magic link to {email}!</strong>
				{:else}
					<form class="form-control" on:submit|preventDefault="{handleSignIn}">
						<div class="relative">
							<input
								bind:value="{email}"
								id="email"
								type="email"
								placeholder="Email"
								required
								class="w-full py-2 pl-4 pr-16  text-sm rounded-full border border-gray-300 bg-gray-50 hover:bg-white transition duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500" />

							<button
								class="absolute right-0 inset-y-0 rounded-r-full flex-shrink-0 bg-primary-500 hover:bg-primary-700 transition duration-300 py-2 px-4 text-sm text-white font-semibold">
								Get Magic Link !
							</button>
						</div>
					</form>
				{/if}
			{/await}
		</div> -->

	<!-- <div class="flex flex-row items-center justify-center space-x-2 md:space-x-4"> -->
	<!-- Facebook login -->

	<!-- <a
				href="/auth/facebook"
				class="
            p-2.5
            w-full
            flex-1 flex
            items-center
            justify-center
            text-xs
            space-x-2
            transition
            duration-300
            border
            rounded-md
            shadow-md
            cursor-pointer
            hover:shadow-lg
          ">
		  <div>
			  <ImageLoader src="/social-media/facebook.png" alt="" class="h-5 w-5" />
			</div>

				<span>Facebook</span>
			</a> -->

	<!-- Google login -->

	<!-- <a
				href="/auth/google"
				class="
            p-2.5
            w-full
            flex-1 flex
            justify-center
            items-center
            text-xs
            space-x-2
            transition
            duration-300
            border
            rounded-md
            shadow-md
            cursor-pointer
            hover:shadow-lg
          ">
	<div>
				<ImageLoader src="/social-media/google.png" alt="" class="h-5 w-5" />
	</div>
				<span>Google</span>
			</a>
		</div> -->
</div>
