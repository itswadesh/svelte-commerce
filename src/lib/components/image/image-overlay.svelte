<script lang="ts">
	import LazyImg from '$lib/core/components/image/lazy-img.svelte'
	let { title, description, buttonText, link, imgSrc, imgAlt = 'Default alt text', side = 'left' } = $props()
</script>

<div class="group relative my-5 w-full">
	<div
		class="absolute right-0 top-[47%] z-10 flex h-fit w-auto -translate-y-[47%] transform flex-col items-center justify-center p-[25px] text-center mobilem:w-[375px] mobilel:w-[425px] tablet:right-[50px] laptop:right-[10%] laptop:-translate-x-[10%]"
	>
		<div class="mb-[15px] flex flex-col mobiles:mb-[20px]">
			<h2 class="pb-[5px] text-[24px] font-bold uppercase tracking-wider text-white mobiles:pb-[12px] tablet:text-black laptop:text-[40px]">
				{title}
			</h2>
			<div class="mx-auto h-[2px] w-[40px] bg-white tablet:bg-black laptop:h-[2.5px]"></div>
		</div>
		<p class="mb-[20px] text-[12px] text-white tablet:text-black laptop:mb-[30px]">
			{description}
		</p>
		<a href={link} class="inline-block">
			<button
				class="w-[180px] border border-black bg-black px-[15px] py-[10px] text-[14px] font-semibold uppercase text-white transition-colors duration-300 hover:bg-white hover:text-black"
			>
				{buttonText}
			</button>
		</a>
	</div>

	{#if imgSrc}
		<LazyImg
			src={imgSrc}
			alt={imgAlt}
			class="h-fit w-full object-cover sm:h-full sm:w-full sm:object-contain sm:object-[center] {side === 'left'
				? 'object-[70%]'
				: ''} hidden tablet:block"
		/>
		<LazyImg
			src="https://new-ella-demo.myshopify.com/cdn/shop/files/banner-1-mb-min.jpg?v=1632459215&width=750"
			alt={imgAlt}
			class="h-fit w-full object-cover tablet:hidden"
		/>
	{:else}
		<!-- Fallback placeholder when imgSrc is not provided -->
		<div class="flex h-[660px] w-full items-center justify-center bg-gray-300 text-gray-500 sm:h-full sm:w-full">Image Not Available</div>
	{/if}
</div>
