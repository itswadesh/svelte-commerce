<script>
import { getExtension, toast } from '$lib/utils'
import { goto } from '$app/navigation'
import { page } from '$app/stores'
import { post } from '$lib/utils/api'
import { ReviewService } from '$lib/services'
import {Textarea,PrimaryButton,Errors,BackButton} from '$lib/ui'
import dayjs from 'dayjs'
import {LazyImg} from '$lib/components'
import SEO from '$lib/components/SEO/index.svelte'

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
	oid: $page?.url?.searchParams.get('oid') || null,
	message: '',
	rating: null
}
let today = dayjs().format('YYYY-MM-DD')
let file
let folder = 'userdesigns'
if (today) {
	folder = `userdesigns/${today}`
}
let uploading = false
let select = null
let errors = []
let images = []

function onSelect(i) {
	select = i
	review.rating = i + 1
}

async function uploadImageToS3() {
	try {
		uploading = true
		const response = await fetch('/server/files/upload', {
			method: 'POST',
			body: file[0],
			headers: {
				folder,
				extension: getExtension(file[0]?.name),
				'Content-Type': file[0].type || 'image/*'
			}
		})
		const res = await response.json()

		if (res?.url) {
			let imgs = [...images]
			imgs.push(res?.url)
			images = imgs
		}
	} catch (e) {
	} finally {
		uploading = false
	}
}

async function saveReviewproduct(review) {
	try {
		toast('Sending your business rating and review', 'info')
		review.store = $page.data.store?.id
		await ReviewService.saveReview({
			id: review.id,
			pid: review.pid,
			oid: review.oid,
			message: review.message,
			rating: review.rating,
			images,
			storeId: $page.data.store?.id,
			origin: $page.data.origin
		})

		toast('Successfully saved.', 'success')

		if (data.product) goto(`${data.ref}#ratings-and-reviews`)
	} catch (e) {
		toast(e?.body?.message || e?.body, 'error')
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
				href="{data.ref || '##'}"
				aria-label="Click to view the product details"
				class="mb-2 flex max-w-max flex-row items-center gap-4 text-sm text-zinc-500 lg:flex-row-reverse lg:text-right group">
				<div
					class="h-14 w-14 border border-zinc-200 rounded shadow-md flex items-center justify-center">
					<LazyImg
						src="{data.product?.img}"
						alt="Business img"
						height="48"
						class="h-12 w-auto object-contain object-center text-xs" />
				</div>

				<div class="flex-1">
					<h6 class="font-semibold">{data.product?.brand?.name}</h6>

					<span class="group-hover:underline">{data.product?.name}</span>
				</div>
			</a>
		{/if}
	</div>

	<Errors errors="{errors}" />

	<div class="flex flex-col-reverse xl:flex-row xl:gap-4">
		<div class="mt-4 flex w-full flex-col gap-2 xl:mt-0 xl:w-1/3">
			<div class="rounded border bg-white p-4 text-lg font-semibold capitalize shadow-md">
				What makes a good review
			</div>

			<ul class="gap-2 divide-y rounded border bg-white shadow-md">
				{#each information as info}
					<li class="flex flex-col gap-1 p-4 text-sm">
						<span class="font-semibold">{info.question}</span>

						<span>{info.answer}</span>
					</li>
				{/each}
			</ul>
		</div>

		<form on:submit|preventDefault="{() => saveReviewproduct(review)}" class="w-full">
			<div class="flex flex-col gap-4 rounded border bg-white p-4 shadow-md">
				<div class="flex flex-wrap items-center">
					<h2 class="mb-2 mr-4 text-lg font-semibold capitalize">Rate this business</h2>

					<div class="flex items-center gap-4">
						<div class="flex items-center gap-2">
							{#each { length: 5 } as _, i}
								<button
									type="button"
									class="focus:outline-none focus:ring-0 focus:ring-offset-0"
									on:click="{() => onSelect(i)}">
									<svg
										class="block h-8 w-8
        									{select >= i && select != null ? 'text-primary-500' : 'text-zinc-200'}"
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

				<div>
					<h2 class="mb-2 mr-4 text-lg font-semibold capitalize">Reviews this business</h2>

					<Textarea placeholder="Description" bind:value="{review.message}" />
				</div>

				<div>
					<h2 class="mb-2 mr-4 text-lg font-semibold capitalize">Upload Image</h2>

					{#if images?.length}
						<div class="mb-10">
							{#each images as img}
								<img src="{img}" alt="review image" class="h-40 w-auto object-contain" />
							{/each}
						</div>
					{/if}

					<div class="flex items-center justify-center w-full">
						<label
							for="dropzone-file"
							class="flex flex-col items-center justify-center w-full h-64 border-2 border-zinc-200 border-dashed rounded-lg cursor-pointer bg-zinc-50 hover:bg-zinc-100">
							<div class="flex flex-col items-center justify-center pt-5 pb-6">
								<svg
									aria-hidden="true"
									class="w-10 h-10 mb-3 text-zinc-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12">
									</path>
								</svg>

								<p class="mb-2 text-sm text-zinc-500 dark:text-zinc-400">
									<span class="font-semibold">Click to upload</span> or drag and drop
								</p>

								<p class="text-xs text-zinc-500 dark:text-zinc-400">SVG, PNG, JPG or GIF</p>
							</div>

							<input
								id="dropzone-file"
								type="file"
								accept="image/*"
								class="hidden"
								multiple="{false}"
								bind:files="{file}"
								on:change="{uploadImageToS3}" />
						</label>
					</div>
				</div>

				<div class="ml-auto max-w-max">
					<PrimaryButton type="submit" class="w-40">SUBMIT</PrimaryButton>
				</div>
			</div>
		</form>
	</div>
</div>
