<script>
import { Skeleton, PrimaryButton } from '$lib/ui'
import { slide } from 'svelte/transition'
import noEmptyFaqs from '$lib/assets/no/empty-faqs.svg'
import SEO from '$lib/components/SEO/index.svelte'

export let data

let seoProps = {
	title: `Frequently Asked Questions`,
	description: `Frequently Asked Questions`
}

let show = []

function showans(i) {
	show[i] = !show[i]
}
</script>

<SEO {...seoProps} />

<section class="min-h-screen px-3 py-5 sm:p-10">
	<div class="container mx-auto w-full max-w-6xl">
		{#if data.loading}
			<div class="flex flex-col gap-5">
				{#each { length: 3 } as _}
					<Skeleton />
				{/each}
			</div>
		{:else if data.count > 0}
			<!-- Frequently Asked Questions -->

			<div>
				<h1 class="mb-5 text-center sm:mb-10">Frequently Asked Questions</h1>

				<div class="divide-y rounded border">
					{#each data.faqs as f, fx}
						<div class:text-primary-500="{show[fx]}">
							<button
								type="button"
								class="flex w-full cursor-pointer items-start justify-between gap-5 p-5 text-left focus:outline-none"
								on:click="{() => showans(fx)}">
								<h5 class="flex-1">{f.question}</h5>

								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="h-6 w-6 transition duration-300
									{show[fx] ? 'text-primary-500 transform rotate-45 transition duration-300' : ''}">
									<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15">
									</path>
								</svg>
							</button>

							{#if show[fx]}
								<div
									transition:slide="{{ duration: 300 }}"
									class="prose max-w-none px-5 pb-5 first-letter:uppercase">
									{@html f.answer}
								</div>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		{:else}
			<div class="flex h-[70vh] flex-col items-center justify-center text-center">
				<img src="{noEmptyFaqs}" alt="empty faqs" class="mb-5 h-60 object-contain" />

				<h2 class="mb-2">Empty FAQs!!</h2>

				<p class="mb-5">There's no frequently asked questions found.</p>

				<a href="/" aria-label="Click to visit home" data-sveltekit-preload-data>
					<PrimaryButton class="w-40 py-2 text-sm">Shop Now</PrimaryButton>
				</a>
			</div>
		{/if}
	</div>
</section>
