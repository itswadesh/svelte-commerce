<script>
import SEO from '$lib/components/SEO/index.svelte'
import LazyImg from '$lib/components/Image/LazyImg.svelte'
import MobileFooter from '$lib/MobileFooter.svelte'
import { goto } from '$app/navigation'

export let data

// console.log('zzzzzzzzzzzzzzzzzz', data)

let seoProps = {
	title: `Categories`,
	description: `Categories`
}

$: megaMenu = data?.megaMenu.filter((e) => {
	return e.name !== 'New Arrivals'
})

let bgColors = [
	'bg-fuchsia-200',
	'bg-blue-200',
	'bg-green-200',
	'bg-stone-200',
	'bg-indigo-200',
	'bg-amber-200',
	'bg-lime-200',
	'bg-orange-200',
	'bg-teal-200',
	'bg-cyan-200',
	'bg-yellow-200',
	'bg-gray-200'
]

let showChild = []

function handleParent(m, mx) {
	if (showChild[mx] === true) {
		return
	} else if (showChild[mx] === false) {
		showChild[mx] = undefined
	} else {
		goto(`/${m.slug}`)
	}
}

function toggle(mx) {
	if (showChild[mx] === true) {
		showChild[mx] = false
	} else {
		showChild[mx] = true
	}
}
</script>

<SEO {...seoProps} />

<div>
	<div class="mb-20">
		{#if megaMenu.length}
			<ul class="flex flex-col divide-y-2 divide-white tracking-wider">
				{#each megaMenu as m, mx}
					{#if m}
						<li>
							{#if m.children?.length}
								<button
									type="button"
									class="flex h-24 w-full items-end justify-between focus:outline-none 
									{bgColors[mx]}"
									on:click="{() => handleParent(m, mx)}">
									<div class="flex h-full w-full flex-1 items-center px-6">
										<div class="flex items-center gap-2">
											<h1 class="text-xl font-bold uppercase">
												{m.name}
											</h1>

											<button
												type="button"
												class="overflow-hidden rounded-full p-2 focus:outline-none"
												on:click="{() => toggle(mx)}">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													class="h-6 w-6 flex-shrink-0 transition duration-300
													{showChild[mx] ? 'transform -rotate-180' : ''}"
													viewBox="0 0 20 20"
													fill="currentColor">
													<path
														fill-rule="evenodd"
														d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
														clip-rule="evenodd"></path>
												</svg>
											</button>
										</div>
									</div>

									{#if m.imgCdn}
										<div class="flex-shrink-0">
											<img src="{m.imgCdn}" alt="" class="h-auto w-20" />
										</div>
									{/if}
								</button>
							{:else}
								<a
									href="/{m.slug}"
									class="flex h-24 w-full items-end justify-between {bgColors[mx]}">
									<div class="flex h-full w-full flex-1 items-center px-6">
										<h1 class="flex-1 text-xl font-bold uppercase">
											{m.name}
										</h1>
									</div>

									{#if m.imgCdn}
										<div class="flex-shrink-0">
											<img src="{m.imgCdn}" alt="" class="h-auto w-20" />
										</div>
									{/if}
								</a>
							{/if}

							{#if showChild[mx]}
								{#if m.children?.length}
									<ul class="flex flex-col divide-y bg-white px-8">
										{#each m.children as c}
											<li>
												<a href="/{c.slug}" class="flex items-center gap-4 py-3 font-medium">
													{#if c.imgCdn}
														<div class="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full">
															<LazyImg
																src="{c.imgCdn}"
																alt=""
																width="48"
																height="48"
																class="h-full w-full" />
														</div>
													{:else}
														<div
															class="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
														</div>
													{/if}

													<h6>{c.name}</h6>
												</a>
											</li>
										{/each}
									</ul>
								{/if}
							{/if}
						</li>
					{/if}
				{/each}
			</ul>
		{:else}
			<div>No categories found</div>
		{/if}
	</div>

	<!-- MOBILE FOOTER -->

	<div class="block sm:hidden">
		<MobileFooter />
	</div>
</div>
