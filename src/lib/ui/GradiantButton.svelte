<style>
.gradient {
	display: flex;
	background: linear-gradient(120deg, #1f2937, #0a6ce8, #1f2937, #0a6ce8, #1f2937);
	background-size: 300%;
	transition: 0.8s;
}

.gradient:hover {
	background-position: right;
}
</style>

<script>
import { createEventDispatcher } from 'svelte'

const dispatch = createEventDispatcher()

export let loading = false,
	loadingringsize = 'base',
	disabled = false,
	className,
	roundedFull = false,
	type = 'button'

// creates a `class` property, even
// though it is a reserved word

export { className as class }
</script>

<button
	type="{type}"
	class="
      relative
      px-4
      py-2
      font-semibold
      tracking-wider
      text-white
      transition
      duration-300
      transform
      bg-white
      shadow-md
      hover:shadow
      items-center
      justify-center
      text-center
      focus:outline-none focus:ring-0 focus:ring-offset-0 overflow-hidden
	  {disabled ? 'bg-gray-400 cursor-not-allowed' : 'gradient active:scale-95'}
      {roundedFull ? 'rounded-full' : 'rounded-md'}
	  {className}
    "
	on:click="{() => dispatch('click')}">
	<div class="flex items-center justify-center space-x-1">
		<slot />
	</div>

	{#if loading}
		<div
			class="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center cursor-not-allowed">
			<svg
				class="mx-auto text-white animate-spin 
				{loadingringsize == 'xs' ? 'w-4 h-4' : ''}
				{loadingringsize == 'sm' ? 'h-5 w-5' : ''}
				{loadingringsize == 'base' ? 'h-6 w-6' : ''}
				{loadingringsize == 'lg' ? 'h-7 w-7' : ''}"
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
