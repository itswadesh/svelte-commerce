<script>
import { UiGreenCheck } from '$lib/components/icons'

export let success
export let title = 'Success!'
</script>

{#if success}
	<div class="rounded-md bg-green-100 p-4 mt-4">
		<div class="flex">
			<div class="flex-shrink-0">
				<UiGreenCheck />
			</div>
			<div class="ml-3">
				<h3 class="text-sm leading-5 font-medium text-green-800">
					{title}
				</h3>
				<div class="mt-2 text-sm leading-5 text-green-700">
					<p>
						{success}
					</p>
				</div>
			</div>
		</div>
	</div>
{/if}
