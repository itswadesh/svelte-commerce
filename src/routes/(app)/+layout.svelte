<script lang="ts">
import Nav from '$lib/Nav.svelte'
import Footer from '$lib/Footer.svelte'
import PageTransitions from '$lib/PageTransitions.svelte'
export let data
let showCartSidebar = false
let openSidebar = false
</script>

<div class="{showCartSidebar || openSidebar ? 'h-screen overflow-hidden' : 'h-full'}">
	<Nav
		me="{data.me}"
		cart="{data.cart}"
		store="{data.store}"
		q="{data.q}"
		bind:showCartSidebar
		bind:openSidebar />

	<PageTransitions url="{data.url}">
		<div class="mt-20 w-full flex-1">
			<slot />
		</div>
	</PageTransitions>

	<div class="hidden sm:block">
		<Footer me="{data.me}" cart="{data.cart}" />
	</div>
</div>
