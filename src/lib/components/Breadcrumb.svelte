<script lang="ts">
export let data = []

let clazz = ''
export { clazz as class }
</script>

<div class="{clazz} overflow-x-auto scrollbar-none">
	<ul class="flex max-w-[90vw] items-center justify-start whitespace-nowrap text-sm">
		{#each data as d}
			<li>
				{#if d.link}
					<div class="flex items-center">
						<a
							href="{d.link}"
							aria-label="Click to go inside this page"
							class="first-letter:uppercase hover:text-blue-600 hover:underline">
							{d.label}
						</a>

						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5 px-1"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"></path>
						</svg>
					</div>
				{:else}
					<span class="truncate text-gray-400 first-letter:uppercase">{d.label}</span>
				{/if}
			</li>
		{/each}
	</ul>
</div>
