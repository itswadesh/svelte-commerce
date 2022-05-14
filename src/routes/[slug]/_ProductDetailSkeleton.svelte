<div class="lg:flex lg:gap-10">
	<div class="lg:w-2/3 grid grid-cols-2 gap-2">
		{#each { length: 6 } as _}
			<div class="col-span-1 h-[50vh] sm:h-[70vh] bg-gray-300 rounded-md animate-pulse"></div>
		{/each}
	</div>

	<div class="lg:w-1/3">
		<div class="mb-2 w-40 h-4 bg-gray-300 rounded-md animate-pulse"></div>

		<div class="mb-2 w-full h-4 bg-gray-300 rounded-md animate-pulse"></div>

		<div class="mb-5 w-4/5 h-4 bg-gray-300 rounded-md animate-pulse"></div>

		<div class="mb-2 w-2/5 h-10 bg-gray-300 rounded-md animate-pulse"></div>

		<div class="mb-5 w-2/5 h-4 bg-gray-300 rounded-md animate-pulse"></div>

		<div class="mb-5 flex flex-wrap gap-2">
			{#each { length: 6 } as _}
				<div class="w-14 h-14 bg-gray-300 rounded-full animate-pulse"></div>
			{/each}
		</div>

		<div class="mb-5 w-2/5 h-4 bg-gray-300 rounded-md animate-pulse"></div>

		<div class="mb-5 flex flex-wrap gap-2">
			{#each { length: 6 } as _}
				<div class="w-14 h-14 bg-gray-300 rounded-full animate-pulse"></div>
			{/each}
		</div>

		{#each { length: 6 } as _}
			<div class="mb-5">
				<div class="mb-2 w-40 h-4 bg-gray-300 rounded-md animate-pulse"></div>

				<div class="mb-2 w-full h-4 bg-gray-300 rounded-md animate-pulse"></div>

				<div class="mb-2 w-4/5 h-4 bg-gray-300 rounded-md animate-pulse"></div>

				<div class="mb-2 w-3/5 h-4 bg-gray-300 rounded-md animate-pulse"></div>
			</div>
		{/each}
	</div>
</div>
