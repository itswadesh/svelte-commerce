<script lang="ts">
import { Footer, Nav } from '$lib/theme-config'
import { PageTransitions } from '$lib/components'

export let data

let showCartSidebar = false
let openSidebar = false
</script>

<div class="{showCartSidebar || openSidebar ? 'h-screen overflow-hidden' : 'h-full'} antialiased">
	<Nav me="{data.me}" store="{data.store}" bind:showCartSidebar bind:openSidebar />

	<PageTransitions url="{data.url}">
		<!-- {#key data.url} -->
		<slot />
		<!-- {/key} -->
	</PageTransitions>

	<div class="hidden lg:block">
		<Footer />
	</div>
</div>
