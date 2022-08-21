<style>
.zoom {
	transition: transform 0.7s;
}
.zoom:hover {
	transform: scale(0.98);
}
</style>

<script>
import { toasts, ToastContainer, FlatToast } from 'svelte-toasts'
import { goto } from '$app/navigation'
import Cookies from 'universal-cookie'
import SEO from '$lib/components/SEO/index.svelte'
import { toast } from '$lib/util'
import { signIn } from '$lib/services'
import { browser } from '$app/env'
import { GQL_login } from '$houdini'

export let data
let { ref } = data
$: ({ ref } = data)

const seoProps = {
	title: 'Login',
	metadescription: 'Login now - '
}
const cookies = new Cookies()
let email = '',
	password = '',
	loading = false
async function submit(e) {
	try {
		loading = true
		const me = await signIn({ email, password })
		$Page.user.me = me
		let r = ref || '/my'
		if (browser) goto(r)
	} catch (e) {
	} finally {
		loading = false
	}
}
</script>

<SEO {...seoProps} />

<div class="h-screen bg-gray-900 py-20 ">
	<div class="mx-4 flex justify-center">
		<div class="hidden w-full rounded-lg rounded-r-none bg-black px-8 md:block md:w-96">
			<div class="mt-2 py-6 text-2xl font-bold text-white">Sveltekit is awesome</div>
			<div class="text-gray-500 ">
				<div class="my-4">
					<div class="text-lg font-semibold ">
						<span class="mr-1 ">✓</span>
						Creating full ecommerce frontend using svelte is
					</div>
					<div class="text-xs ">divine experience</div>
				</div>
				<div class="my-4">
					<div class="text-lg font-semibold ">
						<span class="mr-1 ">✓</span>
						Lets build it together
					</div>
					<div class="text-xs ">and make it awesome</div>
				</div>
				<div class="my-4">
					<div class="text-lg font-semibold ">
						<span class="mr-1 ">✓</span>
						Small contribution
					</div>
					<div class="text-xs ">even 1 line of code will be appreciated</div>
				</div>
			</div>
		</div>
		<div class="w-full rounded-lg bg-white shadow md:w-96 md:rounded-l-none">
			<div class="">
				<div class=" ml-auto mr-2 h-7 w-7">
					<a
						href="/"
						class="mt-2 block rounded-full bg-gray-900 p-1 hover:bg-gray-500 focus:outline-none">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5 text-white "
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"></path>
						</svg>
					</a>
				</div>
				<h1 class="text-center text-3xl font-bold tracking-tight text-gray-900 ">Sign in</h1>
				<form
					on:submit|preventDefault="{submit}"
					class="mx-4 mt-10 flex flex-col text-sm text-gray-500">
					<input
						type="text"
						placeholder="Email"
						class="rounded-full border border-gray-500 py-2 px-5 focus:outline-none "
						bind:value="{email}" />
					<input
						type="password"
						placeholder="Password"
						class="mt-3 rounded-full border border-gray-500 py-2 px-5 focus:outline-none "
						bind:value="{password}" />
					<button
						type="submit"
						class="zoom mt-8 rounded-full bg-gray-900 py-2 text-lg font-semibold tracking-wider text-white shadow-md focus:outline-none">
						Login Now</button>
				</form>
			</div>
			<div class="mx-4 mt-4">
				<a
					rel="external"
					href="{`/signup`}"
					class="zoom flex items-center justify-center rounded-full border py-2 font-semibold text-gray-900 shadow-md hover:no-underline">
					<div class="ml-4 text-lg font-semibold tracking-tight">Sign up</div>
				</a>
				<div class=" mt-5 ">
					<h5 class="mx-auto max-w-max cursor-pointer  text-sm font-semibold hover:underline">
						Reset Password
					</h5>
				</div>
				<div class="mx-4 mt-10 mb-10 text-center text-xs tracking-widest text-gray-500">
					<h5 class="mb-1">By continuing, you agree to Svelte Commerce</h5>
					<a class="text-gray-800 hover:underline" href="/">Terms of Service</a>
					,
					<a class="text-gray-800 hover:underline" href="/">Privacy Policy</a>
				</div>
			</div>
		</div>
	</div>
</div>
