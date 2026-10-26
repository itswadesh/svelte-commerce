<script lang="ts">
	import { Package, ListTree, Tag, User, ArrowRight, Settings, Mail, Phone, Pencil } from '@lucide/svelte'
	import { Button } from '$lib/components/ui/button'
	import { getUserState } from '$lib/core/stores/index.js'
	import { page } from '$app/state'

	const userState = getUserState()

	const importOptions = [
		// {
		// 	title: 'Profile',
		// 	description: 'Your account information',
		// 	icon: User,
		// 	href: '/my/profile'
		// },
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
	<title>My dashboard</title>
</svelte:head>

<div class="mx-auto max-w-7xl px-0 md:py-8 md:py-12">
	{#if userState?.user}
		<div class="mb-12 rounded-md border border-border bg-card p-6 md:p-8">
			<div class="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
				<div class="flex items-center gap-4">
					<div class="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-2xl font-bold text-primary">
						{userState.user.firstName?.charAt(0) || 'U'}
					</div>
					<div>
						<h2 class="page-heading">Hi, {userState.user.firstName || 'User'}!</h2>
						<div class="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
							{#if userState.user.email}
								<div class="flex items-center gap-1.5">
									<Mail class="h-3.5 w-3.5" />
									{userState.user.email}
								</div>
							{/if}
							{#if userState.user.phone}
								<div class="flex items-center gap-1.5">
									<Phone class="h-3.5 w-3.5" />
									{userState.user.phone}
								</div>
							{/if}
						</div>
					</div>
				</div>
				<Button href="/my/profile" variant="outline" class="flex items-center gap-2">
					<Pencil class="h-4 w-4" />
					Edit profile
				</Button>
			</div>
		</div>
	{/if}

	<!-- <div class="mb-12">
		<h1 class="page-heading">Account dashboard</h1>
		<p class="mt-2 text-lg text-muted-foreground">Manage your orders, wishlist, and profile settings.</p>
	</div> -->
	<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
		{#each importOptions as option}
			<a
				href={option.href}
				class="flex flex-col rounded-md border border-border bg-card p-6 transition-all"
			>
				<div class="mb-4 flex h-12 w-12 items-center justify-center rounded bg-muted text-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
					<svelte:component this={option.icon} class="h-6 w-6" />
				</div>

				<div class="flex items-start justify-between">
					<h3 class="mb-1 text-lg font-bold text-foreground">
						{option.title}
					</h3>
					<ArrowRight class="h-4 w-4 text-muted-foreground transition-transform motion-safe:group-hover:translate-x-1 group-hover:text-primary" />
				</div>
				<p class="text-sm text-muted-foreground">
					{option.description}
				</p>
			</a>
		{/each}
	</div>
</div>
