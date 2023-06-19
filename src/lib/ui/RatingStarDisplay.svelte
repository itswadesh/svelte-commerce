<script>
export let biggerSize = false
export let rating
export let ratingCount
export let reviewCount
export let textWhite = false

let clazz = ''
export { clazz as class }

let disableColorCount = 0
let fullColorCount = 0

$: if (rating == 1.5) {
	fullColorCount = 1
	disableColorCount = 3
} else if (rating == 2.5) {
	fullColorCount = 2
	disableColorCount = 2
} else if (rating == 3.5) {
	fullColorCount = 3
	disableColorCount = 1
} else if (rating == 4.5) {
	fullColorCount = 4
	disableColorCount = 0
}
</script>

<div
	class="{clazz} text-sm
	{textWhite ? 'text-white' : 'text-zinc-800'} 
	{biggerSize ? 'font-semibold' : 'font-normal'}">
	{#if rating == 4.5 || rating == 3.5 || rating == 2.5 || rating == 1.5}
		<div class="flex items-center gap-1">
			{#each { length: fullColorCount } as _}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="text-primary-500 {biggerSize ? 'h-5 w-5' : 'h-4 w-4'}"
					viewBox="0 0 24 24"
					stroke-width="2"
					stroke="currentColor"
					fill="none"
					stroke-linecap="round"
					stroke-linejoin="round">
					<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
					<path
						d="M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z"
						stroke-width="0"
						fill="currentColor"></path>
				</svg>
			{/each}

			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="text-primary-500 {biggerSize ? 'h-5 w-5' : 'h-4 w-4'}"
				viewBox="0 0 24 24"
				stroke-width="2"
				stroke="currentColor"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round">
				<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
				<path
					d="M12 1a.993 .993 0 0 1 .823 .443l.067 .116l2.852 5.781l6.38 .925c.741 .108 1.08 .94 .703 1.526l-.07 .095l-.078 .086l-4.624 4.499l1.09 6.355a1.001 1.001 0 0 1 -1.249 1.135l-.101 -.035l-.101 -.046l-5.693 -3l-5.706 3c-.105 .055 -.212 .09 -.32 .106l-.106 .01a1.003 1.003 0 0 1 -1.038 -1.06l.013 -.11l1.09 -6.355l-4.623 -4.5a1.001 1.001 0 0 1 .328 -1.647l.113 -.036l.114 -.023l6.379 -.925l2.853 -5.78a.968 .968 0 0 1 .904 -.56zm0 3.274v12.476a1 1 0 0 1 .239 .029l.115 .036l.112 .05l4.363 2.299l-.836 -4.873a1 1 0 0 1 .136 -.696l.07 -.099l.082 -.09l3.546 -3.453l-4.891 -.708a1 1 0 0 1 -.62 -.344l-.073 -.097l-.06 -.106l-2.183 -4.424z"
					stroke-width="0"
					fill="currentColor"></path>
			</svg>

			{#each { length: disableColorCount } as _}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="text-zinc-400 {biggerSize ? 'h-5 w-5' : 'h-4 w-4'}"
					viewBox="0 0 24 24"
					stroke-width="2"
					stroke="currentColor"
					fill="none"
					stroke-linecap="round"
					stroke-linejoin="round">
					<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
					<path
						d="M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z"
						stroke-width="0"
						fill="currentColor"></path>
				</svg>
			{/each}
		</div>
	{:else}
		<div class="flex items-center gap-1">
			{#each { length: rating } as _}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="text-primary-500 {biggerSize ? 'h-5 w-5' : 'h-4 w-4'}"
					viewBox="0 0 24 24"
					stroke-width="2"
					stroke="currentColor"
					fill="none"
					stroke-linecap="round"
					stroke-linejoin="round">
					<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
					<path
						d="M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z"
						stroke-width="0"
						fill="currentColor"></path>
				</svg>
			{/each}

			{#each { length: 5 - rating } as _}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="text-zinc-400 {biggerSize ? 'h-5 w-5' : 'h-4 w-4'}"
					viewBox="0 0 24 24"
					stroke-width="2"
					stroke="currentColor"
					fill="none"
					stroke-linecap="round"
					stroke-linejoin="round">
					<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
					<path
						d="M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z"
						stroke-width="0"
						fill="currentColor"></path>
				</svg>
			{/each}
		</div>
	{/if}

	<div class="mt-1 flex felx-wrap items-center gap-2 whitespace-nowrap">
		<span>
			{#if ratingCount}
				{ratingCount}
			{:else}
				No
			{/if}

			{#if ratingCount > 1}
				Review
			{:else}
				Rating
			{/if}
		</span>

		&

		<span>
			{#if reviewCount}
				{reviewCount}
			{:else}
				No
			{/if}

			{#if reviewCount > 1}
				Reviews
			{:else}
				Review
			{/if}
		</span>
	</div>
</div>
