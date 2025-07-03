<script lang="ts">
import Product from '$lib/components/product-catalogue/product-card.svelte'
import { chatService, reviewService, ReviewService, vendorService, VendorService } from '$lib/core/services'
import { Skeleton } from '$lib/components/ui/skeleton'
import { Star } from 'lucide-svelte'
import { page } from '$app/state'
import { toast } from 'svelte-sonner'
import { onMount } from 'svelte'
import { goto } from '$app/navigation'
import Pagination from '$lib/components/common/pagination.svelte'

let productsCount = $state(0)
let products = $state({})
let loading = $state(true)
let reviews = $state([])
let loadingReviews = $state(true)
let { data } = $props()

const mount = async () => {
	loading = true
	try {
		products = await vendorService.fetchProductsOfVendor(data?.vendor?.id)
	} finally {
		loading = false
	}
}

const fetchReviews = async () => {
	loadingReviews = true
	try {
		// Replace with actual review fetching logic
		reviews = await reviewService.fetchReviews({
			productId: data?.product?.id,
			search: page.url.searchParams.get('search') || undefined,
			sort: page.url.searchParams.get('sort') || undefined,
			currentPage: page.url.searchParams.get('page') || 1
		})
	} finally {
		loadingReviews = false
	}
}

$effect(() => {
	mount()
	fetchReviews()
})

function getRatingColor(rating) {
	if (rating >= 4) return 'text-green-500'
	if (rating >= 3) return 'text-yellow-500'
	return 'text-red-500'
}

const sendMessageToChat = async (chatId: string, vendorId: string, message: string) => {
	const payload = {
		chat_id: chatId,
		message,
		vendorId
	}

	const res = await chatService.save(payload)
}

const initiateChatWithVendor = async (vendorId: string) => {
	try {
		const res = await chatService.chats({ vendorId })
		if (res?.chatId) {
			await sendMessageToChat(res.chatId, vendorId, 'Hi, I am interested in your products.')
				.then(() => {
					toast.success('Chat initiated successfully')
					goto('/messages')
				})
				.catch(e => {
					// console.log('error', e)
					toast.error((e as any)?.message)
				})
		}
	} catch (e) {
		console.log('error', e)
		toast.error((e as any)?.message)
	}
}
</script>

<svelte:head>
	<title>{data?.vendor?.businessName}</title>
</svelte:head>

<div class="container mx-auto">
	{#if loading}
		<div class="mb-5">
			<Skeleton class="h-48 w-full rounded-lg" />
		</div>
		<div class="mb-8 space-y-1 text-center">
			<Skeleton class="mx-auto h-8 w-64" />
		</div>

		<!-- Rating Summary Skeleton -->
		<div class="mb-8 rounded-lg bg-gray-50 p-6 dark:bg-gray-800">
			<div class="flex items-center justify-between">
				<div class="space-y-3">
					<Skeleton class="h-6 w-32" />
					<div class="flex gap-2">
						<Skeleton class="h-5 w-5" />
						<Skeleton class="h-5 w-5" />
						<Skeleton class="h-5 w-5" />
						<Skeleton class="h-5 w-5" />
						<Skeleton class="h-5 w-5" />
					</div>
				</div>
				<Skeleton class="h-12 w-32" />
			</div>
		</div>

		<div class="mb-5 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
			{#each Array(10) as _}
				<div class="space-y-3">
					<Skeleton class="aspect-square w-full rounded-lg" />
					<Skeleton class="h-4 w-[80%]" />
					<Skeleton class="h-4 w-[60%]" />
					<div class="flex gap-2">
						<Skeleton class="h-4 w-[40%]" />
						<Skeleton class="h-4 w-[30%]" />
					</div>
				</div>
			{/each}
		</div>
		<div class="flex justify-center">
			<Skeleton class="h-10 w-72" />
		</div>
	{:else}
		{#if data?.vendor?.banners}
			<div class="mb-5">
				<img src={data?.vendor?.banners} alt={data?.vendor?.businessName} class="h-48 w-full rounded-lg object-cover" />
			</div>
		{/if}
		<div class="mb-8 flex flex-row justify-center space-x-3">
			<h2 class="text-2xl font-semibold tracking-tight">Products of {data?.vendor?.businessName}</h2>
			<!-- <button class="rounded-lg border border-input px-3 py-1.5 text-sm" onclick={() => initiateChatWithVendor(data.vendor?.id)}>
				Initiate Chat
			</button> -->
		</div>

		<!-- Rating and Reviews Section -->
		<!-- <div class="mb-8 rounded-lg bg-gray-50 p-6 dark:bg-gray-800">
			<div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
				<div class="space-y-2">
					<h3 class="text-lg font-semibold">Store Rating & Reviews</h3>
					{#if loadingReviews}
						<div class="flex gap-2">
							{#each Array(5) as _}
								<Skeleton class="h-5 w-5" />
							{/each}
						</div>
					{:else}
						<div class="flex items-center gap-2">
							<div class="flex">
								{#each Array(5) as _, i}
									<Star class={i < (data?.vendor?.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'} size={20} />
								{/each}
							</div>
							<span class={getRatingColor(data?.vendor?.rating || 0)}>
								{data?.vendor?.rating || 0} / 5
							</span>
							<span class="text-sm text-gray-500">({reviews?.length || 0} reviews)</span>
						</div>
					{/if}
				</div>
				<button
					class="rounded-lg bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-100"
				>
					Write a Review
				</button>
			</div>

			//Reviews List
			{#if loadingReviews}
				<div class="mt-6 space-y-4">
					{#each Array(3) as _}
						<div class="space-y-3 rounded-lg bg-white p-4 dark:bg-gray-700">
							<div class="flex items-center gap-3">
								<Skeleton class="h-10 w-10 rounded-full" />
								<div class="space-y-2">
									<Skeleton class="h-4 w-32" />
									<div class="flex gap-1">
										{#each Array(5) as _}
											<Skeleton class="h-4 w-4" />
										{/each}
									</div>
								</div>
							</div>
							<Skeleton class="h-4 w-full" />
							<Skeleton class="h-4 w-3/4" />
						</div>
					{/each}
				</div>
			{:else if reviews?.length > 0}
				<div class="mt-6 space-y-4">
					{#each reviews as review}
						<div class="rounded-lg bg-white p-4 dark:bg-gray-700">
							<div class="flex items-center gap-3">
								<div class="h-10 w-10 rounded-full bg-gray-200">
									// User Avatar
								</div>
								<div>
									<p class="font-medium">{review.userName}</p>
									<div class="flex gap-1">
										{#each Array(5) as _, i}
											<Star size={16} class={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'} />
										{/each}
									</div>
								</div>
							</div>
							<p class="mt-2 text-gray-600 dark:text-gray-300">{review.comment}</p>
						</div>
					{/each}
				</div>
			{:else}
				<p class="mt-6 text-center text-gray-500">No reviews yet. Be the first to review!</p>
			{/if}
		</div> -->

		<div class="mb-5 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
			{#if products?.data?.length > 0}
				{#each products?.data as p}
					<Product
						product={{
							id: p.id,
							slug: p.slug,
							thumbnail: p.thumbnail,
							price: p.price,
							mrp: p.mrp,
							title: p.title,
							vendor: p.vendor,
							variants: p.variants
						}}
						aspectRatio="square"
					/>
				{/each}
			{/if}
		</div>

		<Pagination noOfPage={products.noOfPage} />
	{/if}
</div>
