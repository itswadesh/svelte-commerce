<script lang="ts">
import { page } from '$app/stores'
import { PageTransitions, Nav, Footer } from '$lib/components'

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
			class="w-full flex-1
			{hellobar?.active?.val && $page.data.store?.isHyperlocal
				? 'mt-[114px] sm:mt-[206px] lg:mt-[114px]'
				: ''}
			{hellobar?.active?.val && !$page.data.store?.isHyperlocal ? 'mt-[88px] sm:mt-28' : ''}
			{$page.data.store?.isHyperlocal && !hellobar?.active?.val ? 'mt-20 sm:mt-[104px] lg:mt-20' : ''}
			{!hellobar?.active?.val && !$page.data.store?.isHyperlocal ? 'mt-14 sm:mt-20' : ''}">
			<slot />
		</div>
	</PageTransitions>

	<div class="hidden md:block">
		<Footer me="{data.me}" cart="{data.cart}" />
	</div>
</div>
