<script>
import { browser } from '$app/environment'
import { goto, invalidateAll } from '$app/navigation'
import { page } from '$app/stores'
import { UserService } from '$lib/services'
import Error from '$lib/components/Error.svelte'
import LazyImg from '$lib/components/Image/LazyImg.svelte'
import PrimaryButton from '$lib/ui/PrimaryButton.svelte'
import SEO from '$lib/components/SEO/index.svelte'
import TextboxFloating from '$lib/ui/TextboxFloating.svelte'

const seoProps = {
	title: 'Forgot Password',
	description: 'Forgot Password'
}

let email
let loading = false
let err

function protocol() {
	// const protocol = window.location.protocol + '//'
	const protocol = 'https://' //window.location.protocol + '//'
	return protocol
}

async function submit() {
	// 	email: email,
	// 	referrer: `${$page.data.origin}`
	// })

	try {
		loading = true

		const res = await UserService.forgotPasswordService({
			email: email,
			referrer: $page.data.origin,
			storeId: $page.data.store?.id,
			origin: $page.data.origin
		})


		await invalidateAll()

		if (browser) goto('/auth/forgot-success')
	} catch (e) {
		err = e
	} finally {
		loading = false
	}
}
</script>

<SEO {...seoProps} />

<div class="flex w-full max-w-md flex-col rounded-2xl border bg-white p-10 shadow-2xl">
	<a href="/" aria-label="Go to home" class="mx-auto mb-8 block max-w-max">
		{#if $page.data.store?.logo}
			<LazyImg
				src="{$page?.data?.store?.logo}"
				alt="logo"
				height="64"
				aspect_ratio="4:1"
				class="max-h-16 w-40 object-contain object-center" />
		{:else}
			<h1
				class="bg-gradient-to-b from-primary-500 to-primary-700 bg-clip-text text-3xl font-extrabold text-transparent underline decoration-zinc-800">
				{#if $page.data.store?.websiteName}
					{$page.data.store?.websiteName}
				{:else}
					Litekart
				{/if}
			</h1>
		{/if}
	</a>

	<h1 class="mb-8 w-full text-center text-2xl font-semibold text-primary-500">Forgot Password</h1>

	<Error err="{err}" />

	<form class="flex flex-col gap-5" on:submit|preventDefault="{submit}">
		<TextboxFloating type="email" label="Email" class="w-full" required bind:value="{email}" />

		<PrimaryButton type="submit" loading="{loading}" class="w-full">SEND EMAIL</PrimaryButton>

		<div class="mx-auto flex max-w-max flex-col gap-1 text-center text-sm">
			<a
				href="{`/auth/login?ref=${$page.url.searchParams.get('ref') || '/'}`}"
				aria-label="Click to login with phone number"
				class="max-w-max whitespace-nowrap text-primary-500 hover:text-primary-700 hover:underline">
				Back to Login
			</a>
		</div>
	</form>
</div>
