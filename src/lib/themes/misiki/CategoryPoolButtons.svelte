<script>
export let categoryPool = []

</script>

{#if categoryPool?.length}
	<ul
		class="w-[89vw] sm:w-full flex sm:flex-wrap items-center justify-start sm:justify-center gap-2 sm:gap-4 overflow-x-auto sm:overflow-x-visible scrollbar-none">
		{#each categoryPool as c}
			{#if c}
				<li>
					<a
						href="/{c.slug}"
						class="py-2 px-6 text-sm rounded-full font-semibold border bg-transparent border-zinc-200 hover:border-primary-500 text-primary-500 flex items-center justify-center gap-1 uppercase whitespace-nowrap transition duration-300 focus:outline-none">
						<span>{c.name}</span>

						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							class="w-5 h-5">
							<path
								fill-rule="evenodd"
								d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
								clip-rule="evenodd"></path>
						</svg>
					</a>
				</li>
			{/if}
		{/each}
	</ul>
{/if}
