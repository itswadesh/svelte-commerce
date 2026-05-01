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

<div class="mx-auto p-4">
	<!-- <div class="mb-6 flex items-center gap-2">
		<a href="/my" class="text-gray-500 hover:text-gray-600">
			<ArrowLeft class="h-5 w-5" />
		</a>
		<h1 class="text-2xl font-semibold text-gray-900">My Dashboard</h1>
	</div> -->

	<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
		{#each importOptions as option}
			<a 
				href={option.href}
				class="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:border-gray-200"
			>
				<div class="flex flex-col items-center text-center">
					<div class="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 text-gray-900 transition-transform duration-500 group-hover:scale-110 group-hover:bg-black group-hover:text-white">
						<svelte:component this={option.icon} class="h-8 w-8" />
					</div>
					
					<h3 class="text-sm font-bold uppercase tracking-[0.2em] text-gray-900">
						{option.title}
					</h3>
					<p class="mt-3 text-xs font-medium leading-relaxed text-gray-400">
						{option.description}
					</p>

					<div class="mt-8 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-900 opacity-0 transition-all duration-300 group-hover:opacity-100">
						View All <ArrowRight class="h-3 w-3" />
					</div>
				</div>
			</a>
		{/each}
	</div>
</div>
