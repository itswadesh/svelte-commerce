<script>
	import { Package, ListTree, Tag, User, ArrowRight } from '@lucide/svelte'
	import { Button } from '$lib/components/ui/button'

	const importOptions = [
		{
			title: 'Profile',
			description: 'Your account information',
			icon: User,
			href: '/my/profile'
		},
		{
			title: 'Orders',	
			description: 'List of orders placed',
			icon: Package,
			href: '/my/orders'
		},
		{
			title: 'Wishlist',
			description: 'All wishlisted products',
			icon: ListTree,
			href: '/my/wishlist'
		},
		{
			title: 'Addresses',
			description: 'List of addresses',
			icon: Tag,
			href: '/my/addresses'
		}
	]
</script>

<svelte:head>
	<title>My Dashboard</title>
</svelte:head>

<div class="mx-auto max-w-7xl px-0 md:py-8 md:py-12">
	<div class="mb-12">
		<h1 class="text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">Account Dashboard</h1>
		<p class="mt-2 text-lg text-muted-foreground">Welcome back! Manage your orders, wishlist, and profile settings.</p>
	</div>

	<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
		{#each importOptions as option}
			<a
				href={option.href}
				class="flex flex-col rounded-md border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-primary/30 hover:bg-gray-50/50 hover:shadow-md"
			>
				<div class="mb-4 flex h-12 w-12 items-center justify-center rounded bg-gray-100 text-gray-700 transition-colors group-hover:bg-primary/10 group-hover:text-primary">
					<svelte:component this={option.icon} class="h-6 w-6" />
				</div>

				<div class="flex items-start justify-between">
					<h3 class="mb-1 text-lg font-bold text-gray-900">
						{option.title}
					</h3>
					<ArrowRight class="h-4 w-4 text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
				</div>
				<p class="text-sm text-gray-500">
					{option.description}
				</p>
			</a>
		{/each}
	</div>
</div>
