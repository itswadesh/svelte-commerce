<script>
import Skeleton from '$lib/ui/Skeleton.svelte'
import { getAPI } from '$lib/util/api'
import dayjs from 'dayjs'
import { onMount } from 'svelte'
import { page } from '$app/stores'
import { applyAction, enhance } from '$app/forms'

export let product, data

let deliveryDetails = $page.data.zip || {}
let pincode = deliveryDetails.pincode ?? ''
let validPin = !!pincode
let loading = false

function handlePinCode() {
	if (pincode.toString().length === 6) {
		validPin = true
	}
}

// async function submit() {
// 	try {
// 		loading = true
// 		deliveryDetails = await getAPI(`pincodes/${pincode}`, $page.data.origin)
// 		await cookies.set('zip', pincode, { path: '/' })
// 		$page.data.zip = pincode
// 	} catch (e) {
// 	} finally {
// 		loading = false
// 	}
// }
</script>

<div class="mb-4">
	<form
		action="/server/verify-zip"
		method="POST"
		use:enhance="{() => {
			return async ({ result }) => {
				console.log('bounceItemFromTop', result)
				deliveryDetails = result
				await applyAction(result)
			}
		}}"
		class="relative w-full max-w-sm overflow-hidden rounded-md border
        {validPin ? 'border-primary-500' : 'border-gray-400'}">
		<input
			name="zip"
			type="tel"
			value="{pincode}"
			maxlength="6"
			placeholder="Please enter pincode"
			class="w-full rounded-md bg-transparent py-3 px-4 pr-24 text-sm font-semibold focus:outline-none"
			on:input="{handlePinCode}" />

		<button
			type="submit"
			class="absolute inset-y-0 right-0 z-10 flex w-20 items-center justify-center text-right text-sm font-bold uppercase 
            {validPin ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-300'}">
			{#if loading}
				<div
					class="absolute inset-0 flex cursor-not-allowed items-center justify-center bg-black bg-opacity-70">
					<svg
						class="mx-auto h-4 w-4 animate-spin text-white"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
						></circle>
						<path
							class="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					</svg>
				</div>
			{/if}

			<span> Check </span>
		</button>
	</form>

	{#if loading}
		<ul class="mt-4 flex flex-col gap-4">
			{#each { length: 2 } as _}
				<li>
					<Skeleton extraSmall />
				</li>
			{/each}
		</ul>
	{:else if deliveryDetails}
		<ul class="mt-4 flex flex-col gap-2">
			<li class="flex items-center gap-4">
				<div class="flex h-auto w-8 items-center justify-end overflow-hidden">
					<img
						src="/product/delivery.png"
						alt=""
						class="h-full w-full object-contain object-center" />
				</div>

				<span>
					Get it by {dayjs().add(deliveryDetails.deliveryDays, 'day').format('dddd, MMM D, YYYY')}
				</span>
			</li>

			<li class="flex items-center gap-4">
				<div class="flex h-auto w-8 items-center justify-end overflow-hidden">
					<img src="/product/cod.png" alt="" class="h-full w-full object-contain object-center" />
				</div>

				<span>
					{#if deliveryDetails.hasCOD}
						Pay on delivery available
					{:else}
						Pay on delivery not available
					{/if}
				</span>
			</li>

			{#if product.replaceAllowed || product.returnAllowed}
				<li class="flex items-center gap-4">
					<div class="flex h-auto w-8 items-center justify-end overflow-hidden">
						<img
							src="/product/opposite-arrows.png"
							alt=""
							class="h-full w-full object-contain object-center" />
					</div>

					<div>
						{#if product.replaceAllowed && product.returnAllowed}
							{#if product.returnValidityInDays === product.replaceValidityInDays}
								Easy {product.returnValidityInDays} days return & exchange available
							{:else}
								Easy {product.returnValidityInDays} days return & {product.replaceValidityInDays}
								days exchange available
							{/if}
						{/if}

						{#if product.returnAllowed && product.returnValidityInDays > 0 && !product.replaceAllowed}
							Easy {product.returnValidityInDays} days return available
						{/if}

						{#if product.replaceAllowed && product.replaceValidityInDays > 0 && !product.returnAllowed}
							Easy {product.replaceValidityInDays} days exchange available
						{/if}
					</div>
				</li>
			{/if}
		</ul>
	{:else}
		<div class="mt-2">
			<p class="text-xs text-gray-500">
				Please enter PIN code to check delivery time & Pay on Delivery Availability
			</p>

			<ul class="mt-4 ml-4 flex list-disc flex-col gap-1 text-sm">
				<li>100% Original Products</li>

				<li>Pay on delivery might be available</li>

				<li>Easy 30 days returns and exchanges</li>

				<li>Try & Buy might be available</li>
			</ul>
		</div>
	{/if}
</div>
