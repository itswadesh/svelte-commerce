<script>
let show
function toggle() {
	show = !show
}
let menuItem = [
	{
		name: 'Women',
		img: ` <img
                src="https://img.icons8.com/pastel-glyph/30/000000/user-female--v3.png"
                alt=""
              />`,
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
              </svg>`,
	},
	{
		name: 'Men',
		img: `<img src="https://img.icons8.com/ios-glyphs/30/000000/cartoon-boy.png"
                  alt="" /> `,
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
              </svg>`,
	},
	{
		name: 'Kids',
		img: `<img
                src="https://img.icons8.com/fluent-systems-filled/30/000000/children-faces.png"
                alt=""
              /> `,
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
              </svg>`,
	},
	{
		name: 'Home and Kitchen',
		img: `<img
                src="https://img.icons8.com/material-outlined/30/000000/home--v2.png"
                alt=""
              /> `,
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
              </svg>`,
	},
	{
		name: 'Stores',
		img: `<img
                src="https://img.icons8.com/material-outlined/30/000000/home--v2.png"
                alt=""
              /> `,
		svg: '',
	},
	{
		name: 'Precious Jewellery',
		img: ` <img
              src="https://img.icons8.com/fluent-systems-regular/30/000000/necklace.png"
              alt=""
            /> `,
		svg: '',
	},
	{
		name: 'Sneakerhood',
		img: ` <img
              src="https://img.icons8.com/fluent-systems-filled/30/000000/trainers.png"
              alt=""
            />`,
		svg: '',
	},
	{
		name: 'Collections',
		img: ` <img
              src="https://img.icons8.com/fluent-systems-filled/30/000000/group-objects.png"
              alt=""
            />`,
		svg: '',
	},
	{
		name: 'New Arrivals',
		img: ` <img
              src="https://img.icons8.com/windows/30/000000/new.png"
              alt=""
            />`,
		svg: '',
	},
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

		name: 'Kurtas & Kurtis',
	},
]
</script>

<section class="w-96 h-screen text-gray-800">
	<div class="bg-white w-4/5 h-full">
		<div class="flex items-center shadow-md p-2">
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

			<div class="max-w-max mx-auto">
				<a href="/" class="flex items-center "
					><img alt="" class="w-8 h-8" src="/logo.svg" />
					<div class="">
						<h2 class="ml-2 font-bold tracking-wide">Litekart</h2>
						<div class="ml-auto h-0.5 w-10 bg-pink-700"></div>
					</div>
				</a>
			</div>
		</div>
		<div class="bg-gray-100">
			<h5 class="text-sm pt-4 pb-0.5 pl-4">Shop by</h5>
			<div class="bg-white rounded-lg mx-4 my-5 py-1 h-full overflow-y-auto">
				<!-- Menu section start  -->
				{#each menuItem as item, i}
					<div on:click="{toggle}" class="px-4 ">
						<div class="border-b border-gray-100 py-3 flex items-center justify-between">
							<div class="flex">
								<div>{@html item.img}</div>
								<span class="ml-2"> {item.name} </span>
							</div>
							<div>{@html item.svg}</div>
						</div>
					</div>
				{/each}
				<!-- Menu section end -->
				<!-- Submenu section start -->
				{#if show}
					{#each subMenu as item, i}
						<div class="px-4">
							<div class="border-b border-gray-100 py-3 flex items-center justify-between">
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
				<div class="bg-black p-1 w-full flex items-center">
					<div class="flex items-center">
						<img src="/make-up.jpg" alt="" class="h-16 w-16" />
						<span class="text-xs text-white ml-2">
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
