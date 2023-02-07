<script>
export let small = false
</script>

<div class="flex w-full animate-pulse gap-5">
	<div
		class="rounded-md bg-gray-200  
		{small ? 'w-14 h-14 sm:w-20 sm:h-20' : 'w-24 h-24 sm:w-40 sm:h-40'}"
	></div>

	<div class="flex w-full flex-1 flex-col {small ? 'gap-2 sm:gap-3' : 'gap-3 sm:gap-4'}">
		<div
			class="w-4/5 rounded-md bg-gray-200
			{small ? 'h-2 sm:h-3' : 'h-3 sm:h-5'}"
		></div>

		<div
			class="w-3/5 rounded-md bg-gray-200
			{small ? 'h-2 sm:h-3' : 'h-3 sm:h-5'}"
		></div>

		<div
			class="w-2/6 rounded-md bg-gray-200
			{small ? 'h-2 sm:h-3' : 'h-3 sm:h-5'}"
		></div>
	</div>
</div>
