<script lang="ts">
	import { faqService } from '$lib/core/services'
	import { page } from '$app/state'
	import { onMount } from 'svelte'
	import { ChevronDownIcon, ChevronUpIcon } from 'lucide-svelte'
	import { fade, slide } from 'svelte/transition'
	import SeoHeader from '$lib/core/components/plugins/seo-header.svelte'

	interface FAQ {
		id: string
		question: string
		answer: string
	}

	type APIResponse = FAQ[] | { data: FAQ[] }

	let loading = $state(false)
	let error = $state('')
	let faqs = $state<{ data: FAQ[] }>({ data: [] })
	const { plugins } = page.data.store
	let selectedFaqId: string = $state('')

	function toggleFaq(faqId: string) {
		selectedFaqId = selectedFaqId === faqId ? '' : faqId
	}

	async function loadFaqs() {
		try {
			loading = true
			error = ''
			const response = (await faqService.listFaqs({ page: 1 })) as APIResponse
			faqs = { data: Array.isArray(response) ? response : response.data || [] }
		} catch (err) {
			console.error(err)
			error = 'Failed to load FAQs. Please try again later.'
		} finally {
			loading = false
		}
	}

	onMount(loadFaqs)
</script>

<SeoHeader metaTitle="Frequently Asked Questions" />

<div class="mx-auto max-w-3xl px-4 py-8">
	<h1 class="mb-8 text-center text-3xl font-bold text-gray-900">Frequently Asked Questions</h1>

	{#if loading}
		<div class="flex min-h-[200px] items-center justify-center" transition:fade>
			<div class="flex w-full animate-pulse flex-col gap-4">
				{#each Array(3) as _}
					<div class="h-16 rounded bg-gray-100"></div>
				{/each}
			</div>
		</div>
	{:else if error}
		<div class="py-8 text-center text-red-600" transition:fade>
			<p>{error}</p>
			<button class="mt-4 rounded-lg bg-gray-100 px-4 py-2 transition-colors hover:bg-gray-200" onclick={loadFaqs}> Try Again </button>
		</div>
	{:else if faqs?.data?.length}
		<div class="space-y-4">
			{#each faqs.data as faq (faq.id)}
				<div class="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
					<button
						class="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-gray-50"
						onclick={() => toggleFaq(faq.id)}
						aria-expanded={selectedFaqId === faq.id}
						aria-controls="faq-{faq.id}"
					>
						<span class="flex-1 pr-4 text-lg font-medium text-gray-900">{faq.question}</span>
						<span class="transform text-gray-500 transition-transform duration-200" class:rotate-180={selectedFaqId === faq.id}>
							<ChevronDownIcon class="h-5 w-5" />
						</span>
					</button>

					{#if selectedFaqId === faq.id}
						<div id="faq-{faq.id}" class="px-6 pb-4" transition:slide|local={{ duration: 200 }}>
							<div class="prose prose-sm max-w-none text-gray-600">
								{@html faq.answer}
							</div>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{:else}
		<div class="py-8 text-center text-gray-500" transition:fade>
			<p>No FAQs available at the moment.</p>
		</div>
	{/if}
</div>
