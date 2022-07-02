<script>
import { goto } from '$app/navigation'
import { page, session } from '$app/stores'
import Cookies from 'universal-cookie'
const cookies = new Cookies()
import { Icon, ChartPie, UserCircle, Truck, Logout } from 'svelte-hero-icons'
import { toast } from '$lib/util'
import { signOut } from '$lib/services'
export let section

async function logout() {
	try {
		await signOut()
		$session.me = null
		$session.token = null
		$session.sid = null
		toast('Successfully loggedout', 'success')
		goto('/')
	} catch (e) {
		toast(e, 'error')
	}
}
</script>

<section
	class="flex h-full w-20 flex-col items-center justify-around overflow-hidden border bg-white  py-4 text-sm text-gray-800 shadow-lg sm:w-40 sm:px-4">
	<a
		href="/my"
		class:bg-primary-100="{$page.url.pathname === '/my'}"
		class="group flex w-full flex-col items-center justify-center py-2 focus:outline-none">
		<Icon
			src="{ChartPie}"
			class="h-6 w-6 text-gray-500 group-hover:text-primary-500 sm:h-8 sm:w-8" />
		<h6 class="mt-2 text-xs font-semibold group-hover:text-primary-500 sm:text-base">Dashboard</h6>
	</a>

	<hr class="my-4 w-full border-t border-gray-300" />

	<a
		href="/my/orders"
		class:bg-primary-100="{$page.url.pathname === '/my/orders'}"
		class="group flex w-full flex-col items-center justify-center py-2 focus:outline-none">
		<Icon src="{Truck}" class="h-6 w-6 text-gray-500 group-hover:text-primary-500 sm:h-8 sm:w-8" />
		<h6 class="mt-2 text-xs font-semibold group-hover:text-primary-500 sm:text-base">My Orders</h6>
	</a>

	<hr class="my-4 w-full border-t border-gray-300" />

	<a
		href="/my/profile"
		class:bg-primary-100="{$page.url.pathname === '/my/profile'}"
		class="group flex w-full flex-col items-center justify-center py-2 focus:outline-none">
		<Icon
			src="{UserCircle}"
			class="h-6 w-6 text-gray-500 group-hover:text-primary-500 sm:h-8 sm:w-8" />
		<h6 class="mt-2 text-xs font-semibold group-hover:text-primary-500 sm:text-base">Profile</h6>
	</a>

	<hr class="my-4 w-full border-t border-gray-300" />

	<!-- <button
		class="flex flex-col items-center justify-center focus:outline-none w-full py-2 hover:text-primary-500">
		<img src="/landing/users.png" alt="" class="h-6 w-6 sm:h-8 sm:w-8" />
		<h6 class="mt-2 text-xs sm:text-base font-semibold">Customers</h6>
	</button> -->
	<button
		on:click="{logout}"
		class="group flex w-full flex-col items-center justify-center py-2 focus:outline-none">
		<Icon src="{Logout}" class="h-6 w-6 text-gray-500 group-hover:text-primary-500 sm:h-8 sm:w-8" />
		<h6 class="mt-2 text-xs font-semibold group-hover:text-primary-500 sm:text-base">Logout</h6>
	</button>

	<hr class="my-4 w-full border-t border-gray-300" />

	<div class="relative mt-10 flex flex-col items-center justify-center">
		<div
			class="m-1 rounded-sm bg-gray-200 p-1 pt-6 text-center  text-xs text-gray-400 shadow-sm sm:p-4   sm:pt-8">
			Use tailwindcss to quickly change style of the storefront
		</div>

		<div
			class="absolute inset-x-0  top-0 -mt-8 flex flex-col items-center justify-center sm:-mt-10">
			<h6 class="mb-1 text-xs font-semibold sm:text-base">Tip</h6>
			<div
				class="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border bg-white shadow-sm sm:h-10 sm:w-10">
				<img src="/landing/light-on.png" alt="" class="h-4 w-4 sm:h-6 sm:w-6" />
			</div>
		</div>
	</div>
</section>
