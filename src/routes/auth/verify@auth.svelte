<script context="module" lang="ts">
import Cookie from 'cookie-universal'
const coookies = Cookie()
export async function load({ url, params, fetch, session, context }) {
	let err
	const isHome = url.pathname === '/'
	let currentPage = +url.searchParams.get('page') || 1
	let id = url.searchParams.get('id') || ''
	let token = url.searchParams.get('token') || ''
	let expires = url.searchParams.get('expires') || ''
	let signature = url.searchParams.get('signature') || ''
	const me = session.me
	try {
		const ve = await KQL_VerifyEmail.mutate({
			variables: {
				id,
				token,
				signature,
				expires,
				store: session.store?.id
			}
		})
		if (ve.errors) {
			err = ve.errors[0].message
			toast(err, 'error')
		} else {
			return {
				status: 302,
				redirect: `/auth/verification-success`
			}
		}
	} catch (e) {
		this.$store.commit('setErr', e)
	}
	return {
		props: {
			id,
			token,
			expires,
			signature,
			me,
			err
		}
	}
}
</script>

<script>
import { goto } from '$app/navigation'
import { KQL_ResendEmail, KQL_VerifyEmail } from '$lib/graphql/_kitql/graphqlStores'
import HeadingUnderline from '$lib/HeadingUnderline.svelte'
import { onMount } from 'svelte'
import { store, toast } from '$lib/util'
import GrnIndGradiantButton from '$lib/ui/GrnIndGradiantButton.svelte'
import { loginUrl } from '$lib/store'
import { signOut } from '$lib/services'
import { page, session } from '$app/stores'

export let id, token, expires, signature, me, err

onMount(async () => {})
function findEmailDomain(email) {
	if (!email) return 'gmail.com'
	else return email.split('@').pop()
}
async function resendEmail() {
	try {
		const data = await KQL_ResendEmail.mutate({
			fetch,
			variables: {
				email: me?.email
			}
		})
		if (data.errors) {
			toast(data.errors[0].message, 'error')
		} else {
			toast(data.data.resendEmail, 'info')
		}
	} catch (e) {
		toast(e, 'error')
	}
}

async function handleSignout() {
	try {
		await signOut()
		$session.me = null
		$session.token = null
		$session.sid = null
		toast('Signed Out...', 'success')
		goto($loginUrl)
	} catch (e) {
		toast(e, 'error')
	} finally {
	}
}
</script>

<section
	class="
      flex h-screen
      flex-col
      items-center
      justify-center
      bg-gradient-to-br
      from-secondary-100 to-primary-100
      p-2
      text-center
      text-gray-600
    ">
	<div class="mx-auto w-full max-w-sm">
		<div class="frosted rounded-md p-2.5 shadow-md md:p-0">
			<div class="mx-auto py-10 text-center md:w-10/12">
				<a href="/" class="">
					<span
						class="
                bg-gradient-to-br
                from-secondary-500
                to-primary-500
                bg-clip-text text-4xl
                font-extrabold
                text-transparent
              ">
						{store?.websiteName}
					</span>
				</a>
				<div>
					<div class="mx-auto mt-5 max-w-max">
						<svg class="h-20 w-20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 62 80">
							<path
								fill="lightblue"
								fill-rule="nonzero"
								d="M59.466 10.162l-27.88-10a2.708 2.708 0 0 0-1.84 0l-27.878 10C.748 10.562 0 11.645 0 12.858v31.945c0 5.943 2.265 11.809 6.736 17.438 1.69 2.117 3.757 4.257 6.319 6.543 2.954 2.643 10.25 7.23 15.85 10.613l.308.189c.444.277.947.414 1.45.414a2.77 2.77 0 0 0 1.458-.414l.307-.189c5.6-3.383 12.897-7.97 15.85-10.611 2.563-2.288 4.63-4.428 6.322-6.55 4.468-5.624 6.733-11.48 6.733-17.405V12.858c0-1.213-.748-2.296-1.867-2.696zm-28.8 8.41c4.613 0 8.364 3.846 8.364 8.573s-3.751 8.572-8.363 8.572-8.364-3.845-8.364-8.572c0-4.727 3.752-8.572 8.364-8.572zm13.94 37.145H16.727c-.77 0-1.394-.639-1.394-1.428 0-8.665 6.88-15.715 15.334-15.715C39.12 38.574 46 45.624 46 54.289c0 .79-.623 1.428-1.394 1.428z"
							></path>
						</svg>
					</div>

					<!-- <HeadingUnderline>Verify Email</HeadingUnderline> -->

					<div class="mt-5 flex flex-col space-y-5">
						<h5>Account verification error</h5>
						{#if err}
							<div class="rounded bg-white px-4 py-2 text-xs text-red-500">
								{err}
							</div>
						{/if}
						<button class="text-blue-400 hover:text-blue-500" on:click="{resendEmail}">
							Resend Email
						</button>
						<a
							href="{`https://${findEmailDomain(me.email)}`}"
							target="_blank"
							class="flex justify-center text-center">
							<GrnIndGradiantButton class="">Check your email</GrnIndGradiantButton>
						</a>
						<br />
						or
						<br />
						<button
							type="button"
							class="text-gray-400 hover:text-gray-500"
							on:click="{handleSignout}">
							Sign Out
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
