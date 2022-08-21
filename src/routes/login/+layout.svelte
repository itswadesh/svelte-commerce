<script>
import PageTransitions from '$lib/PageTransitions.svelte'
import Nav from '$lib/Nav.svelte'
import MobNav from '$lib/MobNav.svelte'
import MobFooter from '$lib/MobFooter.svelte'
import { getStores, navigating, page } from '$app/stores'
import { ToastContainer, FlatToast } from 'svelte-toasts'
import PreloadingIndicator from '$lib/PreloadingIndicator.svelte'
export let data
let { user } = data
$: ({ user } = data)
</script>

{#if $navigating}
	<PreloadingIndicator />
{/if}

<!-- <PageTransitions refresh="{$page.url.pathname}"> -->
<div class="bg-gray-50 font-sans antialiased">
	<slot />
</div>

<div class="fixed bottom-0 z-40 w-full  md:hidden">
	<MobFooter />
</div>
<!-- </PageTransitions> -->
<ToastContainer let:data>
	<FlatToast data="{data}" />
</ToastContainer>
