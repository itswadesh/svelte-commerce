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
import { session } from '$app/stores'
import Cookies from 'universal-cookie'
import SEO from '$lib/components/SEO/index.svelte'
import { toast } from './../util'
import { signUp } from '$lib/services'
let ref,
	loading = false
const seoProps = {
	title: 'Signup',
	metadescription: 'Signup here'
}
const cookies = new Cookies()
let email = '',
	password = '',
	confirmPassword = '',
	firstName = '',
	lastName = '',
	role = 'user'

async function submit(e) {
	try {
		const me = await signUp({ email, password, firstName, lastName, role, confirmPassword })
		$session.me = me
		let r = ref || '/my'
		goto(r)
	} catch (e) {
		toast('Error: ' + e?.message, 'error')
	} finally {
		loading = false
	}
	// try {
	// 	const res = await post('users', { email, password })
	// 	cookies.set('token', res.token, { path: '/' })
	// 	$session.user = res.user
	// 	$session.token = res.token
	// 	toast('Welcome to svelte commerce', 'success')
	// 	goto('/')
	// } catch (e) {
	// 	toast(e, 'error')
	// 	console.log('Login Error...', e.toString())
	// }
}
</script>

<SEO {...seoProps} />

<div class="h-screen py-20 bg-gray-900 ">
	<div class="flex justify-center mx-4">
		<div class="hidden w-full px-8 bg-black rounded-lg rounded-r-none md:w-96 md:block">
			<div class="py-6 mt-2 text-2xl font-bold text-white">Sveltekit is awesome</div>
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
		<div class="w-full bg-white rounded-lg shadow md:rounded-l-none md:w-96">
			<div class="">
				<div class=" h-7 w-7 ml-auto mr-2">
					<a
						href="/"
						class="block mt-2 p-1 hover:bg-gray-500 bg-gray-900 rounded-full focus:outline-none">
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
				<h1 class="text-3xl text-center font-bold tracking-tight text-gray-900 ">Sign up</h1>
				<form
					on:submit|preventDefault="{submit}"
					class="mt-10 mx-4 flex flex-col text-sm text-gray-500">
					<input
						type="text"
						placeholder="Email"
						class="border border-gray-500 rounded-full py-2 px-5 focus:outline-none "
						bind:value="{email}" />
					<input
						type="password"
						placeholder="Password"
						class="mt-3 border border-gray-500 rounded-full py-2 px-5 focus:outline-none "
						bind:value="{password}" />
					<button
						type="submit"
						class="mt-8 py-2 bg-gray-900 text-lg uppercase text-white font-semibold rounded-full shadow-md zoom tracking-wider focus:outline-none">
						Signup Now
					</button>
				</form>
			</div>
			<div class="mx-4 mt-4">
				<a
					rel="external"
					href="{`/login`}"
					class="flex items-center justify-center py-2 font-semibold text-gray-900 border rounded-full shadow-md zoom hover:no-underline">
					<div class="ml-4 text-lg font-semibold tracking-tight">Already registered? Login</div>
				</a>
				<div class="mx-4 mt-10 mb-10 text-xs tracking-widest text-center text-gray-500">
					<h5 class="mb-1">By continuing, you agree to Svelte Commerce</h5>
					<a class="hover:underline text-gray-800" href="/">Terms of Service</a>
					,
					<a class="hover:underline text-gray-800" href="/">Privacy Policy</a>
				</div>
			</div>
		</div>
	</div>
</div>
<ToastContainer let:data>
	<FlatToast data="{data}" />
</ToastContainer>
