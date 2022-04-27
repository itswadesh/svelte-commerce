<script context="module">
export async function load({ session: { user } }) {
	return { props: { user } }
}
</script>

<script>
import PageTransitions from '$lib/PageTransitions.svelte'
import Nav from '$lib/Nav.svelte'
import MobNav from '$lib/MobNav.svelte'
import MobFooter from '$lib/MobFooter.svelte'
import { getStores, navigating, page } from '$app/stores'
export let user
import { ToastContainer, FlatToast } from 'svelte-toasts'
</script>

<!-- <PageTransitions refresh="{$page.url.pathname}"> -->
<div>
	<div class="hidden mb-28 lg:mb-20 lg:block">
		<div class="fixed top-0 z-40 block w-full mb-40 lg:mb-0 lg:hidden">
			<MobNav user="{user}" />
		</div>

		<div class="fixed top-0 z-40 hidden w-full lg:block">
			<Nav user="{user}" />
		</div>
	</div>
	<div class="lg:-mt-2">
		<slot />
	</div>
</div>
<div class="mt-20 lg:mt-0 lg:hidden">
	<div class="fixed z-40 bottom-0 w-full">
		<MobFooter />
	</div>
</div>
<!-- </PageTransitions> -->
<ToastContainer let:data>
	<FlatToast data="{data}" />
</ToastContainer>
