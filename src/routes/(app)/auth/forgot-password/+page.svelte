<script>
import { browser } from '$app/environment'
import { goto, invalidateAll } from '$app/navigation'
import { page } from '$app/stores'
import { UserService } from '$lib/services'
import { LazyImg, Error } from '$lib/components'
import { TextboxFloating, PrimaryButton } from '$lib/ui'
import SEO from '$lib/components/SEO/index.svelte'
import { services } from '@misiki/litekart-utils'
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

		const res = await services.UserService.forgotPasswordService({
			email: email,
			referrer: $page.data.origin,
			storeId: $page?.data?.storeId,
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
			<img
				src="{$page?.data?.store?.logo}"
				alt="logo"
				class="max-h-10 sm:max-h-16 w-40 object-contain object-center" />
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

	<h2 class="mb-8 w-full text-center text-2xl font-semibold text-primary-500">Forgot Password</h2>

	<Error {err} />

	<form class="flex flex-col gap-5" on:submit|preventDefault="{submit}">
		<TextboxFloating type="email" label="Email" class="w-full" required bind:value="{email}" />

		<PrimaryButton type="submit" {loading} class="w-full">SEND EMAIL</PrimaryButton>

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
