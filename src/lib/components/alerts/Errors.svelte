<script lang="ts">
import { UiRedX } from '$lib/components/icons'

export let errors
export let title = 'There were errors with your submission'
</script>

{#if errors?.length > 0}
	<div class="bg-error-50 text-error-800 rounded-md p-4 mt-4">
		<div class="flex">
			<div class="flex-shrink-0">
				<UiRedX />
			</div>
			<div class="ml-3">
				<h3 class="text-sm leading-5 font-medium">
					{title}
				</h3>
				<div class="mt-2 text-sm leading-5 text-error-700">
					<ul class="list-disc pl-5">
						{#each errors as error}
							<li>
								{error}
							</li>
						{/each}
					</ul>
				</div>
			</div>
		</div>
	</div>
{/if}
