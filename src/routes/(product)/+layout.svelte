<script lang="ts">
import { Footer, Nav } from '$lib/theme-config'
import { PageTransitions } from '$lib/components'

export let data

let openSidebar = false
let showCartSidebar = false
</script>

<div class="{showCartSidebar || openSidebar ? 'h-screen overflow-hidden' : 'h-full'}">
	<div class="hidden lg:block">
		<Nav me="{data.me}" store="{data.store}" q="{data.q}" bind:showCartSidebar bind:openSidebar />
	</div>

	<PageTransitions url="{data.url}">
		<!-- {#key data.url} -->
		<slot />
		<!-- {/key} -->
	</PageTransitions>

	<div class="hidden md:block">
		<Footer />
	</div>
</div>
