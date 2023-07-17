<script lang="ts">
import { Footer, Nav } from '$lib/theme-config'
import { PageTransitions } from '$lib/components'
export let data

let openSidebar = false
let showCartSidebar = false
</script>

<div class="{showCartSidebar || openSidebar ? 'h-screen overflow-hidden' : 'h-full'}">
	<div class="hidden lg:block">
		<Nav
			me="{data.me}"
			cart="{data.cart}"
			store="{data.store}"
			q="{data.q}"
			bind:showCartSidebar="{showCartSidebar}"
			bind:openSidebar="{openSidebar}" />
	</div>

	<PageTransitions url="{data.url}">
		<slot />
	</PageTransitions>

	<div class="hidden md:block">
		<Footer />
	</div>
</div>
