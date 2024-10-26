<script>
	import { Package, ListTree, Tag, DollarSign, UploadCloud, ArrowLeft, ArrowRight } from '@lucide/svelte'
	import { Button } from '$lib/components/ui/button'

	const importOptions = [
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

<div class="mx-auto max-w-7xl px-4 py-8 md:py-12">
	<div class="mb-12">
		<h1 class="text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">
			Account Dashboard
		</h1>
		<p class="mt-2 text-lg text-muted-foreground">
			Welcome back! Manage your orders, wishlist, and profile settings.
		</p>
	</div>

	<div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
		{#each importOptions as option}
			<a
				href={option.href}
				class="group relative flex flex-col items-center justify-center overflow-hidden rounded-[3rem] border border-gray-100 bg-white p-12 text-center transition-all duration-700 hover:-translate-y-3 hover:border-primary/20 hover:shadow-[0_40px_80px_rgba(0,0,0,0.12)]"
			>
				<!-- Dynamic Background Circle -->
				<div
					class="absolute -right-6 -top-6 h-40 w-40 rounded-full bg-primary/5 transition-all duration-700 ease-out group-hover:scale-[3] group-hover:bg-primary/10"
				></div>

				<div class="relative z-10 flex flex-col items-center">
					<!-- Icon Container with stable background transition -->
					<div
						class="mb-10 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-gray-50 text-gray-900 shadow-sm transition-all duration-500 ease-in-out group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-2xl group-hover:shadow-primary/40"
					>
						<svelte:component this={option.icon} class="h-10 w-10" />
					</div>

					<h3 class="text-xl font-black uppercase tracking-[0.2em] text-gray-900">
						{option.title}
					</h3>
					<p class="mt-4 max-w-[200px] text-sm font-medium leading-relaxed text-muted-foreground">
						{option.description}
					</p>

					<!-- Action Button with Glassmorphism -->
					<div
						class="mt-12 inline-flex items-center gap-2 overflow-hidden rounded-full bg-gray-900 px-8 py-3.5 text-xs font-black uppercase tracking-widest text-white transition-all duration-500 hover:scale-105 active:scale-95 group-hover:bg-primary group-hover:px-10 group-hover:shadow-xl group-hover:shadow-primary/30"
					>
						<span class="relative z-10">Manage</span>
						<ArrowRight class="relative z-10 h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1" />
					</div>
				</div>
			</a>
		{/each}
	</div>
</div>
