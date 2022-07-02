<script>
import { goto } from '$app/navigation'

export let to = ''

let clazz

export { clazz as class }

function go() {
	if (to) {
		goto(to)
	} else goto('/')
}
</script>

<section class="max-w-max text-gray-800  {clazz}">
	<button
		class="flex max-w-max transform items-center transition duration-300 hover:-translate-x-1 hover:text-primary-500 focus:outline-none"
		on:click="{go}">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-5 w-5"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M15 19l-7-7 7-7"
			></path>
		</svg>

		<span>Back</span>
	</button>
</section>
