<style></style>

<script>
import { date } from '../../../util'

export let order
</script>

<div class="relative xl:w-2/3">
	<div class="relative z-10">
		<div
			class="
          flex flex-col
          xl:flex-row
          space-y-16
          xl:space-y-0 xl:items-center
          justify-start
          xl:justify-between
          flex-wrap
        ">
			{#each order.orderHistory as t, tx}
				{#if t.index < 7 && t.public === true}
					<div class="flex flex-col xl:items-center xl:justify-center">
						{#if t.time}
							<div class="relative h-10 w-10 bg-primary-500 rounded-full">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="absolute inset-0 text-white h-7 w-7 m-1.5"
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
								class="
									relative
									h-10
									w-10
									bg-white
									rounded-full
									border border-black border-opacity-40
									">
								<img
									src="{`${t.icon}?tr=w-24,h-24,fo-auto`}"
									alt=""
									class="absolute inset-0 h-6 w-6 m-1.5 opacity-40" />
							</div>
						{/if}

						<div
							class="absolute xl:static left-12 xl:mt-2 xl:text-center {t.time
								? 'opacity-100'
								: 'opacity-40'} ">
							<h4 class="font-medium">{t.status}</h4>

							<h6 class="mt-1 text-xs font-light text-gray-500">
								{#if t.time}
									<span>
										{date(+t.time)}
									</span>
								{:else}
									<span class="opacity-0"> &nbsp; </span>
								{/if}
							</h6>
						</div>
					</div>
				{/if}
			{/each}
		</div>
	</div>

	<div
		class="
        absolute
        z-0
        inset-0
        top-5
        left-5
        bottom-10
        xl:bottom-0 xl:left-14 xl:right-14
        isolate
      ">
		<div
			class="
          w-1
          h-full
          xl:h-1 xl:w-full
          border-l-2
          xl:border-l-0 xl:border-t-2
          border-dotted border-primary-500
        ">
		</div>
	</div>
</div>
