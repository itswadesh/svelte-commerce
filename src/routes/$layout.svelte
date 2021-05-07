<script context="module">
export async function load({ session: { user } }) {
	fetchCart()
	return { props: { user } }
}
</script>

<script>
import '../global.css'
import PageTransitions from '$lib/PageTransitions.svelte'
import Nav from '$lib/Nav.svelte'
import MobNav from '$lib/MobNav.svelte'
import MobFooter from '$lib/MobFooter.svelte'
import { getStores, navigating, page } from '$app/stores'
import { fetchCart } from './../../store/cart'
import { me } from './../../store/auth'

export let user
</script>

<PageTransitions refresh="{$page.path}">
	<div>
		<div class="mb-28 lg:mb-20">
			<div class="fixed top-0 z-50 block w-full mb-40 lg:mb-0 lg:hidden">
				<MobNav user="{user}" />
			</div>

			<div class="fixed top-0 z-50 hidden w-full lg:block">
				<Nav user="{user}" />
			</div>
		</div>
		<div class="lg:-mt-2">
			<slot />
		</div>
	</div>
	<div class="mt-20 lg:mt-0 lg:hidden">
		<div class="fixed bottom-0 w-full">
			<MobFooter />
		</div>
	</div>
</PageTransitions>
