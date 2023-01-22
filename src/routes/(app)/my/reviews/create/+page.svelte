<script>
import { goto } from '$app/navigation'
import { page } from '$app/stores'
import { post } from '$lib/utils/api'
import { toast } from '$lib/utils'
import BackButton from '$lib/ui/BackButton.svelte'
import Errors from '$lib/ui/Errors.svelte'
import LazyImg from '$lib/components/Image/LazyImg.svelte'
import PrimaryButton from '$lib/ui/PrimaryButton.svelte'
import SEO from '$lib/components/SEO/index.svelte'
import Textarea from '$lib/ui/Textarea.svelte'

const seoProps = {
	title: 'Reviews Details',
	description: 'Reviews Details'
}

export let data

let information = [
	{
		question: `Have you used this business?`,
		answer: `Your review should be about your experience with the business.`
	},
	{
		question: `Why review a business?`,
		answer: `Your valuable feedback will help fellow shoppers decide!`
	},
	{
		question: `How to review a business?`,
		answer: `Your review should include facts. An honest opinion is always appreciated. If you have an issue with the business or service please contact us from the help centre.`
	}
]

let review = {
	id: 'new',
	pid: data.product?._id,
	message: '',
	rating: null
}

let select = null,
	errors = []

function onSelect(i) {
	select = i
	review.rating = i + 1
}

async function saveReviewproduct(review) {
	try {
		toast('Sending your business rating and review', 'info')
		review.store = $page.data.store?.id
		await post('reviews', review, $page.data.origin)

		toast('Successfully saved.', 'success')

		if (data.product) goto(`${data.ref}#ratings-and-reviews`)
	} catch (e) {
		toast(e, 'error')
	} finally {
	}
}
</script>

<SEO {...seoProps} />

<div>
	<BackButton to="{data.ref}" class="mb-2" />

	<div class="mb-3 flex flex-col justify-between lg:flex-row lg:items-center">
		<h1 class="mb-2 font-serif text-2xl font-medium md:text-3xl lg:text-4xl">
			Ratings and Reviews
		</h1>

		{#if data.product}
			<a
				href="{data.ref}"
				aria-label="Click to view the product details"
				class="mb-2 flex max-w-max flex-row items-center gap-4 text-sm text-gray-500 lg:flex-row-reverse">
				<div>
					<LazyImg
						src="{data.product?.img}"
						alt="Business img"
						width="48"
						height="48"
						class="h-12 w-auto object-contain object-center text-xs" />
				</div>

				<span>{data.product?.name}</span>
			</a>
		{/if}
	</div>

	<Errors errors="{errors}" />

	<div class="flex flex-col-reverse xl:flex-row xl:gap-4">
		<div class="mt-4 flex w-full flex-col gap-2 xl:mt-0 xl:w-1/3">
			<div class="rounded-md border bg-white p-4 text-lg font-semibold capitalize shadow-md">
				What makes a good review
			</div>

			<ul class="gap-2 divide-y rounded-md  border bg-white shadow-md">
				{#each information as info}
					<li class="flex flex-col gap-1 p-4 text-sm">
						<span class="font-semibold">{info.question}</span>

						<span>{info.answer}</span>
					</li>
				{/each}
			</ul>
		</div>

		<div class="h-full w-full">
			<div class="flex flex-col rounded-md border bg-white p-4 shadow-md">
				<div class="mb-2 flex flex-wrap items-center">
					<h1 class="mb-2 mr-4 text-lg font-semibold capitalize">Rate this business</h1>

					<div class="mb-2">
						<div class="flex items-center gap-4">
							<div class="flex items-center gap-2">
								{#each { length: 5 } as _, i}
									<button
										type="button"
										class="focus:outline-none focus:ring-0 focus:ring-offset-0"
										on:click="{() => onSelect(i)}">
										<svg
											class="block h-8 w-8
        									{select >= i && select != null ? 'text-primary-500' : 'text-gray-300'}"
											fill="currentColor"
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 20 20">
											<path
												d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"
											></path>
										</svg>
									</button>
								{/each}
							</div>

							{#if select == 0}
								<span class="font-semibold text-red-600"> Very Disappointed </span>
							{/if}

							{#if select == 1}
								<span class="font-semibold text-orange-600"> Slightly Disapponted </span>
							{/if}

							{#if select == 2}
								<span class="font-semibold text-green-600"> Good</span>
							{/if}

							{#if select == 3}
								<span class="font-semibold text-green-600"> Very Good</span>
							{/if}

							{#if select == 4}
								<span class="font-semibold text-green-600"> Excellent</span>
							{/if}
						</div>
					</div>
				</div>

				<div>
					<h1 class="mb-2 mr-4 text-lg font-semibold capitalize">Reviews this business</h1>

					<form on:submit|preventDefault="{() => saveReviewproduct(review)}">
						<div class="mb-4">
							<Textarea placeholder="Description" bind:value="{review.message}" />
						</div>

						<div class="ml-auto max-w-max">
							<PrimaryButton type="submit" class="w-40">SUBMIT</PrimaryButton>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</div>
