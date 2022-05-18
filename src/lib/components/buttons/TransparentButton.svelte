<style></style>

<script>
export let loading = false,
	disabled = false,
	loadingringsize = 'sm',
	rounded = false,
	border = false,
	type = 'button'
let clazz
export { clazz as class }
</script>

<div class="{clazz}">
	<button
		type="{type}"
		class="
      relative
      transform
      items-center
      justify-center
      border-2
      px-4
      py-2
      text-center
      font-semibold
      tracking-wider
      text-primary-500
      transition
      duration-300
      focus:outline-none
      focus:ring-0 focus:ring-offset-0 active:scale-95
      {disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-transparent'}
      {rounded ? 'rounded-full ' : 'rounded-md'}
      {border
			? ' border-primary-500 hover:border-primary-700 hover:text-primary-700 shadow-md hover:shadow'
			: 'border-transparent hover:bg-gray-500 hover:text-white '}
    "
		on:click>
		<div class="flex items-center justify-center space-x-1">
			<slot />
		</div>

		{#if loading}
			<div
				class="
						absolute
						inset-0
						flex cursor-not-allowed
						items-center
						justify-center
						bg-black
						bg-opacity-50
						{rounded ? 'rounded-full' : 'rounded-md'}
					">
				<svg
					class="animate-spin text-white {loadingringsize == 'xs'
						? 'w-4 h-4'
						: loadingringsize == 'sm'
						? 'h-5 w-5'
						: loadingringsize == 'base'
						? 'h-6 w-6'
						: loadingringsize == 'lg'
						? 'h-7 w-7'
						: 'h-7 w-7'} "
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
	</button>
</div>
