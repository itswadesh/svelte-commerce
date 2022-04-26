<script>
import { goto } from '$app/navigation'
import { page, session } from '$app/stores'
import Cookies from 'universal-cookie'
const cookies = new Cookies()
import { Icon, ChartPie, UserCircle, Truck, Logout } from 'svelte-hero-icons'
import { toast } from './../../util'
import { signOut } from '$lib/services'
export let section

async function logout() {
	try {
		// cookies.set('token', null, { path: '/' })
		// $session.user = null
		// $session.token = null
		await signOut()
		goto('/')
		toast('Successfully loggedout', 'success')
	} catch (e) {
		toast(e, 'error')
		console.log('Login Error...', e.toString())
	}
}
</script>

<section
	class="overflow-hidden h-full w-20 sm:w-40 bg-white shadow-lg border py-4 sm:px-4  text-sm text-gray-800 flex flex-col items-center justify-around">
	<a
		href="/my"
		class:bg-primary-100="{$page.url.pathname === '/my'}"
		class="flex flex-col items-center justify-center focus:outline-none w-full py-2 group">
		<Icon
			src="{ChartPie}"
			class="h-6 w-6 sm:h-8 sm:w-8 text-gray-500 group-hover:text-primary-500" />
		<h6 class="mt-2 text-xs sm:text-base font-semibold group-hover:text-primary-500">Dashboard</h6>
	</a>

	<hr class="border-t border-gray-300 w-full my-4" />

	<a
		href="/my/orders"
		class:bg-primary-100="{$page.url.pathname === '/my/orders'}"
		class="flex flex-col items-center justify-center focus:outline-none w-full py-2 group">
		<Icon src="{Truck}" class="h-6 w-6 sm:h-8 sm:w-8 text-gray-500 group-hover:text-primary-500" />
		<h6 class="mt-2 text-xs sm:text-base font-semibold group-hover:text-primary-500">My Orders</h6>
	</a>

	<hr class="border-t border-gray-300 w-full my-4" />

	<a
		href="/my/profile"
		class:bg-primary-100="{$page.url.pathname === '/my/profile'}"
		class="flex flex-col items-center justify-center focus:outline-none w-full py-2 group">
		<Icon
			src="{UserCircle}"
			class="h-6 w-6 sm:h-8 sm:w-8 text-gray-500 group-hover:text-primary-500" />
		<h6 class="mt-2 text-xs sm:text-base font-semibold group-hover:text-primary-500">Profile</h6>
	</a>

	<hr class="border-t border-gray-300 w-full my-4" />

	<!-- <button
		class="flex flex-col items-center justify-center focus:outline-none w-full py-2 hover:text-primary-500">
		<img src="/landing/users.png" alt="" class="h-6 w-6 sm:h-8 sm:w-8" />
		<h6 class="mt-2 text-xs sm:text-base font-semibold">Customers</h6>
	</button> -->
	<button
		on:click="{logout}"
		class="flex flex-col items-center justify-center focus:outline-none w-full py-2 group">
		<Icon src="{Logout}" class="h-6 w-6 sm:h-8 sm:w-8 text-gray-500 group-hover:text-primary-500" />
		<h6 class="mt-2 text-xs sm:text-base font-semibold group-hover:text-primary-500">Logout</h6>
	</button>

	<hr class="border-t border-gray-300 w-full my-4" />

	<div class="mt-10 relative flex flex-col items-center justify-center">
		<div
			class="m-1 p-1 sm:p-4 pt-6 sm:pt-8 text-xs  bg-gray-200 rounded-sm shadow-sm text-gray-400   text-center">
			Use tailwindcss to quickly change style of the storefront
		</div>

		<div
			class="absolute inset-x-0  top-0 -mt-8 sm:-mt-10 flex flex-col items-center justify-center">
			<h6 class="mb-1 text-xs sm:text-base font-semibold">Tip</h6>
			<div
				class="h-8 w-8 sm:h-10 sm:w-10 rounded-full shadow-sm flex items-center justify-center bg-white border overflow-hidden">
				<img src="/landing/light-on.png" alt="" class="h-4 w-4 sm:h-6 sm:w-6" />
			</div>
		</div>
	</div>
</section>
