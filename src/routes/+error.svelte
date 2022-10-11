<style>
h1 {
	font-size: 150px;
	line-height: 150px;
	font-weight: 700;
	color: #252932;
	text-shadow: rgba(61, 61, 61, 0.3) 1px 1px, rgba(61, 61, 61, 0.2) 2px 2px,
		rgba(61, 61, 61, 0.3) 3px 3px;
}
</style>

<script>
import LazyImg from '$lib/components/Image/LazyImg.svelte'
import PrimaryButton from '$lib/ui/PrimaryButton.svelte'
import { page } from '$app/stores'
</script>

<div class="flex h-[70vh] flex-col items-center justify-center text-center sm:h-[92vh]">
	{#if $page.error?.status === 404}
		<div class="container">
			<div class="flex justify-center text-center">
				<LazyImg src="/error/404.svg" alt=" " width="240" class="mb-5 h-auto w-60 object-contain" />
			</div>

			<div class="layout">
				<div class="flex flex-col items-center justify-center text-center">
					<h1>404</h1>

					<h2 class="headline my-3">Sorry, page not found</h2>
				</div>
			</div>
		</div>
	{:else if $page.error?.status === 403}
		<div class="container">
			<div class="layout">
				<div class="flex justify-center text-center">
					<LazyImg
						src="/error/404.svg"
						alt=""
						width="240"
						class="mb-5 h-auto w-60 object-contain" />
				</div>

				<div class="text-center">
					<h1>403</h1>

					<h2 class="headline my-3">Sorry, access denied.</h2>
				</div>
			</div>
		</div>
	{:else if $page.error?.status === 500}
		<div class="container">
			<div class="layout">
				<div class="flex justify-center text-center">
					<LazyImg
						src="/error/404.svg"
						alt=""
						width="240"
						class="mb-5 h-auto w-60 object-contain" />
				</div>

				<div class="flex flex-col gap-5 text-center">
					<h1>500</h1>

					<h2 class="headline my-3">Sorry, the server is down.</h2>
				</div>
			</div>
		</div>
	{:else}
		<div class="container">
			<div class="layout">
				<div class="flex justify-center text-center">
					<LazyImg
						src="/error/404.svg"
						alt=""
						width="240"
						class="mb-5 h-auto w-60 object-contain" />
				</div>

				<div class="flex flex-col gap-5 text-center">
					<h1>{$page.error?.status || 500}</h1>

					<h2 class="headline my-3">{$page.error?.message}</h2>
				</div>
			</div>
		</div>
	{/if}

	<div class="mt-5 sm:mt-10">
		<a href="/" aria-label="Click here to go back home" data-sveltekit-prefetch>
			<PrimaryButton class="px-10">Home</PrimaryButton>
		</a>
	</div>
</div>
