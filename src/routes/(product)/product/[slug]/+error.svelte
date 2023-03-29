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
import { page } from '$app/stores'
import errAnimated from '$lib/assets/no/error.svg'
import PrimaryButton from '$lib/ui/PrimaryButton.svelte'
</script>

<div class="flex h-[70vh] flex-col items-center justify-center text-center sm:h-[92vh]">
	{#if $page.status === 404}
		<div class="container">
			<div class="flex justify-center text-center">
				<img src="{errAnimated}" alt="" class="mb-5 max-h-60 w-auto object-contain object-bottom" />
			</div>

			<div class="layout">
				<div class="flex flex-col items-center justify-center text-center">
					<h1>404</h1>

					<h2 class="headline my-3">Sorry, product not found</h2>
				</div>
			</div>
		</div>
	{:else if $page.status === 403}
		<div class="container">
			<div class="layout">
				<div class="flex justify-center text-center">
					<img
						src="{errAnimated}"
						alt=""
						class="mb-5 max-h-60 w-auto object-contain object-bottom" />
				</div>

				<div class="text-center">
					<h1>403</h1>

					<h2 class="headline my-3">Sorry, access denied.</h2>
				</div>
			</div>
		</div>
	{:else if $page.status === 500}
		<div class="container">
			<div class="layout">
				<div class="flex justify-center text-center">
					<img
						src="{errAnimated}"
						alt=""
						class="mb-5 max-h-60 w-auto object-contain object-bottom" />
				</div>

				<div class="flex flex-col gap-5 text-center">
					<h1>500</h1>

					<h2 class="headline my-3">{$page.error?.message || 'Sorry, the server is down.'}</h2>
				</div>
			</div>
		</div>
	{:else}
		<div class="container">
			<div class="layout">
				<div class="flex justify-center text-center">
					<img
						src="{errAnimated}"
						alt=""
						class="mb-5 max-h-60 w-auto object-contain object-bottom" />
				</div>

				<div class="flex flex-col gap-5 text-center">
					<h1>{$page.status || 500}</h1>

					<h2 class="headline my-3">{$page.error?.message}</h2>
				</div>
			</div>
		</div>
	{/if}

	<div class="mt-5 sm:mt-10">
		<a href="/" aria-label="Click here to go back home" data-sveltekit-preload-data>
			<PrimaryButton class="px-10">Home</PrimaryButton>
		</a>
	</div>
</div>
