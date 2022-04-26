<script context="module" lang="ts">
export async function load({ session: { user, token } }) {
	// fetchCart(token)
	return { props: { user } }
}
</script>

<script>
import PageTransitions from '$lib/PageTransitions.svelte'
import Nav from '$lib/Nav.svelte'
import MobNav from '$lib/MobNav.svelte'
import MobFooter from '$lib/MobFooter.svelte'
import { getStores, navigating, page } from '$app/stores'
import { ToastContainer, FlatToast } from 'svelte-toasts'

export let user
</script>

<PageTransitions refresh="{$page.url.pathname}">
	<div class="bg-gray-50 font-sans antialiased">
		<slot />
	</div>

	<div class="fixed z-40 bottom-0 w-full  md:hidden">
		<MobFooter />
	</div>
</PageTransitions>
<ToastContainer let:data>
	<FlatToast data="{data}" />
</ToastContainer>
