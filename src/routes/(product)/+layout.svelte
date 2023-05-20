<script lang="ts">
import { page } from '$app/stores'
import { PageTransitions, Nav, Footer } from '$lib/components'
import { slotMarginGeneral, slotMarginGeneralWithHelloBar } from '$lib/config'

export let data

let showCartSidebar = false
let openSidebar = false
let hellobar = $page.data.store?.hellobar || {}
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
		<div
			class="{hellobar?.active?.val
				? slotMarginGeneralWithHelloBar
				: slotMarginGeneral} w-full flex-1">
			<slot />
		</div>
	</PageTransitions>

	<div class="hidden md:block">
		<Footer me="{data.me}" cart="{data.cart}" />
	</div>
</div>
