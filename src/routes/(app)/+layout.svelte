<script lang="ts">
import Nav from '$lib/components/Nav.svelte'
import Footer from '$lib/components/Footer.svelte'
import PageTransitions from '$lib/components/PageTransitions.svelte'

export let data

let showCartSidebar = false
let openSidebar = false
</script>

<div class="{showCartSidebar || openSidebar ? 'h-screen overflow-hidden' : 'h-full'} antialiased">
	<Nav
		me="{data.me}"
		cart="{data.cart}"
		store="{data.store}"
		bind:showCartSidebar="{showCartSidebar}"
		bind:openSidebar="{openSidebar}" />

	<PageTransitions url="{data.url}">
		<div class="mt-14 sm:mt-20 w-full flex-1">
			<slot />
		</div>
	</PageTransitions>

	<div class="hidden lg:block">
		<Footer me="{data.me}" />
	</div>
</div>
