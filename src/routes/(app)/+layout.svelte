<script lang="ts">
import { page } from '$app/stores'
import { PageTransitions, Nav, Footer } from '$lib/components'

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
			class="w-full flex-1
			{hellobar?.active?.val && $page.data.store?.isHyperlocal
				? 'mt-[114px] sm:mt-[206px] lg:mt-[182px]'
				: ''}
			{hellobar?.active?.val ? 'mt-[88px] sm:mt-28 lg:mt-[88px]' : ''}
			{$page.data.store?.isHyperlocal ? 'mt-20 sm:mt-[104px] lg:mt-20' : ''}
			{!hellobar?.active?.val && !$page.data.store?.isHyperlocal ? 'mt-14 sm:mt-20 lg:mt-14' : ''}
			">
			<slot />
		</div>
	</PageTransitions>

	<div class="hidden lg:block">
		<Footer me="{data.me}" />
	</div>
</div>
