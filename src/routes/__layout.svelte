<style>
.frosted {
	backdrop-filter: blur(12px);
	background-color: hsla(0, 0%, 0%, 0.5);
}

@media (max-width: 768px) {
	.mt-rem {
		margin-top: 1rem;
	}
}
@media (min-width: 768px) {
	.mt-rem {
		margin-top: 1rem;
	}
}
</style>

<script context="module">
export async function load({ url, params, fetch, session, context }) {
	const isHome = url.pathname === '/'
	let me = session.me
	return {
		props: {
			url,
			me,
			isHome,
			store: session.store
		}
	}
}
</script>

<script>
import '../app.css'
import { KQL__Init } from '$lib/graphql/_kitql/graphqlStores'
KQL__Init()
import { ToastContainer, FlatToast } from 'svelte-toasts'
import { getStores, navigating, page, session } from '$app/stores'
import Footer from '$lib/Footer.svelte'
import Nav from '$lib/Nav.svelte'
import { loadingDelayed } from '$lib/store'
import PreloadingIndicator from '$lib/PreloadingIndicator.svelte'

export let path, url, sort, me, isHome, store
let q
</script>

{#if $navigating}
	<PreloadingIndicator />
{/if}

<section class="minimum-width bg-gray-50 bg-cover bg-bottom font-sans antialiased">
	<!-- <PageTransitions refresh="{page?.path}"> -->
	<div class="minimum-width relative bg-gray-50 font-sans antialiased">
		<!-- {#if $loadingDelayed}
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

		<div class="{$loadingDelayed ? 'h-screen overflow-hidden' : ''}">
			<Nav q="{q}" me="{me}" store="{store}" />

			<div class="{$page?.url?.pathname === '/' ? '' : 'mt-rem'}">
				<slot />
			</div>

			<div class="print:hidden">
				<Footer />
			</div>
		</div>
	</div>
	<!-- </PageTransitions> -->

	<ToastContainer let:data>
		<FlatToast data="{data}" />
	</ToastContainer>

	<!-- <GoogleAnalytics /> -->
</section>
