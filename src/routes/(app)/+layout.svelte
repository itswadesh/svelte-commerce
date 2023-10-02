<script lang="ts">
import { Footer, Nav } from '$lib/theme-config'
import { PageTransitions } from '$lib/components'
import { writable } from 'svelte/store'
import { setContext } from 'svelte'

export let data

// console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz', data);


let megaMenuFromServer = writable([])

megaMenuFromServer.set(data?.megamenu)

setContext('megamenu', megaMenuFromServer)


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
		<slot />
	</PageTransitions>

	<div class="hidden lg:block">
		<Footer />
	</div>
</div>
