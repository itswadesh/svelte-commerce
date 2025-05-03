<script lang="ts">
	import type { Page } from '$lib/core/types'

	interface Props {
		data: {
			page: Page
		}
	}
	let { data }: Props = $props()
</script>

<svelte:head>
	<title>Privacy Policy</title>
</svelte:head>

<section class="mt-20 min-h-screen">
	<div class="container mx-auto flex max-w-7xl flex-col px-4 md:px-10">
		<div class="mx-auto flex max-w-max flex-col items-center py-5 text-center text-3xl font-bold sm:items-start sm:py-10 sm:text-4xl">
			<h1>PRIVACY POLICY</h1>

			<hr class="mt-2.5 w-20 border-t-4 border-zinc-900 opacity-50" />
		</div>
		<div class="prose-lg">
			{@html data?.page?.content}
		</div>
	</div>
</section>
