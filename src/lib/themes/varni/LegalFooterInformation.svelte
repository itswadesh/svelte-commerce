<script>
let items = [
	{
		icon: `<svg
	            xmlns="http://www.w3.org/2000/svg"
	            class="h-8 w-8"
	            viewBox="0 0 24 24"
	            stroke-width="1.5"
	            stroke="currentColor"
	            fill="none"
	            stroke-linecap="round"
	            stroke-linejoin="round">
	            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
	            <path d="M10 10h4v4h-4z"></path>
	            <path d="M10 10l-3.5 -3.5"></path>
	            <path d="M9.96 6a3.5 3.5 0 1 0 -3.96 3.96"></path>
	            <path d="M14 10l3.5 -3.5"></path>
	            <path d="M18 9.96a3.5 3.5 0 1 0 -3.96 -3.96"></path>
	            <path d="M14 14l3.5 3.5"></path>
	            <path d="M14.04 18a3.5 3.5 0 1 0 3.96 -3.96"></path>
	            <path d="M10 14l-3.5 3.5"></path>
	            <path d="M6 14.04a3.5 3.5 0 1 0 3.96 3.96"></path>
            </svg>`,
		title: 'Fast Shipping',
		info: 'With prerpayment order'
	},
	{
		icon: `<svg
	            xmlns="http://www.w3.org/2000/svg"
	            class="h-8 w-8"
	            viewBox="0 0 24 24"
	            stroke-width="1.5"
	            stroke="currentColor"
	            fill="none"
	            stroke-linecap="round"
	            stroke-linejoin="round">
	            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
	            <path
	            	d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2"
	            ></path>
            </svg>`,
		title: 'Online Support 24/7',
		info: 'Support online 24 hours a day'
	},
	{
		icon: `<svg
	            xmlns="http://www.w3.org/2000/svg"
	            class="h-8 w-8"
	            viewBox="0 0 24 24"
	            stroke-width="1.5"
	            stroke="currentColor"
	            fill="none"
	            stroke-linecap="round"
	            stroke-linejoin="round">
	            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
	            <path d="M9 14c0 1.657 2.686 3 6 3s6 -1.343 6 -3s-2.686 -3 -6 -3s-6 1.343 -6 3z"></path>
	            <path d="M9 14v4c0 1.656 2.686 3 6 3s6 -1.344 6 -3v-4"></path>
	            <path
	            	d="M3 6c0 1.072 1.144 2.062 3 2.598s4.144 .536 6 0c1.856 -.536 3 -1.526 3 -2.598c0 -1.072 -1.144 -2.062 -3 -2.598s-4.144 -.536 -6 0c-1.856 .536 -3 1.526 -3 2.598z"
	            ></path>
	            <path d="M3 6v10c0 .888 .772 1.45 2 2"></path>
	            <path d="M3 11c0 .888 .772 1.45 2 2"></path>
            </svg>`,
		title: 'Value For Price',
		info: 'Best Price Guaranteed'
	},
	{
		icon: `<svg
	            xmlns="http://www.w3.org/2000/svg"
	            class="h-8 w-8"
	            viewBox="0 0 24 24"
	            stroke-width="1.5"
	            stroke="currentColor"
	            fill="none"
	            stroke-linecap="round"
	            stroke-linejoin="round">
	            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
	            <path d="M3 5m0 3a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3z"></path>
	            <path d="M7 16l3 -3l3 3"></path>
	            <path
	            	d="M8 13c-.789 0 -2 -.672 -2 -1.5s.711 -1.5 1.5 -1.5c1.128 -.02 2.077 1.17 2.5 3c.423 -1.83 1.372 -3.02 2.5 -3c.789 0 1.5 .672 1.5 1.5s-1.211 1.5 -2 1.5h-4z"
	            ></path>
            </svg>`,
		title: 'Best Deals',
		info: 'All Products Guaranteed'
	}
]
</script>

<div class="px-3 xl:px-10">
	<div class="container mx-auto max-w-6xl border-t">
		<div
			class="py-10 flex flex-wrap items-center gap-4 justify-center lg:justify-between text-primary-500">
			{#each items as item}
				<div class="flex items-center gap-4 w-64">
					<div>
						{@html item.icon}
					</div>

					<div class="flex-1">
						<h6 class="font-semibold">{item.title}</h6>

						<p class="text-zinc-500 text-sm">
							{item.info}
						</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
