<style>
.frosted {
	backdrop-filter: blur(12px);
	background-color: hsla(0, 0%, 0%, 0.5);
}
</style>

<script context="module" lang="ts">
import Cookie from 'cookie-universal'
const coookies = Cookie()
export async function load({ url, params, fetch, session, context }) {
	const isHome = url.pathname === '/'
	let currentPage = url.searchParams.get('page') || 1
	let q = url.searchParams.get('q') || ''
	const me = session.me
	try {
		const domain = session.domain
		// let uri = new URL(`${process.env.VITE_WWW_URL}/api/init?domain=${domain}`)
		// let res = await fetch(uri.toString(), { method: 'get' })
		// if (res.ok) {
		// 	let store = await res.json()
		const storeOne = (await KQL_StoreOne.query({ fetch, variables: { domain } })).data.storeOne
		const { id, email, address, phone, websiteName, websiteLegalName } = storeOne
		coookies.set(
			'store',
			JSON.stringify({ id, domain, address, phone, email, websiteName, websiteLegalName }),
			{
				path: '/'
			}
		)
		// }
	} catch (e) {}
	return {
		props: {
			url,
			currentPage,
			q,
			me,
			isHome
		}
	}
}
</script>

<script>
// import '../app.css'
import PageTransitions from '$lib/PageTransitions.svelte'
import { ToastContainer, FlatToast } from 'svelte-toasts'
import GoogleAnalytics from '$lib/components/GoogleAnalytics.svelte'
import { signOut, getUser } from '$lib/services'
import { browser } from '$app/env'
import { getStores, navigating, page, session } from '$app/stores'
import Footer from '$lib/Footer.svelte'
import { KQL_StoreOne, KQL__Init } from '$lib/graphql/_kitql/graphqlStores'
KQL__Init()

let url
// redirect if not already logged in
const user = getUser()
// if (browser && !user) goto('/auth/login')
</script>

<section class="minimum-width bg-white font-sans antialiased">
	<!-- Page transition commented because it was not removing the layout from the login page after navigating to my/index page -->
	<!-- <PageTransitions refresh="{page?.path}"> -->
	<div class="minimum-width relative bg-white font-sans antialiased">
		<!-- {#if $navigating}
			<div class="frosted absolute inset-0 z-50 flex min-h-screen items-center justify-center">
				<div class="h-28 w-28">
					<svg
						version="1.1"
						id="L7"
						xmlns="http://www.w3.org/2000/svg"
						xmlns:xlink="http://www.w3.org/1999/xlink"
						x="0px"
						y="0px"
						viewBox="0 0 100 100"
						enable-background="new 0 0 100 100"
						xml:space="preserve">
						<path
							fill="#fff"
							d="M31.6,3.5C5.9,13.6-6.6,42.7,3.5,68.4c10.1,25.7,39.2,38.3,64.9,28.1l-3.1-7.9c-21.3,8.4-45.4-2-53.8-23.3
  								c-8.4-21.3,2-45.4,23.3-53.8L31.6,3.5z">
							<animateTransform
								attributeName="transform"
								attributeType="XML"
								type="rotate"
								dur="2s"
								from="0 50 50"
								to="360 50 50"
								repeatCount="indefinite"></animateTransform>
						</path>
						<path
							fill="#fff"
							d="M42.3,39.6c5.7-4.3,13.9-3.1,18.1,2.7c4.3,5.7,3.1,13.9-2.7,18.1l4.1,5.5c8.8-6.5,10.6-19,4.1-27.7
  								c-6.5-8.8-19-10.6-27.7-4.1L42.3,39.6z">
							<animateTransform
								attributeName="transform"
								attributeType="XML"
								type="rotate"
								dur="1s"
								from="0 50 50"
								to="-360 50 50"
								repeatCount="indefinite"></animateTransform>
						</path>
						<path
							fill="#fff"
							d="M82,35.7C74.1,18,53.4,10.1,35.7,18S10.1,46.6,18,64.3l7.6-3.4c-6-13.5,0-29.3,13.5-35.3s29.3,0,35.3,13.5
  								L82,35.7z">
							<animateTransform
								attributeName="transform"
								attributeType="XML"
								type="rotate"
								dur="2s"
								from="0 50 50"
								to="360 50 50"
								repeatCount="indefinite"></animateTransform>
						</path>
					</svg>
				</div>
			</div>
		{/if} -->

		<div class="{$navigating ? 'h-screen overflow-hidden' : ''}">
			<section
				class="fixed inset-0 h-screen w-full bg-gradient-to-br from-secondary-100 to-primary-100">
				<div
					class="h-full w-full overflow-y-auto p-5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-400 sm:p-10 md:p-20">
					<slot />
				</div>
			</section>
		</div>
	</div>
	<!-- </PageTransitions> -->
</section>

<ToastContainer let:data>
	<FlatToast data="{data}" />
</ToastContainer>

<GoogleAnalytics />
