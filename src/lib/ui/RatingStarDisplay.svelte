<script>
export let rating,
	ratingCount,
	reviewCount,
	textWhite = false,
	biggerSize = false

let fullColorCount = 0,
	disableColorCount = 0

$: if (rating === 1.5) {
	fullColorCount = 1
	disableColorCount = 3
} else if (rating === 2.5) {
	fullColorCount = 2
	disableColorCount = 2
} else if (rating === 3.5) {
	fullColorCount = 3
	disableColorCount = 1
} else if (rating === 4.5) {
	fullColorCount = 4
	disableColorCount = 0
}
</script>

{#if rating || reviewCount}
	<div
		class="flex flex-wrap items-center gap-2 text-sm  {textWhite ? 'text-white' : 'text-gray-800'} 
		{biggerSize ? 'font-semibold' : 'font-normal'}"
	>
		{#if rating > 0}
			{#if rating === 5 || rating === 4 || rating === 3 || rating === 2 || rating === 1}
				<div class="flex items-center gap-1">
					{#each { length: rating } as _}
						<div class="flex items-center justify-center rounded-md bg-primary-500 p-1 text-white">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="{biggerSize ? 'h-5 w-5' : 'h-4 w-4'}"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
								></path>
							</svg>
						</div>
					{/each}

					{#each { length: 5 - rating } as _}
						<div class="flex items-center justify-center rounded-md bg-gray-300 p-1 text-white">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="{biggerSize ? 'h-5 w-5' : 'h-4 w-4'}"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
								></path>
							</svg>
						</div>
					{/each}
				</div>
			{:else if rating === 4.5 || rating === 3.5 || rating === 2.5 || rating === 1.5}
				<div class="flex items-center gap-1">
					{#each { length: fullColorCount } as _}
						<div class="flex items-center justify-center rounded-md bg-primary-500 p-1 text-white">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="{biggerSize ? 'h-5 w-5' : 'h-4 w-4'}"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
								></path>
							</svg>
						</div>
					{/each}

					<div
						class="flex items-center justify-center rounded-md  p-1 text-white"
						style="background: linear-gradient(90deg, #1F2937 50%, #D1D5DB 50%);"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="{biggerSize ? 'h-5 w-5' : 'h-4 w-4'}"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
							>
							</path>
						</svg>
					</div>

					{#each { length: disableColorCount } as _}
						<div class="flex items-center justify-center rounded-md bg-gray-300 p-1 text-white">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="{biggerSize ? 'h-5 w-5' : 'h-4 w-4'}"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
								></path>
							</svg>
						</div>
					{/each}
				</div>
			{/if}
		{/if}

		<div class="flex items-center gap-2 whitespace-nowrap">
			{#if ratingCount}
				<span>
					{ratingCount}
					{#if ratingCount === 1}
						rating
					{:else}
						ratings
					{/if}
				</span>
			{/if}

			{#if ratingCount && reviewCount}
				&
			{/if}

			{#if reviewCount}
				<span>
					{reviewCount}
					{#if reviewCount === 1}
						review
					{:else}
						reviews
					{/if}
				</span>
			{/if}
		</div>
	</div>
{/if}
