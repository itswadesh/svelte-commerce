<script lang="ts">
import { page } from '$app/stores'
import { PageTransitions, Nav, Footer } from '$lib/components'
import { slotMarginGeneral, slotMarginGeneralWithHelloBar } from '$lib/config'

export let data

let hellobar = $page.data.store?.hellobar || {}
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
		<div
			class="{hellobar?.active?.val
				? slotMarginGeneralWithHelloBar
				: slotMarginGeneral} w-full flex-1">
			<slot />
		</div>
	</PageTransitions>

	<div class="hidden lg:block">
		<Footer me="{data.me}" />
	</div>
</div>
