<style></style>

<script>
import { date } from '$lib/utils'
import LazyImg from '$lib/components/Image/LazyImg.svelte'

export let tracks
</script>

<div>
	<h3 class="mb-4">Timeline</h3>

	<div class="flex flex-col gap-2">
		{#each tracks as t}
			<div>
				<div class="mb-2 flex items-start gap-4">
					<div class="h-5 w-5 shrink-0 overflow-hidden rounded-full">
						{#if t.icon}
							<LazyImg
								src="{t.icon}"
								width="20"
								height="20"
								alt=" "
								class="h-full w-full bg-zinc-100 object-contain object-center" />
						{:else}
							<div class="h-full w-full bg-zinc-200"></div>
						{/if}
					</div>

					<h6 class="flex-1 gap-1 capitalize">
						{t.title}
					</h6>
				</div>

				<div class="flex gap-4">
					<!-- This is required for gray straight line -->

					<div class="flex w-5 items-center justify-center">
						<div class="h-full min-h-[24px] w-[2px] bg-zinc-200"></div>
					</div>

					<div class="flex flex-1 flex-col gap-1">
						{#if t.comment}
							<p class="first-letter:uppercase">
								{t.comment}
							</p>
						{/if}

						<span class="text-xs text-zinc-500">{date(t.time)}</span>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>

<!-- {#if order.orderHistory?.length > 0}
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
									<h5>{t.status}</h5>

									<h6 class="mt-1 text-zinc-500">
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
									{t.time ? 'bg-primary-500' : 'bg-zinc-400'}">
								</div>
							{/if}
						</div>
					{/if}
				{/each}
			</div>
		</div>
	</div>
{/if} -->
