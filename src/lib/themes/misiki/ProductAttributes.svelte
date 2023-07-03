<script>
export let attributes = []
</script>

{#if attributes?.length}
	<div class="mb-5">
		<h6 class="mb-2 flex items-center gap-2 font-semibold uppercase">Specifications</h6>

		<ul class="m-0 p-0 list-none grid grid-cols-2 gap-x-10 gap-y-4">
			{#each attributes as att}
				{#if att.key && att.val}
					<li class="col-span-1 flex flex-col gap-1">
						<h6 class="text-xs text-zinc-500">
							{att.key}
						</h6>

						<p class="text-sm">
							{att.val}
						</p>

						<hr />
					</li>
				{/if}
			{/each}
		</ul>
	</div>
{/if}
