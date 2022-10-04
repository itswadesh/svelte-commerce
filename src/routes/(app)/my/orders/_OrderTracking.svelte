<style></style>

<script>
import LazyImg from '$lib/components/Image/LazyImg.svelte'

import { date } from '$lib/util'

export let order
</script>

{#if order.orderHistory?.length > 0}
	<div class="xl:w-2/3">
		<div class="relative z-10">
			<div
				class="flex flex-col justify-start gap-16 xl:flex-row xl:items-center xl:justify-between xl:gap-2">
				{#each order.orderHistory as t, tx}
					{#if t.index < 7 && t.public === true}
						<div class="flex w-full gap-2">
							<div class="flex flex-1 flex-col xl:items-center xl:justify-center">
								{#if t.time}
									<div class="relative h-10 w-10 rounded-full bg-primary-500">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="absolute inset-0 m-1.5 h-7 w-7 text-white"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="3"
												d="M5 13l4 4L19 7"></path>
										</svg>
									</div>
								{:else}
									<div
										class="relative h-10 w-10 rounded-full border border-black border-opacity-40 bg-white">
										<LazyImg
											src="{t.icon}"
											alt=""
											width="24"
											height="24"
											class="absolute inset-0 m-1.5 h-6 w-6 opacity-40" />
									</div>
								{/if}

								<div
									class="absolute left-12 whitespace-nowrap xl:static xl:mt-2 xl:text-center 
									{t.time ? 'opacity-100' : 'opacity-40'} ">
									<h4 class="font-medium">{t.status}</h4>

									<h6 class="mt-1 text-xs font-light text-gray-500">
										{#if t.time}
											<span>
												{date(t.time)}
											</span>
										{:else}
											<span> _ _ _ </span>
										{/if}
									</h6>
								</div>
							</div>

							{#if tx < 4}
								<div
									class="mt-4 h-2 w-full rounded-full
									{t.time ? 'bg-primary-500' : 'bg-gray-400'}">
								</div>
							{/if}
						</div>
					{/if}
				{/each}
			</div>
		</div>
	</div>
{/if}
