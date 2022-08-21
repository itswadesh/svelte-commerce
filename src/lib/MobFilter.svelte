<script lang="ts">
import { goto } from '$app/navigation'
export let categories = []
let show
function toggle(url) {
	goto(url)
	show = !show
}
let menuItem = [
	{
		name: 'Women',
		img: '/sidebar/female-user.png',
		svg: `<svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="3"
                  d="M9 5l7 7-7 7"
                />
              </svg>`
	},
	{
		name: 'Men',
		img: '/sidebar/user-male.png',
		svg: `<svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="3"
                  d="M9 5l7 7-7 7"
                />
              </svg>`
	},
	{
		name: 'Kids',
		img: '/sidebar/baby-face.png',
		svg: `<svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="3"
                  d="M9 5l7 7-7 7"
                />
              </svg>`
	},
	{
		name: 'Home and Kitchen',
		img: '/sidebar/home.png',
		svg: `<svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="3"
                  d="M9 5l7 7-7 7"
                />
              </svg>`
	},
	{
		name: 'Stores',
		img: '/sidebar/furniture-store.png',
		svg: ''
	},
	{
		name: 'Precious Jewellery',
		img: '/sidebar/acrobatic-rings.png',
		svg: ''
	},
	{
		name: 'Sneakerhood',
		img: '/sidebar/sneakers.png',
		svg: ''
	},
	{
		name: 'Collections',
		img: '/sidebar/group-objects.png',
		svg: ''
	},
	{
		name: 'New Arrivals',
		img: '/sidebar/new.png',
		svg: ''
	}
]

let subMenu = [
	{
		svg: `
        <svg
          xmlns='http://www.w3.org/2000/svg'
          class='h-5 w-5'
          viewBox='0 0 20 20'
          fill='currentColor'
        >
          <path
            fill-rule='evenodd'
            d='M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z'
            clip-rule='evenodd'
          />
        </svg>
      `,

		name: 'Kurtas & Kurtis'
	}
]
</script>

<section class="h-screen w-96 text-gray-800">
	<div class="h-full w-4/5 bg-white">
		<div class="flex items-center p-2 shadow-md">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6 cursor-pointer"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="1.5"
					d="M6 18L18 6M6 6l12 12"></path>
			</svg>

			<div class="mx-auto max-w-max">
				<a href="/" class="flex items-center "
					><img alt="" class="h-8 w-8" src="/logo.png" />
					<div class="">
						<h2 class="ml-2 font-bold tracking-wide">Litekart</h2>
						<div class="ml-auto h-0.5 w-10 bg-pink-700"></div>
					</div>
				</a>
			</div>
		</div>
		<div class="bg-gray-100">
			<h5 class="pt-4 pb-0.5 pl-4 text-sm">Shop by</h5>
			<div class="mx-4 my-5 h-full overflow-y-auto rounded-lg bg-white py-1">
				<!-- Menu section start  -->
				{#each data.categories as item, i}
					<button
						on:click="{() => toggle(`/search?categories=${item.slug}`)}"
						class="block w-full px-4 ">
						<div class="flex items-center justify-between border-b border-gray-100 py-3">
							<div class="flex">
								<img src="{item.imgCdn}" alt="" />
								<span class="ml-2"> {item.name} </span>
							</div>
						</div>
					</button>
				{/each}
				<!-- Menu section end -->
				<!-- Submenu section start -->
				{#if show}
					{#each subMenu as item, i}
						<div class="px-4">
							<div class="flex items-center justify-between border-b border-gray-100 py-3">
								<div class="flex">
									<div>{@html item.svg}</div>
									<div>{item.name}</div>
								</div>
							</div>
						</div>
					{/each}
				{/if}
				<!-- Submenu section end -->

				<!-- Image with Quote section start -->
				<div class="flex w-full items-center bg-black p-1">
					<div class="flex items-center">
						<img src="/make-up.jpg" alt="" class="h-16 w-16" />
						<span class="ml-2 text-xs text-white">
							“ Fashion & Clothing is the one makes you look awesome and unique from others! ”
						</span>
					</div>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6 text-white"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"
						></path>
					</svg>
				</div>
			</div>
			<!-- Image with Quote section end -->
		</div>
	</div>
</section>
