<script>
import { page } from '$app/stores'
import Error from '$lib/components/Error.svelte'
import LazyImg from '$lib/components/Image/LazyImg.svelte'
import PrimaryButton from '$lib/ui/PrimaryButton.svelte'
import SEO from '$lib/components/SEO/index.svelte'

const seoProps = {
	title: 'Verify Email',
	description: 'Verify Email'
}

let err
// onMount(async () => {
// 	const id = $page.url?.searchParams.get('id')
// 	const token = $page.url?.searchParams.get('token')
// 	const expires = $page.url?.searchParams.get('expires')
// 	const signature = $page.url?.searchParams.get('signature')

// 	try {
// 		const res = await post(
// 			`verify-email`,
// 			{
// 				id,
// 				token,
// 				expires,
// 				signature
// 			},
// 			$page.data?.origin
// 		)

// 		userDetail = res

// 		goto('/auth/verification-success')
// 	} catch (e) {
// 		err = e
// 	} finally {
// 	}
// })
</script>

<SEO {...seoProps} />

<div class="flex w-full max-w-md flex-col rounded-2xl border bg-white p-10 shadow-2xl">
	<a href="/" aria-label="Go to home" class="mx-auto mb-8 block max-w-max">
		{#if $page.data?.store?.logo}
			<LazyImg
				src="{$page.data?.store?.logo}"
				alt="{$page.data?.store?.websiteName}"
				height="80"
				class="h-14 w-32 object-contain object-center" />
		{:else}
			<h2
				class="bg-gradient-to-b from-primary-500 to-primary-700 bg-clip-text text-3xl font-extrabold text-transparent underline decoration-zinc-800">
				{#if $page.data?.store?.websiteName}
					{$page.data?.store?.websiteName}
				{:else}
					<LazyImg
						src="/litekart-rectangular-logo-black.png"
						alt="logo"
						height="80"
						class="h-14 w-32 object-contain object-center" />
				{/if}
			</h2>
		{/if}
	</a>

	<h2 class="mb-8 w-full text-2xl font-bold text-red-600">Verification Failed</h2>

	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="currentColor"
		class="mb-5 h-24 w-24 text-red-200">
		<path
			fill-rule="evenodd"
			d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
			clip-rule="evenodd"></path>
	</svg>

	<Error {err} class="mb-5" />

	<a href="/auth/signup-success" aria-label="Home" class="block w-full">
		<PrimaryButton class="w-full">Try Again</PrimaryButton>
	</a>
</div>
