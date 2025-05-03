<script lang="ts">
	import { page } from '$app/state'
</script>

<div class="mr-4 md:flex">
	<div class="flex gap-3">
		{#if page?.data?.store?.logo}
			<a href="/">
				<img src={page?.data?.store?.logo} class="h-10 object-contain" alt="Logo" />
			</a>
		{:else}
			<a href="/" class="flex items-center space-x-2">
				<span class="font-bold"> {page?.data?.store?.name || ''} </span>
			</a>
		{/if}

		<!-- Navigation menu with consistent styling -->
		<div class="ml-6 hidden items-center space-x-6 lg:flex">
			<!-- Home link only when not on home page -->
			{#if page?.url?.pathname !== '/'}
				<a
					href="/"
					class="relative text-sm font-medium text-muted-foreground transition-colors after:absolute
					after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:text-primary hover:after:w-full"
				>
					Home
				</a>
			{/if}

			<!-- Dynamic menu items with same styling -->
			{#each page?.data?.store?.menu?.find?.((menu) => menu?.menuId === 'header')?.items || [] as item}
				<a
					href={item.link}
					class="relative text-sm font-medium text-muted-foreground transition-colors after:absolute
					after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:text-primary hover:after:w-full"
				>
					{item?.name}
				</a>
			{/each}
		</div>
		<!-- {#if userState?.user?.role === 'ADMIN'}
			<div class="flex flex-row gap-3">
				{#each menuItems as item}
					<a href={item.link} class="block w-full cursor-default">
						{item?.name}
					</a>
				{/each}
			</div>
		{/if} -->
	</div>
	<nav class="flex items-center gap-6 text-sm">
		<!-- <svg viewBox="0 0 2 3" aria-hidden="true">
      <path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" />
    </svg> -->

		<!-- <a
      href="/auth/login"
      class={cn(
        'transition-colors hover:text-foreground/80',
        page.url.pathname.startsWith('/auth/login')
          ? 'text-foreground'
          : 'text-foreground/60'
      )}
    >
      Login
    </a> -->
		<!-- <a
      href="/contact"
      class={cn(
        'transition-colors hover:text-foreground/80',
        page.url.pathname.startsWith('/contact')
          ? 'text-foreground'
          : 'text-foreground/60'
      )}
    >
      Contact
    </a> -->
		<!-- <a
      href="/cart"
      class={cn(
        'transition-colors hover:text-foreground/80',
        page.url.pathname.startsWith('/cart')
          ? 'text-foreground'
          : 'text-foreground/60'
      )}
    >
      Cart
    </a> -->
		<!-- <a
      href="/about"
      class={cn(
        'transition-colors hover:text-foreground/80',
        page.url.pathname.startsWith('/about')
          ? 'text-foreground'
          : 'text-foreground/60'
      )}
    >
      About
    </a> -->
		<!-- <a
      href="https://docs.litekart.in"
      target="_blank"
      class={cn(
        'transition-colors hover:text-foreground/80',
        page.url.pathname === '/docs'
          ? 'text-foreground'
          : 'text-foreground/60'
      )}
    >
      Docs
    </a> -->
		<!-- <a
      href="https://github.com/itswadesh/kitcommerce-svelte5"
      target="_blank"
      rel="noopener noreferrer"
      class={cn(
        'hidden text-foreground/60 transition-colors hover:text-foreground/80 lg:block'
      )}
    >
      GitHub
    </a> -->
		<!-- <svg viewBox="0 0 2 3" aria-hidden="true">
      <path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" />
    </svg> -->
	</nav>
</div>
