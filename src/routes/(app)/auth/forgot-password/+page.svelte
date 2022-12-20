<style>
.frosted {
	background-image: url('/auth/login/bg-lighter.svg');
	backdrop-filter: blur(15px);
	background-color: hsla(0, 0%, 100%, 0.75);
}
</style>

<script>
import { browser } from '$app/environment'
import { goto, invalidateAll } from '$app/navigation'
import { page } from '$app/stores'
import { post } from '$lib/util/api'
import { toast } from '$lib/util'
import Error from '$lib/components/Error.svelte'
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

async function submit() {
	try {
		loading = true

		const res = await post(
			'users/forgot-password',
			{
				email: email,
				referrer: 'https://litekart.in'
			},
			$page.data.origin
		)

		// console.log('zzzzzzzzzzzzzzzzzz', res)

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

<div
	class="frosted container mx-auto flex w-full max-w-sm flex-col rounded-2xl border bg-cover bg-center bg-no-repeat p-10 shadow-2xl"
	style="background-image: url('/login/bg-lighter.svg');">
	<h1 class="mb-8 w-full text-center text-2xl font-bold text-primary-500">Forgot Password</h1>

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
