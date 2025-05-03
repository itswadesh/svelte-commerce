<script>
	import { Package, ListTree, Tag, DollarSign, UploadCloud, ArrowLeft } from 'lucide-svelte'
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

	<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
		{#each importOptions as option}
			<div class="relative rounded-lg border bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
				<div class="flex items-start justify-between">
					<div class="flex items-center gap-4">
						<div class="bg-primary-50 rounded-lg p-2">
							<svelte:component this={option.icon} class="text-primary-600 h-6 w-6" />
						</div>
						<div>
							<h3 class="font-medium text-gray-900">
								{option.title}
							</h3>
							<p class="mt-1 text-sm text-gray-500">
								{option.description}
							</p>
						</div>
					</div>
				</div>

				<div class="mt-4 flex items-center justify-center gap-3">
					<Button href={option.href} class="flex w-full items-center gap-2">
						<!-- <UploadCloud class="h-4 w-4" /> -->
						<span>{option.title}</span>
					</Button>
				</div>
			</div>
		{/each}
	</div>
</div>
