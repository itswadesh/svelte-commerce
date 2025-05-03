<script lang="ts">
	import { Label } from '$lib/components/ui/label'
	import { Avatar } from '$lib/components/ui/avatar'
	import { Button } from '$lib/components/ui/button'
	import Modal from '$lib/components/common/modal.svelte'
	import { date } from '$lib/core/utils'
	import OrderTimelineRenderer from '$lib/core/composables/order-timeline-renderer.svelte'

	let { timeline } = $props()
</script>

<OrderTimelineRenderer {timeline}>
	{#snippet content({
		comments,
		systemGeneratedMessages,
		showEmailPreviewFromTimeline,
		selectedEmailFromTimeline,
		showEmailPreview,
		hideEmailPreview
	})}
		<div class=" flex flex-col">
			<Label class="mb-3 text-sm font-semibold sm:text-base">Timeline</Label>

			<div class="">
				<div class="relative">
					<div class="absolute bottom-0 left-[17px] top-0 w-[2px] bg-muted"></div>

					<div class="space-y-4 sm:space-y-6">
						{#each [...comments, ...systemGeneratedMessages] as item}
							<div class="relative pl-8 sm:pl-10">
								<div
									class="absolute left-[18px] top-2 box-content h-[9px] w-[9px] -translate-x-[50%] rounded-full border-[3px] border-white bg-[#515151]"
								></div>

								{#if 'avatar' in item}
									<!-- Comment item -->
									<div class="mb-2 rounded-lg border bg-card p-3 shadow-sm sm:p-4">
										<div class="flex items-start gap-2 sm:gap-3">
											<Avatar class="flex h-8 w-8 items-center justify-center bg-gray-200 text-black sm:h-12 sm:w-12">
												<span class="text-base sm:text-lg">{item.avatar}</span>
											</Avatar>
											<div class="min-w-0 flex-1">
												<div class="text-sm font-medium sm:text-base">{item.author}</div>
												<div class="break-words text-xs text-muted-foreground sm:text-sm">{@html item.content}</div>
											</div>
										</div>
									</div>
								{:else}
									<!-- Timeline entry -->
									<div class="group flex flex-col gap-1 sm:flex-row sm:gap-0">
										<div class="min-w-0 flex-1">
											<p class="whitespace-pre-line break-words text-xs text-gray-700 sm:text-sm">{@html item.message}</p>
											{#if item.comment}
												<div class="break-words text-xs text-muted-foreground sm:text-sm">{@html item.comment}</div>
											{/if}

											{#if item.action}
												<Button variant="secondary" size="sm" class="mt-2 text-xs sm:text-sm" onclick={item.action.onClick}>
													{item.action.label}
												</Button>
											{/if}
										</div>

										<div class="flex items-center text-xs text-muted-foreground sm:text-sm">
											<span>{date(item.timestamp)}</span>
										</div>
									</div>
								{/if}
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>

		<Modal loading={false} show={showEmailPreviewFromTimeline} title="Email Preview" hideFooter close={hideEmailPreview}>
			<div class="p-5">
				{@html selectedEmailFromTimeline}
			</div>
		</Modal>
	{/snippet}
</OrderTimelineRenderer>
